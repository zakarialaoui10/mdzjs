import { parse } from 'yaml'; 

const parseYml = yml => {
    const {__props__, ...__attrs__} = parse(yml) ;
    const HasAttributs = Object.keys(__attrs__).length > 0
    return {
        props : __props__
                ?`{${Object.entries(__props__).map(([key, value]) => `${key} = ${JSON.stringify(value)}`).join(", ")}}={}`
                :"",
        attrs : HasAttributs
                ?[
                    `const {${Object.keys(__attrs__).join(",")}} = ${JSON.stringify(__attrs__,"",2)}`,
                    `export {${Object.keys(__attrs__).join(", ")}}`
                ].join("\n")
                : ""
    }
}

export {parseYml}