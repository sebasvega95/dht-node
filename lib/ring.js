const zmq = require('zeromq');

const log = require('./log');
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

exports.addNode = (id, dir) => {
  if (range.in(id)) {
    messages.send(predecessorSocket, { type: 'new-succ', id: id, dir: dir });
    // if (predecessorId !== successorId)
    //   messages.send(successorSocket, { type: 'new-pred', id: id, dir: dir });
    let oldPredId = predecessorId;
    let oldPredDir = predecessorDir;
    setPredecessor(id, dir);
    messages.send(predecessorSocket, {
      type: 'join-acc',
      ringInfo: {
        predId: oldPredId,
        predDir: oldPredDir,
        succId: myId,
        succDir: myDir
      }
    });
  } else if (range.below(id)) {
    messages.send(predecessorSocket, { type: 'join', id: id, dir: dir });
  } else {
    messages.send(successorSocket, { type: 'join', id: id, dir: dir });
  }
};

exports.join = ({ predId, predDir, succId, succDir }, nodeId, nodeDir) => {
  myId = nodeId;
  myDir = nodeDir;
  setPredecessor(predId, predDir);
  setSuccessor(succId, succDir);
};
