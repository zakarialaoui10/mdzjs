import { text } from "ziko";
export default ({data,color})=>{
    return text(data).style({
        color : color
    })
}