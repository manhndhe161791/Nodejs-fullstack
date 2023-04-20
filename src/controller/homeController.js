import db from "../models";
import CRUDservice from "../services/CRUDservice";

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll()
        return res.render("homepage.ejs",
            { data: JSON.stringify(data) }
        );
    }
    catch (e) {
        console.log(e);
    }
}

let getAboutPage = (req, res) => {
    return res.send('About Us')
}

let getCRUD = (req, res) => {
    return res.render('crud.ejs')
}

let postCRUD = async (req, res) => {
    let message = await CRUDservice.createNewUser(req.body)
    console.log(message)
    return res.send('post create')
}

let displayGetCRUD = async (req, res) => {
    let data = await CRUDservice.getAllUser();
    return res.render('displayCRUD.ejs', { userData: data });
}
let getEditCRUD = async (req, res) => {
    let userID = req.query.id;
    if (userID) {
        let userData = await CRUDservice.getUserDataByID(userID);
        console.log(userData)
        return res.render('editCRUD.ejs', { userData: userData })
    }
    else {
        return res.send("User not founded !")
    }
}
let putEditCRUD = async (req, res) => {
    let data = req.body;
    let allUser = await CRUDservice.updateUserData(data);
    return res.render('displayCRUD', { userData: allUser });
}
let deleteCRUD = async (req, res) => {
    let id = req.query.id;
    if (id) {
        await CRUDservice.deleteUserByID(id);
        return res.send('Deleted an User');
    }
    else {
        return res.send('User not founded');
    }


}
module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    getEditCRUD: getEditCRUD,
    putEditCRUD: putEditCRUD,
    deleteCRUD: deleteCRUD
}