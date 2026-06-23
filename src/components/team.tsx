"use client";

import React, { useState } from "react";

const members = [
  { src: '/people/david.jpeg', name: 'David Bouck', role: 'Secretary General', description: 'I will write something more soon!' },
  { src: '/people/nina.jpeg', name: 'Nina Marianna Gawlasova', role: 'Deputy Secretary General', description: 'I will write something more soon!' },
  { src: '/people/elodie.jpeg', name: 'Elodie Wray', role: 'Chief of Staff', description: 'I will write something more soon!' },
  { src: '/people/lilly.jpeg', name: 'Lilly Ann Hohmann', role: 'Chief of Staff', description: 'I will write something more soon!' },
  { src: '/people/henrytom.jpeg', name: 'Thomas Michael Hill', role: 'PGA, Social Event', description: 'I will write something more soon!' },
  { src: '/people/henrytom.jpeg', name: 'Henry Bowdler', role: 'PGA', description: 'I will write something more soon!' },
  { src: '/people/tomas.png', name: 'Tomáš Stoklásek ', role: 'Head of IT, Website & Logistics, Social Event', description: 'I will write something more soon!' },
  { src: '/people/klara.jpeg', name: 'Klara Elisa Müller', role: 'Assistant', description: 'I will write something more soon!' },
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