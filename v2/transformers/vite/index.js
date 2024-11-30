import { transpileMDZ } from "../../transpiler/index.js";
export function MDZ(){
    return {
      name: 'MDZ',
      transform(src, id) {
        if (id.endsWith('.mdz')) {
          console.log(src)
          return {
            code: transpileMDZ(src),
            map: null,
          };
        }
      },
    };
  }
  