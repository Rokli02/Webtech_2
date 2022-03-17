module.exports.nameValidator = function(name) {
    return (name &&
            name.length >= 2 &&
            !name.includes('  '));
}

module.exports.descriptionValidator = function(desc) {
    return (desc &&
            desc.length >= 16 &&
            !desc.includes('  '));
}

module.exports.imgUrlValidator = function(img) {
    return (img &&
            !img.includes(' '));
}