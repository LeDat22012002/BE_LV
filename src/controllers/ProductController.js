
const ProductService = require('../services/ProductServices')


const createProduct = async (req , res) => {
    try {
       
        // Lấy ra những trường mà mình tạo ra cho Product
        const { name , image , type, price , countInStock , rating , description ,discount ,category ,brand} = req.body 
        // console.log(req.body)
        // Kiểm tra tụi nó có tồn tại không
        if( !name || !image || !type|| !price || !countInStock || !rating || !discount ||!category  ){
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

const getAllProduct = async (req , res) => {
    // console.log('tttt' , req.query)
    try {
        const {limit , page , sort , filter}  = req.query
        const response = await ProductService.getAllProduct(Number(limit) || null , Number(page) || 0 , sort , filter)
        return res.status(200).json(response)
    }catch(e) {
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


module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct,
    deleteManyProduct,
    getAllTypeProduct,
    getAllCategoryProduct
   
}