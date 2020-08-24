const recLaOptions = require("rec-la").httpsOptions;
recLaOptions.https = true;
recLaOptions.host = "l.rec.la";

module.exports = {
  devServer: recLaOptions,
};
