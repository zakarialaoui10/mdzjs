import { parse } from 'yaml'; 

const parseYml = yml => {
    const {__props__, ...__attrs__} = yml ? parse(yml) : {__props__ : {}} ;
    const HasAttributs = Object.keys(__attrs__).length > 0
    return {
        props : __props__,
        attrs : HasAttributs
                ?[
                    `const {${Object.keys(__attrs__).join(",")}} = ${JSON.stringify(__attrs__,"",2)}`,
                    `export {${Object.keys(__attrs__).join(", ")}}`
                ].join("\n")
                : "",
    }
}

const stringifyProps = (props) =>{
    return props
            ?`{${Object.entries(props).map(([key, value]) => `${key} = ${JSON.stringify(value)}`).join(", ")}}={}`
            :""
}

export {parseYml, stringifyProps}