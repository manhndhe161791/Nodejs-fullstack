import UserService from '../services/UserService'

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    if (!email || !password) {
        return res.status(500).json({
            errorCode: '1',
            message: "missing input parameters"
        })
    }
    let userData = await UserService.handleLogin(email, password);
    return res.status(200).json({
        errorCode: userData.errorCode,
        message: userData.message,
        user: userData ? userData.user : {}
    })
}
let handleGetAllUser = async (req, res) => {
    let id = req.query.id;
    if (!id) {
        return res.status(500).json({
            errorCode: 1,
            message: 'Missing parameter(s)',
            user: []
        })
    }
    let user = await UserService.getAllUser(id);
    return res.status(200).json({
        errorCode: 0,
        message: 'OK',
        user
    })
}

let handleCreateUser = async (req, res) => {
    let message = await UserService.createUser(req.body);
    return res.status(200).json(message);
}

let handleEditUser = async (req, res) => {
    let data = req.body;
    let message = await UserService.editUser(data);
    return res.status(200).json(message)
}

let handleDeleteUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errorCode: 1,
            message: 'Missing required parameter(s)'
        })
    }
    let message = await UserService.deleteUser(req.body.id);
    return res.status(200).json(message);
}

module.exports = {
    handleLogin: handleLogin,
    handleGetAllUser: handleGetAllUser,
    handleCreateUser: handleCreateUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser
} 