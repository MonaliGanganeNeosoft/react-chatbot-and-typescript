
const jwt = require('jsonwebtoken')
const jwtSecret = 'sdsfdsfdsfdsf'
const userSchema = require('../db/userSchema')
const User = require('../services/userService')

const USER_SOCIAL_LOGIN = async (req, res) => {
    try {
        const userdata = await User.findquery({ email: req.body.email })
        console.log(userdata);
        console.log(userdata.length);
        if (userdata.length == 0) {
            const addsoical = await User.addUser({ firstname: req.body.firstName, lastname: req.body.lastName, email: req.body.email, soical: true })
            if (addsoical) {
                const user = await User.findquery({ email: req.body.email })
                if (user[0]) {
                    console.log('inside reg token');
                    let payload = { uid: user }
                    const token = jwt.sign(payload, jwtSecret, { expiresIn: 360 })
                    return res.status(200).json({ "err": 0, "msg": `${req.body.firstName} ${req.body.lastName} Login Success`, "token": token })
                }
                else {
                    return res.status(400).json({ err: 1, msg: 'email must be diffenet' })
                }
            }
        }
        else if (userdata[0].soical == true) {
            console.log('inside login');
            let payload = { uid: userdata }
            const token = jwt.sign(payload, jwtSecret, { expiresIn: 360 })
            res.status(200).json({ "err": 0, "msg": "Login Success", "token": token })
        }
        else {
            return res.json({ err: 1, "msg": "Try to Login with password" })
        }
    }
    catch {
        return res.json({ err: 1, "msg": "Unable to login try later" })
    }
    // await userSchema.find({ email: req.body.email }, (err, data) => {
    //     if (err) {
    //         console.log('inside error');
    //         res.status(400).json({ err: 1, msg: 'Unable to login' })
    //     }
    //     else if (!data[0]) {
    //         console.log('inside reg');
    //         let userData = new userSchema({ firstname: req.body.firstName, lastname: req.body.lastName, email: req.body.email, soical: true })
    //         userData.save((err) => {
    //             if (err) {
    //                 console.log('inside email must be diffenet');
    //                 res.status(400).json({ err: 1, msg: 'email must be diffenet' })
    //             }
    //             else {
    //                 console.log('inside email must be else');
    //                 userSchema.find({ email: req.body.email }, (err, data) => {
    //                     if (!data[0]) {
    //                         console.log('inside email not found');
    //                         res.status(400).json({ err: 1, "msg": "Email  is not correct" })
    //                     }
    //                     else {
    //                         console.log('inside reg token');
    //                         let payload = { uid: data }
    //                         const token = jwt.sign(payload, jwtSecret, { expiresIn: 360 })
    //                         res.status(200).json({ "err": 0, "msg": `${req.body.firstName} ${req.body.lastName}Login Success`, "token": token })
    //                     }


    //                 })
    //             }
    //         })
    //     }
    //     else if (data[0].soical == true) {
    //         console.log('inside login');
    //         let payload = { uid: data }
    //         const token = jwt.sign(payload, jwtSecret, { expiresIn: 360 })
    //         res.status(200).json({ "err": 0, "msg": "Login Success", "token": token })
    //     }
    //     else {
    //         res.json({ err: 1, "msg": "Try to Login with password" })
    //     }
    // })
}
const PROFILE_UPDATE = async (req, res) => {
    try {
        console.log(req.body);
        const profile = await User.updatequery({ email: req.body.email }, { $set: { firstname: req.body.firstname, lastname: req.body.lastname, mobileno: req.body.mobileno } })
        if (profile) {
            const user = await User.findquery({ email: req.body.email })
            if (!user[0]) {
                return res.status(200).json({ err: 1, "msg": "Unable to genrate jwt" })
            }
            else {
                let payload = { uid: user }
                const token = jwt.sign(payload, jwtSecret, { expiresIn: 360 })
                return res.status(200).json({ "err": 0, "msg": "Profile updated successfully", "token": token })
            }
        }
    }
    catch {
        return res.status(400).json({ err: 1, msg: 'Unable to Update profile' })
    }
    // await userSchema.updateMany({ email: req.body.email }, { $set: { firstname: req.body.firstname, lastname: req.body.lastname, mobileno: req.body.mobileno } }, (err, data) => {
    //     if (err) {
    //         console.log(err);
    //         res.status(400).json({ err: 1, msg: 'Unable to Update profile' })
    //     }
    //     else {
    //         console.log('inside else');
    //         userSchema.find({ email: req.body.email }, (err, data) => {
    //             if (!data[0]) {
    //                 console.log('inside email not found');
    //                 res.status(400).json({ err: 1, "msg": "Unable to genrate jwt" })
    //             }
    //             else {
    //                 console.log('inside reg token');
    //                 let payload = { uid: data }
    //                 const token = jwt.sign(payload, jwtSecret, { expiresIn: 360 })
    //                 res.status(200).json({ "err": 0, "msg": "Profile updated successfully", "token": token })
    //             }


    //         })
    //     }
    // })
}
const UPDATE_PROFILE_PIC = async (req, res) => {
    try {
        const profilepic = await User.updatequery({ email: req.body.email }, { $set: { profilepic: req.file.filename } })
        if (profilepic) {
            const user = await User.findquery({ email: req.body.email })
            if (!user[0]) {
                return res.status(200).json({ err: 1, "msg": "Unable to genrate jwt" })
            }
            else {
                let payload = { uid: user }
                const token = jwt.sign(payload, jwtSecret, { expiresIn: 360 })
                return res.status(200).json({ "err": 0, "msg": "Profile Picture updated successfully", "token": token })
            }
        }
    }
    catch {
        return res.status(400).json({ err: 1, 'msg': "unable to change profile pic" })
    }
    // await userSchema.updateOne({ email: req.body.email }, { $set: { profilepic: req.file.filename } }, (err) => {
    //     if (err) {
    //         res.status(400).json({ err: 1, 'msg': "unable to change profile pic" })
    //     }
    //     else {
    //         userSchema.find({ email: req.body.email }, (err, data) => {
    //             if (!data[0]) {
    //                 console.log('inside email not found');
    //                 res.status(400).json({ err: 1, "msg": "Unable to genrate jwt" })
    //             }
    //             else {
    //                 let payload = { uid: data }
    //                 const token = jwt.sign(payload, jwtSecret, { expiresIn: 360 })
    //                 res.status(200).json({ "err": 0, "msg": "Profile Picture updated successfully", "token": token })
    //             }


    //         })
    //     }
    // })
}
const ADD_ADDRESS = async (req, res) => {
    try {
        const addadrres = await User.findquery({ email: req.body.email })
        if (addadrres[0]) {
            let addressData = { Address_id: Math.random(), address: req.body.ADDRESS.address, PinCode: req.body.ADDRESS.PinCode, City: req.body.ADDRESS.City, State: req.body.ADDRESS.State, Country: req.body.ADDRESS.Country }
            addadrres[0].Address.push(addressData)
            const newadd = await User.updatequery({ email: req.body.email }, { $set: { Address: addadrres[0].Address } })
            const user = await User.findquery({ email: req.body.email })
            if (!user[0]) {
                res.status(200).json({ err: 1, "msg": "Unable to genrate jwt" })
            }
            else {
                let payload = { uid: user }
                const token = jwt.sign(payload, jwtSecret, { expiresIn: 360 })
                res.status(200).json({ "err": 0, "msg": "Address Added", "token": token })
            }
        }
    }
    catch {
        return res.status(400).json({ err: 1, 'msg': "unable add  address" })
    }
    // await userSchema.find({ email: req.body.email }, (err, data) => {
    //     if (err) {
    //         res.status(400).json({ err: 1, 'msg': "unable add  address" })
    //     }
    //     else {
    //         let addressData = { Address_id: Math.random(), address: req.body.ADDRESS.address, PinCode: req.body.ADDRESS.PinCode, City: req.body.ADDRESS.City, State: req.body.ADDRESS.State, Country: req.body.ADDRESS.Country }
    //         data[0].Address.push(addressData)
    //         console.log(data);
    //         userSchema.updateOne({ email: req.body.email }, { $set: { Address: data[0].Address } }, (err) => {
    //             if (err) {
    //                 console.log(err);
    //                 res.status(400).json({ err: 1, 'msg': "unable to change profile pic" })
    //             }
    //             else {
    //                 userSchema.find({ email: req.body.email }, (err, data) => {
    //                     if (!data[0]) {
    //                         console.log('inside email not found');
    //                         res.status(400).json({ err: 1, "msg": "Unable to genrate jwt" })
    //                     }
    //                     else {
    //                         let payload = { uid: data }
    //                         const token = jwt.sign(payload, jwtSecret, { expiresIn: 360 })
    //                         res.status(200).json({ "err": 0, "msg": "Address Added", "token": token })
    //                     }
    //                 })
    //             }
    //         })
    //     }
    // })

}
module.exports = { USER_SOCIAL_LOGIN, PROFILE_UPDATE, UPDATE_PROFILE_PIC, ADD_ADDRESS }