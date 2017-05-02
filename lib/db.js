let db = {};

exports.peek = () => db;

exports.insert = (key, value) => (db[key] = value);

exports.delete = key => delete db[key];

exports.lookUp = key => db[key];
