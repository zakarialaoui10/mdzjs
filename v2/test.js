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
  let a = Math.random()
  return 1/a
})()} , How are you ?

Hello Ziko

{(async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos/1')
  const data = await response.json()
  return data
})()}

`;

let res = transpileMDZ(Markdown)
console.log(res)

// const md2 = "```js \n console.log(1) \n ```"
// console.log(transpileMDZ(md2))

