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
        // text: `Your OTP code is: ${otpCode}. It will expire in 10 minutes.`,
        html: `
        <div style="
            text-align: center;
            background-color: #fff;
            box-shadow: 5px 5px 10px #8ca0aa;
            border-radius: 5px;
            padding: 20px;
            font-family: Arial, sans-serif;
        ">
            <p style="font-size: 18px; color: #333;">الكود الخاص بك هو</p>
            <p style="font-size: 24px; color: #000; font-weight: bold;">${otpCode}</p>
            <p style="font-size: 14px; color: #555;">.سوف تنتهى صلاحيته خلال 10 دقائق</p>
        </div>
    `
      };
    
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log('Email sent: ' + info.response);
      });
}