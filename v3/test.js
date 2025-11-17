import { parseMarkdown } from "./index.js";
import { processMDZAST } from "./processor/index.js";
const inp = `
---
a : 1
b : 2
MDZ.Props : 
 - a : int().default(10)
 - c : 2
---
import A from 'B';

{A}

# Hello 
`.trimStart()
const out = await parseMarkdown(inp)
const p = processMDZAST(out.ast)

// console.log(out)
console.log(p)