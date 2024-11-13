import nodemailer from 'nodemailer'
import dotenv from 'dotenv';
dotenv.config();

export const sendEmail=(email,otpCode)=>{
    const transporter=nodemailer.createTransport({
        service:'gmail',
        auth: {
            user:process.env.EMAIL_USER, 
            pass:process.env.EMAIL_PASSWORD
        },
    })

    const mailOptions = {
        from: 'Forira',
        to: email,
        subject: 'Password Reset Code',
        text: `Your OTP code is: ${otpCode}. It will expire in 10 minutes.`
      };
    
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log('Email sent: ' + info.response);
      });
}