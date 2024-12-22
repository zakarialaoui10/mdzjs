// import { cleanMD } from "./pre-parse/clean-md.js";
import { parseMDZ, transpileMDZ } from "./transpiler/index.js";
import { parseYml } from "./utils/parse-yml.js";

const md = `---
title : get started
id : 1
__props__ : 
 color : red
 size : 10
---

<script>
 console.log(1)
 console.log(2)

 console.log(3)
</script>

import A from "./A"
export const b = 10;

Hello {name} mm {m} [mmmm](kkk)

<B exp={1+1} str="kk">
  # hi
  # hi
</B>

# Hi 
## HI {Ziko}


|A|B|
|-|-|

`

// const md = `---
// title : Hi
// ---
// `
const ast = parseMDZ(md)
// console.log(ast.children.at(-1))
const js = transpileMDZ(md)
console.log(js)
// console.log(JSON.stringify(ast, null, 2))

// parseYml('a : 1\n__props__ : \n d : 2\n e : 1')