// The access link: /?access=<password> opens everything that's closed under "What's open" for whoever has it,
// so someone can sign up or apply late. Admins change the password on the Settings page, which also copies the link.
//
// This default is in the public repository, so anyone can find it: change it on the Settings page before relying
// on it. A password saved there is only ever seen by admins and by the server.
export const access = {
  password: 'IWannaApplyForPlismun',
}
