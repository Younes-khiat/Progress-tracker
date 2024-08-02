const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    //remember to modify this ----------------------------------------------------------
    service: 'your_email_service',
    auth: {
      user: 'your_email',
      pass: 'your_email_password'
    }
  });

  const mailOptions = {
    from: 'your_email',//remember to modify this --------------------------------------
    to: to,
    subject: subject,
    text: text
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
