import { parseMDZ } from "../parser/index.js"
const getZikoScript=(MDZ)=>{
    let {modules,attributes,components}=parseMDZ(MDZ)
    return `
import {Flex, HTMLWrapper} from "ziko";
${modules?.join(";\n")};

export const attributes = ${JSON.stringify(attributes)}

export default ()=> Flex(
 ${components.join(",\n ")}
).vertical(0, "space-around")
    `
}
export{
    getZikoScript
}