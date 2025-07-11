function getComponentType(component) {
    const trimmedComponent = component.trim();
    
    const tagRegex = /^<([a-zA-Z][a-z0-9]*)/; // Match opening HTML/JSX tag
    const match = trimmedComponent.match(tagRegex);
    
    if (match) {
        const tagName = match[1];
        
        // Check if the first letter is uppercase - PascalCase component name
        if (tagName[0] === tagName[0].toUpperCase()) {
            return "jsx";
        }
        
        // Return "script" if it's a script tag
        if (tagName.toLowerCase() === 'script') {
            return "script";
        }

        // Otherwise, it's just regular HTML
        return "html";
    }

    return "unknown";
}

export { getComponentType };
