const tickerItems = [
  "AI Product OS",
  "Memory Timeline",
  "Capability Map",
  "Release Kit",
  "Agent Context",
  "Build In Public",
];

export default function AiosTicker() {
  const items = [...tickerItems, ...tickerItems];

  return (
    <div className="aios-marquee">
      <div className="aios-marquee-track">
        {items.map((item, index) => (
          <span key={`${item}-${index}`}># {item}</span>
        ))}
      </div>
    </div>
  );
}
