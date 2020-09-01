var ghpages = require("gh-pages");

ghpages.publish("dist", function(error) {
  console.log("check " + error);
});
