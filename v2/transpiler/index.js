import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { getComponentType } from './get-component-type.js';
import { jsx2js } from './jsx2js.js';
import { processText } from "./process-text.js"
import { parse as parseYaml } from 'yaml'; 
import remarkFrontmatter from 'remark-frontmatter';
import { remarkImports } from './import-plugin.js';

const parseMDZ = (markdown) => unified().use(remarkParse).use(remarkFrontmatter).use(remarkImports).parse(markdown);

const processMDZ = (markdown) => {
  // Frontmatter regex (between '---' or '+++')
  // const frontmatterRegex = /^---\n([\s\S]+?)\n---/m;
  const importRegex = /^import\s+.+from\s+.+;$/gm;
  
  // let imports = ['import {tag, Flex, HTMLWrapper} from "ziko"'];
  let imports = ['import {Flex, HTMLWrapper} from "ziko"'];
  let frontmatter = {};
  let cleanedMarkdown = markdown;

  // const frontmatterMatch = markdown.match(frontmatterRegex);
  // if (frontmatterMatch) {
  //   const frontmatterContent = frontmatterMatch[1];
  //   frontmatter = parseYaml(frontmatterContent); 
  //   cleanedMarkdown = cleanedMarkdown.replace(frontmatterRegex, ''); 
  // }

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
        return `"${processText(text).join("")}"`
        return text.includes("Ziko")?null:JSON.stringify(node.value);
      }
      case 'paragraph' : {
        const childNodes = node.children.map(transformNode).join(', ');
        return ` tag('p', {}, ${childNodes})` 
      }
      case 'heading' : {
        const childNodes = node.children.map(transformNode).join(', ');
        return ` tag('h${node.depth}', {}, ${childNodes})`;
      }
      case 'strong': {
        const childNodes = node.children.map(transformNode).join(', ');
        return ` tag('strong', {}, ${childNodes})`;
      }

      case 'emphasis': {
        const childNodes = node.children.map(transformNode).join(', ');
        return ` tag('em', {}, ${childNodes})`;
      }

      case 'link': {
        const childNodes = node.children.map(transformNode).join(', ');
        return ` tag('a', { href: "${node.url}" }, ${childNodes})`;
      }

      case 'image': {
        return ` tag('img', { src: "${node.url}", alt: "${node.alt || ''}" })`;
      }

      case 'list': {
        const listTag = node.ordered ? 'ol' : 'ul';
        const childNodes = node.children.map(transformNode).join(', ');
        return ` tag('${listTag}', {}, ${childNodes})`;
      }

      case 'listItem': {
        const childNodes = node.children.map(transformNode).join(', ');
        return ` tag('li', {}, ${childNodes})`;
      }

      case 'code': {
        const language = node.lang ? `, { 'data-lang': '${node.lang}' }` : '';
        return ` tag('pre', {}, tag('code'${language}, {}, ${JSON.stringify(node.value)}))`;
      }

      case 'blockquote': {
        const childNodes = node.children.map(transformNode).join(', ');
        return ` tag('blockquote', {}, ${childNodes})`;
      }
      case 'thematicBreak': {
        return ` tag('hr', {}, '')`;
      }
      case 'html' : {
        const component = node.value.trim();
        const type = getComponentType(component);
        switch (type) {
          case 'jsx':
            return ` ${jsx2js(component.replaceAll("\n",""))}`;
          case 'html':
            return ` HTMLWrapper("${component}")`;
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
    body : mdBody.map(transformNode).join(`,\n`)
  }
  // const body = markdownAST.children.map(transformNode).join(',\n');
  // return body
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
  let ui = `
  import {text} from "ziko"
  const tag=(...ars)=> text("hi")
  const UI=({${defaultProps}}={})=>Flex(
${body}
).vertical(0,0);
export default UI;`
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
