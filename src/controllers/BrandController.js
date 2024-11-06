const BrandServices = require('../services/BrandServices')

const createBrand = async (req , res) => {
    try {
       
        // Lấy ra những trường mà mình tạo ra cho Product
        const { name } = req.body 
        // console.log(req.body)
        // Kiểm tra tụi nó có tồn tại không
        if( !name  ){
            return res.status(200).json({
                status: "ERR",
                message: 'Một trong số các trường không tồn tại'
            })
        }
        
        const response = await BrandServices.createBrand(req.body)
        // console.log('response', response)
        return res.status(200).json(response)
    }catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const  updateBrand = async (req , res) => {
    try {
        const brandId = req.params.id
        const data = req.body
        if(!brandId) {
            return res.status(200).json({
                status: "ERROR" ,
                message: 'trường brandId không tồn tại'
            })
        }
        // console.log('productId',productId)
        const response = await BrandServices.updateBrand(brandId , data)
        return res.status(200).json(response)
    }catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteBrand = async (req , res) => {
    try {
        const brandId = req.params.id
        
        if(!brandId) {
            return res.status(200).json({
                status: "ERROR" ,
                message: 'trường BrandId không tồn tại'
            })
        }
        // console.log('productId',productId)
        const response = await BrandServices.deleteBrand(brandId)
        return res.status(200).json(response)
    }catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllBrand = async (req , res) => {
    try {
        
        const response = await BrandServices.getAllBrand()
        return res.status(200).json(response)
    }catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailsBrand = async (req , res) => {
    try {
        const brandId = req.params.id
        
        if(!brandId) {
            return res.status(200).json({
                status: "ERROR" ,
                message: 'trường brandId không tồn tại'
            })
        }
        // console.log('userId' ,userId)
        const response = await BrandServices.getDetailsBrand(brandId)
        return res.status(200).json(response)
    }catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createBrand,
    updateBrand,
    deleteBrand,
    getAllBrand,
    getDetailsBrand,
}