import * as esbuild from 'esbuild';


// Create run configuration for build
/** @type {esbuild.BuildOptions} */
const buildConfig = {
  entryPoints: [
    "./src/customElements/customElements.ts",
    "./src/scripts/tabs.js",
    "./src/scripts/entryPortal.ts",
    "./src/scripts/index.js",
    "./src/scripts/stickyScrolling.js",
    "./src/scripts/providerLogin.ts",
    "./src/scripts/switchTab.ts"
  ],
  outdir: "./dist/bundles",
  outExtension: {
    ".js": ".bundle.js",
  },
  format: "esm",
  minify: true,
  bundle: true,
  target: "es2020"
};

console.log("running build");
const response = esbuild.buildSync(buildConfig);
console.log(response);
