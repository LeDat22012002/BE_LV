// const Category = require("../models/CategoryModel");
const Product = require("../models/ProductModel");




const createProduct = (newProduct) =>{
    return new Promise(async (resolve , reject) => {
        
        const { name , image , type, price , countInStock , rating , description ,discount,  category , brand } = newProduct
        try {
            // const category = await Category.findById(categoryId)
            // if (!category) {
            //     resolve({
            //         status: 'ERR' ,
            //         message: 'Danh mục không tồn tại'
            //     })
            // }
            const checkProduct = await Product.findOne({
                name: name
            })
            
            // nếu mà thằng name của sản phẩm đã tồn tại
            if(checkProduct !== null) {
                resolve({
                    status: 'ERR' ,
                    message: 'Tên của sản phẩm đã tồn tại'
                })
            }
            
            
            const createProduct = await Product.create({
                name, 
                image, 
                type, 
                price, 
                countInStock: Number(countInStock), 
                rating, 
                description,
                discount: Number(discount),
                category,
                brand,
                
            })
            if(createProduct) {
                resolve({
                    status: 'OK' ,
                    message: 'SUCCESS',
                    data: createProduct
                })
            }
            
           
        }catch(e) {
            reject(e)
        }
    })
}

const updateProduct = (id , data) =>{
    return new Promise(async (resolve , reject) => {
        
        try {
            const checkProduct = await Product.findOne({
                _id: id,
            }).populate("category")
            // console.log('checkProduct' , checkProduct);
            
            if(checkProduct === null) {
                resolve({
                    status: 'ERR' ,
                    message: 'Product không có trong database'
                })
            }
            const updatedProduct = await Product.findByIdAndUpdate(id , data , {new: true})
            // console.log('updatedProduct' , updatedProduct)
            resolve({
                status: 'OK' ,
                message: 'SUCCESS',
                data: updatedProduct
                
            })
           
            
           
        }catch(e) {
            reject(e)
        }
    })
}

const getDetailsProduct = (id) =>{
    return new Promise(async (resolve , reject) => {
        
        try {
            const product = await Product.findOne({
                _id: id,
            }).populate("category").populate('brand')
            // console.log('product' , product);
            
            if(product === null) {
                resolve({
                    status: 'ERR' ,
                    message: 'Product không có trong database'
                })
            }
            
            resolve({
                status: 'OK' ,
                message: 'lấy thông tin chi tiết Product thành công!',
                data: product
            })
           
            
           
        }catch(e) {
            reject(e)
        }
    })
}

const deleteProduct = (id) =>{
    return new Promise(async (resolve , reject) => {
        
        try {
            const checkProduct = await Product.findOne({
                _id: id,
            })
            // console.log('checkProduct', checkProduct);
            
            if(checkProduct === null) {
                resolve({
                    status: 'ERR' ,
                    message: 'Product không có trong database'
                })
            }
            await Product.findByIdAndDelete(id)
            resolve({
                status: 'OK' ,
                message: 'delete Product thành công!',
                
            })
           
            
           
        }catch(e) {
            reject(e)
        }
    })
}

const deleteManyProduct = (ids) =>{
    return new Promise(async (resolve , reject) => {
        
        try {
            
            await Product.deleteMany({_id : ids})
            resolve({
                status: 'OK' ,
                message: 'delete Product thành công!',
                
            })
           
            
           
        }catch(e) {
            reject(e)
        }
    })
}

const getAllProduct = (limit  , page , sort , filter) =>{
    // console.log(sort)
    return new Promise(async (resolve , reject) => {
        
        try {
            const totalProduct = await Product.countDocuments()
            let allProduct= []
            // console.log(filter)
            if(filter) {
                const lable = filter[0]
                const allObjectFilter = await Product.find({
                    [lable]: {'$regex' : new RegExp(filter[1],"i")}
                }).limit(limit).skip(page * limit)

                

                resolve({
                    status: 'OK' ,
                    message: 'Lấy thông tin tất cả Product thành công!',
                    data: allObjectFilter,
                    total: totalProduct, // tổng số sản phẩm 
                    pageCurrent: Number(page + 1) , // mỗi lần click page tăng lên 1 
                    totalPage: Math.ceil(totalProduct / limit) // Tổng số page
                })
            }
            if(sort){
                // console.log('OKKKK')
                const objectSort = {}
                objectSort[sort[1]] = sort[0]
                // console.log('objectSort' , objectSort)

                const allProductSort = await Product.find().limit(limit).skip(page * limit).populate("category")
                resolve({
                    status: 'OK' ,
                    message: 'Lấy thông tin tất cả Product thành công!',
                    data: allProductSort,
                    total: totalProduct, // tổng số sản phẩm 
                    pageCurrent: Number(page + 1) , // mỗi lần click page tăng lên 1 
                    totalPage: Math.ceil(totalProduct / limit) // Tổng số page
                })
            }
            // limit() lấy số lượng product mặc định mà bạn mong muốn 
            // skip() bỏ qua số product đầu tiên bạn muốn
            // skip(page * limit) mỗi lần nhấn chuyển trang thằng page sẽ tăng lên vs giá trị tương ứng
            if(!limit){
                allProduct = await Product.find().populate("category") 
            }else{
                allProduct = await Product.find().limit(limit).skip(page * limit).sort().populate("category") 
            }
           
            resolve({
                status: 'OK' ,
                message: 'Lấy thông tin tất cả Product thành công!',
                data: allProduct,
                total: totalProduct, // tổng số sản phẩm 
                pageCurrent: Number(page + 1) , // mỗi lần click page tăng lên 1 
                totalPage: Math.ceil(totalProduct / limit) // Tổng số page
            })
           
            
           
        }catch(e) {
            reject(e)
        }
    })
}

const getAllTypeProduct = () =>{
    // console.log(sort)
    return new Promise(async (resolve , reject) => {
        
        try {
            
           
            const allTypeProduct = await Product.distinct('type')
            resolve({
                status: 'OK' ,
                message: 'Lấy thông tin tất cả Product thành công!',
                data: allTypeProduct,
                
            })
           
            
           
        }catch(e) {
            reject(e)
        }
    })
}

const getAllCategoryProduct = () =>{
    // console.log(sort)
    return new Promise(async (resolve , reject) => {
        
        try {
            
           
            const allCategoryProduct = await Product.distinct('category').populate('category')
            resolve({
                status: 'OK' ,
                message: 'Lấy thông tin tất cả Category Product thành công!',
                data: allCategoryProduct,
                
            })
           
            
           
        }catch(e) {
            reject(e)
        }
    })
}

module.exports = {
    createProduct, 
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct ,
    deleteManyProduct,
    getAllTypeProduct,
    getAllCategoryProduct
    
    
}