import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
    }
});
export async function sendResetEmail(to, token){
    const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to, subject:'Reset your password',
    html:`<p>Click <a href="${link}">here</a> to reset. Expires in 1 hour.</p>`
    });
}
