const zmq = require('zeromq');

exports.send = (socket, load) => socket.send(JSON.stringify(load));

exports.sendToDir = (dir, load) => {
  let socket = zmq.socket('push');
  socket.connect(`tcp://${dir}`);
  socket.send(JSON.stringify(load));
  socket.close();
};
