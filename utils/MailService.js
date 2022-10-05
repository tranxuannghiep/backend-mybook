const nodemailer = require("nodemailer");

class MailService {
  static init() {
    this.transportor = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
      secure: true,
    });
  }
  static async sendMail(to, subject, text, html) {
    await this.transportor.sendMail({ to, subject, text, html });
  }
}

module.exports = MailService;
