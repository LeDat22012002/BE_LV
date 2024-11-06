const Order = require("../models/OderProduct");
const Product = require("../models/ProductModel");
const EmailService = require("../services/EmailServices")


const createOrder = (newOrder) =>{
    
    return new Promise(async (resolve , reject) => {
       
        const { orderItems, paymentMethod ,  itemsPrice ,  shippingPrice,  totalPrice ,  fullName , address , city , phone , user ,email, isPaid,paidAt} = newOrder
        try {
            const promises = orderItems.map(async(order) => {
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: order.product,
                        countInStock: {$gte: order.amount}

                    },
                    {$inc: {
                        countInStock: -order.amount,
                        selled: +order.amount
                    }},
                    {new: true}
                ) 
                if(productData) {
                    return {
                        status:'OK',
                        message:'SUCCESS'
                    }
                    
                }else{
                    return {
                        status:'OK',
                        message:'ERR',
                        id: order.product
                    }
                }
           })
           const results = await Promise.all(promises)
           const newData = results && results.filter((item) => item.id)
           if(newData.length){
                const arrId = []
                newData.forEach((item) => {
                    arrId.push(item.id)
                })
                resolve({
                    status: 'ERR',
                    message: `Sản phẩm với id: ${arrId.join(',')} không đủ hàng`
                })
           }else {
                const createdOrder = await Order.create({
                    orderItems,
                    shippingAddress: {
                        fullName,
                        address,
                        city,
                        phone
                    },
                    paymentMethod,
                    itemsPrice,
                    shippingPrice,
                    totalPrice,
                    user: user,
                    isPaid,
                    paidAt

                })
                if(createdOrder) {
                    await EmailService.sendEmailCreateOrder(email,orderItems)
                    resolve({
                        status:'OK',
                        message:'success'
                    })
                
                }
           }
           
        }catch(e) {
            console.log('e',e)
            reject(e)
        }
    })
}

const getOrderDetails = (id) =>{
    return new Promise(async (resolve , reject) => {
        
        try {
            const order = await Order.find({
                user: id,
            })
            // console.log('product' , product);
            
            if(order === null) {
                resolve({
                    status: 'ERR' ,
                    message: 'Order không có trong database'
                })
            }
            
            resolve({
                status: 'OK' ,
                message: 'lấy thông tin chi tiết Đơn đặt hàng thành công!',
                data: order
            })
           
            
           
        }catch(e) {
            reject(e)
        }
    })
}

const getDetails_Order = (id) =>{
    return new Promise(async (resolve , reject) => {
        
        try {
            const order = await Order.findById({
                _id: id,
            })
            // console.log('product' , product);
            
            if(order === null) {
                resolve({
                    status: 'ERR' ,
                    message: 'Order không có trong database'
                })
            }
            
            resolve({
                status: 'OK' ,
                message: 'lấy thông tin chi tiết Đơn đặt hàng thành công!',
                data: order
            })
           
            
           
        }catch(e) {
            reject(e)
        }
    })
}


const getAllOrder = () =>{
    return new Promise(async (resolve , reject) => {
        
        try {
           
            
            const allOrder = await Order.find()
            resolve({
                status: 'OK' ,
                message: 'Lấy thông tin tất cả đơn hàng thành công!',
                data: allOrder
            })
           
            
           
        }catch(e) {
            reject(e)
        }
    })
}




module.exports = {
    createOrder, 
    getOrderDetails,
    getDetails_Order,
    getAllOrder
    
    
}