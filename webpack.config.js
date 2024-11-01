const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: {
    customElements: {
      import: [
        "./src/customElements/ActionButton.ts",
        "./src/customElements/Forms.ts",
        "./src/customElements/TextField.ts",
        "./src/customElements/Ripple.ts",
        "./src/customElements/Tabs.ts",
        "./src/customElements/MultipleEntry.ts",
        "./src/customElements/modalWindow.ts",
        "./src/customElements/Dropdown.ts",
        "./src/customElements/Checkbox.ts"
      ],
    },
    index: {
      import: "./src/scripts/index.js",
      library: {
        name: "Lib",
        type: "var",
      },
    },
    entryPortal: {
      import: "./src/scripts/entryPortal.js",
      library: {
        name: "Lib",
        type: "var",
      },
    },
    tabs: {
      import: "./src/scripts/tabs.js",
      library: {
        name: "Lib",
        type: "var",
      },
    },
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            unused: false,
          },
        },
      }),
    ],
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist/bundles"),
  },
};
