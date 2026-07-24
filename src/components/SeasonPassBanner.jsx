import SeasonPassButton from './SeasonPassButton';

export default function SeasonPassBanner({ user, paid }) {
  if (paid) return null;

  return (
    <div
      style={{
        background: '#111813',
        border: '1px solid #2CE86A',
        borderRadius: 16,
        padding: '16px 18px',
        margin: '12px 0',
        fontFamily: 'Poppins, sans-serif',
        color: '#fff',
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
        Season Pass 26/27
      </div>
      <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 12 }}>
        One pass. Both leagues. Every matchweek. Predictions lock without it from 21 August.
      </div>
      <SeasonPassButton user={user} />
    </div>
  );
}
