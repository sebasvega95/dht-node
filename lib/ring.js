const zmq = require('zeromq');

const db = require('./db');
const messages = require('./messages');
const range = require('./range');

let predecessorId, predecessorDir, predecessorSocket;
let successorId, successorDir, successorSocket;
let myId, myDir;

function setPredecessor(id, dir) {
  predecessorId = id;
  predecessorDir = dir;
  predecessorSocket = zmq.socket('push');
  predecessorSocket.connect(`tcp://${dir}`);
  // I'm responsible for everything in (predId, myId]
  range.set(id, myId);
}
exports.setPredecessor = setPredecessor;

function setSuccessor(id, dir) {
  successorId = id;
  successorDir = dir;
  successorSocket = zmq.socket('push');
  successorSocket.connect(`tcp://${dir}`);
}
exports.setSuccessor = setSuccessor;

exports.getNeighbors = () => [predecessorId, successorId];

function sendKeysToPredecessor() {
  let oldKeys = {};
  Object.keys(db.peek()).forEach(key => {
    if (range.below(key)) {
      oldKeys[key] = db.lookUp(key);
      db.delete(key);
    }
  });
  messages.send(predecessorSocket, { type: 'new-entries', entries: oldKeys });
}

exports.addNode = (id, dir) => {
  if (range.in(id)) {
    messages.send(predecessorSocket, { type: 'new-succ', id: id, dir: dir });
    let oldPredId = predecessorId;
    let oldPredDir = predecessorDir;
    setPredecessor(id, dir);
    // Now id is my predecessor
    messages.send(predecessorSocket, {
      type: 'join-acc',
      ringInfo: {
        predId: oldPredId,
        predDir: oldPredDir,
        succId: myId,
        succDir: myDir
      }
    });
    // Send to id all keys that are below me now
    sendKeysToPredecessor();
  } else if (range.below(id)) {
    messages.send(predecessorSocket, { type: 'join', id: id, dir: dir });
  } else {
    messages.send(successorSocket, { type: 'join', id: id, dir: dir });
  }
};

exports.removeNode = () => {
  messages.send(successorSocket, {
    type: 'new-pred',
    id: predecessorId,
    dir: predecessorDir
  });
  messages.send(successorSocket, { type: 'new-entries', entries: db.peek() });
};

exports.join = ({ predId, predDir, succId, succDir }, nodeId, nodeDir) => {
  myId = nodeId;
  myDir = nodeDir;
  setPredecessor(predId, predDir);
  setSuccessor(succId, succDir);
};

exports.passToNeighbor = msg => {
  let { key } = msg;
  if (range.below(key)) {
    messages.send(predecessorSocket, msg);
  } else if (range.above(key)) {
    messages.send(successorSocket, msg);
  }
};
