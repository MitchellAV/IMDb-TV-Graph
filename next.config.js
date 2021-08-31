const path = require("path");
module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  target: "serverless",
  reactStrictMode: true,
  images: {
    domains: ["image.tmdb.org", "imdb-api.com"],
  },
};
