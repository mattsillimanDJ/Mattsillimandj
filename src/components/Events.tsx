import { Calendar, MapPin, Clock } from 'lucide-react';

export function Events() {
  const upcomingEvents = [
    {
      date: 'Dec 15, 2025',
      time: '10:00 PM',
      venue: 'The Warehouse',
      location: 'Brooklyn, NY',
      type: 'Live Set',
    },
    {
      date: 'Dec 28, 2025',
      time: '11:00 PM',
      venue: 'Electric Dreams',
      location: 'Los Angeles, CA',
      type: 'DJ Set',
    },
    {
      date: 'Jan 10, 2026',
      time: '9:00 PM',
      venue: 'Underground Club',
      location: 'Chicago, IL',
      type: 'Live Set',
    },
  ];

  const pastEvents = [
    {
      date: 'Nov 20, 2025',
      venue: 'Basement Sessions',
      location: 'New York, NY',
    },
    {
      date: 'Oct 15, 2025',
      venue: 'Sound Factory',
      location: 'Detroit, MI',
    },
    {
      date: 'Sep 5, 2025',
      venue: 'Nocturnal Festival',
      location: 'San Francisco, CA',
    },
  ];

  return (
    <section id="events" className="min-h-screen py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl md:text-6xl mb-16 tracking-tight">Events</h2>
        
        <div className="mb-20">
          <h3 className="text-3xl mb-12">Upcoming Shows</h3>
          <div className="space-y-6">
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className="border border-white/20 p-8 bg-white/5 hover:bg-white/10 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-3">
                    <h4 className="text-2xl">{event.venue}</h4>
                    <div className="flex flex-wrap gap-6 text-white/60">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="self-start md:self-center">
                    <span className="px-4 py-2 border border-white/30 text-sm uppercase tracking-wider">
                      {event.type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-3xl mb-12">Past Performances</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pastEvents.map((event, index) => (
              <div
                key={index}
                className="border border-white/10 p-6 bg-white/5"
              >
                <div className="text-sm text-white/40 mb-3 uppercase tracking-wider">{event.date}</div>
                <h4 className="text-lg mb-2">{event.venue}</h4>
                <p className="text-white/60 text-sm">{event.location}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
