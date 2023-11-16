import * as esbuild from "esbuild";
import { replace } from "esbuild-plugin-replace";
import readdir from "recursive-readdir-files";
import { readFileSync } from "fs";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
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
    js: '"use client";',
  },
  bundle: true,
  format: "esm",
  loader: {
    ".png": "dataurl",
    ".svg": "dataurl",
    ".woff": "dataurl",
    ".woff2": "dataurl",
  },
  platform: "browser",
  plugins: [
    replace({
      include: /src\/components\/MortyStackProvider\/useBuildTag.ts$/,
      values: {
        __buildVersion: process.env.npm_package_version,
      },
    }),
    {
      name: "make-all-packages-external",
      setup(build) {
        const filter = /^[^./]|^\.[^./]|^\.\.[^/]/;
        build.onResolve({ filter }, (args) => ({
          external: true,
          path: args.path,
        }));
      },
    },
  ],
  splitting: true,
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
