// Redirects keep the query parameters of the page they leave, so something like ?access= or ?utm_source=
// isn't lost on the way to the next page.

// Where to go after signing in. Spent by the redirect itself, so not carried on to where it leads
const REDIRECT_PARAMS = ['next', 'callbackUrl']

/**
 * href with the parameters in search added. The href's own parameters win, and ones named in except are
 * left out. Only for links within the site: any other href is returned as it is, so the parameters never go
 * to another site.
 */
export function withParams(href: string, search: string, { except = [] }: { except?: string[] } = {}): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href

  const url = new URL(href, 'http://site.invalid')
  const own = new Set(url.searchParams.keys())
  for (const [key, value] of new URLSearchParams(search)) {
    if (!own.has(key) && !except.includes(key)) url.searchParams.append(key, value)
  }
  return url.pathname + url.search + url.hash
}

/**
 * Where to redirect someone from this page: href with this page's query parameters kept, except ?next=,
 * which is where they're being sent. Only in the browser, like in an event handler or effect.
 */
export const keepParams = (href: string) => withParams(href, window.location.search, { except: REDIRECT_PARAMS })
