require('dotenv').config();
const nodeMailer = require('nodemailer');

const transporter = nodeMailer.createTransport({
    service: 'hotmail',
    auth:{
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

function sendMail(coupon, mailTarget){
    const mailOptions= {
        from: process.env.EMAIL,
        to: mailTarget,
        subject: 'Your coupon from spin wheel',
        text: `Hello we send you your coupon ${coupon}`
    }
    
    transporter.sendMail(mailOptions)
}

module.exports = {sendMail}; 