import { defineConfig } from "vite";
import MDZ from "mdzjs/vite"

export default defineConfig({
    plugins:[
        MDZ({
            extensions : ["mdx"],
            useVanJs : true
        })
    ]
});
