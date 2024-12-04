function getComponentType(component) {
    const trimmedComponent = component.trim();
    
    const tagRegex = /^<([a-zA-Z][a-z0-9]*)/;
    const match = trimmedComponent.match(tagRegex);
    
    if (match) {
        const tagName = match[1].toLowerCase();
        
        if (tagName === 'script') {
            return "script";
        }

        if (tagName[0] === tagName[0].toUpperCase()) {
            return "jsx";
        } else {
            return "html";
        }
    }
    
    return "unknown";
}

export { getComponentType };
