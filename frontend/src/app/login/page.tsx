'use client';

import { useActionState } from 'react';
import { loginAction } from '../auth-actions';
import Link from 'next/link';
import { Lock, Mail, HeartHandshake, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <main className="container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <HeartHandshake size={36} color="var(--primary-color)" />
          <span style={{ fontSize: '1.5rem', fontWeight: 700, background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            CA Special Needs Navigator
          </span>
        </Link>
      </div>

      <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '1.8rem' }}>Welcome Back</h2>
        <p style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '0.95rem' }}>
          Log in to manage your child's saved benefit programs and checklists.
        </p>

        {state?.error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '1.5rem', textAlign: 'center', fontWeight: 500 }}>
            {state.error}
          </div>
        )}

        {/* Action form */}
        <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="var(--text-light)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="email" 
                id="email" 
                name="email"
                placeholder="you@example.com" 
                required 
                style={{ paddingLeft: '2.75rem' }}
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="var(--text-light)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="password" 
                id="password" 
                name="password"
                placeholder="••••••••" 
                required 
                style={{ paddingLeft: '2.75rem' }}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={isPending} style={{ marginTop: '0.75rem' }}>
            {isPending ? <Loader2 className="animate-spin" size={18} /> : null}
            {isPending ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-light)' }}>
          Don't have an account?{' '}
          <Link href="/register" style={{ color: 'var(--primary-color)', fontWeight: 600, textDecoration: 'none' }}>
            Sign Up
          </Link>
        </div>
      </div>
    </main>
  );
}
