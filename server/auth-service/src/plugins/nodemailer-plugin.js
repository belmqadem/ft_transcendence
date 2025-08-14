import fp from 'fastify-plugin';
import nodemailer from 'nodemailer';

function htmlTemplateWithCode(otpCode) {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Hello 👋</h2>
      <p>Your OTP code is:</p>
      <div style="font-size: 28px; font-weight: bold; letter-spacing: 4px; margin: 20px 0;">
        ${otpCode}
      </div>
      <p>This code expires in 5 minutes.</p>
      <p>If you didn't request this, you can ignore this email.</p>
      <p style="color: #888;">&copy; 2025 BHV Club</p>
    </div>
  `;
}


async function nodemailerPlugin(fastify) {

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASS)
        throw new Error('Missing Gmail credentials in environment');
    const transporterInstance = nodemailer.createTransport({
        service: 'gmail',
        auth : {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASS
        }
    })


    fastify.decorate('sendMail', async (otpCode, email) => {
        const mailOptions = {
            from: `${process.env.APP_NAME} <${process.env.APP_EMAIL}>`,
            to: `${email}`,
            subject: "Your OTP code",
            html: htmlTemplateWithCode(otpCode),
        }
        await transporterInstance.sendMail(mailOptions)
        .then((info) => {
            console.log("info: ", info);
            return info;
        })
        .catch(console.error);
    })
};

export default fp(nodemailerPlugin);
