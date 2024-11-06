const nodemailer = require('nodemailer') 
const dotenv = require('dotenv');
const sendEmailCreateOrder = async (email, orderItems) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true ,
        auth: {
            user: process.env.MAIL_ACCOUNT,
            pass: process.env.MAIL_PASSWORD,
        },
    })

    let listItem = ''
    const attachImage = []
    orderItems.forEach((order) => {
        listItem +=`<div>
        <div>
            Bạn đã đặt sản phẩm <b>${order.name}</b> với số lượng: <b>${order.amount}</b> và giá :<b>${order.price} VND</b></div>
            <div>Bên dưới là hình ảnh của sản phẩm</div>
        </.div>`
        attachImage.push({path: order.image})
    })

    let info = await transporter.sendMail({
        from: process.env.MAIL_ACCOUNT,
        to:"ledat22.01.2002@gmail.com",
        subject: "Bạn đã đặt hàng thành công tại Shop Việt Thương Mussic",
        text: "Hello wordl",
        html: `<div><b>Bạn đã đặt hàng thành công</b></div>${listItem}`,
        attachments: attachImage,
    })
}

module.exports = {
    sendEmailCreateOrder
}