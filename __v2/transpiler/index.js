import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { getComponentType } from './get-component-type.js';
import { jsx2js } from './jsx2js.js';
import { processText } from "./process-text.js"
import { parse as parseYaml } from 'yaml'; 
import remarkFrontmatter from 'remark-frontmatter';
import remarkGFM from "remark-gfm"
import { cleanMD } from '../pre-parse/clean-md.js';

const parseMDZ = (markdown) => unified().use(remarkParse).use(remarkGFM).use(remarkFrontmatter, ['yaml']).parse(markdown);

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
        return processText(text)
      }
      case 'paragraph' : {
        const childNodes = node.children.map(transformNode).join(', ');
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
        return `h('hr', {})`;
      }
      case 'table': {
        const headerRows = node.children[0].children.map(transformNode).join(', ');
        const bodyRows = node.children.slice(1).map(transformNode).join(', ');
        const thead = `h('thead', {}, h('tr', {}, ${headerRows})`;
        const tbody = `h('tbody', {}, ${bodyRows})`
        return `h('table', {}, ${thead}), ${tbody}).style({border : "1px solid darkblue", borderCollapse: "collapse"})`;
      }
      case 'tableRow': {
        const cells = node.children.map(transformNode).join(', ');
        return `h('tr', {}, ${cells}).style({border : "1px solid darkblue", borderCollapse: "collapse"})`;
      }
      case 'tableCell': {
        const childNodes = node.children.map(transformNode).join(', ');
        return `h('td', {}, ${childNodes}).style({border : "1px solid darkblue", borderCollapse: "collapse", padding : "5px"})`;
      }
      case 'html' : {
        const component = node.value.trim();
        const type = getComponentType(component);
        switch (type) {
          case 'jsx':
            return ` ${jsx2js(component.replaceAll("\n",""))}`;
          case 'html':{
            return ` HTMLWrapper("${component}")`

            // To be replaced by HTML Parser
          }
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
    fm : fm[0] ? parseYaml(fm[0].value) : {},
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
    
console.log({defaultProps : fm})
let ui = `const __items__ = [];
${body}
// console.log({__items__})
const UI = (${defaultProps ? `{${defaultProps}}={}`: ""}) => Flex(...__items__).vertical(0, 0);
export default UI
`
const AttrFounded = Object.keys(Attr).length > 0
let attributs = AttrFounded ? `const {${Object.keys(Attr).join(",")}} = ${JSON.stringify(Attr,"",2)}` : null
let exports = AttrFounded ? `export {${Object.keys(Attr).join(", ")}}` : null
  const Output = [
    imports,
    attributs,
    ui,
    exports,
  ].filter(Boolean).join('\n');
  return Output

}
export {transpileMDZ}
