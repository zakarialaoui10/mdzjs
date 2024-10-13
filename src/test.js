import { parseMDZ } from "./parser/index.js";
const markdownContent = `
---
modules: 
 - import A from "./a"
 - import B from "./b"
title: ziko
---
line 0

<Comp0 />

line2

<Comp1 />
<Comp2 data="hello" />
`.trim();

console.log(parseMDZ(markdownContent))