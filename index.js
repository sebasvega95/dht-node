const ip = require('ip');
const minimist = require('minimist');
const zmq = require('zeromq');

const handle = require('./lib/handle');
const { getId } = require('./lib/hashing');
const log = require('./lib/log');
const messages = require('./lib/messages');
const ring = require('./lib/ring');
const validate = require('./lib/validate');

const argv = minimist(process.argv.slice(2));
const clientPort = argv.c || argv.client || '8080';

const nodeIp = ip.address();
const nodeId = (argv.i || argv.id || getId(nodeIp)).toString();
const nodeDir = `${nodeIp}:${clientPort}`;
log.info('My dir:', nodeDir);
log.info('My name:', nodeId);

if (argv.n || argv.node) {
  const dirSomeNode = argv.n || argv.node;
  log.info('Attempting to connect to ring through', dirSomeNode);
  if (!validate.dir(dirSomeNode)) {
    log.error('Invalid direction for node in ring');
    process.exit(1);
  }

  log.info('Sending invite request');
  messages.sendToDir(dirSomeNode, { type: 'join', id: nodeId, dir: nodeDir });
} else {
  log.info('Building new ring');
  ring.join(
    {
      predId: nodeId,
      predDir: nodeDir,
      succId: nodeId,
      succDir: nodeDir
    },
    nodeId,
    nodeDir
  );
}

let clientSocket = zmq.socket('pull');
clientSocket.bindSync(`tcp://*:${clientPort}`);
log.info('Listening on port', clientPort);

clientSocket.on('message', msg => {
  msg = JSON.parse(msg);
  switch (msg.type) {
    case 'join':
      handle.join(msg);
      break;
    case 'join-acc':
      handle.joinAcc(msg, nodeId, nodeDir);
      break;
    case 'new-succ':
      handle.newSuccessor(msg);
      break;
    case 'new-pred':
      handle.newPredecessor(msg);
      break;
    case 'insert':
      handle.insert(msg);
      break;
    case 'look-up':
      handle.lookUp(msg);
      break;
    case 'delete':
      handle.delete(msg);
      break;
    default:
      log.warn(`Ignoring unknown message type '${msg.type}'`);
  }
});
