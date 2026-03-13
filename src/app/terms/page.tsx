import LegalPageLayout from "@/components/LegalPageLayout";

export default function TermsOfService() {
  return (
    <LegalPageLayout 
      title="Terms of Service" 
      subtitle="The foundational framework of our engagement // established 2026."
    >
      <div className="space-y-12">
        <section className="font-mono text-[11px] leading-relaxed opacity-60 uppercase p-6 border border-black/10">
          SYSTEM_ID: TERMS_SERVICE_ARCHIVE_VER_1.0.0
          LAST-UPDATE: 2026-03-07
          ENCRYPTION: AES-256
        </section>

        <section>
          <h2 className="font-heading text-sm font-bold tracking-[0.2em] mb-4 uppercase">1. OVERVIEW</h2>
          <p className="font-mono text-[11px] opacity-70 leading-loose uppercase tracking-wider mb-4">
            BY ACCESSING THE NEXUS SAINT PLATFORM, YOU AGREE TO BE BOUND BY THESE TERMS. WE RESERVE THE RIGHT TO TERMINATE ACCESS TO THE NETWORK AT ANY TIME IF VIOLATIONS ARE DETECTED.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-sm font-bold tracking-[0.2em] mb-4 uppercase">2. INTELLECTUAL PROPERTY</h2>
          <p className="font-mono text-[11px] opacity-70 leading-loose uppercase tracking-wider mb-4">
            ALL ASSETS, DESIGNS, RENDERINGS, AND CODE WITHIN THE NEXUS SAINT ECOSYSTEM ARE THE EXCLUSIVE INTELLECTUAL PROPERTY OF THE SAINT CORPORATION. ANY UNAUTHORIZED REPLICATION WILL BE COUNTERED WITH PROTOCOLS.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-sm font-bold tracking-[0.2em] mb-4 uppercase">3. PURCHASES & ACQUISITIONS</h2>
          <p className="font-mono text-[11px] opacity-70 leading-loose uppercase tracking-wider mb-4">
            ALL ASSETS ACQUIRED THROUGH OUR PAYMENT GATEWAY ARE SUBJECT TO AVAILABILITY. ONCE AN ORDER IS DISPATCHED, IT BECOMES A COMPLETED TRANSACTION.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-sm font-bold tracking-[0.2em] mb-4 uppercase">4. DISPUTE RESOLUTION</h2>
          <p className="font-mono text-[11px] opacity-70 leading-loose uppercase tracking-wider mb-4">
            ANY CONFLICTS ARISING FROM THE USE OF OUR NETWORK SHALL BE RESOLVED THROUGH ARBITRATION WITHIN THE SPECIFIED JURISDICTION.
          </p>
        </section>
      </div>
    </LegalPageLayout>
  );
}
