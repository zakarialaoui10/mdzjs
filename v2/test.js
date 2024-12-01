import { transpileMDZ } from "./transpiler/index.js";
const Markdown = `
---
title: "Example Page"
author: "John Doe"
count : 10
__Props__ : {
  color : "red",
  id : 10
}
---

import Button from './Button.js';

# Hello World 
<Button 
data="100" 
p="kkk"
/>

This is a paragraph with <Button data="hello"/>

<p> Hello {1+1} </p>

<Button 
data="100" 
p="kkk"
m={1+1}
/>


Hello {(()=>{
  return 1
})()} , How are you ?

Hello Ziko
`;

let res = transpileMDZ(Markdown)
// console.log(res)

// const md2 = "```js \n console.log(1) \n ```"
// console.log(transpileMDZ(md2))

