import * as esbuild from "esbuild";
import { replace } from "esbuild-plugin-replace";
import readdir from "recursive-readdir-files";

const isWatching = process.argv.includes("--watch");


const getAllEntryPoints = async (rootPath) =>
  (await readdir(rootPath))
    .map(({ path }) => path)
    .filter(
      (path) =>
        /\.tsx?$/.test(path) &&
        !path.endsWith(".css.ts") &&
        !path.includes(".test.")
    );

const baseBuildConfig = {
  banner: {
    js: '"use client";', // Required for Next 13 App Router
  },
  bundle: true,
  format: "esm",
  loader: {
    ".png": "dataurl",
    ".svg": "dataurl",
  },
  platform: "browser",
  plugins: [
    replace({
      include: /src\/components\/MortyStackProvider\/useBuildTag.ts$/,
      values: {
        __buildVersion: process.env.npm_package_version,
      },
    }),
    // vanillaExtractPlugin({
    //   identifiers: isCssMinified ? "short" : "debug",
    //   processCss: async (css) => {
    //     const result = await postcss([
    //       autoprefixer,
    //       prefixSelector({ prefix: "[data-rk]" }),
    //     ]).process(css, {
    //       from: undefined, // suppress source map warning
    //     });

    //     return result.css;
    //   },ƒ
    // }),
    {
      name: "make-all-packages-external",
      setup(build) {
        const filter = /^[^./]|^\.[^./]|^\.\.[^/]/; // Must not start with "/" or "./" or "../"
        build.onResolve({ filter }, (args) => ({
          external: true,
          path: args.path,
        }));
      },
    },
  ],
  splitting: true, // Required for tree shaking
};

const mainBuild = esbuild.build({
  ...baseBuildConfig,
  entryPoints: [
    "./src/index.ts",

    ...(await getAllEntryPoints("src/themes")),

      "./src/components/index.ts",
  ],
  outdir: "dist",
  watch: isWatching
    ? {
        onRebuild(error, result) {
          if (error) console.error("main build failed:", error);
          else console.log("main build succeeded:", result);
        },
      }
    : undefined,
});

Promise.all([mainBuild])
  .then(() => {
    if (isWatching) {
      console.log("watching...");
    }
  })
  .catch(() => process.exit(1));
