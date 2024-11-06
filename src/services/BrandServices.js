const Brand = require("../models/BrandModel");

const createBrand = (newBrand) =>{
    return new Promise(async (resolve , reject) => {
        
        const { name } = newBrand
        try {
            const checkBrand = await Brand.findOne({
                name: name
            })
            // nếu mà thằng name của sản phẩm đã tồn tại
            if(checkBrand !== null) {
                resolve({
                    status: 'ERR' ,
                    message: 'Tên của thương hiệu đã tồn tại'
                })
            }
            
            
            const createBrand = await Brand.create({
                name, 
                
            })
            if(createBrand) {
                resolve({
                    status: 'OK' ,
                    message: 'SUCCESS',
                    data: createBrand
                })
            }
            
           
        }catch(e) {
            reject(e)
        }
    })
}

const updateBrand = (id , data) =>{
    return new Promise(async (resolve , reject) => {
        
        try {
            const checkBrand = await Brand.findOne({
                _id: id,
            })
            // console.log('checkProduct' , checkProduct);
            
            if(checkBrand === null) {
                resolve({
                    status: 'ERR' ,
                    message: 'Brand không có trong database'
                })
            }
            const updatedBrand = await Brand.findByIdAndUpdate(id , data , {new: true})
            // console.log('updatedProduct' , updatedProduct)
            resolve({
                status: 'OK' ,
                message: 'SUCCESS',
                data: updatedBrand
                
            })
           
            
           
        }catch(e) {
            reject(e)
        }
    })
}

const deleteBrand = (id) =>{
    return new Promise(async (resolve , reject) => {
        
        try {
            const checkBrand = await Brand.findOne({
                _id: id,
            })
            // console.log('checkProduct', checkProduct);
            
            if(checkBrand === null) {
                resolve({
                    status: 'ERR' ,
                    message: 'Brand không có trong database'
                })
            }
            await Brand.findByIdAndDelete(id)
            resolve({
                status: 'OK' ,
                message: 'delete Brand thành công!',
                
            })
           
            
           
        }catch(e) {
            reject(e)
        }
    })
}

const getAllBrand = () =>{
    return new Promise(async (resolve , reject) => {
        
        try {
           
            
            const allBrand = await Brand.find()
            resolve({
                status: 'OK' ,
                message: 'Lấy thông tin tất cả brand thành công!',
                data: allBrand
            })
           
            
           
        }catch(e) {
            reject(e)
        }
    })
}

const getDetailsBrand = (id) =>{
    return new Promise(async (resolve , reject) => {
        
        try {
            const brand = await Brand.findOne({
                _id: id,
            })
            
            if(brand === null) {
                resolve({
                    status: 'ERR' ,
                    message: 'Brand không có trong database'
                })
            }
            
            resolve({
                status: 'OK' ,
                message: 'lấy thông tin chi tiết Brand thành công!',
                data: brand
            })
           
            
           
        }catch(e) {
            reject(e)
        }
    })
}

module.exports = {
    createBrand,
    updateBrand,
    deleteBrand,
    getAllBrand,
    getDetailsBrand
}