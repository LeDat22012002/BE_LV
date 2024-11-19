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

const getAllProduct = (limit, page, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            let query = {};
            let sortOption = { createdAt: -1 }; // Mặc định sort theo ngày mới nhất

            // Xử lý filter
            if (filter) {
                const [field, value] = filter;
                query = {
                    [field]: { '$regex': new RegExp(value, "i") }
                }
            }

            // Xử lý sort
            if (sort) {
                const [sortType] = sort; // Lấy type sort từ params
                switch (sortType) {
                    case 'newest':
                        sortOption = { createdAt: -1 }; // Mới nhất đến cũ nhất
                        break;
                    case 'asc':
                        sortOption = { price: 1 }; // Giá tăng dần
                        break;
                    case 'desc':
                        sortOption = { price: -1 }; // Giá giảm dần
                        break;
                    case 'selle':
                        sortOption = { selled: -1 };//Bán chạy nhất
                        break;   
                    default:
                        sortOption = { createdAt: -1 }; // Mặc định mới nhất
                }
            }

            // Query database
            const [products, totalProduct] = await Promise.all([
                Product.find(query)
                    .sort(sortOption)
                    .populate("category")
                    .populate("brand")
                    .limit(limit)
                    .skip(page * limit),
                Product.countDocuments(query)
            ]);

            resolve({
                status: 'OK',
                message: 'Lấy thông tin tất cả Product thành công!',
                data: products,
                total: totalProduct,
                pageCurrent: Number(page + 1),
                totalPage: Math.ceil(totalProduct / limit)
            });

        } catch (e) {
            reject(e);
        }
    });
};

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


const getProductsByCategory = (categoryId, limit, page, sort) => {
    return new Promise(async (resolve, reject) => {
        try {
            let query = { category: categoryId };
            let sortOption = { createdAt: -1 }; // Mặc định sort theo ngày mới nhất

            // Xử lý sort nếu có
            if (sort) {
                const [sortType] = sort;
                switch (sortType) {
                    case 'newest':
                        sortOption = { createdAt: -1 };
                        break;
                    case 'asc':
                        sortOption = { price: 1 };
                        break;
                    case 'desc':
                        sortOption = { price: -1 };
                        break;
                    case 'selle':
                        sortOption = { selled: -1 };
                        break;    
                    default:
                        sortOption = { createdAt: -1 };
                }
            }

            // Query database với Promise.all để tối ưu performance
            const [products, totalProduct] = await Promise.all([
                Product.find(query)
                    .sort(sortOption)
                    .populate("category")
                    .populate("brand")
                    .limit(limit)
                    .skip(page * limit),
                Product.countDocuments(query)
            ]);

            // Check nếu không có sản phẩm nào
            if (products.length === 0) {
                resolve({
                    status: 'OK',
                    message: 'Không có sản phẩm nào trong danh mục này',
                    data: [],
                    total: 0,
                    pageCurrent: 1,
                    totalPage: 0
                });
                return;
            }

            resolve({
                status: 'OK',
                message: 'Lấy thông tin sản phẩm theo danh mục thành công',
                data: products,
                total: totalProduct,
                pageCurrent: Number(page + 1),
                totalPage: Math.ceil(totalProduct / limit)
            });

        } catch (error) {
            reject(error);
        }
    });
};

const getAllCategoryProduct = () => {
    return new Promise(async (resolve, reject) => {
        try {
            // Lấy tất cả category có sản phẩm
            const categories = await Product.aggregate([
                {
                    $group: {
                        _id: "$category",
                        count: { $sum: 1 },
                        products: { $push: "$$ROOT" }
                    }
                },
                {
                    $lookup: {
                        from: "categories", // Collection name của category
                        localField: "_id",
                        foreignField: "_id",
                        as: "categoryInfo"
                    }
                },
                {
                    $project: {
                        categoryId: "$_id",
                        categoryName: { $arrayElemAt: ["$categoryInfo.name", 0] },
                        productCount: "$count",
                        products: { $slice: ["$products", 4] } // Lấy 4 sản phẩm mới nhất
                    }
                }
            ]);

            resolve({
                status: 'OK',
                message: 'Lấy thông tin danh mục và sản phẩm thành công',
                data: categories
            });

        } catch (error) {
            reject(error);
        }
    });
};

const getProductsByBrand = (brandId, limit, page, sort) => {
    return new Promise(async (resolve, reject) => {
        try {
            let query = { brand: brandId };
            let sortOption = { createdAt: -1 }; // Mặc định sort theo ngày mới nhất

            // Xử lý sort nếu có
            if (sort) {
                const [sortType] = sort;
                switch (sortType) {
                    case 'newest':
                        sortOption = { createdAt: -1 };
                        break;
                    case 'asc':
                        sortOption = { price: 1 };
                        break;
                    case 'desc':
                        sortOption = { price: -1 };
                        break;
                    case 'selle':
                        sortOption = { selled: -1 };
                        break;    
                    default:
                        sortOption = { createdAt: -1 };
                }
            }

            // Query database với Promise.all để tối ưu performance
            const [products, totalProduct] = await Promise.all([
                Product.find(query)
                    .sort(sortOption)
                    .populate("category")
                    .populate("brand")
                    .limit(limit)
                    .skip(page * limit),
                Product.countDocuments(query)
            ]);

            // Check nếu không có sản phẩm nào
            if (products.length === 0) {
                resolve({
                    status: 'OK',
                    message: 'Không có sản phẩm nào trong thương hiệu này',
                    data: [],
                    total: 0,
                    pageCurrent: 1,
                    totalPage: 0
                });
                return;
            }

            resolve({
                status: 'OK',
                message: 'Lấy thông tin sản phẩm theo thương hiệu thành công',
                data: products,
                total: totalProduct,
                pageCurrent: Number(page + 1),
                totalPage: Math.ceil(totalProduct / limit)
            });

        } catch (error) {
            reject(error);
        }
    });
};

const getAllBrandProduct = () => {
    return new Promise(async (resolve, reject) => {
        try {
            // Lấy tất cả category có sản phẩm
            const brands = await Product.aggregate([
                {
                    $group: {
                        _id: "$brand",
                        count: { $sum: 1 },
                        products: { $push: "$$ROOT" }
                    }
                },
                {
                    $lookup: {
                        from: "brands", // Collection name của category
                        localField: "_id",
                        foreignField: "_id",
                        as: "brandInfo"
                    }
                },
                {
                    $project: {
                        brandId: "$_id",
                        brandName: { $arrayElemAt: ["$brandInfo.name", 0] },
                        productCount: "$count",
                        products: { $slice: ["$products", 4] } // Lấy 4 sản phẩm mới nhất
                    }
                }
            ]);

            resolve({
                status: 'OK',
                message: 'Lấy thông tin thương hiệu và sản phẩm thành công',
                data: brands
            });

        } catch (error) {
            reject(error);
        }
    });
};






module.exports = {
    createProduct, 
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct ,
    deleteManyProduct,
    getAllTypeProduct,
    getAllCategoryProduct,
    getProductsByCategory,
    getAllCategoryProduct,
    getProductsByBrand,
    getAllBrandProduct,

    
}