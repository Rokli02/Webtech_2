
module.exports.nameValidator = function (name) {
    return (name &&
            name.length >= 6 &&
            !name.includes(' '));
}

module.exports.emailValidator = function (email) {
    const regexPattern = '^([a-zA-Z\d._\-áÁéÉíÍóÓüÜöÖűŰúÚőŐ]{3,})@([a-zA-Z._\-]{3,}).([a-zA-Z]{2,3})$';
    const regex = new RegExp(regexPattern);
    return (email && regex.test(email));
}  

module.exports.passwordValidator = function(password) {
    return (password &&
            password.length >= 8 &&
            !password.includes(' '));
}

module.exports.genderValidator = function(gender) {
    return (gender === 'female' || gender === 'male');
}