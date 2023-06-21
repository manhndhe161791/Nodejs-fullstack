import AllCodeService from '../services/AllCodeService';

let getAllCode = async (req, res) => {
    try {
        let data = await AllCodeService.getAllCodeService(req.query.type);
        return res.status(200).json(data);
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errorCode: 1,
            message: "Error from server"
        })
    }
}

module.exports = {
    getAllCode: getAllCode
} 