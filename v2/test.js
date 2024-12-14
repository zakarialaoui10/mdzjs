import { transpileMDZ } from "./transpiler/index.js";

const Markdown = `
---
title : hi
__Props__ :
  m : 1
 
---

# Hi 

{
 1+1
}
<p> Hi </p>
`
let res = transpileMDZ(Markdown)
console.log(res)