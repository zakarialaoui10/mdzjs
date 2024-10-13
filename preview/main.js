import { useTitle } from "ziko"
import UI,{attributes} from "./test.mdz"
const {title, background} = attributes
title && useTitle(title)
UI().style({
    border : "2px darkblue solid",
    width : "70%",
    margin : "auto",
    padding : "10px",
    fontFamily : "Cheeronsta",
    background : background ?? "orange"
}).vertical(-1, "space-around")
