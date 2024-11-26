const UserService = require('../services/UserServices')
const JwtService = require('../services/JwtServices')



const createUser = async (req , res) => {
    try {
        // console.log(req.body)
        // Lấy ra những trường mà mình tạo ra cho User
        const { name , email , password , confirmPassword , phone } = req.body 
        // Kiểm tra trường email có phải là email hay không
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        const isCheckEmail = reg.test(email)
        // console.log('value', email ,password, confirmPassword )
        // Kiểm tra tụi nó có tồn tại không
        if(  !email || !password || !confirmPassword ){
            return res.status(200).json({
                status: "ERR",
                message: 'Một trong số các trường không tồn tại'
            })
        }else if( !isCheckEmail) {
            return res.status(200).json({
                status: "ERR",
                message: 'Trường email không phải là email'
            })
        }else if( password !== confirmPassword){  
            return res.status(200).json({
                status: "ERR",
                message: 'Trường password khác với trường confirmPassword'
            })
        }

        // kiểm tra email thử đúng là email không
        // console.log('isCheckEmail' ,isCheckEmail)
        const response = await UserService.createUser(req.body)
        return res.status(200).json(response)
    }catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const loginUser = async (req , res) => {
    try {
        // console.log(req.body)
        // Lấy ra những trường mà mình tạo ra cho User
        const {  email , password } = req.body 
        // Kiểm tra trường email có phải là email hay không
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        const isCheckEmail = reg.test(email)
        // console.log('value',email ,password)
        // Kiểm tra tụi nó có tồn tại không
        if(  !email || !password ){
            return res.status(200).json({
                status: "ERR",
                message: 'Một trong số các trường không tồn tại'
            })
        }else if( !isCheckEmail) {
            return res.status(200).json({
                status: "ERR",
                message: 'Trường email không phải là email'
            })
        }
        
        const response = await UserService.loginUser(req.body)
        const {refresh_token , ...newReponse} = response
        // console.log('response' , response)
        res.cookie('refresh_token' , refresh_token , {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            path: '/'
        })
        return res.status(200).json(newReponse)
    }catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateUser = async (req , res) => {
    try {
        const userId = req.params.id
        const data = req.body
        if(!userId) {
            return res.status(200).json({
                status: "ERROR" ,
                message: 'trường userId không tồn tại'
            })
        }
        // console.log('userId' ,userId)
        const response = await UserService.updateUser(userId , data)
        return res.status(200).json(response)
    }catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteUser = async (req , res) => {
    try {
        const userId = req.params.id
        
        if(!userId) {
            return res.status(200).json({
                status: "ERROR" ,
                message: 'trường userId không tồn tại'
            })
        }
        // console.log('userId' ,userId)
        const response = await UserService.deleteUser(userId)
        return res.status(200).json(response)
    }catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteManyUser = async (req , res) => {
    try {
        const ids = req.body.ids
        
        if(!ids) {
            return res.status(200).json({
                status: "ERROR" ,
                message: 'trường ids không tồn tại'
            })
        }
        
        const response = await UserService.deleteManyUser(ids)
        return res.status(200).json(response)
    }catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllUser = async (req , res) => {
    try {
        
        const response = await UserService.getAllUser()
        return res.status(200).json(response)
    }catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailsUser = async (req , res) => {
    try {
        const userId = req.params.id
        
        if(!userId) {
            return res.status(200).json({
                status: "ERROR" ,
                message: 'trường userId không tồn tại'
            })
        }
        // console.log('userId' ,userId)
        const response = await UserService.getDetailsUser(userId)
        return res.status(200).json(response)
    }catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const refreshToken = async (req , res) => {
    // console.log('req.cookies' ,req.cookies.refresh_token)
    try {
        const token = req.cookies.refresh_token
        
        if(!token) {
            return res.status(200).json({
                status: "ERROR" ,
                message: 'trường token không tồn tại'
            })
        }
        // console.log('userId' ,userId)
        const response = await JwtService.refreshTokenJwtService(token)
        return res.status(200).json(response)
        
    }catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const logoutUser = async (req , res) => {
    // console.log('req.cookies' ,req.cookies.refresh_token)
    try {
        res.clearCookie('refresh_token')
        return res.status(200).json({
            status: 'OK',
            message: 'Logout thành công'
        })
        
    }catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateUserActive = async (req, res) => {
    try {
        const userId = req.params.id;
        
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'UserId is required'
            });
        }

        const response = await UserService.updateUserActive(userId);
        return res.status(200).json(response);

    } catch (error) {
        return res.status(500).json({
            status: 'ERR',
            message: 'Error updating user active status',
            error: error.message
        });
    }
};



module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    refreshToken,
    logoutUser,
    deleteManyUser,
    updateUserActive
}