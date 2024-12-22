> [!NOTE]  
> This project is part of the [ZikoJS](https://github.com/zakarialaoui10/ziko.js) ecosystem.

# Markdown for [Zikojs](https://github.com/zakarialaoui10/ziko.js)

## Install 
```bash
 npm i mdzjs
```

## Usage 

### Config 
```js
import {defineConfig} from "vite"
import {MDZ} from "mdzjs"
export default defineConfig({
    plugins : [
        MDZ()
    ]
})
```

### Example 

```md
---
title : MDZ
background : tomato
---

import InteractiveBlock from "./InteractiveBlock.js";

**MDZ** (Markdown for ***zikojs***) is a format that allows you to append Zikojs Elements directly within Markdown.

It combines the simplicity of Markdown syntax with the power and flexibility of ***Javascript***

Here’s an example of an interactive block rendered within this MDZ file:

<InteractiveBlock data="Hello  from MDZ" color="darkblue"/>

### Features of MDZ:
1- **Simple Integration :** Write Markdown as usual, and inject ZikoJS elements wherever needed.
2- **Frontmatter Support :** In this example, the title of the document is set dynamically through the frontmatter.

3- **Extensible :** Create custom components like InteractiveBlock and use them in any Markdown file.
```

```js
// InteractiveBlock.js
import {Flex, input, text} from "ziko"
export default ({data, color})=>{
    let txt = text(data).style({color})
    let inp = input(data).style({
        padding : "5px",
        background : "transparent",
        outline :"none",
        boxShadow :"1px 1px 1px white",
        fontSize : "inherit"
    })
    inp.onInput(e=>txt.setValue(e.value))
    return Flex(
        inp,
        txt
    ).vertical(0, "space-around").size("60%").style({
        border : "2px darkblue solid",
        padding : "10px",
        minHeight : "100px",
        margin : "auto"
    })
}
```

```js
// main.js
import { useTitle } from "ziko"
import UI,{title, background} from "./test.mdz"
title && useTitle(title)
UI().style({
    border : "2px darkblue solid",
    width : "70%",
    margin : "auto",
    padding : "10px",
    fontFamily : "Cheeronsta",
    background : background ?? "orange"
}).vertical(-1, "space-around")
```