import { transpileMDZ } from "./transpiler/index.js";

const Markdown = `
# Hi 

{
 1+1
}
<p> Hi </p>
`
let res = transpileMDZ(Markdown)
console.log(res)