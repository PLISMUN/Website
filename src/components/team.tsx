import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const members = [
    { src: 'https://avatars.githubusercontent.com/u/47919550?v=4', name: 'Igor Zajac', role: 'Secretary General' },
    { src: 'https://avatars.githubusercontent.com/u/31113941?v=4', name: 'David Bouck', role: 'Deputy Secrutary General, Admissions, Finance' },
    { src: 'https://avatars.githubusercontent.com/u/68236786?v=4', name: 'Vic Maceckova', role: 'Chief of Staff' },
    { src: 'https://avatars.githubusercontent.com/u/23456789?v=4', name: 'Tomáš Stoklásek ', role: 'Head of IT & Website' },
    { src: 'https://avatars.githubusercontent.com/u/99137927?v=4', name: 'Aoife McCormick ', role: 'Head of Research' },
    { src: 'https://avatars.githubusercontent.com/u/12345678?v=4', name: 'Klara Elisa Müller', role: 'Head of Admins' },
    { src: 'https://avatars.githubusercontent.com/u/34567890?v=4', name: 'Amira Tabasaranskaya', role: 'Head of Social Media/Press' },
    { src: 'https://avatars.githubusercontent.com/u/45678901?v=4', name: 'Elodie Wray', role: 'Head of Catering & Venue' },
    { src: 'https://avatars.githubusercontent.com/u/56789012?v=4', name: 'Lilly Ann Hohmann', role: 'Head of Merchandise & Design' },
    { src: 'https://avatars.githubusercontent.com/u/47919550?v=4', name: 'Thomas Michael Hill', role: 'Head of Social Media' },
    { src: 'https://avatars.githubusercontent.com/u/31113941?v=4', name: 'Mariya Krykhtina', role: 'Head of Photography' },
    { src: 'https://avatars.githubusercontent.com/u/68236786?v=4', name: 'Vera Motrenko', role: 'Head of Finance' },
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
