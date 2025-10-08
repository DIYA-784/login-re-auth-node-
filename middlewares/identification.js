const jwt = require('jsonwebtoken');

exports.identifier = (req, res, next) => {
    let token;
    if(req.headers.client === 'not-browser'){
        token = req.headers.authorization;
    } else{
        token = req.cookies['Authorization'];
    }
    if(!token){
        return res.status(401).json({ success: false, message: 'Unauthorized Access ! No token provided' });
    }
    try{
        const userToken = token.split(' ')[1];
        const jwtVerified = jwt.verify(userToken, process.env.SECRET_KEY);
        
        if(jwtVerified){
            req.user = jwtVerified;
            next();
        } else{
            return res.status(401).json({ success: false, message: 'Invalid token!' });
        }
    } catch(err){
        console.log(err);
    }
}