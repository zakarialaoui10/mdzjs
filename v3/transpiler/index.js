import { parseMDZ } from "./parser.js";
import { processMDZAST } from "./process.js";

const transpileMDZ=(Markdown)=>{
    const ast = parseMDZ(Markdown);
    const {args, esm, statements}= processMDZAST(ast)
    const body = [
        'import {h, Flex} from "ziko"',
        ...esm,
        `export default (${args})=>{`,
        'const __items__ = []',
        ...statements,
        "const UI = Flex(...__items__).vertical(0, 0)",
        "return UI }"
      ]
    return body.join("\n");
}

export {
    parseMDZ,
    processMDZAST,
    transpileMDZ
}