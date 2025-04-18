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
    "./src/scripts/switchTab.ts",
    "./src/scripts/passwordReset.ts",
    "./src/scripts/studentEntry.ts",
    "./src/scripts/adminPage.ts",
  "./src/scripts/testFafsa.ts"
  ],
  outdir: "./dist/bundles",
  outExtension: {
    ".js": ".bundle.js",
  },
  format: "esm",
  minify: true,
  bundle: true,
  target: "es2022",
  platform: "node"
};

console.log("running build");
const response = esbuild.buildSync(buildConfig);
console.log(response);
