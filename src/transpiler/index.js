import { parseMDZ } from "../parser/index.js";
import { processMDZAST } from "../processor/index.js";
import { stringifyProps, transformeAttrs } from "../utils/index.js";

const transpileMDZ = async (Markdown, {plugins = []} = {})=>{
    const {ast, frontmatter} = await parseMDZ(Markdown.trimStart(), ...plugins);
    const {esm, statements, hasCode, Tags}= processMDZAST(ast);

    console.log({Tags})

    const { 'MDZ.Props': props, ...attrs } = frontmatter;

    const body = [
        'import {tags, HTMLWrapper} from "ziko/ui"',
        ...esm,
        transformeAttrs(attrs),
        `export default (${stringifyProps(props)})=>{`,
        `const {${[...Tags].join(', ')}} = tags`,
        'const __items__ = []',
        ...statements,
        'return __items__',
        '}',
        // "const UI = tags.div({class : 'mdz-wrapper'}, ...__items__).style({display : 'contents'})",
        // "return UI }"
      ]
    // if(hasCode) body.unshift(`import("highlight.js/styles/${CodeStyle}.css")`);
    return body.join("\n");
}
export{
    transpileMDZ
}