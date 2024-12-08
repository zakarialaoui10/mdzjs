import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { getComponentType } from './get-component-type.js';
import { jsx2js } from './jsx2js.js';
import { processText } from "./process-text.js"
import { parse as parseYaml } from 'yaml'; 
import remarkFrontmatter from 'remark-frontmatter';

const parseMDZ = (markdown) => unified().use(remarkParse).use(remarkFrontmatter).parse(markdown);

const processMDZ = (markdown) => {
  const importRegex = /^\s*import\s+[^;]+;$/gm
  let imports = ['import {h, Flex, HTMLWrapper} from "ziko"'];
  let frontmatter = {};
  let cleanedMarkdown = markdown;

  cleanedMarkdown = cleanedMarkdown.replace(importRegex, (match) => {
    imports.push(match.trim());
    return ''; 
  });
  return { imports : imports.join("\n"), frontmatter, cleanedMarkdown };
};

const transformMDZ = (markdownAST) => {
  const transformNode = (node) => {
    switch(node.type){
      case 'text' : {
        const text = node.value;
        console.log({pr : processText(text)})
        return processText(text)
      }
      case 'paragraph' : {
        // console.log({node : node.children})
        const childNodes = node.children.map(transformNode).join(', ');
        // console.log({childNodes})
        return `h('p', {}, ${childNodes})` 
      }
      case 'heading' : {
        const childNodes = node.children.map(transformNode).join(', ');
        return `h('h${node.depth}', {}, ${childNodes})`;
      }
      case 'strong': {
        const childNodes = node.children.map(transformNode).join(', ');
        return `h('strong', {}, ${childNodes})`;
      }

      case 'emphasis': {
        const childNodes = node.children.map(transformNode).join(', ');
        return `h('em', {}, ${childNodes})`;
      }

      case 'link': {
        const childNodes = node.children.map(transformNode).join(', ');
        return `h('a', { href: "${node.url}" }, ${childNodes})`;
      }

      case 'image': {
        return `h('img', { src: "${node.url}", alt: "${node.alt || ''}" })`;
      }

      case 'list': {
        const listTag = node.ordered ? 'ol' : 'ul';
        const childNodes = node.children.map(transformNode).join(', ');
        return `h('${listTag}', {}, ${childNodes})`;
      }

      case 'listItem': {
        const childNodes = node.children.map(transformNode).join(', ');
        return `h('li', {}, ${childNodes})`;
      }

      case 'code': {
        const language = node.lang ? `, { 'data-lang': '${node.lang}' }` : '';
        return `h('pre', {}, h('code'${language}, {}, ${JSON.stringify(node.value)}))`;
      }

      case 'blockquote': {
        const childNodes = node.children.map(transformNode).join(', ');
        return `h('blockquote', {}, ${childNodes})`;
      }
      case 'thematicBreak': {
        return `h('hr', {}, '')`;
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
  const {body,fm} = transformMDZ(ast);
  const {__Props__, ...Attr} = fm
  const defaultProps = __Props__
    ? Object.entries(__Props__)
        .map(([key, value]) => `${key} = ${JSON.stringify(value)}`)
        .join(', ')
    : '';
let ui = `
const __items__ = [];
${body}
// console.log({__items__})
const UI = (${defaultProps ? `{${defaultProps}}={}`: ""}) => Flex(...__items__).vertical(0, 0);
export default UI
`
let attributs = `const {${Object.keys(Attr).join(",")}} = ${JSON.stringify(Attr,"",2)}`
let exports = `export {${Object.keys(Attr).join(", ")}}`
  const Output = [
    imports,
    attributs,
    ui,
    exports
  ].join('\n');
  return Output

}
export {transpileMDZ}
