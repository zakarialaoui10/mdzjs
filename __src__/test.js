import { getZikoScript } from "./converter/index.js";
const markdownContent = `
---
modules:
 - import Component from "./Component" 
 - import OtherComponent from "./OtherComponent"
 - import OtherComonenetWithProps from "./OtherComonenetWithProps"
title: MDZ
---
Para
[Link](#hi)

<Component />

line2

<OtherComponent />
<OtherComonenetWithProps data="hello" />
`;
const script = getZikoScript(markdownContent);
console.log(script)