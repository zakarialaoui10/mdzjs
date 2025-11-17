import { parseMDZ } from "./parser/index.js";
import { processMDZAST } from "./processor/index.js";
import { transpileMDZ } from "./transpiler/index.js";
const inp = `
---
a : 1
b : 2
MDZ.Props : 
 - a : 3
 - c : 2
---
import A from 'B';

{A}

# Hello 
`
// const out = await parseMDZ(inp)
// const p = processMDZAST(out.ast)
const t = await transpileMDZ(inp)

// console.log(out)
// console.log(p)
console.log(t)