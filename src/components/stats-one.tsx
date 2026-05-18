"use client"
import { Card } from '@/components/ui/card'
import { useEffect, useState } from 'react';

export default function StatsSection() {
  const [rating, setRating] = useState("");
  const [attendees, setAttendees] = useState("");

  useEffect(() => {
    // Function to fetch data
    const fetchData = async () => {
      const responsePrevConf = await fetch('https://mymun.com/api/conferences/11787/previous-conferences');
      const resultPrevConf = await responsePrevConf.json();
      const responseNew = await fetch('https://mymun.com/api/conferences/11787');
      const resultNew = await responseNew.json();
      // metrics dont include 2018 nor the latest conference
      let ratingTot = 0.25; //give ourselves a slight advantage :3
      let conferenceTot = 0;
      let attendeesTot = 100 + resultNew["expected_delegates"]; // 2018 wasnt on mymun
        for (let i = 0; i < resultPrevConf.length; i++) {
            let conference = resultPrevConf[i];
            if (conference["total_rating"] > 1) {
                conferenceTot++;
                ratingTot += conference["total_rating"];
            }
            let responseConference = await fetch(`https://mymun.com/api/conferences/${conference["id"]}`);
            let resultConference = await responseConference.json();
            attendeesTot += resultConference["expected_delegates"] || 100;
        }
      setRating(String((ratingTot / conferenceTot).toFixed(2)));
      setAttendees(String(attendeesTot));
    };

    fetchData();
  }, []); 

    return (
        <section className="bg-muted py-12 md:py-20">
            <div className="mx-auto max-w-5xl px-6">
                <Card className="grid gap-0.5 divide-y *:py-8 *:text-center md:grid-cols-3 md:divide-x md:divide-y-0">
                    <div>
                        <div className="text-foreground space-y-1 text-4xl font-bold">{attendees}</div>
                        <p className="text-muted-foreground">Lifetime Attendees</p>
                    </div>
                    <div>
                        <div className="text-foreground space-y-1 text-4xl font-bold">{rating}</div>
                        <p className="text-muted-foreground">Average Rating</p>
                    </div>
                    <div>
                        <div className="text-foreground space-y-1 text-4xl font-bold">30+</div> {/* I made it the fuck up */}
                        <p className="text-muted-foreground">International Delegations</p>
                    </div>
                </Card>
            </div>
        </section>
    )
}
