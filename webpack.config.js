const path = require("path");

module.exports = {
    entry: "./index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "index.js"
    },
    mode: 'production',
    target: "node",
    externals:{
        fs:    "commonjs fs",
        path:  "commonjs path"
    }
  };
  