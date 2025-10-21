import { parseMarkdown } from "./index.js";
const inp = `
---
a : 1
b : 2
MDZ.Props : 
 - a : int().default(10)
 - c : 2
---
---
import A : 1
---

# Hello 
`.trimStart()
const out = await parseMarkdown(inp)

console.log(out.frontmatter['MDZ.Props'])