import { Fragment } from 'react'
import { about } from '@/config/about'

export default function AboutSection() {
    return (
        <section>
            <div className="pt-24">
                <div className="mx-auto w-full max-w-5xl px-6">
                    <div className="@container mx-auto max-w-2xl">
                        <div>
                            <h2 className="text-foreground text-4xl font-semibold">{about.heading}</h2>
                            <p className="text-muted-foreground mb-12 mt-4 text-xl">
                                {about.paragraphs.map((paragraph, index) => (
                                    <Fragment key={index}>
                                        {index > 0 && <><br /><br /></>}
                                        {paragraph}
                                    </Fragment>
                                ))}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
