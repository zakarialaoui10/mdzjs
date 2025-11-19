import {Flex, tags, text} from "ziko"
export default ({data , color = 'red'})=>{
    let txt = tags.span(data).style({color})
    // let inp = tags.input(data).style({
    //     padding : "5px",
    //     background : "transparent",
    //     outline :"none",
    //     boxShadow :"1px 1px 1px white",
    //     fontSize : "inherit"
    // })
    // inp.onInput(e=>txt.setValue(e.value))
    return Flex(
        // inp,
        txt
    ).vertical(0, "space-around").size("60%").style({
        border : "2px darkblue solid",
        padding : "10px",
        minHeight : "100px",
        margin : "auto"
    }).onClick(e=>console.log(e.target))
}