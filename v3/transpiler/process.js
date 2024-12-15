// import { processAttribute } from "../utils/process-attributes.js";
import { 
  componentType,
  processAttribute,
  parseYml
} from "../utils/index.js"
const processMDZ = (markdownAST) => {
    const transformNode = (node) => {
      // console.log({type : node.type})
      switch(node.type){
        case 'mdxjsEsm' : {
          return {
            type : "script",
            value : node.value
          }
        }
        case 'text' : {
          const text = node.value;
          return `"${text}"`
        }
        case 'mdxTextExpression' : {
          const {value} = node
          return value
        }
        case 'heading' : {
          const childNodes = node.children.map(transformNode).join(', ');
          return `h('h${node.depth}', {}, ${childNodes})`;
        }
        case 'paragraph' : {
          const childNodes = node.children.map(transformNode).join(', ');
          return `h('p', {}, ${childNodes})` 
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
        case 'yaml':{
          return {
            type : "yaml",
            value : parseYml(node.value)
          }
        }
        case 'mdxJsxFlowElement':{
          const {name, attributes, children} = node;
          const childNodes = children.map(transformNode).join(', ');
          const hasChildren = childNodes.length > 0;
          switch(componentType(name)){
            case "jsx" : return `${name}(${processAttribute(attributes)}${hasChildren ?`, ${childNodes}`:""})`;
            case "html" : return `h(${name}, ${processAttribute(attributes)}${hasChildren ?`, ${childNodes}`:""})`;
            case "script" : {
              const statements = [];
              for(let i=0; i<node.children.length; i++) statements.push(node.children[i].children[0].value)
              return {
                type : "script",
                value : statements.join("\n")
              }
            }
          }
        }
      }
      return 'null';
    };
    let fm = [];
    let esm = [];
    let mdBody = [];
    let args = ""

    const statements = []
    markdownAST.children.forEach((node) => {
      switch(node.type){
        case 'yaml' : args = transformNode(node).value; break;
        // case 'mdxjsEsm' : statements.push(node); break;
        default : statements.push(transformNode(node)) ; break;
      }
    });

    const body = [
      'import {h, Flex} from "ziko"',
      `export default (${args})=>{`,
      'const __items__ = []'
    ]
    console.log({statements})
    for(let i=0; i<statements.length; i++){
      if(typeof statements[i]==="string") body.push(`__items__.push(${statements[i]})`)
      else body.push(statements[i].value)
    }
    body.push("const UI = Flex(...__items__).vertical(0, 0)")
    body.push("return UI }")
    console.log(body.join("\n"))
    console.log({args})
    return {
      fm ,
      body : body.join("\n"),
      esm
    }
  };
export {
    processMDZ
}