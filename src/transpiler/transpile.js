import { parseMDZ } from "./parser.js";
import { processMDZAST } from "./process.js";

const transpileMDZ=(Markdown)=>{
    const ast = parseMDZ(Markdown);
    const {attrs, props, esm, statements}= processMDZAST(ast)
    console.log({props})
    const body = [
        'import {h, HTMLWrapper, Flex} from "ziko"',
        attrs,
        ...esm,
        `export default (${props})=>{`,
        'const __items__ = []',
        ...statements,
        "const UI = Flex(...__items__).vertical(0, 0)",
        "return UI }"
      ]
    return body.join("\n");
}
export{
    transpileMDZ
}