const { isV4Format } = require('ip');

exports.dir = ipAndPort => {
  let [ip, port] = ipAndPort.split(':');
  let ipOk = isV4Format(ip) || ip === 'localhost';
  let portOk = +port >= 1024 && +port <= 49151;
  return ipOk && portOk;
};
