const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
dotenv.config()

const generalAcesstoken = async (payload) =>{
    const access_Token = jwt.sign({
        ...payload
    },process.env.ACCESS_TOKEN,{ expiresIn: '24h'})
    return access_Token;
}

const generalRefreshtoken = async (payload) =>{
    const refresh_Token = jwt.sign({
        ...payload
    },process.env.REFRESH_TOKEN,{ expiresIn: '24h'})
    return refresh_Token;
}
const refreshTokenJWT = async (token) => {
    return new Promise(async (resolve, reject) => {
      try {
        jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
          if (err) {
            resolve({
              status: 'error'
            });
          }
          const access_Token = await generalAcesstoken({
            id: user?.id,
            role_id: user?.role_id == 1
          });
          resolve({
            status: 'success',
            access_Token
          });
        });
      } catch (error) {
        reject(error);
      }
    });
  };



module.exports = {generalAcesstoken,generalRefreshtoken,refreshTokenJWT}
