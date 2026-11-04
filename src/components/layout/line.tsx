'use client'
import { useEffect } from 'react'
import { vitals, sync } from '@/lib/telemetry'

export function Line() {
  const v = vitals()
  useEffect(() => {
    sync()
  }, [])
  return (
    <>
      {v.pre}
      <a className="underline" href={v.url}>
        {v.name}
      </a>
    </>
  )
}
