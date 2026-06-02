import React, { useState } from 'react';
import { Compass, LayoutDashboard, ShieldAlert, Sparkles, Menu, X } from 'lucide-react';

export default function Header({ currentTab, setCurrentTab, userProfilesCount }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'directory', label: 'Public Directory', icon: Compass },
    { id: 'dashboard', label: 'Family Dashboard', icon: LayoutDashboard, badge: userProfilesCount > 0 ? userProfilesCount : null },
    { id: 'admin', label: 'Admin Portal', icon: ShieldAlert }
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(10, 15, 29, 0.75)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--glass-border)',
      padding: '16px 0'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setCurrentTab('directory')}>
          <div style={{
            background: 'linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-teal) 100%)',
            padding: '8px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(139, 92, 246, 0.3)'
          }}>
            <Sparkles size={20} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
              <span className="gradient-text">CALIFORNIA</span>
            </h1>
            <span style={{ fontSize: '11px', color: 'var(--accent-teal)', fontWeight: 600, display: 'block', marginTop: '-4px', letterSpacing: '0.1em' }}>
              DISABILITY NAVIGATOR
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="desktop-only">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id || (item.id === 'directory' && currentTab.startsWith('directory'));
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`nav-link ${isActive ? 'active' : ''}`}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  padding: '8px 0',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)'
                }}
              >
                <Icon size={16} />
                {item.label}
                {item.badge && (
                  <span style={{
                    background: 'var(--accent-purple)',
                    color: 'white',
                    fontSize: '10px',
                    borderRadius: '999px',
                    padding: '2px 6px',
                    fontWeight: 700
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }} className="desktop-only">
          <button 
            onClick={() => setCurrentTab('screener')}
            className="btn btn-teal"
            style={{ padding: '8px 16px', fontSize: '13px' }}
          >
            Check Child's Benefits
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            padding: '4px'
          }}
          className="mobile-toggle-btn"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--glass-border)',
          padding: '16px 24px',
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxShadow: 'var(--shadow-lg)',
          animation: 'fadeIn 0.2s ease-out forwards'
        }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                style={{
                  background: isActive ? 'rgba(255, 255, 255, 0.05)' : 'none',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  textAlign: 'left',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  padding: '12px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  fontSize: '15px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon size={18} />
                  {item.label}
                </div>
                {item.badge && (
                  <span style={{
                    background: 'var(--accent-purple)',
                    color: 'white',
                    fontSize: '11px',
                    borderRadius: '999px',
                    padding: '2px 8px',
                    fontWeight: 700
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          <button 
            onClick={() => {
              setCurrentTab('screener');
              setMobileMenuOpen(false);
            }}
            className="btn btn-teal"
            style={{ width: '100%', padding: '12px' }}
          >
            Check Child's Benefits
          </button>
        </div>
      )}

      {/* Basic Embedded Mobile Media Queries via standard inline style */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
        }
        @media (min-width: 769px) {
          .mobile-toggle-btn { display: none !important; }
        }
      `}} />
    </header>
  );
}
