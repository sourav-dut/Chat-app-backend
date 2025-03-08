import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: "dustbinpaul99@gmail.com",
    pass: "kqss ymda wenz gkeu",
  },
});

export const sendMail = async(receiverEmail,subject,body) => {
    await transporter.sendMail({
    from: process.env.EMAIL,
    to: receiverEmail,
    subject: subject,
    html: body
  });
};
