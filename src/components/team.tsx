import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

const members = [
    { src: '/people/igor.jpeg', name: 'Igor Zajac', role: 'Secretary General', description: 'Hello everyone! My name is Igor Zajac and I am the Secretary General of PLISMUN 2026. Having gone to ten conferences, I am an experienced Model United Nations Delegate. I am excited by the opportunity to organise this conference. My role is to oversee departments progress and coordinate them to make PLISMUN both impactful and memorable. This year, with special committees such as the historical world health organisation and the crisis committee, the organising team has been working hard to provide the best experience. PLISMUN 2026 is a great opportunity for both new and experienced delegates.' },
    { src: '/people/david.jpeg', name: 'David Bouck', role: 'Deputy Secretary General, Head Admissions', description: 'Hello everyone! My name is David Bouck and I am the Deputy Secretary-General of PLISMUN 2026. Throughout my MUN journey, I have attended 11 conferences, each of which I thoroughly enjoyed and found intellectually enriching. I am thrilled to have the opportunity to help make PLISMUN 2026 as remarkable and impactful as it has always been, with an extra touch of excellence. It has been incredibly rewarding to be part of the hardworking team behind the scenes, an experience you don’t often get as a delegate. One of my favourite parts of this role is the logistical side, transforming blank pieces of paper into actions that shape real events. Some of the most notable MUNs I have attended include conferences at the United Nations Headquarters in New York City and in The Hague, Netherlands, both of which were incredible. I hope you will enjoy this conference as much as I will, and I look forward to welcoming you all to PLISMUN 2026!' },
    { src: '/people/vic.jpeg', name: 'Vic Maceckova', role: 'Chief of Staff', description: 'Fellow delegates and dear readers, my name is Victoria Macečková and it is my pleasure to be a part of the PLISMUN’26 organisation team. This year I am the Chief of Staff, which has thus far been my greatest role in the PLISMUN organisational team since joining in 2023 and I therefore take great pride in this opportunity. My job entails me guiding different departments to carrying out their specific tasks, which when combined will hopefully create a successful conference in February. My favourite part about my role is that whilst working alongside all the different departments, I have the chance to see all the hard work that it takes to produce our conference. So far, I have attended conferences as both a delegate and an admin in the Czech Republic and also abroad in Poland. Alongside MUN conferences, I dance competitively and I also enjoy spending time with my friends and family. With that being said, I wish everybody a wonderful conference and I look forward to seeing all of you!' },
    { src: '/people/tomas.png', name: 'Tomáš Stoklásek ', role: 'Heya! I am Tomas (or Milo) and this year I am in charge of rewriting all of our our online systems (aka website, design language, programming, databases, etc. Full stack development) as well as helping with general managment & logistics & social media. I hold myself to the same standards as the Prague city officials, so expect any bug fixes to come in 5-47 business days :3.  This is my second year in the organising team, however I have been active in the MUN community for a while, pocketing myself multiple awards even though I usually try to focus on creating funny moments. Apart from MUN, you can find me hanging out with friends, programming, or watching House M.D with the occasional video game or game of tennis. I really hope that the conference will go well with as little tech issues as possible, fingers crossed. See you there and enjoy!' },
    { src: '/people/aoife.jpg', name: 'Aoife McCormick ', role: 'Head of Research', description: 'Hey everyone, my name is Aoife McCormick and I am glad to be head of research for PLISMUN 26. MUN has been a long lasting interest of mine, having participated in over 9 MUNs and helped organising PLISMUN since 2024. We had quite a large research team this year, and we truly did our best to propose unique and interesting topics. I hope everyone found atleast one committee wich peaked their interest. I hope to attend PLISMUN 26, despite having moved away from prague, to see all these fruitful debates in action. Outside of MUN, I enjoy spending time with friends and drawing. ' },
    { src: '/people/klara.jpeg', name: 'Klara Elisa Müller', role: 'Head of Admins', description: 'Hello! My name is Klara Muller and I am thankful to be the Head of Admins at PLISMUN26! I started my model UN journey as an admin in 2023, where I passed notes during conferences and set up snack tables for the delegates. Since then I have loved mun and its welcoming community. My role is to lead the Admins and make sure the conference runs smoothly, and I hope that the Admin team is helpful to everyone, from passing notes within committees to serving the delegates refreshments. In my free time, I love to read, dance and spend time with family and friends. I look forward to seeing the debates in motion and I hope everyone enjoys the conference as much as I do!' },
    { src: '/people/amira.jpeg', name: 'Amira Tabasaranskaya', role: 'Head of Social Media/Press', description: 'Hi everyone! My name is Amira Tabasaranskaya and it is my utmost pleasure to be a part of the organisation team for PLISMUN26. This year, I am honored to be the Head of Social Media. I have been involved in MUN as a delegate since 2022 where I have participated in 6 conferences, and have beed a part of the PLISMUN organisational team since 2024. Alongside MUN, I enjoy spending time with friends and family as well as - .  I hope everyone will have a great time during this years conference ande cant wait to see you all there!' },
    { src: '/people/elodie.jpeg', name: 'Elodie Wray', role: 'Head of Catering', description: 'Hey everyone! My name is Elodie Wray and I am this years Head of Catering and Venues. Helping to organise PLISMUN26 has been so fulfilling, and I’m extremely grateful to be working with such a extraordinary team. Its my job to find and book venues for the conference, as well as ensuring everybody recieves delicious meals and snacks - delegates will need quality food to keep their energy up! I know from experience how tiring debating can be. I’ve been participating in MUN since 2023, first as an admin and then as a delegate, and I’ve enjoyed all of my roles thoroughly. In my free time, I love to sketch, and I also love spending time with my sister and hanging out with my friends. I truly hope everybody has a wonderful time at our conference, filled with fruitful debate and joy :)' },
    { src: '/people/lilly.jpeg', name: 'Lilly Ann Hohmann', role: 'Head of Merchandise & Design', description: 'Hi guys! My name is Lilly and I am the Head of Design and Merchandise. I am in charge of coordinating the designs of most of your PLISMUN26 ammenities and ordering them too, and this job has been incredible to work on with the rest of the PLISMUN team to make this an amazing year for everyone attending. I hope you all like the designs made with my lovely team! Ive been a part of MUN since 2023, where I worked as an admin in PLISMUN23, and ever since then Ive thoroughly enjoyed participating in MUNs in any way possible. Ive participated in around 9 conferences and each has bee an interesting and enriching experience. Alongside MUN, I love drawing, spending time with friends, reading, and horse riding. I hope everyone attending has an an unforgettable time at this PLISMUN, filled with new friends, fun punishments, and fruitful debates! :D' },
    { src: '/people/henrytom.jpeg', name: 'Thomas Michael Hill', role: 'Head of Social Event', description: 'Hello everyone! Im Tom and this year my main role is co-head of Social Event with my good friend Henry, as well as helping with the admissions, research and social media teams. I have been doing MUN for a while now (11 conferences) and cannot wait for this years edition of the plismun conference and I hope everyone will enjoy the social event! Outside of MUN and school, I enjoy playing tennis every week as well as hanging out with my friends. Enjoy your time at Plismun!' },
    { src: '/people/nina.jpeg', name: 'Nina Marianna Gawlasova', role: 'Head of Finance', description: 'Hi everyone! My name is Nina Gawlasova and I am the Head of Finance for PLISMUN ’26. My role mainly consists of budgeting and sending emails. I am so grateful to have such an opportunity, and to be able to work alongside the amazing organisation team. My MUN journey actually began at PLISMUN in the year 2023, where I started out as an admin and have since continued as a delegate. Outside of MUN my hobbies are horse riding, math (clearly), and reading. I wish you all good luck at the conference and hope to see you there!' },
    { src: '/people/henrytom.jpeg', name: 'Henry Bowdler', role: 'Head of Social Event', description: 'Hey there everyone! Im Henry and I will be your other co-head of Social Event this year and will also be taking a major role within the admission and research team. I have had quite a lengthy MUN career, spanning over around 11 conferences, however I have only ever chaired once, unfortunately. This will be my first time having a larger role in the organisation of my own schools conference yet after witnessing several of my friends take on these roles in their own respective conferences, it is definitely an opportunity that I am looking forward to and that I am grateful for. Outside of MUN, I enjoy socialising, reading, painting, or taking part in any sort of artistic activity. I have the firm belief that the conference will be spectacular and I hope that it will have a lasting effect on all the delegates which attend!' },
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
                                    <HoverCard>
                                        <HoverCardTrigger>
                                            <div className='grid grid-cols-[auto_1fr] items-center gap-3 cursor-pointer'>
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
                                        </HoverCardTrigger>
                                        <HoverCardContent className="w-100 min-h-50">
                                            <div>
                                                <Avatar className="rounded-(--radius) ring-foreground/10 size-40 border border-transparent shadow ring-1 float-left mr-4 mb-2">
                                                <AvatarImage src={member.src} />
                                                <AvatarFallback className="rounded-(--radius)">{member.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <h4 className="text-sm font-semibold">{member.name}</h4>
                                                <div className="text-muted-foreground text-xs">{member.role}</div>
                                                <p className="text-sm mt-1">
                                                {member.description}
                                                </p>
                                            </div>
                                        </HoverCardContent>
                                    </HoverCard>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
