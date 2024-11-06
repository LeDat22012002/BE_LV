const User = require("../models/UserModel");
const bcrypt = require("bcrypt"); // dùng để mã hóa password
const { genneralAccessToken ,genneralRefreshToken} = require("./JwtServices");


const createUser = (newUser) =>{
    return new Promise(async (resolve , reject) => {
        const { name ,email, password , confirmPassword , phone } = newUser
        try {
            const checkUser = await User.findOne({
                email: email
            })
            // nếu mà thằng email đã tồn tại
            if(checkUser !== null) {
                resolve({
                    status: 'ERR' ,
                    message: 'Email đã tồn tại'
                })
            }
            const hash = bcrypt.hashSync(password, 10) // mã hóa password ra dạng kí tự đặc biệt
            // console.log('hash' ,hash)
            const createdUser = await User.create({
                name ,
                email ,
                password: hash,
                confirmPassword: hash , 
                phone 
            })
            if(createdUser) {
                resolve({
                    status: 'OK' ,
                    message: 'SUCCESS',
                    data: createdUser
                })
            }
            
           
        }catch(e) {
            reject(e)
        }
    })
}

const loginUser = (userLogin) =>{
    return new Promise(async (resolve , reject) => {
        const { email, password  } = userLogin
        try {
            const checkUser = await User.findOne({
                email: email
            })
            // nếu mà thằng email đã tồn tại
            if(checkUser === null) {
                resolve({
                    status: 'ERR' ,
                    message: 'User không có trong database'
                })
            }
            const comparePassword = bcrypt.compareSync(password , checkUser.password)
            // console.log('comparePassword' ,comparePassword)
           
            if(!comparePassword){
                resolve({
                    status: 'ERR' ,
                    message: 'The password or user is incorrect'
                })
            } 
            const access_token = await genneralAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin,
            })
            // console.log('access_token' ,access_token)
            // được sử dụng khi access_token hết hạn và nó sẽ cấp lại 1 access_token mới
            const refresh_token = await genneralRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin,
            })
            resolve({
                status: 'OK' ,
                message: 'SUCCESS',
                access_token,
                refresh_token
                
            })
           
            
           
        }catch(e) {
            reject(e)
        }
    })
}

const updateUser = (id , data) =>{
    return new Promise(async (resolve , reject) => {
        
        try {
            const checkUser = await User.findOne({
                _id: id,
            })
            // console.log('checkUser' , checkUser);
            // nếu mà thằng email đã tồn tại
            if(checkUser === null) {
                resolve({
                    status: 'ERR' ,
                    message: 'User không có trong database'
                })
            }
            const updatedUser = await User.findByIdAndUpdate(id ,data , {new: true})
            // console.log('updatedUser' , updatedUser)
            resolve({
                status: 'OK' ,
                message: 'SUCCESS',
                data: updatedUser
                
            })
           
            
           
        }catch(e) {
            reject(e)
        }
    })
}

const deleteUser = (id) =>{
    return new Promise(async (resolve , reject) => {
        
        try {
            const checkUser = await User.findOne({
                _id: id,
            })
            // console.log('checkUser' , checkUser);
            // nếu mà thằng email đã tồn tại
            if(checkUser === null) {
                resolve({
                    status: 'ERR' ,
                    message: 'User không có trong database'
                })
            }
            await User.findByIdAndDelete(id)
            resolve({
                status: 'OK' ,
                message: 'delete user thành công!',
                
            })
           
            
           
        }catch(e) {
            reject(e)
        }
    })
}


const deleteManyUser = (ids) =>{
    return new Promise(async (resolve , reject) => {
        
        try {
           
            await User.deleteMany({_id:ids})
            resolve({
                status: 'OK' ,
                message: 'delete user thành công!',
                
            })
           
            
           
        }catch(e) {
            reject(e)
        }
    })
}


const getAllUser = () =>{
    return new Promise(async (resolve , reject) => {
        
        try {
           
            
            const allUser = await User.find()
            resolve({
                status: 'OK' ,
                message: 'Lấy thông tin tất cả user thành công!',
                data: allUser
            })
           
            
           
        }catch(e) {
            reject(e)
        }
    })
}

const getDetailsUser = (id) =>{
    return new Promise(async (resolve , reject) => {
        
        try {
            const user = await User.findOne({
                _id: id,
            })
            // console.log('checkUser' , checkUser);
            // nếu mà thằng email đã tồn tại
            if(user === null) {
                resolve({
                    status: 'ERR' ,
                    message: 'User không có trong database'
                })
            }
            
            resolve({
                status: 'OK' ,
                message: 'lấy thông tin chi tiết user thành công!',
                data: user
            })
           
            
           
        }catch(e) {
            reject(e)
        }
    })
}



module.exports = {
    createUser, 
    loginUser, 
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    deleteManyUser
    
}