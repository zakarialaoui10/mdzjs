function jsx2js(component) {
    const regex = /<(\w+)([^>]*)\/?>/;
    const match = component.match(regex);
    if (!match) {
        throw new Error("Invalid component format");
    }
    
    const componentName = match[1];
    const attributesString = match[2];
    const attributes = {};
    
    const attrRegex = /(\w+)\s*=\s*"([^"]*)"/g;
    let attrMatch;
    
    while ((attrMatch = attrRegex.exec(attributesString)) !== null) {
        attributes[attrMatch[1]] = attrMatch[2];
    }
    
    const attributesArray = Object.entries(attributes).map(([key, value]) => {
        return `${key}:${JSON.stringify(value)}`;
    });
    
    const attributesStringFormatted = attributesArray.join(',');
    
    return `${componentName}({${attributesStringFormatted}})`;
}

export { jsx2js };