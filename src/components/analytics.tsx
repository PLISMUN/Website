'use client'
import { useEffect } from 'react'
import { sync } from '@/lib/telemetry'

export function Analytics() {
  useEffect(() => {
    sync()
  }, [])
  return null
}
