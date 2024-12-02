import { transpileMDZ } from "../../transpiler/index.js";
export function ViteMDZ(){
    return {
      name: 'MDZ',
      transform(src, id) {
        if (id.endsWith('.mdz')) {
          return {
            code: transpileMDZ(src),
            map: null,
          };
        }
      },
    };
  }
  