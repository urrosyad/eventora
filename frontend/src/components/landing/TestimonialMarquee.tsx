interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
}

export function TestimonialMarquee() {
  const testimonials: Testimonial[] = [
    {
      quote: "Eventora helped us coordinate 12 sponsorships for our annual conference in just 3 weeks.",
      name: "Marcus Sterling",
      role: "VP of Operations, TechSummit ID",
      initials: "MS",
    },
    {
      quote: "We streamlined our community budget distribution process. The incoming requests are so clean.",
      name: "Elena Rostova",
      role: "CSR Director, Astra Group",
      initials: "ER",
    },
    {
      quote: "No more scattered PDFs across WhatsApp threads. The proposal tracking pipeline is perfect.",
      name: "Dian Pratama",
      role: "Event Lead, TEDxJakarta",
      initials: "DP",
    },
    {
      quote: "Automated status transitions are a lifesaver. We always know when the sponsor reviews our proposal.",
      name: "Sarah Jenkins",
      role: "PR Manager, Hackathon Indonesia",
      initials: "SJ",
    },
    {
      quote: "We love how structured the support requests are. Highly recommend Eventora for partnerships.",
      name: "Kenji Sato",
      role: "Head of Marketing, Sony Corp ID",
      initials: "KS",
    },
  ];

  // Duplicate the list to make the infinite loop transition seamless
  const scrollList = [...testimonials, ...testimonials];

  return (
    <div className="relative w-full overflow-hidden py-10 bg-background/30 border-y border-border/50">
      <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      {/* Scrolling Row */}
      <div className="flex w-max space-x-6 animate-infinite-scroll">
        {scrollList.map((t, idx) => (
          <div
            key={idx}
            className="w-[320px] bg-white border border-border/80 p-6 rounded-2xl shadow-sm space-y-4 hover:border-accent-blue/40 transition-colors duration-300"
          >
            <p className="text-sm text-muted-ink leading-relaxed italic">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <div className="w-10 h-10 rounded-full bg-primary-blue/10 flex items-center justify-center font-bold text-xs text-primary-blue border border-primary-blue/20">
                {t.initials}
              </div>
              <div>
                <h4 className="text-xs font-bold text-ink">{t.name}</h4>
                <p className="text-[10px] text-muted-ink">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
