import { 
  componentType,
  processAttribute,
  parseYml,
  hyperscript
} from "../utils/index.js"
const processMDZAST = (markdownAST) => {
    const transformNode = (node) => {
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
          return hyperscript(`h${node.depth}`,"{}", childNodes);
          // return `h('h${node.depth}', {}, ${childNodes})`;
        }
        case 'paragraph' : {
          const childNodes = node.children.map(transformNode).join(', ');
          return hyperscript("p","{}", childNodes)
          // return `h('p', {}, ${childNodes})` 
        }
        case 'strong': {
          const childNodes = node.children.map(transformNode).join(', ');
          return hyperscript("strong","{}", childNodes);
          // return `h('strong', {}, ${childNodes})`;
        }
  
        case 'emphasis': {
          const childNodes = node.children.map(transformNode).join(', ');
          return hyperscript("emphasis","{}", childNodes);
          // return `h('em', {}, ${childNodes})`;
        }
  
        case 'link': {
          const childNodes = node.children.map(transformNode).join(', ');
          return hyperscript("a", `{ href: "${node.url}" }`, childNodes);
        }
  
        case 'image': {
          hyperscript("img", `{ src: "${node.url}", alt: "${node.alt || ''}`)
          return `h('img', { src: "${node.url}", alt: "${node.alt || ''}" })`;
        }
  
        case 'list': {
          const listTag = node.ordered ? 'ol' : 'ul';
          const childNodes = node.children.map(transformNode).join(', ');
          return hyperscript(listTag, "{}", childNodes);
          // return `h('${listTag}', {}, ${childNodes})`;
        }
  
        case 'listItem': {
          const childNodes = node.children.map(transformNode).join(', ');
          return hyperscript("li", "{}", childNodes);
          // return `h('li', {}, ${childNodes})`;
        }
  
        case 'code': {
          const language = node.lang ? `, { 'data-lang': '${node.lang}' }` : '';
          return hyperscript("pre", "{}", hyperscript(
            "code",
            language,
            JSON.stringify(node.value)
          ));
          // return `h('pre', {}, h('code'${language}, {}, ${JSON.stringify(node.value)}))`;
        }
  
        case 'blockquote': {
          const childNodes = node.children.map(transformNode).join(', ');
          return hyperscript("blockquote", "{}", childNodes);
        }
        case 'thematicBreak': {
          return `h('hr', {})`;
        }
        case 'table': {
          const headerRows = node.children[0].children.map(transformNode).join(', ');
          const bodyRows = node.children.slice(1).map(transformNode).join(', ');
          const thead = hyperscript("thead", "{}", hyperscript("tr", "{}", headerRows));
          const tbody = hyperscript("tbody", "{}", bodyRows);
          return hyperscript("table", "{}", [thead, tbody].join(","))
          // console.log({thead, tbody})
          // const thead = `h('thead', {}, h('tr', {}, ${headerRows})`;
          // const tbody = `h('tbody', {}, ${bodyRows})`
          // return `h('table', {}, ${thead}), ${tbody}).style({border : "1px solid darkblue", borderCollapse: "collapse"}`;
        }
        case 'tableRow': {
          const cells = node.children.map(transformNode).join(', ');
          return `${hyperscript("tr", "{}", cells)}.style({border : "1px solid darkblue", borderCollapse: "collapse"})`
          // return `h('tr', {}, ${cells}).style({border : "1px solid darkblue", borderCollapse: "collapse"})`;
        }
        case 'tableCell': {
          const childNodes = node.children.map(transformNode).join(', ');
          return `${hyperscript("td", "{}", childNodes)}.style({border : "1px solid darkblue", borderCollapse: "collapse", padding : "5px"})`
          // return `h('td', {}, ${childNodes}).style({border : "1px solid darkblue", borderCollapse: "collapse", padding : "5px"})`;
        }
        case 'yaml':{
          const {props, attrs} = parseYml(node.value)
          return {
            type : "yaml",
            props, 
            attrs
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
                isScript : true,
                value : statements.join("\n")
              }
            }
          }
        }
      }
      return 'null';
    };
    let esm = [];
    let props = "";
    let attrs = "";

    const statements = []
    markdownAST.children.forEach((node) => {
      switch(node.type){
        case 'yaml' : {
          const Transformed = transformNode(node)
          props = Transformed.props,
          attrs = Transformed.attrs
        } break;
        case 'mdxjsEsm' : esm.push(node.value); break;
        default : {
          const Transformed = transformNode(node);
          if(Transformed.isScript) statements.push(Transformed.value);
          else statements.push(`__items__.push(${Transformed})`)
        }
      }
    });
    return {
      attrs,
      props,
      esm,
      statements
    }
  };
export {
    processMDZAST
}