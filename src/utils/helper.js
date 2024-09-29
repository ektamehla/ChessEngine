function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj)); // Simple deep copy utility
}

module.exports = {
    deepCopy,
};