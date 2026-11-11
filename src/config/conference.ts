// The basics of this year's conference. Anything on the site that shows a date, the year,
// a link or the contact address reads it from here. See src/config/README.md.
export const conference = {
  name: 'PLISMUN',
  host: 'Park Lane International School',
  city: 'Prague',
  timeZone: 'Europe/Prague',

  // When the conference opens, with the UTC offset on that date. The countdown runs to this,
  // and the year shown across the site ("PLISMUN'27") comes from it.
  startsAt: '2027-01-28T09:00:00+01:00',
  // The last day of the conference
  endsOn: '2027-01-31',

  siteUrl: 'https://www.plismun.com',
  contactEmail: 'plismun@parklane-is.com',

  mymun: {
    // The number in this year's myMUN API URL. The stats on /about are calculated from it.
    conferenceId: 11787,
    pageUrl: 'https://mymun.com/conferences/plismun-2027',
  },

  social: {
    facebook: 'https://www.facebook.com/Plismunofficial/',
    instagram: 'https://www.instagram.com/plismun/',
    linkedin: 'https://www.linkedin.com/in/plis-mun-3b1a61293/',
  },

  // The Instagram feed on the home page, from the Behold dashboard
  beholdFeedId: 'bde9UTCU8DFuCu0tWkgM',

  // The numbers on /about that myMUN can't tell us
  stats: {
    attendeesBeforeMymun: 100, // 2018 wasn't on myMUN
    internationalDelegations: '30+', // Source? I mae it the fuck up >:3
  },

  // Shown in the site and email footers. Add yourself to maintainedBy when you take over,
  // and please don't delete previous contributors: this is a multi-mun-generational project :)
  credits: {
    maintainedBy: ['Tomáš Stoklásek', 'Sebastian Doléžal'],
  },
}
