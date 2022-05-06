// @ts-check

import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import css from "rollup-plugin-css-only";
import svelte from "rollup-plugin-svelte";
import { terser } from "rollup-plugin-terser";
import sveltePreprocess from "svelte-preprocess";
import copy from "rollup-plugin-copy-assets";
import scss from 'rollup-plugin-scss'

const production = !process.env.ROLLUP_WATCH;

/**
 * @param {string} filename
 * @param {boolean} useSvelte
 */
function createConfig(filename, useSvelte = false) {
    return {
        input: `src/${filename}.ts`,
        output: {
            format: "iife",
            file: `public/build/${filename}.js`,
        },
        plugins: [
            useSvelte &&
                svelte({
                    compilerOptions: {
                        // enable run-time checks when not in production
                        dev: !production,
                    },
                    preprocess: sveltePreprocess(),
                }),

            // we'll extract any component CSS out into
            // a separate file - better for performance
            css({ output: `${filename}.css` }),
            scss({
                include: ["/**/*.css", "/**/*.scss", "/**/*.sass"],
                output: "public/build/style.css",
                failOnError: true,
            }),

            // If you have external dependencies installed from
            // npm, you'll most likely need these plugins. In
            // some cases you'll need additional configuration -
            // consult the documentation for details:
            // https://github.com/rollup/plugins/tree/master/packages/commonjs
            resolve({
                browser: true,
                dedupe: ["svelte"],
            }),

            commonjs(),
            typescript(),

            copy({
                assets: [
                  "src/assets",
                ],
              }),

            // If we're building for production (npm run build
            // instead of npm run dev), minify
            production && terser(),
        ],
    };
}

export default [
    // createConfig("popup", true),
    createConfig("content_script", true),
];
