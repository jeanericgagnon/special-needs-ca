import type { Metadata } from "next";
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { logoutAction } from './auth-actions';
import Link from 'next/link';
import { HeartHandshake, User, LayoutDashboard, Search, LogOut, BookOpen, MapPin, Compass, Landmark, Heart } from 'lucide-react';
import { getAuditStats } from '@/lib/seo-policy';
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ablefull.org';

export const metadata: Metadata = {
  title: {
    default: "Ablefull — 50-State Disability Benefits Guide",
    template: "%s | Ablefull"
  },
  description: "Find disability benefits, waiver programs, IEP advocacy, and early intervention resources for your child — across all 50 states.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "Ablefull",
    description: "Find disability benefits, waiver programs, IEP advocacy, and early intervention resources for your child — across all 50 states.",
    url: SITE_URL,
    siteName: "Ablefull",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ablefull",
    description: "Find disability benefits, waiver programs, IEP advocacy, and early intervention resources for your child — across all 50 states.",
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
  const { complete, blocked } = getAuditStats();

  return (
    <html lang="en">
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        {/* Modern Glassmorphic Header */}
        <header className="navbar-container">
          <nav className="navbar-content">
            <Link href="/" className="nav-logo">
              <HeartHandshake size={24} color="var(--primary-color)" />
              <span className="logo-text">Ablefull</span>
            </Link>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <Link href="/benefits" className="nav-link">
                <Compass size={16} />
                <span>Benefits</span>
              </Link>
              <Link href="/school-districts" className="nav-link">
                <Landmark size={16} />
                <span>School Districts</span>
              </Link>
              <Link href="/advocates" className="nav-link">
                <Heart size={16} />
                <span>Advocates</span>
              </Link>
              <Link href="/forms" className="nav-link">
                <BookOpen size={16} />
                <span>Library</span>
              </Link>
              <Link href="/find-help" className="nav-link">
                <Search size={16} />
                <span>Find Help</span>
              </Link>

              <span style={{ width: '1px', height: '18px', background: 'rgba(0,0,0,0.08)', margin: '0 0.25rem' }} />
              
              {session && (
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
            <p>&copy; 2026 Ablefull. All rights reserved. {complete} states currently verified for indexable publication; {blocked} states remain verification pending.</p>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link href="/benefits/california" style={{ color: 'var(--text-light)', textDecoration: 'none', fontWeight: 600 }}>California</Link>
              <Link href="/benefits/texas" style={{ color: 'var(--text-light)', textDecoration: 'none', fontWeight: 600 }}>Texas</Link>
              <Link href="/benefits/florida" style={{ color: 'var(--text-light)', textDecoration: 'none', fontWeight: 600 }}>Florida</Link>
              <Link href="/benefits/programs" style={{ color: 'var(--text-light)', textDecoration: 'none', fontWeight: 600 }}>Guides</Link>
              <Link href="/counties" style={{ color: 'var(--text-light)', textDecoration: 'none', fontWeight: 600 }}>Counties</Link>
              <Link href="/advocates" style={{ color: 'var(--text-light)', textDecoration: 'none', fontWeight: 600 }}>Advocates</Link>
              <Link href="/sitemap.xml" style={{ color: 'var(--text-light)', textDecoration: 'none' }}>Sitemap</Link>
              {!session ? (
                <>
                  <Link href="/login" style={{ color: 'var(--text-light)', textDecoration: 'none' }}>Log In</Link>
                  <Link href="/register" style={{ color: 'var(--text-light)', textDecoration: 'none' }}>Sign Up</Link>
                </>
              ) : (
                <Link href="/dashboard" style={{ color: 'var(--text-light)', textDecoration: 'none' }}>Dashboard</Link>
              )}
            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}
