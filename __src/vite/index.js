import { getZikoScript } from "../converter/index.js";
export function MDZ(){
    return {
      name: 'MDZ',
      transform(src, id) {
        if (id.endsWith('.mdz')) {
          console.log(src)
          return {
            code: getZikoScript(src),
            map: null,
          };
        }
      },
    };
  }
  