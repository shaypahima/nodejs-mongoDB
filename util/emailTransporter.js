import nodemailer from 'nodemailer'
import { MailtrapTransport } from 'mailtrap'

const transport = nodemailer.createTransport(
  MailtrapTransport(
    {
      token: process.env.MAILTRAP_TOKEN,
      testInboxId: 3325100,
    }
  )
)

const sender = {
  address: "NodejsPractice@jsIsAwesome.com",
  name: "Reset Password",
};



export const sendAnEmail = async (recipient, content, subject) => {
  try {
    await transport.sendMail({
      from: sender,
      to: recipient,
      subject,
      html: content, // Use this if sending an HTML email
      sandbox: true
    })

  } catch (error) {
    console.log(error);
  }
}


export const sendResetPasswordEmail = async (recipient, userKey) => {
  try {

    const subject = 'Reset Your Password'
    const htmlContent = `
      <h1>Password Reset Request</h1>
      <p>Hello,</p>
      <p>Please click the following link to reset your password:</p>
      <a href="http://localhost:3000/reset-password/${userKey}">Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>
    `;

    await sendAnEmail(recipient,htmlContent,subject)

  } catch (error) {
    console.log(error);
  }
}




