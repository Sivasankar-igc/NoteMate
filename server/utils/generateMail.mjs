import Nodemailer from "nodemailer";

const transporter = Nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.SENDER_EMAIL_ACCOUNT,
        pass: process.env.APP_PASSWORD
    }
})

export const sendMail = (mailId, username, message) => {
    const mailOptions = {
        from: {
            name: username,
            address: mailId
        },
        to: "sahoosivasankar33@gmail.com",
        subject: "Message From NoteMate User",
        html: `
        <h1>EmailId : ${mailId}</h1>
        <h1>Name : ${username}</h1>
        <h1>Message : </h1><p>${message}</p>
        `
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error(`Server Error : mail couldn't be sent--> ${error}`);
        } else {
            sendReply(mailId, username, message)
        }
    });
}


const sendReply = (mailId, username, message) => {
    const mailOptions = {
        from: {
            name: "NoteMate",
            address: "sahoosivasankar33@gmail.com"
        },
        to: mailId,
        subject: "Thank You for Contacting Us!",
        html: `
        <body style="font-family: Arial, sans-serif; line-height: 1.6;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px;">
                <tr>
                    <td style="padding: 10px 0; text-align: center;">
                        <h2>Thank You for Contacting Us!</h2>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 10px 0;">
                        <p>Dear <strong>${username}</strong>,</p>
                        <p>Thank you for reaching out to us! We have received your message and appreciate you taking the time to get in touch.</p>
                        <p><strong>Your Message:</strong></p>
                        <blockquote style="background: #f9f9f9; border-left: 10px solid #ccc; margin: 10px 0; padding: 10px;">
                            ${message}
                        </blockquote>
                        <p>We value every piece of feedback we receive. One of our team members will review your message and get back to you as soon as possible, typically within 48 hours.</p>
                        <p>In the meantime, if you have any additional questions or need immediate assistance, please feel free to reply to this email or contact us directly at <a href="mailto:sahoosivasankar33@gmail.com">sahoosivasankar33@gmail.com</a>.</p>
                        <p>Thank you again for contacting us. We look forward to assisting you!</p>
                        <p>Best regards,</p>
                        <p>
                            Siva Sankar Sahoo<br>
                            Founder and CEO<br>
                            NoteMate<br>
                            <a href="mailto:sahoosivasankar33@gmail.com">sahoosivasankar33@gmail.com</a><br>
                            <a href="https://notemate-uwix.onrender.com/">notemate</a>
                        </p>
                    </td>
                </tr>
            </table>
        </body>
        `
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error(`Server Error : reply mail couldn't be sent--> ${error}`);
        } else {
            return true
        }
    });
}