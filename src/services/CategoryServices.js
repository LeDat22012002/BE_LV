const Category = require("../models/CategoryModel");
const Product = require("../models/ProductModel");

const createCategory = (newCategory) =>{
    return new Promise(async (resolve , reject) => {
        
        const { name } = newCategory
        try {
            const checkCategory = await Category.findOne({
                name: name
            })
            // nếu mà thằng name của sản phẩm đã tồn tại
            if(checkCategory !== null) {
                resolve({
                    status: 'ERR' ,
                    message: 'Danh mục đã tồn tại'
                })
            }
            
            
            const createCategory = await Category.create({
                name, 
                
            })
            if(createCategory) {
                resolve({
                    status: 'OK' ,
                    message: 'SUCCESS',
                    data: createCategory
                })
            }
            
           
        }catch(e) {
            reject(e)
        }
    })
}

const updateCategory = (id , data) =>{
    return new Promise(async (resolve , reject) => {
        
        try {
            const checkCategory = await Category.findOne({
                _id: id,
            })
            // console.log('checkProduct' , checkProduct);
            
            if(checkCategory === null) {
                resolve({
                    status: 'ERR' ,
                    message: 'Category không có trong database'
                })
            }
            const updatedCategory = await Category.findByIdAndUpdate(id , data , {new: true})
            // console.log('updatedProduct' , updatedProduct)
            resolve({
                status: 'OK' ,
                message: 'SUCCESS',
                data: updatedCategory
                
            })
           
            
           
        }catch(e) {
            reject(e)
        }
    })
}

const deleteCategory = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkCategory = await Category.findOne({
                _id: id,
            })
            
            if(checkCategory === null) {
                resolve({
                    status: 'ERR',
                    message: 'Category không có trong database'
                })
            }

            // Kiểm tra xem có sản phẩm nào trong danh mục kh��ng
            const productsInCategory = await Product.countDocuments({ category: id })
            if (productsInCategory > 0) {
                resolve({
                    status: 'ERR',
                    message: `Không thể xóa danh mục này vì còn ${productsInCategory} sản phẩm`
                })
                return
            }

            await Category.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'delete Category thành công!',
            })
        } catch(e) {
            reject(e)
        }
    })
}

const getAllCategory = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allCategory = await Category.find()
            
            // Lấy số lượng sản phẩm cho mỗi danh mục
            const categoriesWithCount = await Promise.all(
                allCategory.map(async (category) => {
                    const productCount = await Product.countDocuments({ category: category._id })
                    return {
                        ...category._doc,
                        productCount
                    }
                })
            )

            resolve({
                status: 'OK',
                message: 'Lấy thông tin tất cả Category thành công!',
                data: categoriesWithCount
            })
        } catch(e) {
            reject(e)
        }
    })
}

const getDetailsCategory = (id) =>{
    return new Promise(async (resolve , reject) => {
        
        try {
            const category = await Category.findOne({
                _id: id,
            })
            
            if(category === null) {
                resolve({
                    status: 'ERR' ,
                    message: 'Brand không có trong database'
                })
            }
            
            resolve({
                status: 'OK' ,
                message: 'lấy thông tin chi tiết Brand thành công!',
                data: category
            })
           
            
           
        }catch(e) {
            reject(e)
        }
    })
}

module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getAllCategory,
    getDetailsCategory
}