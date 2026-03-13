"use client";

import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert("SYSTEM_MSG: SUBSCRIPTION_SUCCESSFUL // WELCOME TO THE NETWORK");
    setEmail("");
  };

  return (
    <footer className="w-full bg-white border-t border-black/5 pt-20 pb-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* Support Col */}
          <div className="flex flex-col gap-4">
            <h4 className="font-heading text-[11px] font-bold tracking-[0.2em] uppercase mb-4">Support</h4>
            <Link href="/contact" className="font-mono text-[10px] tracking-wider opacity-50 hover:opacity-100 transition-opacity no-underline uppercase">Contact Us</Link>
            <Link href="/returns" className="font-mono text-[10px] tracking-wider opacity-50 hover:opacity-100 transition-opacity no-underline uppercase">Returns & Exchanges</Link>
            <Link href="/shipping" className="font-mono text-[10px] tracking-wider opacity-50 hover:opacity-100 transition-opacity no-underline uppercase">Shipping Info</Link>
          </div>

          {/* Legal Col */}
          <div className="flex flex-col gap-4">
            <h4 className="font-heading text-[11px] font-bold tracking-[0.2em] uppercase mb-4">Legal</h4>
            <Link href="/terms" className="font-mono text-[10px] tracking-wider opacity-50 hover:opacity-100 transition-opacity no-underline uppercase">Terms of Service</Link>
            <Link href="/privacy" className="font-mono text-[10px] tracking-wider opacity-50 hover:opacity-100 transition-opacity no-underline uppercase">Privacy Policy</Link>
            <Link href="/cookie-policy" className="font-mono text-[10px] tracking-wider opacity-50 hover:opacity-100 transition-opacity no-underline uppercase">Cookie Policy</Link>
          </div>

          {/* Connect Col */}
          <div className="flex flex-col gap-4">
            <h4 className="font-heading text-[11px] font-bold tracking-[0.2em] uppercase mb-4">Connect</h4>
            <a href="https://www.instagram.com/julia4n_/" target="_blank" className="font-mono text-[10px] tracking-wider opacity-50 hover:opacity-100 transition-opacity no-underline uppercase">Instagram</a>
            <a href="https://twitter.com" target="_blank" className="font-mono text-[10px] tracking-wider opacity-50 hover:opacity-100 transition-opacity no-underline uppercase">Twitter / X</a>
            <a href="https://discord.com" target="_blank" className="font-mono text-[10px] tracking-wider opacity-50 hover:opacity-100 transition-opacity no-underline uppercase">Discord Community</a>
          </div>

          {/* Newsletter Col */}
          <div className="flex flex-col gap-4">
            <h4 className="font-heading text-[11px] font-bold tracking-[0.2em] uppercase mb-4">Newsletter</h4>
            <p className="font-mono text-[10px] tracking-wider opacity-50 uppercase leading-relaxed mb-2">
              Join the nexus to receive early access and updates.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input 
                type="email" 
                placeholder="EMAIL_ADDRESS"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent border-b border-black/20 font-mono text-[10px] py-1 focus:outline-none focus:border-black transition-colors"
              />
              <button 
                type="submit"
                className="font-mono text-[10px] tracking-widest uppercase hover:underline"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-black/5 gap-4">
          <div className="flex items-center gap-6">
            <span className="font-heading text-lg font-black tracking-tighter">NXST</span>
            <span className="font-mono text-[9px] opacity-30 tracking-[0.3em] uppercase">© 2026 NEXUS SAINT // ARCHIVE_V1</span>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-5 bg-black/5 rounded flex items-center justify-center font-mono text-[7px] opacity-30">VISA</div>
            <div className="w-8 h-5 bg-black/5 rounded flex items-center justify-center font-mono text-[7px] opacity-30">MC</div>
            <div className="w-8 h-5 bg-black/5 rounded flex items-center justify-center font-mono text-[7px] opacity-30">AMEX</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
