const bcrypt = require('bcrypt');
const createHmac = require('crypto');

doHashing = async(value) => {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(value, salt);
    return hashedPassword;
}

comparePassword = async(enteredPassword, savedPassword) => {
    const result = bcrypt.compare(enteredPassword, savedPassword);
    return result;
}

hmacProcess = (value, key) => {  // The hmacProcess function creates an HMAC (Hash-based Message Authentication Code) using the SHA-256 algorithm.  from "crypto" module
    const result = createHmac('sha256', key).update(value).digest('hex');
    return result;
}

module.exports = { doHashing, comparePassword, hmacProcess };
