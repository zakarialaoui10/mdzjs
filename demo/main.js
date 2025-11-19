// import { useTitle } from "ziko"
import {tags} from 'ziko/ui'
import {Dom} from './components/Dom.js'
// import UI, {title} from "./test.mdz"
import UI from './test.mdz'

globalThis.d = Dom({text : 'AAAAA', color : 'red'})
tags.div({}, d)
// title && useTitle(title)
UI({name : "from MDZjs"})
    // .vertical(-1, 0)
    .style({
        border :"1px darkblue solid",
        padding : "15px",
})