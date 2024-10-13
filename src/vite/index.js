import { getZikoScript } from "../converter/index.js";
export function MDZ(){
    return {
      name: 'MDZ',
      transform(src, id) {
        if (id.endsWith('.mdz')) {
          console.log(src)
          return {
            code: getZikoScript(src),
            map: null
          };
        }
      },
      resolveId(id) {
        if (id.endsWith('.mdz')) {
          console.log("resolve ...")
          return id;
        }
        return null;
      },
      load(id) {
        if (id.endsWith('.mdz')) {
          console.log("load ...")
          return `export default ''`;
        }
        return null;
      }
    };
  }
  