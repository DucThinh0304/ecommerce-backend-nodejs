'use strict'

const shopModel = require("../models/shop.model")
const crypto = require("node:crypto")
const bcrypt = require("bcrypt")
const KeyTokenService = require("../services/keytoken.service");
const {createTokenPair} = require("../auth/authUtils");
const {getInfoData} = require("../utils");
const {BadRequestError, ConflictRequestError, AuthFailureError} = require("../core/error.response");
const {findByEmail} = require("./shop.service");

const RoleShop = {
    SHOP: "SHOP",
    WRITER: '00001',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {
    static login = async ({email, password, refreshToken = null}) => {
        const foundShop = await findByEmail({email})
        if (!foundShop) { throw new BadRequestError("Invalid email or password") }
        const match = await bcrypt.compare(password, foundShop.password)
        if (!match) { throw new AuthFailureError("Invalid password") }
        const privateKey = crypto.randomBytes(64).toString("hex")
        const publicKey = crypto.randomBytes(64).toString("hex")

        const {_id: userId} = foundShop

        const tokens = await createTokenPair({userId, email}, publicKey, privateKey)
        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey, publicKey, userId
        })
        return {
            shop: getInfoData({fields: ['_id', 'name', 'email'], object: foundShop}),
            tokens
        }
    }

    static signUp = async ({name, email, password}) => {
        const holderShop = await shopModel.findOne({email}).lean()
        if (holderShop) {
            throw new BadRequestError('Error: Shop already exists')
        }
        const passwordHash = await bcrypt.hash(password, 12);
        const newShop = await shopModel.create({
            name, email, password: passwordHash, roles: [RoleShop.SHOP]
        })

        if (newShop) {
            const privateKey = crypto.randomBytes(64).toString("hex")
            const publicKey = crypto.randomBytes(64).toString("hex")

            console.log({privateKey, publicKey})

            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey
            })
            if (!keyStore) {
                return {
                    code: 'xxxx',
                    message: 'Shop already exists!'
                }
            }

            const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey)
            console.log(`Created Token Success::`, tokens)

            return {
                code: 201,
                metadata: {
                    shop: getInfoData({fields: ['_id', 'name', 'email'], object: newShop}),
                    tokens
                }
            }
        }
        return {
            code: 200,
            metadata: null
        }
    }
}

module.exports = AccessService