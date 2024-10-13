function smartJoin(strings = [], indexes = []) {
    const result = [];
    let lastIndex = 0;
    indexes.forEach(index => {
        if (index > lastIndex) {
            result.push(strings.slice(lastIndex, index).join(''));
        }
        result.push(strings[index]);
        lastIndex = index + 1; 
    });
    if (lastIndex < strings.length) {
        result.push(...strings.slice(lastIndex));
    }
    return result;
}
export {
    smartJoin
}