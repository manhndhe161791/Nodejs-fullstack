import db from "../models/index";
import bcrypt, { hash } from "bcryptjs"

const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            var hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword)
        }
        catch (e) {
            reject(e)
        }
    })
}

let handleLogin = (userEmail, userPassword) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(userEmail);
            if (isExist) {
                let user = await db.User.findOne({
                    attributes: ['email', 'roleID', 'password'],
                    where: { email: userEmail },
                    raw: true
                });
                if (user) {
                    let check = await bcrypt.compareSync(userPassword, user.password);
                    if (check) {
                        userData.errorCode = 0;
                        userData.message = `OK`;
                        delete user.password
                        userData.user = user;
                    }
                    else {
                        userData.errorCode = 3;
                        userData.message = `Wrong password`;
                    }
                    resolve(userData);
                }
                else {
                    userData.errorCode = 2;
                    userData.message = `User not found`;
                }
                resolve(userData);
            }
            else {
                userData.errorCode = 1;
                userData.message = `Your's Email isn't exist in the system. Please try again`;
                resolve(userData);
            }
        } catch (e) {
            reject(e)
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail }
            })
            if (user) {
                resolve(true)
            }
            else {
                resolve(false)
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

let getAllUser = (userID) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = '';
            if (userID === 'all') {
                user = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            if (userID && userID !== 'all') {
                user = await db.User.findOne({
                    where: { id: userID },
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(user)
        } catch (e) {
            reject(e);
        }
    })
}

let createUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // check isExist ?
            let emailIsExist = await checkUserEmail(data.email);
            if (emailIsExist === true) {
                resolve({
                    errorCode: 1,
                    message: 'Your email is already exist. Please use another email !'
                })
            }

            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phoneNumber: data.phoneNumber,
                gender: data.gender === 1 ? true : false,
                roleID: data.roleID,
            })
            resolve("Created New User!");
        } catch (e) {
            reject(e)
        }
    })
}

let deleteUser = (userID) => {
    return new Promise(async (resolve, reject) => {
        let user = await db.User.findOne({
            where: { id: userID }
        })
        if (!user) {
            resolve({
                errorCode: 2,
                message: `The user doesn't exist`
            })
        }
        await db.User.destroy({
            where: { id: userID }
        })
        resolve({
            errorCode: 0,
            message: `Deleted an user !`
        })
    })
}

let editUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errorCode: 2,
                    message: `Misssing required parameters !`
                })
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            });
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;

                await user.save();

                resolve({
                    errorCode: 0,
                    message: `Updated user information succeed !`
                })
            }
            else {
                resolve({
                    errorCode: 1,
                    message: `NOT found user !`
                });
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    handleLogin: handleLogin,
    getAllUser: getAllUser,
    createUser: createUser,
    deleteUser: deleteUser,
    editUser: editUser
}