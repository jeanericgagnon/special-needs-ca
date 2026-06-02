'use client';

import React, { useState } from 'react';
import { 
  Coins, Shield, Info, HelpCircle, CheckCircle2, 
  AlertTriangle, TrendingUp, BookOpen, Sparkles, Scale 
} from 'lucide-react';

export default function PlanningClient() {
  // Simulator state
  const [savingsAmount, setSavingsAmount] = useState(15000);

  // Quiz states
  const [fundingSource, setFundingSource] = useState<'parents' | 'inheritance' | 'child-injury'>('parents');
  const [expectedBalance, setExpectedBalance] = useState<'low' | 'mid' | 'high'>('mid');
  const [spendingTimeline, setSpendingTimeline] = useState<'immediate' | 'longterm' | 'mixed'>('mixed');

  // Recommendation logic
  const getRecommendation = () => {
    if (fundingSource === 'child-injury') {
      return {
        title: 'First-Party Special Needs Trust (SNT) with optional CalABLE wrapper',
        desc: 'Since funds belong directly to the child (e.g. lawsuit settlement or direct inheritance), a First-Party SNT is legally mandated to protect benefits. You can transfer up to $18,000 annually from the trust into a CalABLE account to facilitate tax-free daily spending without trustee signatures.',
        recoveryNote: 'Note: First-Party SNTs require a Medicaid state-recovery provision upon the beneficiary\'s passing.'
      };
    }

    if (expectedBalance === 'high' || fundingSource === 'inheritance') {
      return {
        title: 'Third-Party Special Needs Trust (Master Trust) + CalABLE account combination',
        desc: 'This is the gold-standard setup. For balances exceeding $100,000 or funds originating from extended family wills/wills, establish a Third-Party SNT. This protects the estate from Medicaid recovery. Supplement this by transferring funds into a CalABLE account for daily disability expenditures (QDEs) to maximize flexibility.',
        recoveryNote: 'Third-Party SNTs have no Medicaid clawback provisions. Unused funds pass directly to secondary heirs.'
      };
    }

    return {
      title: 'Direct CalABLE Account (Standalone)',
      desc: 'For expected savings under $100,000 primarily funded by parents or wages, a CalABLE account is the most cost-effective and immediate tool. It takes 15 minutes to open online, carries minimal fees, and allows the child or parents to spend money directly using a debit card for Qualified Disability Expenses.',
      recoveryNote: 'California has outlawed Medicaid estate recovery on CalABLE accounts for residents, making it highly safe.'
    };
  };

  const recommendation = getRecommendation();

  // Helper to determine eligibility status based on savings amount
  const exceedsSsiLimit = savingsAmount > 2000;
  const exceedsCalableSsiLimit = savingsAmount > 100000;

  return (
    <main className="container animate-fade-in" style={{ paddingBottom: '5rem', maxWidth: '1150px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <Coins size={48} color="var(--primary-color)" style={{ margin: '0 auto 1rem' }} />
        <h1>CalABLE vs Special Needs Trust (SNT) Planner</h1>
        <p style={{ fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto', color: 'var(--text-light)' }}>
          Protect your child's Medi-Cal and SSI eligibility. Simulate the asset limit boundaries and identify the best legal savings structures for your family.
        </p>
      </div>

      {/* Simulator Section */}
      <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '3rem', background: 'rgba(255, 255, 255, 0.85)' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.5rem' }}>
          <TrendingUp size={20} color="var(--primary-color)" /> Asset Limit Eligibility Simulator
        </h2>
        
        <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: '1.5', marginBottom: '2rem' }}>
          California Medicaid (Medi-Cal) and SSI impose a strict **$2,000 asset limit** on individuals. Exceeding this cap disqualifies your child from medical services and monthly checks. Slide the bar to simulate your planned savings and see the shielding impact of CalABLE and SNTs.
        </p>

        {/* Slider control */}
        <div style={{ background: 'rgba(0,0,0,0.02)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.03)', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Planned Savings / Investment Target:</span>
            <strong style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}>${savingsAmount.toLocaleString()}</strong>
          </div>
          
          <input 
            type="range" 
            min="500" 
            max="150000" 
            step="500"
            value={savingsAmount}
            onChange={(e) => setSavingsAmount(parseInt(e.target.value))}
            style={{ width: '100%', height: '8px', cursor: 'pointer', accentColor: 'var(--primary-color)' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>
            <span>$500</span>
            <span>$2,000 (Standard Limit)</span>
            <span>$50,000</span>
            <span>$100,000 (SSI CalABLE Limit)</span>
            <span>$150,000+</span>
          </div>
        </div>

        {/* Visual Bar Comparison Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', flexWrap: 'wrap' }} className="iep-grid-layout">
          
          {/* Card A: Unprotected Account */}
          <div style={{ 
            background: exceedsSsiLimit ? 'rgba(239, 68, 68, 0.02)' : 'rgba(16, 185, 129, 0.02)',
            border: `1px solid ${exceedsSsiLimit ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)'}`,
            borderRadius: '16px',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', justifySelf: 'space-between', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>Standard Savings Account</span>
                <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(0,0,0,0.05)', fontWeight: 600 }}>Unprotected</span>
              </div>
              
              <div style={{ height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', overflow: 'hidden', margin: '1rem 0' }}>
                <div style={{ 
                  height: '100%', 
                  width: `${Math.min((savingsAmount / 2000) * 100, 100)}%`, 
                  background: exceedsSsiLimit ? '#ef4444' : '#10b981',
                  transition: 'width 0.2s ease'
                }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '1.25rem' }}>
                <span>Asset Cap: $2,000</span>
                <span>Current: ${savingsAmount.toLocaleString()}</span>
              </div>
            </div>

            {exceedsSsiLimit ? (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', background: 'rgba(239, 68, 68, 0.05)', padding: '0.85rem', borderRadius: '10px' }}>
                <AlertTriangle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.78rem', color: '#b91c1c', lineHeight: 1.4 }}>
                  <strong>Benefit Disqualification!</strong> Your child exceeds the $2,000 limit by <strong>${(savingsAmount - 2000).toLocaleString()}</strong>. They will lose Medi-Cal eligibility and monthly SSI payments.
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', background: 'rgba(16, 185, 129, 0.05)', padding: '0.85rem', borderRadius: '10px' }}>
                <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.78rem', color: '#15803d' }}>
                  <strong>Eligible.</strong> Balances remain under the $2,000 cap. Benefits are protected.
                </div>
              </div>
            )}
          </div>

          {/* Card B: Protected Account */}
          <div style={{ 
            background: exceedsCalableSsiLimit ? 'rgba(245, 158, 11, 0.02)' : 'rgba(16, 185, 129, 0.02)',
            border: `1px solid ${exceedsCalableSsiLimit ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)'}`,
            borderRadius: '16px',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', justifySelf: 'space-between', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>CalABLE or Special Needs Trust</span>
                <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)', fontWeight: 700 }}>Asset Shielded</span>
              </div>
              
              <div style={{ height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', overflow: 'hidden', margin: '1rem 0' }}>
                <div style={{ 
                  height: '100%', 
                  width: `${Math.min((savingsAmount / 100000) * 100, 100)}%`, 
                  background: exceedsCalableSsiLimit ? '#f59e0b' : '#10b981',
                  transition: 'width 0.2s ease'
                }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '1.25rem' }}>
                <span>SSI Shield Cap: $100,000 (SNT has no cap)</span>
                <span>Current: ${savingsAmount.toLocaleString()}</span>
              </div>
            </div>

            {exceedsCalableSsiLimit ? (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', background: 'rgba(245, 158, 11, 0.05)', padding: '0.85rem', borderRadius: '10px' }}>
                <AlertTriangle size={18} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.78rem', color: '#b45309', lineHeight: 1.4 }}>
                  <strong>SSI Suspended, Medi-Cal Safe.</strong> CalABLE shields up to $100,000 for SSI. The excess limits will temporarily suspend SSI checks, but **Medi-Cal remains 100% active**. (Use SNT to shield over $100k).
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', background: 'rgba(16, 185, 129, 0.05)', padding: '0.85rem', borderRadius: '10px' }}>
                <Shield size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.78rem', color: '#15803d', lineHeight: 1.4 }}>
                  <strong>100% Shielded.</strong> Under California CalABLE/SNT code guidelines, these assets are completely ignored. Benefits remain fully protected.
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
        
        {/* Left: Interactive Quiz Panel */}
        <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="grid-col-lg-5">
          
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <HelpCircle size={18} color="var(--primary-color)" /> Savings Strategy Finder
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Question 1 */}
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>1. What is the source of the savings funds?</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.4rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="q1" 
                      checked={fundingSource === 'parents'} 
                      onChange={() => setFundingSource('parents')} 
                    />
                    <span>Parents' savings, child wages, or family gifts</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="q1" 
                      checked={fundingSource === 'inheritance'} 
                      onChange={() => setFundingSource('inheritance')} 
                    />
                    <span>Inheritance from wills, estates, or trust fund payouts</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="q1" 
                      checked={fundingSource === 'child-injury'} 
                      onChange={() => setFundingSource('child-injury')} 
                    />
                    <span>Injury lawsuit settlement or direct child assets</span>
                  </label>
                </div>
              </div>

              {/* Question 2 */}
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>2. What is the target target savings limit?</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.4rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="q2" 
                      checked={expectedBalance === 'low'} 
                      onChange={() => setExpectedBalance('low')} 
                    />
                    <span>Under $20,000 (Short-term needs)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="q2" 
                      checked={expectedBalance === 'mid'} 
                      onChange={() => setExpectedBalance('mid')} 
                    />
                    <span>$20,000 - $100,000 (Educational / vehicle / therapy budget)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="q2" 
                      checked={expectedBalance === 'high'} 
                      onChange={() => setExpectedBalance('high')} 
                    />
                    <span>Over $100,000 (Lifetime care estate allocation)</span>
                  </label>
                </div>
              </div>

              {/* Question 3 */}
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>3. What is the spending timeline expectation?</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.4rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="q3" 
                      checked={spendingTimeline === 'immediate'} 
                      onChange={() => setSpendingTimeline('immediate')} 
                    />
                    <span>Immediate (Frequent, small daily expense withdrawals)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="q3" 
                      checked={spendingTimeline === 'longterm'} 
                      onChange={() => setSpendingTimeline('longterm')} 
                    />
                    <span>Long-Term (Funds locked away for child's adult future)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="q3" 
                      checked={spendingTimeline === 'mixed'} 
                      onChange={() => setSpendingTimeline('mixed')} 
                    />
                    <span>Combination (Some daily flexibility, some legacy protection)</span>
                  </label>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Right: Advisor Recommendation & Setup Directories */}
        <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '2rem' }} className="grid-col-lg-6">
          
          {/* Strategy Recommendation Card */}
          <div className="glass-panel" style={{ padding: '2rem', borderLeft: '6px solid var(--primary-color)', background: 'linear-gradient(to right, rgba(99, 102, 241, 0.02), transparent)' }}>
            <span style={{ 
              fontSize: '0.75rem', 
              fontWeight: 700, 
              color: 'var(--primary-color)', 
              textTransform: 'uppercase', 
              background: 'rgba(99, 102, 241, 0.08)',
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              display: 'inline-block',
              marginBottom: '0.5rem'
            }}>
              Recommended Strategy
            </span>
            
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
              {recommendation.title}
            </h3>
            
            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.6', marginBottom: '1rem' }}>
              {recommendation.desc}
            </p>

            <div style={{ background: 'rgba(0,0,0,0.02)', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.8rem', color: 'var(--text-light)' }}>
              <strong>Estate Recovery Warning:</strong> {recommendation.recoveryNote}
            </div>
          </div>

          {/* Setup Directories */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <BookOpen size={18} color="var(--primary-color)" /> Asset Shield Setup Directories
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Directory 1: CalABLE */}
              <div style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Sparkles size={14} color="var(--primary-color)" /> CalABLE Account Setup Details
                </h4>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.82rem', color: 'var(--text-light)', display: 'flex', flexDirection: 'column', gap: '0.25rem', lineHeight: 1.4 }}>
                  <li><strong>Contribution Cap:</strong> Up to $18,000 annually (or more if the child is employed under ABLE to Work rules).</li>
                  <li><strong>Tax Shield:</strong> Earnings grow 100% tax-free when used for Qualified Disability Expenses (QDE).</li>
                  <li><strong>What is a QDE?</strong> Extremely broad: housing, groceries, transit, therapies, assistive tech, tuition, and funeral costs.</li>
                  <li><strong>How to open:</strong> Open directly at <a href="https://calable.ca.gov" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>calable.ca.gov</a> with a minimum $25 deposit.</li>
                </ul>
              </div>

              {/* Directory 2: Third-Party SNT */}
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Scale size={14} color="var(--primary-color)" /> Third-Party Special Needs Trust Guidelines
                </h4>
                <ul style={{ paddingLeft: '1rem', fontSize: '0.82rem', color: 'var(--text-light)', display: 'flex', flexDirection: 'column', gap: '0.25rem', lineHeight: 1.4 }}>
                  <li><strong>No Savings Limit:</strong> Can hold millions of dollars without affecting SSI or Medi-Cal.</li>
                  <li><strong>Asset Sourcing:</strong> Must be funded by **family assets** (parents' estate, grandparents' will, life insurance). Never fund with the child's own wages/direct gifts.</li>
                  <li><strong>Medicaid Reclamation:</strong> Completely immune to state Medi-Cal estate reclamation rules.</li>
                  <li><strong>Trustee Oversight:</strong> Requires appointing a trustee (family member or corporate) to sign off on distributions. Trustee pays vendors directly; funds cannot go directly to the child.</li>
                </ul>
              </div>

            </div>
          </div>

        </div>

      </div>

    </main>
  );
}
