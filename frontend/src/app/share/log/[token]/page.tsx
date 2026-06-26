import React from 'react';
import { verifyShareToken, getChildProfile, getSafetyIncidents } from '@/lib/db';
import SharedLogView from './SharedLogView';
import { ShieldAlert } from 'lucide-react';

export default async function SharedLogPage({ params }: { params: Promise<{ token: string }> }) {
  const resolvedParams = await params;
  const token = resolvedParams.token;
  
  // 1. Verify token validity and expiration
  const tokenObj = await verifyShareToken(token);
  if (!tokenObj) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,rgba(16,24,48,1),rgba(8,12,24,1))] flex items-center justify-center p-4">
        <div className="max-w-md w-full glass-panel p-8 rounded-2xl border border-red-500/20 text-center space-y-4">
          <div className="h-12 w-12 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20 text-red-400 mx-auto">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Access Denied or Link Expired</h2>
          <p className="text-sm text-slate-400">
            The practitioner share link is invalid, has expired, or has been revoked by the parent. 
            Under HIPAA security standard rules, all medical and behavior records are closed.
          </p>
        </div>
      </div>
    );
  }

  // 2. Fetch the corresponding decrypted child profile
  const child = await getChildProfile(tokenObj.child_id);
  const incidents = await getSafetyIncidents(tokenObj.child_id);

  if (!child) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,rgba(16,24,48,1),rgba(8,12,24,1))] flex items-center justify-center p-4">
        <div className="max-w-md w-full glass-panel p-8 rounded-2xl border border-red-500/20 text-center space-y-4">
          <div className="h-12 w-12 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20 text-red-400 mx-auto">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Profile Missing</h2>
          <p className="text-sm text-slate-400">
            The child profile associated with this token could not be found. It may have been deleted.
          </p>
        </div>
      </div>
    );
  }

  return (
    <SharedLogView 
      child={child}
      incidents={incidents}
      token={token}
      scope={tokenObj.access_scope}
    />
  );
}
