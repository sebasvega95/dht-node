const crypto = require('crypto');

exports.getId = ip => {
  const hash = crypto.createHash('sha256');
  hash.update(ip + Math.floor(Math.random() * 2000));
  return hash.digest('hex').substr(0, 10);
};
