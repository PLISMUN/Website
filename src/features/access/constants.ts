// The access link opens everything that's closed under "What's open" on the Settings page, for whoever has it.
// Its password is the access section of the settings (src/config/access.ts).

/** The query parameter an access link carries its password in: /?access=… */
export const ACCESS_PARAM = 'access'

/**
 * Where the browser keeps the password once a link has been opened, until the browser is closed, so it keeps
 * working on pages reached without it in the address. Read by the server too (src/server/access.ts).
 */
export const ACCESS_COOKIE = 'plismun_access'

/** The link to share, for a password and the address of the site. */
export const accessLink = (origin: string, password: string) =>
  `${origin.replace(/\/+$/, '')}/?${ACCESS_PARAM}=${encodeURIComponent(password)}`
