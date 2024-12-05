import nodemailer from 'nodemailer'
import { MailtrapTransport } from 'mailtrap'


export const transporter = nodemailer.createTransport(
  MailtrapTransport(
    {
      token: process.env.MAILTRAP_TOKEN,
      testInboxId: 3325100,
    }
  )
)

export const sender = {
  address: "hello@example.com",
  name: "Mailtrap Test",
};
export const recipients = [
  "shphm4668@gmail.com",
];

