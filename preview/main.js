import { useTitle } from "ziko"
import UI,{title} from "./test.mdz"
title && useTitle(title)
UI({name : "from MDZjs"})
    .vertical(-1, 0)
    .style({
        border :"1px darkblue solid",
        padding : "15px"
    })