const signupSchema = require('../middlewares/validator');

signup = async (req, res) => {
    const {email, password} = req.body;
    try{
        const {error, value} = signupSchema.validate({email, password});
        if(error){
            return res.status(400).json({ error: error.details[0].message });
        }
    } catch(err){
        console.log(err);
    }
}

module.exports = { signup };