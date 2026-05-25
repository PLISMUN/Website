import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

const members = [
    { src: '/people/david.jpeg', name: 'David Bouck', role: 'Secretary General', description: 'Hello everyone! My name is David Bouck and I am the Deputy Secretary-General of PLISMUN 2026. Throughout my MUN journey, I have attended 11 conferences, each of which I thoroughly enjoyed and found intellectually enriching. I am thrilled to have the opportunity to help make PLISMUN 2026 as remarkable and impactful as it has always been, with an extra touch of excellence. It has been incredibly rewarding to be part of the hardworking team behind the scenes, an experience you don’t often get as a delegate. One of my favourite parts of this role is the logistical side, transforming blank pieces of paper into actions that shape real events. Some of the most notable MUNs I have attended include conferences at the United Nations Headquarters in New York City and in The Hague, Netherlands, both of which were incredible. I hope you will enjoy this conference as much as I will, and I look forward to welcoming you all to PLISMUN 2026!' },
    { src: '/people/nina.jpeg', name: 'Nina Marianna Gawlasova', role: 'Deputy Secretary General', description: 'Hi everyone! My name is Nina Gawlasova and I am the Head of Finance for PLISMUN ’26. My role mainly consists of budgeting and sending emails. I am so grateful to have such an opportunity, and to be able to work alongside the amazing organisation team. My MUN journey actually began at PLISMUN in the year 2023, where I started out as an admin and have since continued as a delegate. Outside of MUN my hobbies are horse riding, math (clearly), and reading. I wish you all good luck at the conference and hope to see you there!' },
    { src: '/people/elodie.jpeg', name: 'Elodie Wray', role: 'Chief of Staff', description: 'Hey everyone! My name is Elodie Wray and I am this years Head of Catering and Venues. Helping to organise PLISMUN26 has been so fulfilling, and I’m extremely grateful to be working with such a extraordinary team. Its my job to find and book venues for the conference, as well as ensuring everybody recieves delicious meals and snacks - delegates will need quality food to keep their energy up! I know from experience how tiring debating can be. I’ve been participating in MUN since 2023, first as an admin and then as a delegate, and I’ve enjoyed all of my roles thoroughly. In my free time, I love to sketch, and I also love spending time with my sister and hanging out with my friends. I truly hope everybody has a wonderful time at our conference, filled with fruitful debate and joy :)' },
    { src: '/people/lilly.jpeg', name: 'Lilly Ann Hohmann', role: 'Chief of Staff', description: 'Hi guys! My name is Lilly and I am the Head of Design and Merchandise. I am in charge of coordinating the designs of most of your PLISMUN26 ammenities and ordering them too, and this job has been incredible to work on with the rest of the PLISMUN team to make this an amazing year for everyone attending. I hope you all like the designs made with my lovely team! Ive been a part of MUN since 2023, where I worked as an admin in PLISMUN23, and ever since then Ive thoroughly enjoyed participating in MUNs in any way possible. Ive participated in around 9 conferences and each has bee an interesting and enriching experience. Alongside MUN, I love drawing, spending time with friends, reading, and horse riding. I hope everyone attending has an an unforgettable time at this PLISMUN, filled with new friends, fun punishments, and fruitful debates! :D' },
    { src: '/people/henrytom.jpeg', name: 'Thomas Michael Hill', role: 'PGA, Social Event', description: 'Hello everyone! Im Tom and this year my main role is co-head of Social Event with my good friend Henry, as well as helping with the admissions, research and social media teams. I have been doing MUN for a while now (11 conferences) and cannot wait for this years edition of the plismun conference and I hope everyone will enjoy the social event! Outside of MUN and school, I enjoy playing tennis every week as well as hanging out with my friends. Enjoy your time at Plismun!' },
    { src: '/people/henrytom.jpeg', name: 'Henry Bowdler', role: 'PGA', description: 'Hey there everyone! Im Henry and I will be your other co-head of Social Event this year and will also be taking a major role within the admission and research team. I have had quite a lengthy MUN career, spanning over around 11 conferences, however I have only ever chaired once, unfortunately. This will be my first time having a larger role in the organisation of my own schools conference yet after witnessing several of my friends take on these roles in their own respective conferences, it is definitely an opportunity that I am looking forward to and that I am grateful for. Outside of MUN, I enjoy socialising, reading, painting, or taking part in any sort of artistic activity. I have the firm belief that the conference will be spectacular and I hope that it will have a lasting effect on all the delegates which attend!' },
    { src: '/people/tomas.png', name: 'Tomáš Stoklásek ', role: 'Head of IT, Website & Logistics, Social Event', description: 'Heya! I am Tomas (or Milo) and this year I am in charge of rewriting all of our our online systems (aka website, design language, programming, databases, etc. Full stack development) as well as helping with general managment & logistics & social media. I hold myself to the same standards as the Prague city officials, so expect any bug fixes to come in 5-47 business days :3.  This is my second year in the organising team, however I have been active in the MUN community for a while, pocketing myself multiple awards even though I usually try to focus on creating funny moments. Apart from MUN, you can find me hanging out with friends, programming, or watching House M.D with the occasional video game or game of tennis. I really hope that the conference will go well with as little tech issues as possible, fingers crossed. See you there and enjoy!' },
    { src: '/people/klara.jpeg', name: 'Klara Elisa Müller', role: 'Assistant', description: 'Hello! My name is Klara Muller and I am thankful to be the Head of Admins at PLISMUN26! I started my model UN journey as an admin in 2023, where I passed notes during conferences and set up snack tables for the delegates. Since then I have loved mun and its welcoming community. My role is to lead the Admins and make sure the conference runs smoothly, and I hope that the Admin team is helpful to everyone, from passing notes within committees to serving the delegates refreshments. In my free time, I love to read, dance and spend time with family and friends. I look forward to seeing the debates in motion and I hope everyone enjoys the conference as much as I do!' },
    { src: '/logo.png', name: 'Maria Tiskina', role: 'Head of Research', description: 'I will write something more soon!' },
    { src: '/logo.png', name: 'Julie Popelka', role: 'Head of Admins', description: 'I will write something more soon!' },
    { src: '/logo.png', name: 'Mariya Krykhtina', role: 'Head of Social Media', description: 'I will write something more soon!' },
    { src: '/logo.png', name: 'Maksymilian Zajac', role: 'Head of Admissions', description: 'I will write something more soon!' },
    { src: '/logo.png', name: 'Barbora Juríková', role: 'Head of Finance', description: 'I will write something more soon!' },
    { src: '/logo.png', name: 'Tomas Garza', role: 'Head of Sponsorhips', description: 'I will write something more soon!' },
    { src: '/logo.png', name: 'Hugo Kaban', role: 'Head of Photography', description: 'I will write something more soon!' },
    { src: '/logo.png', name: 'Alex Kryhut', role: 'DJ', description: 'I will write something more soon!' },
]

export default function TeamSection() {
    return (
      <section className="bg-muted/40 py-28">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="mb-14 text-center">
            <h2 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              Meet Our Team
            </h2>
  
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              The secretariat working behind the scenes to make PLISMUN&apos;27
              possible.
            </p>
          </div>
  
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {members.map((member, index) => (
              <div
                key={index}
                className="group relative h-[430px] overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="absolute inset-0 transition duration-500 group-hover:opacity-0">
                  <div className="h-[320px] overflow-hidden bg-slate-100">
                    <img
                      src={member.src}
                      alt={member.name}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-slate-950">
                      {member.name}
                    </h3>
  
                    <p className="mt-1 text-sm font-medium text-sky-700">
                      {member.role}
                    </p>
                  </div>
                </div>
  
                <div className="absolute inset-0 flex translate-y-4 flex-col justify-center bg-white p-7 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="max-h-[330px] overflow-y-auto text-sm leading-6 text-slate-600">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
