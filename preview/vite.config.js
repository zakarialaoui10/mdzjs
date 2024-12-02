import { defineConfig } from "vite";
// import { MDZ } from "../src/vite/index.js";
import { ViteMDZ } from "../v2/transformers/vite/index.js"
export default defineConfig({
    plugins : [ViteMDZ()]
})