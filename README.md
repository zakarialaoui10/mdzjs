> [!NOTE]  
> This project is part of the [ZikoJS](https://github.com/zakarialaoui10/ziko.js) ecosystem.

# MDZjs
A Markdown preprocessor for Zikojs. Markdown in Zikojs.
It combines the simplicity of Markdown syntax with the power and flexibility of ***Javascript***

## Install 
```bash
 npm i mdzjs
```
 
## Config 
```js
import {defineConfig} from "vite"
import MDZ from "mdzjs/vite"
export default defineConfig({
    plugins : [
        MDZ()
    ]
})
```

## Usage

*Article.mdz :*

```js
---
 title : MDZ 
 name : world
 __props__ : 
   background : tomato
   data : []
---
import data from "./data.js";
import InteractiveComponent from "./InteractiveComponent.js";

# Hello {name}

<InteractiveComponent data={data} background={tomato}/>

```

```js
// main.js
import Article,{title} from "./Article.mdz"
```

## Features
- **Simple Integration :** Write Markdown as usual, and inject Zikojs elements wherever needed.
- **Extensible :** Create custom interactive components using Zikojs and use them in any Markdown file.
- **Markdown :**
- **Frontmatter Support :**
- **JSX Syntax :** 
- **Props :**  
- **ESM :** 
- **Expressions :** MDZjs allows the use of JavaScript expressions within curly braces, such as Hello {name}. These expressions can include complete JavaScript programs, provided they are enclosed in an expression that evaluates to a renderable value. For instance, you can use an IIFE in this way :
```js
Hello {(()=>{
    const names = ["world", "everyone"];
    const {length} = names
    return names[Math.floor(Math.random()*length)]
})()}
```
- **Internal scripts :**  allow you to include JavaScript logic that runs alongside your MDZjs components but unlike expressions is not directly rendered as part of the output.
They can be used for initializing variables or performing side effects that influence the application but do not produce visual content.

```html
<script>
    console.log("Hello from MDZjs")
    let addons = [
        "ziko-gl",
        "ziko-lottie",
        "ziko-chart"
    ]
// The addons variable can be accessed and used in MDZjs expressions 
</script>
```
- **Interleaving :** You can use inline markdown elements inside HTML or Zikojs Components

```html
<Header background={background}>
 ***Hello {name}***
</Header>
```



<!-- ## Usage 

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
``` -->