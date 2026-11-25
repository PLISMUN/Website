import { afterEach, describe, expect, it, vi } from 'vitest'
import { keepParams, withParams } from '@/lib/url-params'

describe('keeping query parameters across a redirect', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('adds the current parameters to where someone is sent', () => {
    expect(withParams('/user/dashboard', '?access=secret&utm_source=mail')).toBe('/user/dashboard?access=secret&utm_source=mail')
  })

  it('lets the destination’s own parameters win', () => {
    expect(withParams('/user/signup?next=%2Fuser%2Fpayment', '?next=/user/applications&access=x')).toBe(
      '/user/signup?next=%2Fuser%2Fpayment&access=x'
    )
  })

  it('keeps a parameter that appears more than once, and the hash', () => {
    expect(withParams('/faq#venue', '?tag=a&tag=b')).toBe('/faq?tag=a&tag=b#venue')
  })

  it('never sends the parameters to another site', () => {
    expect(withParams('https://example.com/x', '?access=secret')).toBe('https://example.com/x')
    expect(withParams('//example.com/x', '?access=secret')).toBe('//example.com/x')
  })

  it('drops ?next= after signing in, since that’s where the redirect goes', () => {
    vi.stubGlobal('window', { location: { search: '?next=%2Fuser%2Fsupervisor%2Fapply&access=secret' } })
    expect(keepParams('/user/supervisor/apply')).toBe('/user/supervisor/apply?access=secret')
  })
})
