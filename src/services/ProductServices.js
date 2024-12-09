// const Category = require("../models/CategoryModel");
const Product = require("../models/ProductModel");
const Order = require("../models/OderProduct");



const createProduct = (newProduct) =>{
    return new Promise(async (resolve , reject) => {
        
        const { name , image , type, price , countInStock , description ,  category , brand } = newProduct
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
                
                description,
                
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

const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra sản phẩm tồn tại
            const checkProduct = await Product.findOne({
                _id: id,
            });
            
            if(checkProduct === null) {
                resolve({
                    status: 'ERR',
                    message: 'Sản phẩm không tồn tại trong hệ thống'
                });
                return;
            }

            // Kiểm tra sản phẩm trong đơn hàng
            const orderWithProduct = await Order.findOne({
                'orderItems.product': id
            });

            if(orderWithProduct) {
                resolve({
                    status: 'ERR',
                    message: 'Không thể xóa sản phẩm đã có trong đơn hàng'
                });
                return;
            }

            // Nếu không có trong đơn hàng thì xóa
            await Product.findByIdAndDelete(id);
            resolve({
                status: 'OK',
                message: 'Xóa sản phẩm thành công'
            });

        } catch(e) {
            reject(e);
        }
    });
};

const deleteManyProduct = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra các sản phẩm trong đơn hàng
            const orderWithProducts = await Order.findOne({
                'orderItems.product': { $in: ids }
            });

            if(orderWithProducts) {
                resolve({
                    status: 'ERR',
                    message: 'Không thể xóa sản phẩm đã có trong đơn hàng'
                });
                return;
            }

            // Nếu không có trong đơn hàng thì xóa
            await Product.deleteMany({ _id: ids });
            resolve({
                status: 'OK',
                message: 'Xóa sản phẩm thành công'
            });

        } catch(e) {
            reject(e);
        }
    });
};

const getAllProduct = (limit = 10, page = 0, sort) => {
    return new Promise(async (resolve, reject) => {
        try {
            const validLimit = Math.max(1, parseInt(limit));
            const validPage = Math.max(0, parseInt(page));
            
            let query = {};
            let sortOption = { createdAt: -1 }; // Mặc định sort theo ngày mới nhất

            // Xử lý sort
            if (sort) {
                switch (sort) {
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

            // Query database với pagination metadata
            const [products, totalProduct] = await Promise.all([
                Product.find(query)
                    .sort(sortOption)
                    .populate("category")
                    .populate("brand")
                    .limit(validLimit)
                    .skip(validPage * validLimit),
                Product.countDocuments(query)
            ]);

            // Tính toán thông tin phân trang
            const totalPages = Math.ceil(totalProduct / validLimit);
            const hasNextPage = validPage + 1 < totalPages;
            const hasPrevPage = validPage > 0;

            resolve({
                status: 'OK',
                message: 'Lấy thông tin tất cả Product thành công!',
                data: products,
                pagination: {
                    total: totalProduct,
                    currentPage: validPage + 1,
                    totalPages,
                    limit: validLimit,
                    hasNextPage,
                    hasPrevPage,
                    nextPage: hasNextPage ? validPage + 2 : null,
                    prevPage: hasPrevPage ? validPage : null
                }
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
const searchProducts = (limit, page, searchParams) => {
    return new Promise(async (resolve, reject) => {
        try {
            let query = {};

            // Xử lý tìm kiếm theo nhiều danh mục
            if (searchParams?.categories && searchParams.categories !== 'all') {
                const categoryIds = Array.isArray(searchParams.categories) 
                    ? searchParams.categories 
                    : searchParams.categories.toString().split(',');
                query.category = { $in: categoryIds };
            }

            // Xử lý tìm kiếm theo nhiều thương hiệu
            if (searchParams?.brands && searchParams.brands !== 'all') {
                const brandIds = Array.isArray(searchParams.brands)
                    ? searchParams.brands
                    : searchParams.brands.toString().split(',');
                query.brand = { $in: brandIds };
            }

            // Query database
            const [products, totalProduct] = await Promise.all([
                Product.find(query)
                    .populate('category')
                    .populate('brand')
                    .sort({ createdAt: -1 })
                    .limit(limit)
                    .skip(page * limit),
                Product.countDocuments(query)
            ]);

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: products,
                total: totalProduct,
                pageCurrent: Number(page + 1),
                totalPage: Math.ceil(totalProduct / limit)
            });

        } catch (error) {
            console.error('Search error:', error);
            reject({
                status: 'ERR',
                message: error.message
            });
        }
    });
}


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
    searchProducts,
    
}