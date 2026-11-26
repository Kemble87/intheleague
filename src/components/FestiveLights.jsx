// String of fairy lights — decorative, shown during the festive season
const COLOURS = ['#00E05A', '#FFD60A', '#FF3B5C', '#F6F5EF']
export default function FestiveLights() {
  return (
    <div className="fest-lights" aria-hidden="true">
      {Array.from({ length: 18 }, (_, i) => (
        <i key={i} style={{ '--c': COLOURS[i % COLOURS.length], '--d': (i % 5) * -0.55 + 's' }} />
      ))}
    </div>
  )
}
