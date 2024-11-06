
const OrderService = require('../services/OrderServices')


const createOrder = async (req , res) => {
    
    try {
        // console.log('req' ,req.body)
      
        const {paymentMethod ,  itemsPrice ,  shippingPrice,  totalPrice ,  fullName , address , city , phone} = req.body 
        // console.log(req.body)
        // Kiểm tra tụi nó có tồn tại không
        if( !paymentMethod || !itemsPrice || !shippingPrice|| !totalPrice || !fullName || !address || !city || !phone ){
            return res.status(200).json({
                status: "ERR",
                message: 'Một trong số các trường không tồn tại'
            })
        }
        
        const response = await OrderService.createOrder(req.body)
        // console.log('response', response)
        return res.status(200).json(response)
    }catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getOrderDetails = async (req , res) => {
    try {
        const userId = req.params.id
        
        if(!userId) {
            return res.status(200).json({
                status: "ERROR" ,
                message: 'trường userId không tồn tại'
            })
        }
        // console.log('productId',productId)
        const response = await OrderService.getOrderDetails(userId)
        return res.status(200).json(response)
    }catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetails_Order = async (req , res) => {
    try {
        const orderId = req.params.id
        
        if(!orderId) {
            return res.status(200).json({
                status: "ERROR" ,
                message: 'trường userId không tồn tại'
            })
        }
        // console.log('productId',productId)
        const response = await OrderService.getDetails_Order(orderId)
        return res.status(200).json(response)
    }catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllOrder= async (req , res) => {
    try {
        
        const data = await OrderService.getAllOrder()
        return res.status(200).json(data)
    }catch(e) {
        return res.status(404).json({
            message: e
        })
    }
}




module.exports = {
    createOrder,
    getOrderDetails,
    getDetails_Order,
    getAllOrder
   
   
}