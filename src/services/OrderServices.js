const Order = require("../models/OderProduct");
const Product = require("../models/ProductModel");
const EmailService = require("../services/EmailServices")


const createOrder = (newOrder) =>{
    
    return new Promise(async (resolve , reject) => {
       
        const { orderItems, paymentMethod ,  itemsPrice ,  shippingPrice,  totalPrice ,  fullName , address , city , phone , user ,email, isPaid,paidAt} = newOrder
        try {
            // Kiểm tra số lượng tồn kho
            const stockCheckPromises = orderItems.map(async (order) => {
                const product = await Product.findById(order.product);
                if (!product || product.countInStock < order.amount) {
                    return {
                        status: 'ERR',
                        message: 'ERR',
                        id: order.product
                    };
                }
                return {
                    status: 'OK',
                    message: 'SUCCESS'
                };
            });

            const stockCheckResults = await Promise.all(stockCheckPromises);
            const insufficientStock = stockCheckResults.filter(item => item.status === 'ERR');

            if (insufficientStock.length) {
                const arrId = insufficientStock.map(item => item.id);
                resolve({
                    status: 'ERR',
                    message: `Sản phẩm với id: ${arrId.join(',')} không đủ hàng`
                });
                return;
            }

            // Nếu là thanh toán online (PayPal), cập nhật số lượng ngay
            if (paymentMethod === 'paypal') {
                await Promise.all(orderItems.map(async (order) => {
                    await Product.findByIdAndUpdate(
                        order.product,
                        {
                            $inc: {
                                countInStock: -order.amount,
                                selled: +order.amount
                            }
                        }
                    );
                }));
            }

            // Tạo đơn hàng
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
                isPaid: paymentMethod === 'paypal',
                paidAt: paymentMethod === 'paypal' ? new Date() : null,
                status: paymentMethod === 'paypal' ? 'CONFIRMED' : 'PENDING',
                statusHistory: [{
                    status: paymentMethod === 'paypal' ? 'CONFIRMED' : 'PENDING',
                    updatedAt: new Date(),
                    note: paymentMethod === 'paypal' ? 'Đơn hàng đã được xác nhận tự động do thanh toán online' : 'Đơn hàng mới'
                }]
            });

            if (createdOrder) {
                await EmailService.sendEmailCreateOrder(email, orderItems);
                resolve({
                    status: 'OK',
                    message: 'success'
                });
            }
        } catch (e) {
            console.log('e', e);
            reject(e);
        }
    })
}

const getOrderDetails = (id) =>{
    return new Promise(async (resolve , reject) => {
        
        try {
            const order = await Order.find({
                user: id,
            }).sort({createdAt: -1})
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
           
            
            const allOrder = await Order.find().sort({createdAt: -1})
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

const updateOrderStatus = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { status, note } = data;
            const order = await Order.findById(id);
            
            if (!order) {
                resolve({
                    status: 'ERR',
                    message: 'Đơn hàng không tồn tại'
                });
                return;
            }

            // Cập nhật trạng thái và các field liên quan
            const updates = {
                status,
                statusHistory: [
                    ...order.statusHistory,
                    {
                        status,
                        updatedAt: new Date(),
                        note: note || ''
                    }
                ]
            };

            // Xử lý cập nhật số lượng trong kho dựa trên trạng thái
            switch (status) {
                case 'CONFIRMED':
                    // Khi xác nhận đơn hàng, giảm số lượng trong kho
                    await Promise.all(order.orderItems.map(item => 
                        Product.findByIdAndUpdate(
                            item.product,
                            {
                                $inc: {
                                    countInStock: -item.amount,
                                    selled: +item.amount
                                }
                            }
                        )
                    ));
                    break;
                case 'COMPLETED':
                    updates.isDelivered = true;
                    updates.deliveredAt = new Date();
                    updates.isPaid = true;
                    updates.paidAt = new Date();
                    break;
                case 'SHIPPING':
                    updates.isDelivered = false;
                    break;
                case 'CANCELLED':
                    // Nếu đơn hàng đã được xác nhận trước đó, hoàn lại số lượng vào kho
                    if (order.status === 'CONFIRMED' || order.status === 'SHIPPING') {
                        await Promise.all(order.orderItems.map(item => 
                            Product.findByIdAndUpdate(
                                item.product,
                                {
                                    $inc: {
                                        countInStock: +item.amount,
                                        selled: -item.amount
                                    }
                                }
                            )
                        ));
                    }
                    updates.isDelivered = false;
                    break;
            }

            const updatedOrder = await Order.findByIdAndUpdate(
                id,
                updates,
                { new: true }
            );

            resolve({
                status: 'OK',
                message: 'Cập nhật trạng thái đơn hàng thành công',
                data: updatedOrder
            });
        } catch (e) {
            reject(e);
        }
    });
};

const cancelOrder = (orderId, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findById(orderId);
            
            if (!order) {
                resolve({
                    status: 'ERR',
                    message: 'Đơn hàng không tồn tại'
                });
                return;
            }

            // Kiểm tra quyền
            if (order.user.toString() !== userId) {
                resolve({
                    status: 'ERR',
                    message: 'Bạn không có quyền hủy đơn hàng này'
                });
                return;
            }

            // Kiểm tra trạng thái
            if (order.status !== 'PENDING') {
                resolve({
                    status: 'ERR',
                    message: 'Chỉ có thể hủy đơn hàng ở trạng thái chờ xác nhận'
                });
                return;
            }

            const updates = {
                status: 'CANCELLED',
                statusHistory: [
                    ...order.statusHistory,
                    {
                        status: 'CANCELLED',
                        updatedAt: new Date(),
                        note: 'Đơn hàng đã bị hủy bởi người mua'
                    }
                ]
            };

            // Không cần hoàn lại số lượng sản phẩm vì đơn hàng chưa được xác nhận
            const cancelledOrder = await Order.findByIdAndUpdate(
                orderId,
                updates,
                { new: true }
            );

            resolve({
                status: 'OK',
                message: 'Hủy đơn hàng thành công',
                data: cancelledOrder
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    createOrder, 
    getOrderDetails,
    getDetails_Order,
    getAllOrder,
    updateOrderStatus,
    cancelOrder
}