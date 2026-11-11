// The account the site sends its emails from. Its password is EMAIL_PASSWORD in the environment.
//
// These stay in code on purpose and aren't on the Settings admin page: the site signs in to whatever
// server is named here with EMAIL_PASSWORD, so anyone who could change the host could collect the password.
export const emailServer = {
  smtpHost: 'smtp.gmail.com',
  smtpPort: 465,
  senderAddress: 'plismun@parklane-is.com',
}

// What admins can change on the Settings page
export const email = {
  senderName: 'PLISMUN NOTICES',
}
