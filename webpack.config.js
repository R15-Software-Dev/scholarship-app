const path = require("path");

module.exports = {
  entry: {
    customElements: "./src/customElements/customElements.ts",
    scripts: "./src/scripts/scripts.js"
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist/bundles"),
  },
}
