"use client"
import type { ComponentProps, ReactNode } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useStages } from '@/features/access/context'
import type { PublicSiteConfig } from '@/features/site-config/schema'

/**
 * A price card's button, disabled while its stage is closed. In the browser rather than in Pricing, which is
 * built once for everyone, so it opens for someone with the access link.
 */
export function PricingButton({
    stage,
    href,
    variant,
    children,
}: {
    stage: keyof PublicSiteConfig['stages']
    href: string
    variant?: ComponentProps<typeof Button>['variant']
    children: ReactNode
}) {
    const stages = useStages()

    return (
        <Button asChild className="w-full" variant={variant} disabled={!stages[stage]}>
            <Link href={href}>{children}</Link>
        </Button>
    )
}
