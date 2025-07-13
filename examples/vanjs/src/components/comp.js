// export default function Dom({}, ...children){
//     console.log({children})
//     const element = document.createElement("div")
//     children.forEach(n=>element.append(n))
//     return element
// }

import {p} from "ziko"

export default function Dom({children}){
    // children.forEach(n=>console.log(n.element))
    return p("ppp");
}