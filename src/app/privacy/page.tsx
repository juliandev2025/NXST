import LegalPageLayout from "@/components/LegalPageLayout";

export default function PrivacyPolicy() {
  return (
    <LegalPageLayout 
      title="Privacy Policy" 
      subtitle="The protection of your data is paramount // secure archives."
    >
      <div className="space-y-12">
        <section className="font-mono text-[11px] leading-relaxed opacity-60 uppercase p-6 border border-black/10">
          SYSTEM_ID: PRIVACY_ARCHIVE_VER_1.0.0
          LAST-UPDATE: 2026-03-07
          ENCRYPTION: SHA-256
        </section>

        <section>
          <h2 className="font-heading text-sm font-bold tracking-[0.2em] mb-4 uppercase">1. INFORMATION WE GATHER</h2>
          <p className="font-mono text-[11px] opacity-70 leading-loose uppercase tracking-wider mb-4">
            WE COLLECT THE NECESSARY DATA TO PROCESS TRANSACTIONS, INCLUDING NAMES, EMAIL ADDRESSES, AND DELIVERY COCOORDINATES. NO DATA IS SOLD TO EXTERNAL NETWORKS.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-sm font-bold tracking-[0.2em] mb-4 uppercase">2. SECURE LOGS</h2>
          <p className="font-mono text-[11px] opacity-70 leading-loose uppercase tracking-wider mb-4">
            YOUR PAYMENT INFORMATION IS ENCRYPTED THROUGH THE GATEWAY. NEXUS SAINT DOES NOT STORE CARD DATA DIRECTLY IN ITS ARCHIVES.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-sm font-bold tracking-[0.2em] mb-4 uppercase">3. COOKIE PROTOCOLS</h2>
          <p className="font-mono text-[11px] opacity-70 leading-loose uppercase tracking-wider mb-4">
            WE UTILIZE COOKIES TO OPTIMIZE YOUR EXPERIENCE WITHIN THE INTERFACE. BY USING OUR NETWORK, YOU CONSENT TO THIS DATA COLLECTION.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-sm font-bold tracking-[0.2em] mb-4 uppercase">4. DATA SECURITY</h2>
          <p className="font-mono text-[11px] opacity-70 leading-loose uppercase tracking-wider mb-4">
            ALL DATA IS ENCRYPTED AND STORED WITHIN OUR SECURE INFRASTRUCTURE, ACCESSIBLE ONLY BY AUTHORIZED OPERATORS.
          </p>
        </section>
      </div>
    </LegalPageLayout>
  );
}
