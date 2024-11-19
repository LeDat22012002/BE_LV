const Brand = require("../models/BrandModel");
const Product = require("../models/ProductModel");

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
            
            if(checkBrand === null) {
                resolve({
                    status: 'ERR',
                    message: 'Thương hiệu không tồn tại trong hệ thống'
                })
                return;
            }

            // Kiểm tra xem có sản phẩm nào thuộc thương hiệu này không
            const productsCount = await Product.countDocuments({ brand: id })
            if(productsCount > 0) {
                resolve({
                    status: 'ERR',
                    message: `Không thể xóa thương hiệu "${checkBrand.name}" vì đang có ${productsCount} sản phẩm`
                })
                return;
            }

            await Brand.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: `Đã xóa thương hiệu "${checkBrand.name}" thành công!`,
            })
        } catch(e) {
            reject(e)
        }
    })
}

const getAllBrand = () =>{
    return new Promise(async (resolve , reject) => {
        
        try {
            const allBrand = await Brand.find()
            
            // Thêm số lượng sản phẩm cho mỗi thương hiệu
            const brandsWithCount = await Promise.all(
                allBrand.map(async (brand) => {
                    const productCount = await Product.countDocuments({ brand: brand._id })
                    return {
                        ...brand._doc,
                        productCount
                    }
                })
            )

            resolve({
                status: 'OK',
                message: 'Lấy thông tin tất cả thương hiệu thành công!',
                data: brandsWithCount
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