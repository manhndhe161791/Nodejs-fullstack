
import db from "../models/index";
import bcrypt, { hash } from "bcryptjs"

let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errorCode: 0,
                    message: "Missing required parameter(s) !"
                })
            }
            else {
                let allCode = await db.AllCode.findAll({
                    where: { type: typeInput }
                });
                resolve({
                    errorCode: 0,
                    data: allCode
                })
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    getAllCodeService: getAllCodeService
}