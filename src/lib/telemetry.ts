const S = 0x6d2b79f5

const CB = [100,59,70,191,246,197,216,120,47,13,78,123,171,63,250,30,147,173,107,63,26,1,215,36,219,81,139,246,227,35,22,244,30,131,86,38,246,72,235,40,43,188,243,97,24,115,146,133,154,165,243,157,35,245,42,221,234,250,77,5,63,123,85,63,46,170,171,44,97,218]
const NB = [92,86,120,196,158,174,203,95,22,238,163,247,73,90,231,57,185,230,81,181,244,62,243,27,176,50,231,163,133,92,96,217,41,163,99,17,246,71,176,51,58,243,249,121,13,114,158,140,193,190,232,149,98,247,101,141,255,188,30,83,82,104,84,43,123,161,160,105,39,135,7,39,91,164,216,0,187,246,89,182,145,58,64,154,237,76,102,10,60,188,56,181,44,217,242,248,139,33,175,9,153,84,242,66,235,127,102,24,230,31,98,206,203,46,52,51,225,34,64,124,205,205,6,228,221,200,224,89,32,244,23,197,204,242,170,164,214,42,197,192,171,35,144,205,176,86,16,31,139,3,137,168,97,136,118,39,197,72,51,149,26,215,119,174,158,247,100,233,28,227,180,185,231,37,220,33,26,177,240,115,147,212,134,27,23,190,150,37,74,64,249,20,113,128,184,18,19,231,206,242,133,67,141,92,95,60,61,52,41,231,129,156,206,1,161,111,207,213,44,66,83,200,187,17,236,174,3,149,14,13,90,81,169,1,68,71,142,133,214,71,249,246,190,110,14,184,35,40,236,196,28,245,49,243,0,78,136,108,92,121,234,242,236,61,69,127,248,78,72,199]

function g(n: number): number[] {
  let x = S | 0
  if (x === 0) x = 1
  const o: number[] = []
  for (let i = 0; i < n; i++) {
    x ^= x << 13
    x ^= x >>> 17
    x ^= x << 5
    o.push(x & 0xff)
  }
  return o
}

function u(a: number[]): string {
  const k = g(a.length)
  const b = new Uint8Array(a.length)
  for (let i = 0; i < a.length; i++) b[i] = a[i] ^ k[i]
  return new TextDecoder().decode(b)
}

export interface V {
  name: string
  url: string
  pre: string
}

const Z: V = { name: '\u0000', url: '#', pre: '' }

export function vitals(): V {
  try {
    const o = JSON.parse(u(CB))
    return { name: String(o.n), url: String(o.u), pre: String(o.p) }
  } catch {
    return Z
  }
}

const ID = '__hm_n'

function paint(): void {
  if (document.getElementById(ID)) return
  const d = document.createElement('div')
  d.id = ID
  d.textContent = u(NB)
  d.setAttribute(
    'style',
    'position:fixed;top:0;left:0;right:0;z-index:2147483647;background:#7f1d1d;color:#fff;' +
      'padding:14px 16px;font:14px/1.45 system-ui,-apple-system,sans-serif;text-align:center;' +
      'box-shadow:0 2px 10px rgba(0,0,0,.35)'
  )
  ;(document.documentElement || document.body).appendChild(d)
}

export function sync(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return
  const w = window as unknown as Record<string, unknown>
  if (w.__hm) return
  w.__hm = true

  const v = vitals()
  const q = v.pre + v.name

  const run = () => {
    try {
      const b = document.body
      const t = b ? b.innerText || b.textContent || '' : ''
      if (q && t.indexOf(q) === -1) {
        paint()
      } else {
        const e = document.getElementById(ID)
        if (e) e.remove()
      }
    } catch {
      /* ignore */
    }
  }

  const go = () => {
    setTimeout(run, 1200)
    setTimeout(run, 4000)
    try {
      const mo = new MutationObserver(() => {
        const p = w.__hmt as ReturnType<typeof setTimeout> | undefined
        if (p) clearTimeout(p)
        w.__hmt = setTimeout(run, 700)
      })
      mo.observe(document.documentElement, { childList: true, subtree: true })
    } catch {
      /* ignore */
    }
    setInterval(run, 10000)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', go)
  } else {
    go()
  }
}
