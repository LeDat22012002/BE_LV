
const ProductService = require('../services/ProductServices')


const createProduct = async (req , res) => {
    try {
       
        // Lấy ra những trường mà mình tạo ra cho Product
        const { name , image , type, price , countInStock  , description  ,category ,brand} = req.body 
        // console.log(req.body)
        // Kiểm tra tụi nó có tồn tại không
        if( !name || !image || !type|| !price || !countInStock  ||!category  ){
            return res.status(200).json({
                status: "ERR",
                message: 'Một trong số các trường không tồn tại'
            })
        }
        
        const response = await ProductService.createProduct(req.body)
        // console.log('response', response)
        return res.status(200).json(response)
    }catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const  updateProduct = async (req , res) => {
    try {
        const productId = req.params.id
        const data = req.body
        if(!productId) {
            return res.status(200).json({
                status: "ERROR" ,
                message: 'trường productId không tồn tại'
            })
        }
        // console.log('productId',productId)
        const response = await ProductService.updateProduct(productId , data)
        return res.status(200).json(response)
    }catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailsProduct = async (req , res) => {
    try {
        const productId = req.params.id
        
        if(!productId) {
            return res.status(200).json({
                status: "ERROR" ,
                message: 'trường productId không tồn tại'
            })
        }
        // console.log('productId',productId)
        const response = await ProductService.getDetailsProduct(productId)
        return res.status(200).json(response)
    }catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteProduct = async (req , res) => {
    try {
        const productId = req.params.id
        
        if(!productId) {
            return res.status(200).json({
                status: "ERROR" ,
                message: 'trường productId không tồn tại'
            })
        }
        // console.log('productId',productId)
        const response = await ProductService.deleteProduct(productId)
        return res.status(200).json(response)
    }catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteManyProduct = async (req , res) => {
    try {
        const ids = req.body.ids
        
        if(!ids) {
            return res.status(200).json({
                status: "ERROR" ,
                message: 'trường ids không tồn tại'
            })
        }
        // console.log('productId',productId)
        const response = await ProductService.deleteManyProduct(ids)
        return res.status(200).json(response)
    }catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllProduct = async (req, res) => {
    try {
        const { limit, page, sort, filter } = req.query
        const response = await ProductService.getAllProduct(
            Number(limit) || null, // Default sản phẩm mỗi trang
            Number(page) || 0,
            sort ? [sort] : null, // Chuyển sort thành array
            filter
        )
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllTypeProduct = async (req , res) => {
    // console.log('tttt' , req.query)
    try {
       
        const response = await ProductService.getAllTypeProduct()
        return res.status(200).json(response)
    }catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllCategoryProduct = async (req , res) => {
    // console.log('tttt' , req.query)
    try {
       
        const response = await ProductService.getAllCategoryProduct()
        return res.status(200).json(response)
    }catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

// Thêm các controllers mới cho category
 const getProductsByCategory= async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { limit = 12, page = 0, sort } = req.query;

        if (!categoryId) {
            return res.status(400).json({
                status: "ERR",
                message: 'Thiếu ID danh mục'
            });
        }

        const response = await ProductService.getProductsByCategory(
            categoryId,
            Number(limit),
            Number(page),
            sort ? [sort] : null
        );
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            status: "ERR",
            message: error.message
        });
    }
}

const getCategoryWithProducts= async (req, res) => {
    try {
        const { limit = 4 } = req.query;
        const response = await ProductService.getCategoryWithProducts(Number(limit));
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            status: "ERR",
            message: error.message
        });
    }
}

const getAllBrandProduct = async (req , res) => {
    // console.log('tttt' , req.query)
    try {
       
        const response = await ProductService.getAllBrandProduct()
        return res.status(200).json(response)
    }catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getProductsByBrand= async (req, res) => {
    try {
        const { brandId } = req.params;
        const { limit = 12, page = 0, sort } = req.query;

        if (!brandId) {
            return res.status(400).json({
                status: "ERR",
                message: 'Thiếu ID thương hiệu'
            });
        }

        const response = await ProductService.getProductsByBrand(
            brandId,
            Number(limit),
            Number(page),
            sort ? [sort] : null
        );
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            status: "ERR",
            message: error.message
        });
    }
}

const getBrandWithProducts= async (req, res) => {
    try {
        const { limit = 4 } = req.query;
        const response = await ProductService.getBrandWithProducts(Number(limit));
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            status: "ERR",
            message: error.message
        });
    }
}
const searchProducts = async (req, res) => {
    try {
        const { 
            limit = 12, 
            page = 0, 
            categories, 
            brands, 
            minPrice, 
            maxPrice, 
            keyword,
            sort 
        } = req.query;

        // Xử lý và validate các tham số tìm kiếm
        const searchParams = {
            categories: categories ? categories.split(',') : undefined,
            brands: brands ? brands.split(',') : undefined,
            priceRange: {
                minPrice: minPrice ? Number(minPrice) : undefined,
                maxPrice: maxPrice ? Number(maxPrice) : undefined
            },
            keyword: keyword,
            sort: sort
        };

        // Validate giá
        if (searchParams.priceRange.minPrice && searchParams.priceRange.maxPrice) {
            if (searchParams.priceRange.minPrice > searchParams.priceRange.maxPrice) {
                return res.status(400).json({
                    status: "ERR",
                    message: 'Giá tối thiểu không được lớn hơn giá tối đa'
                });
            }
        }

        // Gọi service search
        const response = await ProductService.searchProducts(
            Number(limit),
            Number(page),
            searchParams
        );

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            status: "ERR",
            message: error.message
        });
    }
};


module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct,
    deleteManyProduct,
    getAllTypeProduct,
    getAllCategoryProduct,
    getCategoryWithProducts,
    getProductsByCategory,
    getAllBrandProduct,
    getProductsByBrand,
    getBrandWithProducts,
    searchProducts
   
}