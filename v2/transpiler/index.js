import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { getComponentType } from './get-component-type.js';
import { jsx2js } from './jsx2js.js';
import { processText } from "./process-text.js"
import { parse as parseYaml } from 'yaml'; 
import remarkFrontmatter from 'remark-frontmatter';

const parseMDZ = (markdown) => unified().use(remarkParse).use(remarkFrontmatter).parse(markdown);

const processMDZ = (markdown) => {
  const importRegex = /^import\s+.+from\s+.+;$/gm;
  
  let imports = ['import {Flex, HTMLWrapper} from "ziko"'];
  let frontmatter = {};
  let cleanedMarkdown = markdown;

  cleanedMarkdown = cleanedMarkdown.replace(importRegex, (match) => {
    imports.push(match.trim());
    return ''; 
  });
  return { imports, frontmatter, cleanedMarkdown };
};

const transformMDZ = (markdownAST) => {
  const transformNode = (node) => {
    switch(node.type){
      case 'text' : {
        const text = node.value;
        return processText(text)
      }
      case 'paragraph' : {
        const childNodes = node.children.map(transformNode).join(', ');
        return `tag('p', {}, ${childNodes})` 
      }
      case 'heading' : {
        const childNodes = node.children.map(transformNode).join(', ');
        return `tag('h${node.depth}', {}, ${childNodes})`;
      }
      case 'strong': {
        const childNodes = node.children.map(transformNode).join(', ');
        return `tag('strong', {}, ${childNodes})`;
      }

      case 'emphasis': {
        const childNodes = node.children.map(transformNode).join(', ');
        return `tag('em', {}, ${childNodes})`;
      }

      case 'link': {
        const childNodes = node.children.map(transformNode).join(', ');
        return `tag('a', { href: "${node.url}" }, ${childNodes})`;
      }

      case 'image': {
        return `tag('img', { src: "${node.url}", alt: "${node.alt || ''}" })`;
      }

      case 'list': {
        const listTag = node.ordered ? 'ol' : 'ul';
        const childNodes = node.children.map(transformNode).join(', ');
        return `tag('${listTag}', {}, ${childNodes})`;
      }

      case 'listItem': {
        const childNodes = node.children.map(transformNode).join(', ');
        return `tag('li', {}, ${childNodes})`;
      }

      case 'code': {
        const language = node.lang ? `, { 'data-lang': '${node.lang}' }` : '';
        return `tag('pre', {}, tag('code'${language}, {}, ${JSON.stringify(node.value)}))`;
      }

      case 'blockquote': {
        const childNodes = node.children.map(transformNode).join(', ');
        return `tag('blockquote', {}, ${childNodes})`;
      }
      case 'thematicBreak': {
        return `tag('hr', {}, '')`;
      }
      case 'html' : {
        const component = node.value.trim();
        const type = getComponentType(component);
        switch (type) {
          case 'jsx':
            return ` ${jsx2js(component.replaceAll("\n",""))}`;
          case 'html':
            return ` HTMLWrapper("${component}")`;
          case 'script' : return {
            type : "script",
            value : `${component.replace(/<script[^>]*>/g, '').replace(/<\/script>/g, '').trim()}`
          };
          default:
            return null;
        }
      }
  

    }
    return 'null';
  };
  let fm = [];
  let mdBody = [];

  markdownAST.children.forEach((node) => {
    if (node.type === 'yaml') {
      fm.push(node); 
    } else {
      mdBody.push(node); 
    }
  });

  return {
    fm : parseYaml(fm[0].value),
    body : mdBody.map(transformNode).map(n=>n instanceof Object? n.value: `__items__.push(${n})`).join("\n")
  }
};

const transpileMDZ= markdown =>{
  const { imports, cleanedMarkdown } = processMDZ(markdown);
  const ast = parseMDZ(cleanedMarkdown);
  // console.log({im : ast.data})
  const {body,fm} = transformMDZ(ast);
  const {__Props__, ...Attr} = fm
  // console.log({
  //   body,
  //   fm
  // })
  const defaultProps = __Props__
    ? Object.entries(__Props__)
        .map(([key, value]) => `${key} = ${JSON.stringify(value)}`)
        .join(', ')
    : '';
//   let ui = `
//   import {text} from "ziko"
//   const tag=(...ars)=> text("hi")
//   const UI=({${defaultProps}}={})=>Flex(
// ${body}
// ).vertical(0,0);
// export default UI;`
let ui = `const __items__ = [];
const tag = (...arg) =>  {
  console.log(arg)
  return arg
}
${body}
console.log({__items__})
const A = () =>100
export default A
`
  let exports = `const {${Object.keys(Attr).join(",")}} = ${JSON.stringify(Attr,"",2)}
export {${Object.keys(Attr).join(", ")}}
  `
  const Output = [
    ...imports,
    ui,
    exports,
  ].join('\n');
  return Output

}
export {transpileMDZ}
