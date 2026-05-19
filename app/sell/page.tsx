import Link from "next/link";

const OFFER_ITEMS = [
  { icon: "🎯", text: "0% commission for first 3 months" },
  { icon: "📦", text: "Free product listing — unlimited" },
  { icon: "🤖", text: "AI-generated product descriptions" },
  { icon: "🌍", text: "Multilingual product cards (6 languages)" },
  { icon: "💱", text: "Multi-currency prices (UAH, USD, EUR…)" },
  { icon: "📲", text: "Instant Telegram order notifications" },
  { icon: "📊", text: "Full seller dashboard & analytics" },
  { icon: "🚀", text: "Priority placement in catalog" },
];

const STEPS = [
  {
    num: "01",
    title: "Apply as seller",
    desc: "Fill in a short form with your store name, category and contact details. Takes 2 minutes.",
    icon: "📝",
  },
  {
    num: "02",
    title: "Add products or send us your list",
    desc: "Upload products via the seller dashboard or send us a CSV / product list and we'll handle import.",
    icon: "📤",
  },
  {
    num: "03",
    title: "We optimize listings with AI",
    desc: "Our AI rewrites descriptions, selects keywords and translates cards into 6 languages automatically.",
    icon: "🤖",
  },
  {
    num: "04",
    title: "Receive orders & Telegram notifications",
    desc: "When a buyer places an order you get an instant Telegram message with all details. No missed orders.",
    icon: "🔔",
  },
];

const BENEFITS = [
  { icon: "🌏", title: "Reach new buyers", desc: "Access customers across Ukraine, Europe and CIS who discover products via AI search." },
  { icon: "⚡", title: "Save time with AI", desc: "Stop writing descriptions manually — AI creates, translates and optimises listings for you." },
  { icon: "🗣️", title: "Sell in multiple languages", desc: "Your products are shown in Russian, Ukrainian, English, Romanian, German and Chinese." },
  { icon: "🛠️", title: "Manage products easily", desc: "Edit prices, stock and details in seconds from a clean seller dashboard." },
  { icon: "🥇", title: "Early seller advantages", desc: "Founder sellers get priority placement, lower fees and direct support from the team." },
];

export default function SellPage() {
  return (
    <div>
      {/* ── Hero ── */}
      <section className="sell-hero">
        <div className="sell-hero-inner">
          <div className="sell-hero-content">
            <div className="sell-badge">🚀 Founder Seller Program</div>
            <h1>Start selling on China Market</h1>
            <p>
              AI-powered marketplace for products from China and trending affordable goods.
              Reach thousands of buyers — in their language, in their currency.
            </p>
            <div className="sell-hero-btns">
              <Link href="/seller/register" className="sell-btn-primary">
                Become a seller →
              </Link>
              <Link href="/support" className="sell-btn-outline">
                Contact support
              </Link>
            </div>
          </div>

          <div className="sell-hero-badge-card">
            <div className="sell-founder-card">
              <div className="sell-founder-title">🎁 Founder Offer</div>
              <div className="sell-founder-highlight">0% commission</div>
              <div className="sell-founder-sub">for your first 3 months</div>
              <div className="sell-founder-divider" />
              <ul className="sell-founder-list">
                <li>✓ Free listing</li>
                <li>✓ AI descriptions</li>
                <li>✓ 6 languages</li>
                <li>✓ Telegram alerts</li>
              </ul>
              <Link href="/seller/register" className="sell-btn-primary" style={{ display: "block", textAlign: "center", marginTop: 20 }}>
                Apply now
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="page-wrap">
        {/* ── Offer block ── */}
        <section className="sell-section">
          <div className="sell-section-label">What you get</div>
          <h2 className="sell-section-title">Founder Seller Program</h2>
          <p className="sell-section-sub">
            Everything you need to start selling — for free, with AI built in.
          </p>
          <div className="sell-offer-grid">
            {OFFER_ITEMS.map((item) => (
              <div key={item.text} className="sell-offer-item">
                <span className="sell-offer-icon">{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="sell-section">
          <div className="sell-section-label">Process</div>
          <h2 className="sell-section-title">How it works</h2>
          <p className="sell-section-sub">Four simple steps from sign-up to first order.</p>
          <div className="sell-steps">
            {STEPS.map((step, i) => (
              <div key={step.num} className="sell-step">
                <div className="sell-step-num">{step.num}</div>
                <div className="sell-step-icon">{step.icon}</div>
                <div className="sell-step-body">
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
                {i < STEPS.length - 1 && <div className="sell-step-arrow">→</div>}
              </div>
            ))}
          </div>
        </section>

        {/* ── Benefits ── */}
        <section className="sell-section">
          <div className="sell-section-label">Why us</div>
          <h2 className="sell-section-title">Benefits for sellers</h2>
          <p className="sell-section-sub">Built for sellers who want to grow without the headache.</p>
          <div className="sell-benefits-grid">
            {BENEFITS.map((b) => (
              <div key={b.title} className="sell-benefit-card">
                <div className="sell-benefit-icon">{b.icon}</div>
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Stats strip ── */}
        <div className="sell-stats-strip">
          <div className="sell-stat-item"><strong>0%</strong><span>Commission for founders</span></div>
          <div className="sell-stat-item"><strong>6</strong><span>Languages supported</span></div>
          <div className="sell-stat-item"><strong>6</strong><span>Currencies displayed</span></div>
          <div className="sell-stat-item"><strong>AI</strong><span>Product optimization</span></div>
          <div className="sell-stat-item"><strong>24/7</strong><span>Telegram notifications</span></div>
        </div>

        {/* ── CTA ── */}
        <section className="sell-cta">
          <div className="sell-cta-inner">
            <div className="sell-cta-badge">Limited spots available</div>
            <h2>Ready to start selling?</h2>
            <p>Join the Founder Seller Program and grow your business with AI.</p>
            <div className="sell-cta-btns">
              <Link href="/seller/register" className="sell-btn-primary sell-btn-lg">
                Become a seller
              </Link>
              <Link href="/seller/dashboard" className="sell-btn-outline sell-btn-lg">
                Open seller dashboard
              </Link>
              <Link href="/support" className="sell-btn-ghost">
                Contact support
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
