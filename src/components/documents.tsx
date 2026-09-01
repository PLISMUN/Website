import fs from 'node:fs'
import path from 'node:path'

import { FileText } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { documentGroups, type DocumentEntry } from '@/config/documents'

// Both pages that render this section are statically prerendered, so this runs
// at build time: a PDF dropped into public/documents/ turns its card into a
// working link on the next build, with no config change.
function isAvailable(doc: DocumentEntry): boolean {
    try {
        return fs.existsSync(path.join(process.cwd(), 'public', doc.href))
    } catch {
        return false
    }
}

function DocumentCard({ doc }: { doc: DocumentEntry }) {
    return (
        <Card className="h-full gap-4 p-6 shadow-sm transition-shadow duration-300 ease-in-out group-hover:shadow-lg">
            <div className="flex items-start justify-between gap-3">
                <FileText className="text-muted-foreground group-hover:text-foreground size-8 shrink-0 transition-colors" />
                <Badge variant="secondary">PDF</Badge>
            </div>

            <div className="space-y-1.5">
                <h4 className="text-lg font-semibold">{doc.title}</h4>
                <p className="text-muted-foreground">{doc.description}</p>
            </div>
        </Card>
    )
}

function UnavailableCard({ doc }: { doc: DocumentEntry }) {
    return (
        <div className="relative cursor-not-allowed select-none" aria-disabled="true">
            {/* pb-16 reserves a clear band at the bottom for the stamp, so it
                never lands on top of the title. */}
            <Card className="bg-muted/30 h-full p-6 pb-16 shadow-none">
                {/* Dimmed hard enough that the stamp reads cleanly on top of it. */}
                <div className="space-y-4 opacity-35">
                    <div className="flex items-start justify-between gap-3">
                        <FileText className="size-8 shrink-0" />
                        <Badge variant="outline">PDF</Badge>
                    </div>

                    <div className="space-y-1.5">
                        <h4 className="text-lg font-semibold">{doc.title}</h4>
                        <p className="text-muted-foreground">{doc.description}</p>
                    </div>
                </div>
            </Card>

            {/* preserveAspectRatio="none" stretches the line corner to corner
                whatever the card ends up measuring; non-scaling-stroke keeps it
                an even 1.5px instead of being stretched with the viewBox. */}
            <svg
                className="text-muted-foreground/60 pointer-events-none absolute inset-0 size-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            </svg>

            <span className="pointer-events-none absolute inset-x-0 bottom-5 flex justify-center">
                <span className="bg-background text-muted-foreground rounded-md border px-3 py-1.5 text-xs font-semibold uppercase tracking-widest shadow-sm">
                    Unavailable
                </span>
            </span>
        </div>
    )
}

// `compact` drops the extra top padding that clears the fixed header, for when
// this section is embedded below another one rather than opening a page.
export default function Documents({ compact = false }: { compact?: boolean }) {
    const groups = documentGroups.filter((group) => group.documents.length > 0)

    return (
        <section>
            <div className={cn(compact ? 'py-24' : 'pb-24 pt-32')}>
                <div className="mx-auto max-w-5xl px-6">
                    <div>
                        <h2 className="text-foreground text-4xl font-semibold">Documents</h2>
                        <p className="text-muted-foreground mb-12 mt-4 text-balance text-lg">Study guides, the rules of procedure, and everything else you need to read before the conference.</p>
                    </div>

                    <div className="space-y-16">
                        {groups.map((group) => (
                            <div key={group.heading}>
                                <h3 className="text-foreground text-2xl font-semibold">{group.heading}</h3>
                                <p className="text-muted-foreground mt-2 text-lg">{group.blurb}</p>

                                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {group.documents.map((doc) =>
                                        isAvailable(doc) ? (
                                            <a
                                                key={doc.href}
                                                href={doc.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group"
                                            >
                                                <DocumentCard doc={doc} />
                                            </a>
                                        ) : (
                                            <UnavailableCard key={doc.href} doc={doc} />
                                        )
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
