import { parseMDZ } from "./parser.js";
import { processMDZAST } from "./process.js";
import { stringifyProps } from "../utils/parse-yml.js";

const transpileMDZ=(Markdown, CodeStyle = "1c-light")=>{
    const ast = parseMDZ(Markdown);
    const {attrs, props, esm, statements, hasCode}= processMDZAST(ast)
    const body = [
        'import {h, HTMLWrapper, Flex} from "ziko"',
        attrs,
        ...esm,
        `export default (${stringifyProps(props)})=>{`,
        'const __items__ = []',
        ...statements,
        "const UI = Flex(...__items__).vertical(0, 0)",
        "return UI }"
      ]
    if(hasCode) body.unshift(`import("highlight.js/styles/${CodeStyle}.css")`);
    return body.join("\n");
}
export{
    transpileMDZ
}