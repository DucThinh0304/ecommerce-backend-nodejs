'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require("bcrypt")

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
                const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa',{
                    modulusLength: 4096,
                })

                console.log({privateKey, publicKey})
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