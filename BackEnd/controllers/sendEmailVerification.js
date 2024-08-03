const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    //remember to modify this ----------------------------------------------------------
    service: 'houhou@gmail.com',
    auth: {
      user: 'user',
      pass: 'pass'
    }
  });

  const mailOptions = {
    from: 'coucou@gmail.com',//remember to modify this --------------------------------------
    to: to,
    subject: subject,
    text: text
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
