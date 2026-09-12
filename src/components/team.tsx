"use client";

import React, { useState } from "react";

const members = [
  { src: '/people/david.jpeg', name: 'David Bouck', role: 'Secretary General', description: 'Hello everybody, My name is David Geroge Bouck and I am honored to be this years Secretary General for PLISMUN 2027! Plismun 2027 will be my 12th ever conference and always my favourite to attend. Throughout my MUN organisational career I have always worked to the best of my abilities in order to produce the best possible experience for you all, in which I am certain will be achieved with PLISMUN 2027. Additionally, PLISMUN holds a special place in my heart as it was one of the first MUNs I have ever attended serving the organisational team as a proud member in the catering team and to now being where I am as Secretary General, a achievment that I can look back on and be proud of. In conclusion, I can not express my gratitude to all my team and will work hard for PLISMUN 2027 to hold up to its outstanding expectations' },
  { src: '/people/nina.jpeg', name: 'Nina Marianna Gawlasova', role: 'Deputy Secretary General', description: `Hi everyone! My name is Nina Gawlasova and I am Deputy Secretary General of PLISMUN ’27. My role is very similar to David's, kind of like a second in command. I am so excited to be granted this opportunity and to be able a plan a conference for you all. My MUN journey actually began at PLISMUN '23 and I am delighted that I am able to play such a big role just a few years later. I've had all types of roles in MUN, ranging from being an admin, to a chair and now DSG. This will be my 9th conference overall, and second in terms or organising as last year I was head of finance which was very fun. Outside of MUN, I deeply enjoy reading, listening to music and horse riding. I am looking forward to seeing you all in January!` },
  { src: '/people/elodie.jpeg', name: 'Elodie Wray', role: 'Chief of Staff', description: `Hey everybody, I'm Elodie Wray and this year I have the wonderful opportunity to be one of your Chiefs of Staff for this upcoming PLISMUN - this means that I work with the rest of the secretariat to make important decisions, and I direct other teams, helping them out if they so need. I've been passionate about MUN since I went to my first conference almost four years ago. PLISMUN'27 will be my 10th conference overall, though I've been a admin, delegate, chair and organizer at different points of my MUN career. Other interests of mine include reading, playing with my dogs and creating art through a variety of mediums. I'm so excited to be a part of yet another amazing PLISMUN conference, and I can't wait to see you all :)` },
  { src: '/people/lilly.jpeg', name: 'Lilly Ann Hohmann', role: 'Chief of Staff', description: `Hi everyone! My name is Lilly Ann Hohmann and I have the honour of being one of PLISMUN's Chiefs of Staff for 2027. I have participated in MUN for 3-4 years now, starting as an admin, and it has been one of my favourite hobbies since I joined. Outside of MUN I enjoy activities such as horse riding, reading, and drawing, as well as spending time with my friends and meeting new people. Regarding MUN organisation, I have helped organising PLISMUN'25 and '26 as a member of the design team and then as head of design and merchandise, which were both incredible experiences. The team will be working hard this year to make this an unforgettable conference for everybody, so please take the time to appreciate everyone's efforts! I am looking forward to seeing you all engage in fruitful debates and make new connections every day. Most importantly, of course, have fun! :)` },
  { src: '/people/henrytom.jpeg', name: 'Thomas Michael Hill', role: 'PGA, Social Event', description: 'I will write something more soon!' },
  { src: '/people/henrytom.jpeg', name: 'Henry Bowdler', role: 'PGA', description: 'I will write something more soon!' },
  { src: '/people/tomas.png', name: 'Tomáš Stoklásek ', role: 'Head of IT, Website & Logistics, Social Event', description: `Heya! I am Tomáš (or Milo) and this year I am in charge of heading our tech team. This is my third year in the organising team, however I have been active in the MUN community for a while, pocketing myself multiple awards even though I usually try to focus on creating funny moments. Apart from MUN, you can find me hanging out with friends, programming, or watching House M.D with the occasional video game or game of tennis. I really hope that the conference will go well with as little tech issues as possible, fingers crossed. See you there and enjoy!` },
  { src: '/people/klara.jpeg', name: 'Klara Elisa Müller', role: 'Assistant', description: `Hi everybody! My name is Klara Elisa Müller and I am happy to be a part of the PLISMUN organising team this year as the established assistant. I have been a delegate, Admin and even the Head of Admins here at PLISMUN, and it's safe to say that every role is better than the next. Putting together a conference for all the passionate delegates gave me a whole new perspective to Model UN. I cannot wait to see all of the fruitful debates, and I hope you will enjoy PLISMUN27'!  ` },
  { src: '/logo.png', name: 'Sebastian Doležal', role: 'IT & Website', description: `Hi everyone, my name is Sebastian Doležal and I am going to be part of the PLISMUN 27 IT team. I enjoy programming, machine learning and scientific research. This is going to be my 1st year at PLISMUN and I am very excited to make your PLISMUN experience sublime this year!` },
  { src: '/logo.png', name: 'Maria Tiskina', role: 'Head of Research', description: `Hi everyone! I'm the Head of Research for this year's instalment of PLISMUN, meaning that my wonderful team and I are responsible for curating and building up the conference's committees and topics. I've taken part in MUN (as a Delegate) for about two years, in which time I've collected a handful of awards and a ton of fun experiences, making PLISMUN'27 my 11th conference. Outside of MUN, I enjoy hanging out with friends, exploring Prague's music scene, reading, and playing video games. Looking forward to seeing you all in our (beautifully put together, lovingly researched) committees, and hope you have as much fun at PLISMUN'27 as we did making it happen :>  ` },
  { src: '/logo.png', name: 'Isabella Curran', role: 'Head of Admins', description: `Hi everyone, my name is Isabella Curran and I have been participating in PLISMUN for 5 years now. I started off as an admin so I am particularly looking forward to help running the admin team this year. I am currently the longest standing member of PYT and I love playing tennis.This should be the Tenth MUN conference that i have attended and I am so excited to see everyone!! Wishing you all a fruitful debate.` },
  { src: '/logo.png', name: 'Mariya Krykhtina', role: 'Head of Social Media', description: `Hi everyone, I'm Mariya Krykhtina, and i'm the Head of Social Media and co-head of photography, for this years edition of PLISMUN! I've been involved in organising PLISMUN for over 3 years now, and have been to numerous local and international MUN conferences, around 6-7 conferences. Outside of MUN, I enjoy inline skating, hanging out with friends, and procrastinating my whole IB diploma at NTK on the weekends. I hope your PLISMUN27 will be as amazing as always and filled with fruitful debates and memories :)` },
  { src: '/logo.png', name: 'Maksymilian Zajac', role: 'Head of Admissions', description: 'I will write something more soon!' },
  { src: '/logo.png', name: 'Barbora Juríková', role: 'Head of Finance', description: `Hello everyone! My name is Barbora Juríková and I am the Head of Finance for PLISMUN 2027. As part of my role, I help manage the conference budget and ensure that all financial matters run smoothly throughout the conference’s planning process. It has been a privilege to work alongside such a dedicated group of people, and I am so thrilled to have this opportunity. My MUN journey began in 2023 when I attended my first conference as an admin, and since then I have also participated as a delegate at ECPMUN and have enjoyed being part of the MUN community. Outside of MUN, I enjoy singing, baking, and spending time with friends and family. I hope everyone has a wonderful time at our conference, filled with new friendships, insightful debate, and great memories. See you there! :)` },
  { src: '/logo.png', name: 'Tomas Garza', role: 'Head of Sponsorhips', description: `Hi everyone,my name is Tomas Garza and it is my honor to be a part of the PLISMUN’27 organisation team. This year I am head of sponsorships and my job entails me sending emails and offering them a chance to sponsor PLISMUN.. This is my first time working in PLISMUN so hopefully all goes to plan.Outside of MUN, I play basketball,go to the gym and I also enjoy spending time with my friends and family. With that being said, I wish everybody a wonderful conference and I look forward to seeing all of you!` },
  { src: '/logo.png', name: 'Samuel Alner', role: 'Catering', description: `Hi everyone, my name is Samuel Alner and I am going to be part of the PLISMUN 27 catering team. I enjoy eating food and musical theater. This is going to be my 5th year at PLISMUN and I am very excited to be organizing your food this year! ` },
  { src: '/logo.png', name: 'Stephanie Horchidan', role: 'Catering', description: `Hi everyone! My name is Stephanie Andreea Horchidan and I am in charge of the food provided for PLISMUN 2027. I have been doing MUNs for the past 4 years and been to 6 MUNs in the past and this is my second year of helping with PLISMUN. I originally started as an admin in PLISMUN'24. I am part of giving you a great PLIMUN experience because I find MUNs so fulfilling and rewarding. Outside of MUN and school, I do PYT and love hiking and going to the countryside. I hope all of you have a great time in Prague and at our conference! Have a great debate!` },
  { src: '/logo.png', name: 'Hermína Králova', role: 'Head of Design and Merchandise', description: `Hello everybody, I am Hermina and I am the co-head of design for PLISMUN 27! I'm having lots of fun creating fun and professional designs for this and hopefully future years. This is my 5th year taking part in mun and I enjoy the challenge of debating along with the occasional silliness. I hope this conference will be unforgettable and you will enjoy some of our designs, from the merch to your placards!` },
  { src: '/logo.png', name: 'Alex Kryhut', role: 'DJ', description: 'DJ' },
]

export default function TeamSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-muted/40 py-28">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="mb-14 text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            Meet Our Team
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            The secretariat working behind the scenes to make
            PLISMUN&apos;27 possible.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {members.map((member, index) => {
            const isOpen = openIndex === index;

            return (
              <button
                key={member.name}
                type="button"
                onClick={() =>
                  setOpenIndex((current) =>
                    current === index ? null : index
                  )
                }
                className="group relative h-[430px] overflow-hidden rounded-[2rem] border border-slate-200 bg-white text-left shadow-sm transition duration-500 focus:outline-none focus:ring-2 focus:ring-sky-200 [@media(hover:hover)]:hover:-translate-y-2 [@media(hover:hover)]:hover:shadow-2xl"
                aria-expanded={isOpen}
                aria-label={`View bio for ${member.name}`}
              >
                <div
                  className={[
                    "absolute inset-0 transition duration-500",
                    isOpen
                      ? "opacity-0"
                      : "opacity-100 [@media(hover:hover)]:group-hover:opacity-0 group-focus-visible:opacity-0",
                  ].join(" ")}
                >
                  <div className="h-[320px] overflow-hidden bg-slate-100">
                    <img
                      src={member.src}
                      alt={member.name}
                      className="h-full w-full object-cover transition duration-700 [@media(hover:hover)]:group-hover:scale-105 group-focus-visible:scale-105"
                    />
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-slate-950">
                      {member.name}
                    </h3>

                    <p className="mt-1 text-sm font-medium text-sky-700">
                      {member.role}
                    </p>

                    <p className="mt-3 text-xs font-medium text-slate-400 [@media(hover:hover)]:hidden">
                      Tap to read bio
                    </p>
                  </div>
                </div>

                <div
                  className={[
                    "absolute inset-0 flex flex-col justify-center bg-white p-7 transition duration-500",
                    isOpen
                      ? "translate-y-0 opacity-100"
                      : "translate-y-4 opacity-0 [@media(hover:hover)]:translate-y-4 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100",
                  ].join(" ")}
                >
                  <p className="max-h-[330px] overflow-y-auto text-sm leading-6 text-slate-600">
                    {member.description}
                  </p>

                  <span className="mt-5 text-xs font-medium text-sky-700 [@media(hover:hover)]:hidden">
                    Tap again to close
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}