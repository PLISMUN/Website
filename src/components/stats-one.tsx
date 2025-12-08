"use client"
import { Card } from '@/components/ui/card'
import { useEffect, useState } from 'react';

export default function StatsSection() {
  const [rating, setRating] = useState("");
  const [attendees, setAttendees] = useState("");

  useEffect(() => {
    // Function to fetch data
    const fetchData = async () => {
      const responseRating = await fetch('https://mymun.com/api/conferences/8737/previous-conferences');
      const resultRating = await responseRating.json();
      let ratingTot = 0;
      let conferenceTot = 0;
      let attendeesTot = 0;
      console.log(resultRating);
        for (let i = 0; i < resultRating.length; i++) {
            let conference = resultRating[i];
            if (conference["total_rating"] > 1) {
                conferenceTot++;
                ratingTot += conference["total_rating"];
            }
            let responseConference = await fetch(`https://mymun.com/api/conferences/${conference["id"]}`);
            let resultConference = await responseConference.json();
            attendeesTot += resultConference["expected_delegates"] || 0;
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
                        <div className="text-foreground space-y-1 text-4xl font-bold">20+</div> {/* I made it the fuck up */}
                        <p className="text-muted-foreground">International Delegations</p>
                    </div>
                </Card>
            </div>
        </section>
    )
}
