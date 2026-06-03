import type { Metadata } from "next";
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { logoutAction } from './auth-actions';
import Link from 'next/link';
import { HeartHandshake, User, LayoutDashboard, Search, LogOut, Key, Sparkles, Calculator, ChevronDown, Scale, ShieldCheck, Coins, BookOpen } from 'lucide-react';
import ThemeToggle from '@/components/theme-toggle';
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "California Special Needs Navigator",
    template: "%s | California Special Needs Navigator"
  },
  description: "Find the exact state benefits, waivers, and scholarships your child qualifies for without reading government documents.",
  metadataBase: new URL("https://special-needs-ca.vercel.app"),
  openGraph: {
    title: "California Special Needs Navigator",
    description: "Find the exact state benefits, waivers, and scholarships your child qualifies for without reading government documents.",
    url: "https://special-needs-ca.vercel.app",
    siteName: "California Special Needs Navigator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "California Special Needs Navigator",
    description: "Find the exact state benefits, waivers, and scholarships your child qualifies for without reading government documents.",
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  const session = token ? verifyToken(token) : null;

  return (
    <html lang="en">
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        {/* Modern Glassmorphic Header */}
        <header className="navbar-container">
          <nav className="navbar-content">
            <Link href="/" className="nav-logo">
              <HeartHandshake size={24} color="var(--primary-color)" />
              <span>CA Special Needs Navigator</span>
            </Link>

            <div className="nav-links">
              <ThemeToggle />

              <Link href="/" className="nav-link">
                <Search size={16} />
                <span>Eligibility Wizard</span>
              </Link>

              <Link href="/benefits" className="nav-link">
                <BookOpen size={16} />
                <span>Guides & Resources</span>
              </Link>
              
              <Link href="/advocates" className="nav-link">
                <User size={16} />
                <span>IEP Advocates</span>
              </Link>
              
              {/* Caregiver Tools Dropdown */}
              <div className="nav-dropdown">
                <button className="nav-dropdown-trigger" type="button">
                  <Sparkles size={16} />
                  <span>Caregiver Tools</span>
                  <ChevronDown size={14} />
                </button>
                <div className="nav-dropdown-menu">
                  <Link href="/dashboard?tab=iep" className="nav-dropdown-item">
                    <Sparkles size={14} />
                    <span>IEP Goals Library</span>
                  </Link>
                  <Link href="/dashboard?tab=dds&sub=respite" className="nav-dropdown-item">
                    <Calculator size={14} />
                    <span>DDS Funding & Respite</span>
                  </Link>
                  <Link href="/dashboard?tab=appeals" className="nav-dropdown-item">
                    <Scale size={14} />
                    <span>Appeals & Letter Builder</span>
                  </Link>
                  <Link href="/dashboard?tab=ihss&sub=journal" className="nav-dropdown-item">
                    <ShieldCheck size={14} />
                    <span>IHSS 24-Hr Safety Log</span>
                  </Link>
                  <Link href="/dashboard?tab=dds&sub=eligibility" className="nav-dropdown-item">
                    <Coins size={14} />
                    <span>CalABLE & SNT Planner</span>
                  </Link>
                </div>
              </div>
              
              {session ? (
                <>
                  <Link href="/dashboard" className="nav-link">
                    <LayoutDashboard size={16} />
                    <span>Saved Plans</span>
                  </Link>
                  <form action={logoutAction} style={{ display: 'inline' }}>
                    <button type="submit" className="nav-btn-logout">
                      <LogOut size={16} />
                      <span>Log Out</span>
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login" className="nav-link">
                    <Key size={16} />
                    <span>Log In</span>
                  </Link>
                  <Link href="/register" className="nav-btn-signup">
                    <span>Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </header>

        {/* Page Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>

        {/* Global Footer */}
        <footer style={{ background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(0,0,0,0.05)', padding: '2rem 1rem', marginTop: 'auto', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-light)' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
            <p>© 2026 California Special Needs Navigator. All rights reserved.</p>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <Link href="/benefits" style={{ color: 'var(--text-light)', textDecoration: 'none', fontWeight: 600 }}>Guides & Resources</Link>
              <Link href="/sitemap.xml" style={{ color: 'var(--text-light)', textDecoration: 'none' }}>Sitemap</Link>
              <a href="https://www.cdss.ca.gov" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-light)', textDecoration: 'none' }}>CDSS</a>
              <a href="https://www.dds.ca.gov" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-light)', textDecoration: 'none' }}>DDS</a>
            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}
