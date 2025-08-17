'use strict'

const shopModel = require("../models/shop.model")
const crypto = require("node:crypto")
const bcrypt = require("bcrypt")
const KeyTokenService = require("../services/keytoken.service");
const {createTokenPair} = require("../auth/authUtils");
const {getInfoData} = require("../utils");

const RoleShop = {
    SHOP: "SHOP",
    WRITER: '00001',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {
    static signUp = async ({name, email, password}) =>{
        try{
            const holderShop = await shopModel.findOne({email}).lean()
            if (holderShop){
                return{
                    code: 'xxxx',
                    message: 'Shop already exists!'
                }
            }
            const passwordHash = await bcrypt.hash(password, 12);
            const newShop = await shopModel.create({
                name, email, password: passwordHash, roles: [RoleShop.SHOP]
            })

            if(newShop){

                const privateKey = crypto.randomBytes(64).toString("hex")
                const publicKey = crypto.randomBytes(64).toString("hex")


                console.log({privateKey, publicKey})

                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                })
                if (!keyStore){
                    return {
                        code: 'xxxx',
                        message: 'Shop already exists!'
                    }
                }

                const tokens = await createTokenPair({userId: newShop._id. email}
                    , publicKey, privateKey)
                console.log(`Created Token Success::`, tokens)

                return {
                    code: 201,
                    metadata:{
                        shop: getInfoData({fields: ['_id', 'name', 'email'], object: newShop}),
                        tokens
                    }
                }
            }
            return {
                code: 200,
                metadata:null
            }
        } catch (err){
            return{
                code: 'xxx',
                message: err.message,
                status: 'error'
            }
        }
    }
}

module.exports = AccessService