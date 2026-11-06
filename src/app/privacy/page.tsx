export const metadata = { title: "Privacy Policy", alternates: { canonical: "https://rojasreport.com/privacy/" } };

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20 text-muted">
      <h1 className="font-display text-4xl text-cream mb-6">Privacy Policy</h1>
      <p className="font-body text-sm text-muted mb-10">Effective: April 2026</p>

      <section className="mb-8">
        <h2 className="font-body text-lg font-semibold text-cream mb-2">What We Collect</h2>
        <p className="font-body leading-relaxed">This site does not collect personal information from visitors. No registration, login, or form submission is required to access content.</p>
      </section>

      <section className="mb-8">
        <h2 className="font-body text-lg font-semibold text-cream mb-2">Hosting</h2>
        <p className="font-body leading-relaxed">This site is hosted on Netlify. Netlify may collect standard server-side access logs. See Netlify&apos;s privacy policy at netlify.com/privacy.</p>
      </section>

      <section className="mb-8">
        <h2 className="font-body text-lg font-semibold text-cream mb-2">Content</h2>
        <p className="font-body leading-relaxed">All profiles on this site cover individuals in their professional and public capacities. Sources are limited to public filings, regulatory disclosures, and published reporting.</p>
      </section>

      <section className="mb-8">
        <h2 className="font-body text-lg font-semibold text-cream mb-2">Contact</h2>
        <p className="font-body leading-relaxed">Questions: <a href="mailto:info@rojasreport.com" className="text-orange hover:underline">info@rojasreport.com</a></p>
      </section>
    </div>
  );
}
