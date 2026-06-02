import type { Metadata } from "next";
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { logoutAction } from './auth-actions';
import Link from 'next/link';
import { HeartHandshake, User, LayoutDashboard, Search, LogOut, Key } from 'lucide-react';
import "./globals.css";

export const metadata: Metadata = {
  title: "California Special Needs Navigator",
  description: "Find the exact state benefits, waivers, and scholarships your child qualifies for without reading government documents.",
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
              <Link href="/" className="nav-link">
                <Search size={16} />
                <span>Eligibility Wizard</span>
              </Link>
              
              {session ? (
                <>
                  <Link href="/dashboard" className="nav-link">
                    <LayoutDashboard size={16} />
                    <span>My Dashboard</span>
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
