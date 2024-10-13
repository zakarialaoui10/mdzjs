import { parseMDZ } from "../parser/index.js"
const getZikoScript=(MDZ)=>{
    let {modules,attributes,components}=parseMDZ(MDZ)
    return `
${modules.join("\n")}

export const attributs = ${JSON.stringify(attributes)}

export default ()=>Wrapper(
 ${components.join(",\n ")}
)  
    `
}
export{
    getZikoScript
}