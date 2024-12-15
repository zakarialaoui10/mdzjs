import { parse } from 'yaml'; 

const parseYml = yml => {
    const attributes = parse(yml) ;
    return `{${Object.entries(attributes).map(([key, value]) => `${key} = ${JSON.stringify(value)}`).join(", ")}}={}`
}

export {parseYml}