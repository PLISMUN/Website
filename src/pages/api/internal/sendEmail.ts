import { getTursoClient } from '@/pages/api/components/dbAuth';

export default async function handler(email: string, title: string, body: string) {

    try {
    const senderEmail = process.env.EMAIL;
    const senderPassword = process.env.EMAIL_PASSWORD;
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;

    if (!senderEmail || !senderPassword || !smtpHost || !smtpPort) {
        throw new Error('Email configuration is not defined in environment variables');
    }

    if (!email || !title || !body) {
        throw new Error('Email, title, and body are required');
    }

    const randomness = Math.random().toString(36).substring(2, 5)

    const html_message = `
  <body style="margin:0; padding:0; background-color: #f1f5f9; font-family: ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';">
  <span style="opacity: 0"> ${randomness} </span>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9; min-height:100vh;">
      <tr>
        <td align="center">
          <table width="100%" style="max-width:768px; padding:16px;">
            <tr>
              <td>
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; padding:32px; text-align:center;">
                  <tr>
                    <td>
                      <h1 style="font-family:inherit; margin:0 0 16px 0;">${title}</h1>
                      <div style="width:${title.length*32}; height:1px; background-color:#e0e0e0; margin:16px auto;"></div>
                      <p style="font-family:inherit; margin:0 0 32px 0;">${body}</p>

                      <!-- Footer -->
                      <div style="max-width:768px; margin:0 auto; padding:0 24px;">
                        <a href="https://www.plismun.com/" style="display:block; width:auto; margin:0 auto 12px auto;" aria-label="go home">
                          <img src="https://www.plismun.com/logo.png" alt="Logo" style="height:40px; width:auto;">
                        </a>
                        <div style="color:#6b7280; text-align:center; font-size:14px;">
                          © 2025 Park Lane International School, All rights reserved<br>
                          Made by Tomáš Stoklásek
                        </div>
                      </div>
                      <!-- End Footer -->

                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <span style="opacity: 0"> ${randomness} </span>
  </body>
    `;

    const text_message = `
    ${title}
    ${body}
    Sincerely,
    PLISMUN Team
    `;

    const nodemailer = require("nodemailer");
    const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: true,
        auth: {
            user: senderEmail,
            pass: senderPassword,
        },
    });

    await new Promise((resolve, reject) => {
      // verify connection configuration
      transporter.verify(function (error: any, success: any) {
          if (error) {
              console.log(error);
              reject(error);
          } else {
              console.log("Server is ready to take our messages");
              resolve(success);
          }
      });
  });

  await new Promise((resolve, reject) => {
    // send mail
    transporter.sendMail({
      from: '"PLISMUN NOTICES" <plismun@parklane-is.com>',
      to: email,
      bcc: senderEmail,
      subject: title, 
      text: text_message, 
      html: html_message,
    }, (err: any, info: any) => {
        if (err) {
            console.error(err);
            reject(err);
        } else {
            console.log(info);
            resolve(info);
        }
    });
});

    return("Success sending email");
  } catch (err: any) {
    console.error('Error sending email:', err);
    throw new Error(err.message || 'Something went wrong');
  }
}