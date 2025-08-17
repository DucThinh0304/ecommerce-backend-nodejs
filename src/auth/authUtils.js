'use strict'

const JWT = require('jsonwebtoken')
const {verify} = require("jsonwebtoken");

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '2d',
        })

        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '7d',
        })
        JWT.verify(accessToken, publicKey, (err, decoded) => {
            if (err) {
                console.log(`error verify::`, err)
            } else {
                console.log(`decoded verify::`. decoded)
            }
        })

        return {accessToken, refreshToken}
    } catch (error) {
        console.log(`error verify::`, error)
    }
}

module.exports = {
    createTokenPair,
}