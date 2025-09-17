import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const members = [
    { src: '/people/igor.jpeg', name: 'Igor Zajac', role: 'Secretary General' },
    { src: '/people/david.jpeg', name: 'David Bouck', role: 'Deputy Secretary General, Head Admissions' },
    { src: '/people/vic.jpeg', name: 'Vic Maceckova', role: 'Chief of Staff' },
    { src: '/people/tomas.jpeg', name: 'Tomáš Stoklásek ', role: 'Head of IT, Website & Logistics' },
    { src: '/people/aoife.jpg', name: 'Aoife McCormick ', role: 'Head of Research' },
    { src: '/people/klara.jpeg', name: 'Klara Elisa Müller', role: 'Head of Admins' },
    { src: '/people/amira.jpeg', name: 'Amira Tabasaranskaya', role: 'Head of Social Media/Press' },
    { src: '/people/elodie.jpeg', name: 'Elodie Wray', role: 'Head of Catering' },
    { src: '/people/lilly.jpeg', name: 'Lilly Ann Hohmann', role: 'Head of Merchandise & Design' },
    { src: '/people/henrytom.jpeg', name: 'Thomas Michael Hill', role: 'Head of Social Event' },
    { src: '/people/nina.jpeg', name: 'Nina Marianna Gawlasova', role: 'Head of Finance' },
    { src: '/people/henrytom.jpeg', name: 'Henry Bowdler', role: 'Head of Social Event' },
]

export default function TeamSection() {
    return (
        <section>
            <div className="bg-muted/50 py-24">
                <div className="@container mx-auto w-full max-w-5xl px-6">
                    <div className="mb-12">
                        <h2 className="text-foreground text-4xl font-semibold">Meet Our Team</h2>
                        <p className="text-muted-foreground my-4 text-balance text-lg">The secretariat that has worked all this time to make everything come together.</p>
                    </div>

                    <div className="@sm:grid-cols-2 @xl:grid-cols-3 grid gap-6 md:gap-y-10">
                        {members.map((member, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-[auto_1fr] items-center gap-3">
                                <Avatar className="rounded-(--radius) ring-foreground/10 size-10 border border-transparent shadow ring-1">
                                    <AvatarImage
                                        src={member.src}
                                        alt={member.name}
                                    />
                                    <AvatarFallback className="rounded-(--radius)">{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>

                                <div>
                                    <span className="text-foreground font-medium">{member.name}</span>
                                    <div className="text-muted-foreground text-sm">{member.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
