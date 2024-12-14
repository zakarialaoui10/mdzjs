// import { cleanMD } from "./pre-parse/clean-md.js";
import { parseMDZ, transpileMDZ } from "./transpiler/index.js";
import { useYml } from "./utils/parse-yml.js";

const md = `
---
title : get started
---

import A from "./A"

export const b = 10;

Hello {name} mm {m} []()

<B exp={1+1} str="kk"/>


`
const ast = parseMDZ(md)
// console.log(ast.children.at(-1))
const js = transpileMDZ(md)
// console.log(ast)
// console.log(JSON.stringify(ast, null, 2))

// useYml('a : 1\n__props__ : \n d : 2\n e : 1')