import { Str } from "ziko";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

const Addon_name = "ziko-something";
const Author = "";

const banner = `
/*
  Project: ${Addon_name}
  Author: ${Author}
  Date : ${new Date()}
*/
`;
const isProduction = process.env.NODE_ENV === "production";

const output = [
  {
    file: `dist/${Addon_name}.mjs`,
    format: "es",
    banner,
    exports: "named",
  },
  {
    file: `dist/${Addon_name}.js`,
    format: "umd",
    name: Str.hyphen2pascalcase(Addon_name),
    banner,
    exports: "named",
  },
];
isProduction &&
  output.push(
    {
      file: `dist/${Addon_name}.min.mjs`,
      format: "es",
      banner,
      exports: "named",
    },
    {
      file: `dist/${Addon_name}.min.js`,
      format: "umd",
      name: Str.hyphen2pascalcase(Addon_name),
      banner,
      exports: "named",
      plugins: [
        terser({
          output: {
            comments: (node, { type, value }) =>
              type === "comment2" && value.includes("Author"),
          },
        }),
      ],
    },
  );

export default {
  input: "src/index.js",
  output,
  external: ["ziko"],
  plugins: [
    resolve(),
    //commonjs(),
  ],
};
