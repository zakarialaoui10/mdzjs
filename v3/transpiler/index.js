import { parseMDZ } from "../parser/index.js";
import { processMDZAST } from "../processor/index.js";
import { stringifyProps, transformeAttrs } from "../utils/index.js";

const transpileMDZ=async (Markdown, {plugins = []} = {})=>{
    const {ast, frontmatter} = await parseMDZ(Markdown, ...plugins);
    const {esm, statements, hasCode}= processMDZAST(ast);

    const { 'MDZ.Props': props, ...attrs } = frontmatter;

    const body = [
        'import {tags, HTMLWrapper} from "ziko"',
        ...esm,
        transformeAttrs(attrs),
        `export default (${stringifyProps(props)})=>{`,
        'const __items__ = []',
        ...statements,
        "const UI = tags.div({class : 'mdz-wrapper'}, ...__items__).style({display : 'contents'})",
        "return UI }"
      ]
    // if(hasCode) body.unshift(`import("highlight.js/styles/${CodeStyle}.css")`);
    return body.join("\n");
}
export{
    transpileMDZ
}