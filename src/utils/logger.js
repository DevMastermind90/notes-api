const log = (level, message, meta = {}) =>
  console.log(JSON.stringify({ level, message, ...meta }));

module.exports = {
  info: (msg, meta) => log("info", msg, meta),
  error: (msg, meta) => log("error", msg, meta),
};
