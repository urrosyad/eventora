export function PartnerSlider() {
  const partners = [
    "TechCorp ID",
    "AstraGroup",
    "GoTo Global",
    "Tokopedia",
    "BankCentral",
    "NetCorp",
    "Telco Indonesia",
    "IndoFood",
    "Grab ID",
    "Traveloka",
  ];

  // Duplicate to make infinite scrolling seamless
  const scrollList = [...partners, ...partners];

  return (
    <div className="relative w-full overflow-hidden py-6 bg-white border-y border-border/40">
      <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      {/* Scrolling Row */}
      <div className="flex w-max space-x-12 animate-infinite-scroll items-center">
        {scrollList.map((p, idx) => (
          <span
            key={idx}
            className="text-sm font-semibold tracking-wider text-silver hover:text-muted-ink transition-colors uppercase whitespace-nowrap cursor-default"
          >
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}
