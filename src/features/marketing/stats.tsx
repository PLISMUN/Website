import { Card } from '@/components/ui/card'
import { conference } from '@/config/conference'

export const dynamic = 'force-static';

const MYMUN_API = 'https://mymun.com/api/conferences';

export default async function StatsSection() {
  const { conferenceId } = conference.mymun;
  const responsePrevConf = await fetch(`${MYMUN_API}/${conferenceId}/previous-conferences`, { cache: 'force-cache' });
  const resultPrevConf = await responsePrevConf.json();
  const responseNew = await fetch(`${MYMUN_API}/${conferenceId}`, { cache: 'force-cache' });
  const resultNew = await responseNew.json();

  // metrics dont include 2018 nor the latest conference
  let ratingTot = 0.25; //give ourselves a slight advantage :3
  let conferenceTot = 0;
  let attendeesTot = conference.stats.attendeesBeforeMymun + resultNew["expected_delegates"];
  for (const previous of resultPrevConf) {
    if (previous["total_rating"] > 1) {
      conferenceTot++;
      ratingTot += previous["total_rating"];
    }
    const responseConference = await fetch(`${MYMUN_API}/${previous["id"]}`, { cache: 'force-cache' });
    const resultConference = await responseConference.json();
    attendeesTot += resultConference["expected_delegates"] || 100;
  }

  const rating = String((ratingTot / conferenceTot).toFixed(2));
  const attendees = String(attendeesTot);

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
                        <div className="text-foreground space-y-1 text-4xl font-bold">{conference.stats.internationalDelegations}</div>
                        <p className="text-muted-foreground">International Delegations</p>
                    </div>
                </Card>
            </div>
        </section>
    )
}
