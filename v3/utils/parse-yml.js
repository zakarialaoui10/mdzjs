import { parse } from 'yaml'; 

const parseYml = yml => {
    const fm = parse(yml) ;
    const {__props__, ...attributes} = fm
    return {
        __props__,
        attributes
    }
}

export {parseYml}