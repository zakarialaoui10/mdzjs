// import { useTitle } from "ziko"
// import UI,{attributes} from "./test.mdz"
// const {title, background} = attributes
// title && useTitle(title)
// UI().style({
//     border : "2px darkblue solid",
//     width : "70%",
//     margin : "auto",
//     padding : "10px",
//     fontFamily : "Cheeronsta",
//     background : background ?? "orange"
// }).vertical(-1, "space-around")
// console.log(1)
import UI,{title} from "./test.mdz"
globalThis.app =UI().vertical(-1, 0).style({border :"1px darkblue solid"}).style({
    padding : "15px"
})
console.log(app)