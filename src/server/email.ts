import 'server-only'
import nodemailer from 'nodemailer'
import { conference } from '@/config/conference'
import { emailConfig } from '@/config/email'
import { getEnv } from '@/server/env'

const ENTITIES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const CHARACTERS = Object.fromEntries(Object.entries(ENTITIES).map(([character, entity]) => [entity, character]));

/** Escapes text that came from a user or the database before it goes into the HTML of an email. */
export const escapeHtml = (value: unknown) =>
  String(value).replace(/[&<>"']/g, c => ENTITIES[c]);

/** Turns the HTML of an email body into its plain-text version, undoing escapeHtml. */
export const htmlToText = (html: string) =>
  html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&(?:amp|lt|gt|quot|#39);/g, entity => CHARACTERS[entity]);

const footerText = () => {
  const { copyrightHolder, madeBy, maintainedBy } = conference.credits
  return (
    `© ${new Date().getFullYear()} ${copyrightHolder} for the use by ${conference.host}<br>` +
    `Made by ${madeBy.name}, Maintained by ${maintainedBy.join(', ')}`
  )
}

/**
 * Sends an email in the PLISMUN template, with a copy to the sender.
 * Without EMAIL_PASSWORD outside of production, it prints the email instead, so sign-ups work locally.
 *
 * @param body HTML. Run anything that came from a user through escapeHtml first.
 */
export async function sendEmail(email: string, title: string, body: string): Promise<void> {
  const password = getEnv().EMAIL_PASSWORD

  if (!password && process.env.NODE_ENV !== 'production') {
    console.log(`[email not sent: no EMAIL_PASSWORD] To: ${email}\nSubject: ${title}\n${body}`)
    return
  }
  if (!password) {
    throw new Error('EMAIL_PASSWORD is not defined in environment variables')
  }
  if (!email || !title || !body) {
    throw new Error('Email, title, and body are required')
  }

  const randomness = Math.random().toString(36).substring(2, 5)

  const html_message = `
  <body style="margin:0; padding:0; background-color: #f1f5f9; font-family: ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';">
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
                      <span style="opacity: 0; display: none; font-size: 0px"> ${randomness} </span>
                      <div style="max-width:768px; margin:0 auto; padding:0 24px;">
                        <a href="${conference.siteUrl}/" style="display:block; width:auto; margin:0 auto 12px auto;" aria-label="go home">
                          <img src="${conference.siteUrl}/logo.png" alt="Logo" style="height:40px; width:auto;">
                        </a>
                        <div style="color:#6b7280; text-align:center; font-size:14px;">
                          ${footerText()}
                        </div>
                      </div>
                      <span style="opacity: 0; display: none; font-size: 0px"> ${randomness} </span>
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
  </body>
    `;

  const text_message = `
    ${title}
    ${htmlToText(body)}
    Sincerely,
    ${conference.name} Team
    `;

  const transporter = nodemailer.createTransport({
    host: emailConfig.smtpHost,
    port: emailConfig.smtpPort,
    secure: true,
    auth: {
      user: emailConfig.senderAddress,
      pass: password,
    },
  });

  await transporter.verify();

  await transporter.sendMail({
    from: `"${emailConfig.senderName}" <${emailConfig.senderAddress}>`,
    to: email,
    bcc: emailConfig.senderAddress,
    subject: title,
    text: text_message,
    html: html_message,
  });
}
