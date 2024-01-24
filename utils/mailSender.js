import nodemailer from "nodemailer";

const mailSender = async (email, title, body) => {
  try {
    // Create a Transporter to send emails
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER, // Your Gmail email address
        pass: process.env.MAIL_PASS, // Your Gmail app password (generate one in your Google account settings)
      },
    });

    // Send emails to users
    let info = await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: title,
      html: body,
    });

    console.log("Email info: ", info);
    return info;
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error; // Re-throw the error so that the calling function can handle it if needed
  }
};

export default mailSender;
