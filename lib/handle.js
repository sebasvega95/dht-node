const db = require('./db');
const log = require('./log');
const range = require('./range');
const ring = require('./ring');

function logNeighbors() {
  let [pred, succ] = ring.getNeighbors();
  console.log('\tPred:', pred);
  console.log('\tSucc:', succ);
}

function logRange() {
  let [lo, hi] = range.get();
  console.log('\tRange:', `(${lo}, ${hi}]`);
}

exports.join = ({ id, dir }) => {
  log.info('New node with id', id, 'at', dir);
  let myProblem = false;
  if (range.in(id)) {
    myProblem = true;
  } else {
    console.log('\tNot my problem');
  }
  ring.addNode(id, dir);
  if (myProblem) {
    logNeighbors();
    logRange();
  }
};

exports.joinAcc = ({ ringInfo }, nodeId, nodeDir) => {
  ring.join(ringInfo, nodeId, nodeDir);
  log.info('Joined ring');
  logNeighbors();
  logRange();
};

exports.newSuccessor = ({ id, dir }) => {
  log.info('New successor with id', id, 'at', dir);
  ring.setSuccessor(id, dir);
  logNeighbors();
  logRange();
};

exports.newPredecessor = ({ id, dir }) => {
  log.info('New predecessor with id', id, 'at', dir);
  ring.setPredecessor(id, dir);
  logNeighbors();
  logRange();
};

exports.insert = ({ dir, key, value }) => {
  log.info('Client at', dir, 'wants to insert key', key);
  if (range.in(key)) {
    db.insert(key, value);
    messages.sendToDir(dir, { status: true });
  } else {
    console.log('\tNot my problem');
    ring.passToNeighbor({ type: 'insert', dir, key, value });
  }
};

exports.delete = ({ dir, key }) => {
  log.info('Client at', dir, 'wants to delete key', key);
  if (range.in(key)) {
    db.delete(key, value);
    messages.sendToDir(dir, { status: true });
  } else {
    console.log('\tNot my problem');
    ring.passToNeighbor({ type: 'delete', dir, key });
  }
};

exports.lookUp = ({ dir, key }) => {
  log.info('Client at', dir, 'wants to look-up key', key);
  if (range.in(key)) {
    db.lookUp(key, value);
    messages.sendToDir(dir, { status: true });
  } else {
    console.log('\tNot my problem');
    ring.passToNeighbor({ type: 'look-up', dir, key });
  }
};
