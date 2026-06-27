import type { Metadata } from "next";
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { logoutAction } from './auth-actions';
import Link from 'next/link';
import { HeartHandshake, User, LayoutDashboard, Search, LogOut, BookOpen, MapPin, Compass } from 'lucide-react';
import { CANONICAL_SITE_URL } from '@/lib/site-url';
import "./globals.css";

const SITE_URL = CANONICAL_SITE_URL;

export const metadata: Metadata = {
  title: {
    default: "Ablefull — Source-Backed Disability Benefits & Family Action Guides",
    template: "%s | Ablefull"
  },
  description: "Find source-backed disability benefits, waiver pathways, IEP guidance, and early intervention next steps for your child. Public launch coverage is deepest in California, with other states available through launch-ready, partial, or gated surfaces.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "Ablefull",
    description: "Find source-backed disability benefits, waiver pathways, IEP guidance, and early intervention next steps for your child. Public launch coverage is deepest in California, with other states available through launch-ready, partial, or gated surfaces.",
    url: SITE_URL,
    siteName: "Ablefull",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ablefull",
    description: "Find source-backed disability benefits, waiver pathways, IEP guidance, and early intervention next steps for your child. Public launch coverage is deepest in California, with other states available through launch-ready, partial, or gated surfaces.",
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
              <span>Ablefull</span>
            </Link>

            <div className="nav-links">
              <Link href="/" className="nav-link">
                <Search size={16} />
                <span>Find Benefits</span>
              </Link>

              <Link href="/find-help" className="nav-link">
                <Compass size={16} />
                <span>Find Help</span>
              </Link>


              <Link href="/benefits/programs" className="nav-link">
                <BookOpen size={16} />
                <span>Benefit Guides</span>
              </Link>
              
              <Link href="/counties" className="nav-link">
                <MapPin size={16} />
                <span>County Resources</span>
              </Link>
              
              <Link href="/advocates" className="nav-link">
                <User size={16} />
                <span>IEP Advocates</span>
              </Link>
              
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
            <p>&copy; 2026 Ablefull. All rights reserved.{' '}California currently has the deepest public launch coverage; all other states are available in source-backed pilot or gated launch modes.</p>
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
