import { transpileMDZ } from "../transpiler/index.js";
export default function ViteMDZ({extensions = [".mdx"]}={}){
    return {
      name: 'MDZ',
      transform(src, id) {
        if (id.endsWith('.mdz')||extensions.some(ext=>id.endsWith(ext))) {
          return {
            code: transpileMDZ(src),
            map: null,
          };
        }
      },
    };
  }
  