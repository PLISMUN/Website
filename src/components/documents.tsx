import { FileText } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { documentGroups } from '@/config/documents'

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
                                    {group.documents.map((doc) => (
                                        <a
                                            key={doc.href}
                                            href={doc.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group"
                                        >
                                            <Card className="h-full gap-4 p-6 shadow-sm transition-shadow duration-300 ease-in-out hover:shadow-lg">
                                                <div className="flex items-start justify-between gap-3">
                                                    <FileText className="text-muted-foreground group-hover:text-foreground size-8 shrink-0 transition-colors" />
                                                    <Badge variant="secondary">PDF</Badge>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <h4 className="text-lg font-semibold">{doc.title}</h4>
                                                    <p className="text-muted-foreground">{doc.description}</p>
                                                </div>
                                            </Card>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
