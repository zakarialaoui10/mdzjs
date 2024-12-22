function jsx2js(component) {
    const regex = /<(\w+)([^>]*)\/?>/;
    const match = component.match(regex);
    if (!match) {
        throw new Error("Invalid component format");
    }

    const componentName = match[1];
    const attributesString = match[2];
    const attributes = {};

    const attrRegex = /(\w+)\s*=\s*("([^"]*)"|{([^}]*)})/g;
    let attrMatch;

    while ((attrMatch = attrRegex.exec(attributesString)) !== null) {
        const key = attrMatch[1];
        const value = attrMatch[3] || attrMatch[4]; // Either the string value or the expression inside {}
        attributes[key] = value === attrMatch[3]?JSON.stringify(value):new Function(`return ${value}`)();
    }

    const attributesArray = Object.entries(attributes).map(([key, value]) => {
        return `${key}:${value}`; 
    });

    const attributesStringFormatted = attributesArray.join(',');

    return `${componentName}({${attributesStringFormatted}})`;
}

export { jsx2js };
