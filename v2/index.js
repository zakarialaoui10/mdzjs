import { unified } from 'unified';
import remarkParse from 'remark-parse';
import {visit} from "unist-util-visit"
import { getComponentType } from './get-component-type.js';
import { jsx2js } from "./jsx2js.js"
const parseMarkdown = (markdown) => unified().use(remarkParse).parse(markdown);

const transformToFunction = (markdownAST) => {
  const transformNode = (node) => {
    if (node.type === 'text') return JSON.stringify(node.value);

    if (node.type === 'paragraph') {
      const childNodes = node.children.map(transformNode).join(', ');
      return `tag('p', {}, ${childNodes})`;
    }

    if (node.type === 'heading') {
      const childNodes = node.children.map(transformNode).join(', ');
      return `tag('h${node.depth}', {}, [${childNodes}])`;
    }

    if (node.type === 'html') {
        const component = node.value.trim()
        const type = getComponentType(component)
        switch(type){
            case "jsx" : return `${jsx2js(component)}` 
            case "html" : return `HTMLWrapper("${component}")`
            default : return null
        }        
    }
    return 'null';
  };

  const body = markdownAST.children.map(transformNode).join(',\n');
  return body.replaceAll(",\n",";\n")
};

const markdown = `
# Hello World

This is a paragraph with <Button data="hello"/>

<p> Hello </p>
`;

const ast = parseMarkdown(markdown);
const jsFunction = transformToFunction(ast);

console.log(jsFunction);