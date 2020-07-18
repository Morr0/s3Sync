const path = require("path");

module.exports = {
    entry: "./index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "index.js"
    },
    mode: 'production',
    target: "async-node"
    // externals:{
    //     fs:    "commonjs fs",
    //     path:  "commonjs path"
    // }
    // node: {
    //     fs: "empty"
    // }
  };
  