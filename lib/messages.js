exports.refuseUnknown = socket =>
  socket.send(
    JSON.stringify({
      status: false,
      message: 'Unknown message type'
    })
  );

exports.send = (socket, load) => socket.send(JSON.stringify(load));
