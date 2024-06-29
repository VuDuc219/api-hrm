// const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const generalAccessToken = (payload) => {
    const accessToken = jwt.sign({
        ...payload
    }, process.env.PRIVATE_KEY, {
        expiresIn: '6h',
        algorithm: "HS256"
    })
    
    return accessToken;
}

const generalRefreshToken = (payload) => {
    const refreshToken = jwt.sign({
        payload
    }, process.env.PRIVATE_KEY_REFRESH, {
        expiresIn: '365d',
        algorithm: "HS256"
    })
    
    return refreshToken;
}

const refreshToken = (refreshToken) => {
    return new Promise((resolve, reject) => {
        try {
            jwt.verify(refreshToken, process.env.PRIVATE_KEY_REFRESH, (err, user) => {
                if (err) {
                    reject({
                        status: "ERR",
                        message: "The authentication"
                    })
                } 

                const {id} = user;
                const accessToken = generalAccessToken({
                    id: id
                });

                resolve({
                    status: "SUCCESS",
                    message: "SUCCESS",
                    accessToken: accessToken
                })
            })
        } catch (error) {
            reject(error);
        }
    })
}

export {
    generalAccessToken,
    generalRefreshToken,
    refreshToken
};

export default {
    generalAccessToken,
    generalRefreshToken,
    refreshToken
};