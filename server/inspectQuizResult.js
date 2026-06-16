const q = require('./models/QuizResult');
console.log('type', typeof q);
console.log('toString', Object.prototype.toString.call(q));
console.log('constructor', q?.constructor?.name);
console.log('modelName', q?.modelName);
console.log('has fromSession', typeof q?.fromSession);
console.log('keys', Object.keys(q));
