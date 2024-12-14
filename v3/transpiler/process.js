import { processAttribute } from "../utils/process-attributes.js";
const processMDZ = (markdownAST) => {
    const transformNode = (node) => {
      switch(node.type){
        case 'mdxjsEsm' : {
          return node.value
        }
        case 'text' : {
          const text = node.value;
          return `"${text}"`
        }
        case 'mdxTextExpression' : {
          const {value} = node
          return value
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
        case 'mdxJsxFlowElement':{
          const {name, attributes, children} = node;
          processAttribute(attributes)
          // console.log({attributes : attributes[0].value})
          return `${name}()`
        }
        // case 'html' : {
        //   const component = node.value.trim();
        //   const type = getComponentType(component);
        //   switch (type) {
        //     case 'jsx':
        //       return ` ${jsx2js(component.replaceAll("\n",""))}`;
        //     case 'html':{
        //       return ` HTMLWrapper("${component}")`
  
        //       // To be replaced by HTML Parser
        //     }
        //     case 'script' : return {
        //       type : "script",
        //       value : `${component.replace(/<script[^>]*>/g, '').replace(/<\/script>/g, '').trim()}`
        //     };
        //     default:
        //       return null;
        //   }
        // }
      }
      return 'null';
    };
    let fm = [];
    let esm = [];
    let mdBody = [];

    const statements = []
  
    markdownAST.children.forEach((node) => {
      // console.log({type : node.type})
      switch(node.type){
        case 'yaml' : statements.push(node); break;
        case 'mdxjsEsm' : statements.push(node.value); break;
        default : statements.push(transformNode(node)) ; break;
      }
    });
    // console.log({statements})
    return {
      fm ,
      body : mdBody.map(transformNode).map(n=>n instanceof Object? n.value: `__items__.push(${n})`).join("\n"),
      esm
    }
  };
export {
    processMDZ
}