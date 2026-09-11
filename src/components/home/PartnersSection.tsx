interface Partner {
  id: string;
  name: string;
  imageUrl: string;
}

interface PartnersSectionProps {
  partners: Partner[];
}

export default function PartnersSection({ partners }: PartnersSectionProps) {
  const visiblePartners = partners.filter((partner) => partner.imageUrl.trim().length > 0);

  if (visiblePartners.length === 0) return null;

  // Triplicate for a very smooth infinite loop regardless of count
  const items = [...visiblePartners, ...visiblePartners, ...visiblePartners];

  return (
    <section className="partners-section">
      <div className="partners-header">
        <div className="partners-badge">İş Birliği</div>
        <h2 className="partners-title">Çalışma Ortaklarımız</h2>
        <p className="partners-desc">
          Sektörün önde gelen kurum ve markalarıyla güçlü iş birlikleri kurarak hizmet kalitemizi sürekli geliştiriyoruz.
        </p>
      </div>

      {/* Divider line */}
      <div className="partners-divider" />

      {/* Scrolling track */}
      <div className="partners-track-wrapper">
        <div className="partners-fade-left" />
        <div className="partners-fade-right" />
        <div className="partners-track">
          {items.map((partner, idx) => (
            <div key={`${partner.id}-${idx}`} className="partner-card">
              <div className="partner-logo-box">
                <img
                  src={partner.imageUrl}
                  alt={partner.name}
                  className="partner-logo-img"
                />
              </div>
              <span className="partner-name">{partner.name}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .partners-section {
          padding: 80px 0 60px;
          background: #fff;
          border-top: 1px solid #f0f0f0;
          overflow: hidden;
        }

        .partners-header {
          text-align: center;
          padding: 0 1rem;
          margin-bottom: 52px;
        }

        .partners-badge {
          display: inline-flex;
          align-items: center;
          padding: 6px 16px;
          border-radius: 999px;
          background: #f4f4f5;
          border: 1px solid #e4e4e7;
          color: #71717a;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .partners-title {
          font-size: clamp(28px, 4vw, 40px);
          font-weight: 800;
          color: #09090b;
          letter-spacing: -0.03em;
          margin: 0 0 14px;
          line-height: 1.15;
        }

        .partners-desc {
          color: #71717a;
          font-size: 16px;
          max-width: 500px;
          margin: 0 auto;
          line-height: 1.65;
        }

        .partners-divider {
          width: 64px;
          height: 3px;
          background: linear-gradient(90deg, #000, #a1a1aa);
          border-radius: 9px;
          margin: 0 auto 52px;
        }

        .partners-track-wrapper {
          position: relative;
        }

        .partners-fade-left,
        .partners-fade-right {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 120px;
          z-index: 10;
          pointer-events: none;
        }

        .partners-fade-left {
          left: 0;
          background: linear-gradient(to right, #ffffff, transparent);
        }

        .partners-fade-right {
          right: 0;
          background: linear-gradient(to left, #ffffff, transparent);
        }

        .partners-track {
          display: flex;
          align-items: center;
          gap: 32px;
          animation: partnerScroll 35s linear infinite;
          width: max-content;
          padding: 8px 0 16px;
        }

        .partners-track:hover {
          animation-play-state: paused;
        }

        @keyframes partnerScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }

        .partner-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
          cursor: default;
        }

        .partner-logo-box {
          width: 160px;
          height: 88px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          border-radius: 20px;
          border: 1.5px solid #e4e4e7;
          background: #fafafa;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          transition: all 0.35s ease;
        }

        .partner-card:hover .partner-logo-box {
          border-color: #a1a1aa;
          background: #fff;
          box-shadow: 0 8px 24px rgba(0,0,0,0.10);
          transform: translateY(-4px);
        }

        .partner-logo-img {
          max-height: 100%;
          max-width: 100%;
          object-fit: contain;
          transition: transform 0.35s ease;
        }

        .partner-card:hover .partner-logo-img {
          transform: scale(1.05);
        }

        .partner-name {
          font-size: 11px;
          font-weight: 700;
          color: #a1a1aa;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          transition: color 0.3s;
        }

        .partner-card:hover .partner-name {
          color: #27272a;
        }
      `}</style>
    </section>
  );
}
