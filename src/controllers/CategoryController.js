const CategoryServices = require('../services/CategoryServices')

const createCategory = async (req , res) => {
    try {
       
        // Lấy ra những trường mà mình tạo ra cho Category
        const { name } = req.body 
        // console.log(req.body)
        // Kiểm tra tụi nó có tồn tại không
        if( !name  ){
            return res.status(200).json({
                status: "ERR",
                message: 'Một trong số các trường không tồn tại'
            })
        }
        
        const response = await CategoryServices.createCategory(req.body)
        // console.log('response', response)
        return res.status(200).json(response)
    }catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const  updateCategory = async (req , res) => {
    try {
        const categoryId = req.params.id
        const data = req.body
        if(!categoryId) {
            return res.status(200).json({
                status: "ERROR" ,
                message: 'trường categoryId không tồn tại'
            })
        }
       
        const response = await CategoryServices.updateCategory(categoryId , data)
        return res.status(200).json(response)
    }catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteCategory = async (req , res) => {
    try {
        const categoryId = req.params.id
        
        if(!categoryId) {
            return res.status(200).json({
                status: "ERROR" ,
                message: 'trường categoryId không tồn tại'
            })
        }
        
        const response = await CategoryServices.deleteCategory(categoryId)
        return res.status(200).json(response)
    }catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllCategory = async (req , res) => {
    try {
        
        const response = await CategoryServices.getAllCategory()
        return res.status(200).json(response)
    }catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailsCategory = async (req , res) => {
    try {
        const categoryId = req.params.id
        
        if(!categoryId) {
            return res.status(200).json({
                status: "ERROR" ,
                message: 'trường categoryId không tồn tại'
            })
        }
        
        const response = await CategoryServices.getDetailsCategory(categoryId)
        return res.status(200).json(response)
    }catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getAllCategory,
    getDetailsCategory,
}