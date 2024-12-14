import { parseMDZ } from "./parser.js";
import { processMDZ } from "./process.js";

const transpileMDZ=(Markdown)=>{
    const ast = parseMDZ(Markdown);
    const {body, fm} = processMDZ(ast);
    // console.log({body, fm})
}

export {
    parseMDZ,
    processMDZ,
    transpileMDZ
}