const recLaOptions = require("rec-la").httpsOptions;
recLaOptions.https = true;
recLaOptions.host = "l.rec.la";

module.exports = {
  devServer: recLaOptions,
  publicPath: process.env.NODE_ENV === "production" ? "/app-web-explorer/" : "/",
};
