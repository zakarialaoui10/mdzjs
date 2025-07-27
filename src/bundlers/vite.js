import { transpileMDZ } from "../transpiler/index.js";
export default function ViteMDZ({extensions = [".mdx"], useVanJs = false}={}){
    return {
      name: 'MDZ',
      transform(src, id) {
        if (id.endsWith('.mdz')||extensions.some(ext=>id.endsWith(ext))) {
          return {
            code: transpileMDZ(src, useVanJs),
            map: null,
          };
        }
      },
      handleHotUpdate({ file, server }) {
        if (file.endsWith('.mdz')) {
          // Send update to Vite HMR client
          server.ws.send({
            type: 'custom',
            event: 'custom-update',
            data: {
              file,
              timestamp: Date.now(),
            },
          });

          return [file];
        }
      },
    };
  }
  