import {tags} from 'ziko/ui'
import UI from './test.mdz'

import hljs from "highlight.js"
import 'highlight.js/styles/github.css';
hljs.highlightAll()
// globalThis.d = Dom({text : 'AAAAA', color : 'red'})
// console.log(d)
// tags.div({}, d)
// title && useTitle(title)

globalThis.items = UI({name : "from MDZjs"})

globalThis.App = tags.section({}, ...items).style({
    border : '1px darkblue solid',
    padding : '16px'
})

App.mount(document.body)

// .forEach(n => n.mount(document.body))
    // .vertical(-1, 0)
    // .style({
    //     border :"1px darkblue solid",
    //     padding : "15px",
    // }).mount(document.body)