const { isV4Format } = require('ip');

exports.dir = ipAndPort => {
  let [ip, port] = ipAndPort.split(':');
  port = Number(port);
  return isV4Format(ip) && port >= 1024 && port <= 49151;
};
