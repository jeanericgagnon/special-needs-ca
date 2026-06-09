import type { Metadata } from "next";
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { logoutAction } from './auth-actions';
import Link from 'next/link';
import { HeartHandshake, User, LayoutDashboard, Search, LogOut, BookOpen, MapPin } from 'lucide-react';
import ThemeToggle from '@/components/theme-toggle';
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "California Special Needs Navigator",
    template: "%s | California Special Needs Navigator"
  },
  description: "Find California disability benefits and local special-needs resources your child may qualify for.",
  metadataBase: new URL("https://california-navigator.org"),
  openGraph: {
    title: "California Special Needs Navigator",
    description: "Find California disability benefits and local special-needs resources your child may qualify for.",
    url: "https://california-navigator.org",
    siteName: "California Special Needs Navigator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "California Special Needs Navigator",
    description: "Find California disability benefits and local special-needs resources your child may qualify for.",
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
                <span>Find Benefits</span>
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
            <p>© 2026 California Special Needs Navigator. All rights reserved.</p>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
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
              <a href="https://www.cdss.ca.gov" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-light)', textDecoration: 'none' }}>CDSS</a>
              <a href="https://www.dds.ca.gov" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-light)', textDecoration: 'none' }}>DDS</a>
            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}
