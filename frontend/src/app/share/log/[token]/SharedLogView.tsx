'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Plus, 
  Clock, 
  AlertTriangle, 
  FileText, 
  User, 
  Check, 
  Lock
} from 'lucide-react';
import { saveSharedIncidentAction } from '../../../dashboard/child-actions';

interface ChildProfile {
  id: string;
  nickname: string;
  dob: string;
  county_id: string;
  zip_code: string;
  insurance_type: string;
  school_status: string;
  caregiver_notes: string;
}

interface SafetyIncident {
  id: string;
  child_id: string;
  time: string;
  category: string;
  risk_level: string;
  details: string;
  intervention: string;
}

interface SharedLogViewProps {
  child: ChildProfile;
  incidents: SafetyIncident[];
  token: string;
  scope: 'read_only' | 'read_write';
}

export default function SharedLogView({ child, incidents, token, scope }: SharedLogViewProps) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [category, setCategory] = useState<string>('meltdown');
  const [riskLevel, setRiskLevel] = useState<string>('medium');
  const [details, setDetails] = useState<string>('');
  const [intervention, setIntervention] = useState<string>('');
  const [time, setTime] = useState<string>(new Date().toISOString().slice(0, 16));

  const handleSubmitIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim() || !intervention.trim()) {
      setErrorMsg('Please specify incident details and interventions used.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    const formattedIncident = {
      id: 'inc-' + Date.now(),
      time: time.replace('T', ' '),
      category,
      risk_level: riskLevel,
      details,
      intervention
    };

    const res = await saveSharedIncidentAction(token, formattedIncident);
    setSubmitting(false);

    if (res.success) {
      setSuccess(true);
      // Clear form
      setDetails('');
      setIntervention('');
      setTime(new Date().toISOString().slice(0, 16));
      setTimeout(() => setSuccess(false), 4000);
    } else {
      setErrorMsg(res.error || 'Failed to submit incident log');
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,rgba(16,24,48,1),rgba(8,12,24,1))] py-8 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Portal Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[rgba(255,255,255,0.08)]">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 text-indigo-400">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase">Special Needs CA</span>
                <span className="h-1.5 w-1.5 bg-slate-500 rounded-full"></span>
                <span className="text-[10px] text-slate-400 font-mono">PRACTITIONER PORTAL</span>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Shared Care Dashboard</h1>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-lg flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              HIPAA Protected Link
            </span>
            <span className="px-3 py-1 bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono rounded-lg">
              {scope === 'read_write' ? '✍️ Read & Write' : '🔍 Read-Only'}
            </span>
          </div>
        </header>

        {/* Child Meta Summary Card */}
        <div className="glass-panel p-6 rounded-2xl border border-[rgba(255,255,255,0.06)] grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:border-r border-[rgba(255,255,255,0.08)] pr-4 space-y-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Patient Name</p>
            <p className="text-lg font-bold text-white flex items-center gap-1.5">
              <User className="h-4 w-4 text-indigo-400" />
              {child.nickname}
            </p>
          </div>
          <div className="md:border-r border-[rgba(255,255,255,0.08)] px-4 space-y-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date of Birth</p>
            <p className="text-sm font-semibold text-slate-200">{child.dob}</p>
          </div>
          <div className="md:border-r border-[rgba(255,255,255,0.08)] px-4 space-y-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Primary Insurance</p>
            <p className="text-sm font-semibold text-slate-200 capitalize">{child.insurance_type}</p>
          </div>
          <div className="pl-4 space-y-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">School District Status</p>
            <p className="text-sm font-semibold text-slate-200 capitalize">{child.school_status.replace('_', ' ')}</p>
          </div>
        </div>

        {/* Main Columns: Incidents Feed vs Logging Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Feed Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-400" />
                Child Behavior & Safety History
              </h3>
              <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded-md font-mono text-[10px]">
                {incidents.length} {incidents.length === 1 ? 'incident' : 'incidents'}
              </span>
            </div>

            {incidents.length === 0 ? (
              <div className="glass-panel p-8 text-center rounded-2xl border border-[rgba(255,255,255,0.06)] italic text-slate-500 text-sm">
                No behavioral or safety incidents have been logged for {child.nickname}.
              </div>
            ) : (
              <div className="space-y-4">
                {incidents.map((incident) => {
                  const isHigh = incident.risk_level === 'high';
                  const isMed = incident.risk_level === 'medium';
                  
                  return (
                    <div 
                      key={incident.id} 
                      className="glass-panel p-5 rounded-2xl border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.01)] hover:bg-[rgba(255,255,255,0.02)] transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase">
                            {incident.category}
                          </span>
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                            <Clock className="h-3 w-3 text-slate-500" />
                            <span>{incident.time}</span>
                          </div>
                        </div>

                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono uppercase tracking-wider font-bold border ${
                          isHigh 
                            ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                            : isMed 
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
                        }`}>
                          {incident.risk_level} RISK
                        </span>
                      </div>

                      <div className="text-xs text-slate-300 bg-[rgba(15,23,42,0.4)] p-3 rounded-lg border border-[rgba(255,255,255,0.03)] space-y-2">
                        <p><strong>Observed Behavior:</strong> {incident.details}</p>
                        <p><strong>Intervention Applied:</strong> {incident.intervention}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Form Column */}
          <div className="space-y-6">
            {scope === 'read_write' ? (
              <div className="glass-panel p-6 rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.015)] space-y-4">
                <div>
                  <h3 className="font-bold text-white text-sm uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Plus className="h-4 w-4 text-indigo-400" />
                    Log Behavior Incident
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Record therapy or classroom behaviors. Logs are immediately synced to the parent&apos;s IHSS dashboard.
                  </p>
                </div>

                {success && (
                  <div className="p-3 bg-emerald-500/15 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span>Incident logged successfully!</span>
                  </div>
                )}

                {errorMsg && (
                  <div className="p-3 bg-red-500/15 border border-red-500/20 text-red-300 text-xs rounded-xl flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSubmitIncident} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Incident Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-[rgba(15,23,42,0.6)] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="meltdown">Meltdown / Tantrum</option>
                      <option value="elopement">Elopement / Wandering</option>
                      <option value="aggression">Aggressive Behavior</option>
                      <option value="self_harm">Self-Injurious Action</option>
                      <option value="sensory_overload">Sensory Crisis</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Severity / Risk Level
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['low', 'medium', 'high'].map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setRiskLevel(lvl)}
                          className={`py-1.5 rounded-lg border font-mono uppercase text-[10px] font-semibold text-center transition-all ${
                            riskLevel === lvl
                              ? lvl === 'high'
                                ? 'bg-red-500/25 border-red-500/50 text-red-300'
                                : lvl === 'medium'
                                  ? 'bg-amber-500/25 border-amber-500/50 text-amber-300'
                                  : 'bg-indigo-500/25 border-indigo-500/50 text-indigo-300'
                              : 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.06)] text-slate-400 hover:bg-[rgba(255,255,255,0.04)]'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Incident Time
                    </label>
                    <input
                      type="datetime-local"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-[rgba(15,23,42,0.6)] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Observed Behaviors & Triggers
                    </label>
                    <textarea
                      rows={3}
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      className="w-full bg-[rgba(15,23,42,0.6)] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 resize-none"
                      placeholder="e.g. Screaming when transitions occurred, threw blocks..."
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Clinical Interventions Applied
                    </label>
                    <textarea
                      rows={3}
                      value={intervention}
                      onChange={(e) => setIntervention(e.target.value)}
                      className="w-full bg-[rgba(15,23,42,0.6)] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 resize-none"
                      placeholder="e.g. Relocated to sensory swing, dim lights, applied compression vest..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-[rgba(99,102,241,0.2)] disabled:opacity-50"
                  >
                    {submitting ? (
                      <Clock className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Plus className="h-3.5 w-3.5" />
                    )}
                    Log Care Incident
                  </button>
                </form>
              </div>
            ) : (
              <div className="glass-panel p-6 rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.01)] text-center space-y-4">
                <div className="h-10 w-10 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 mx-auto text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-white text-sm">Read-Only Session</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The parent has granted Read-Only rights for this access link. 
                  You may observe the behavior histories and clinical notes but logging functions are disabled.
                </p>
              </div>
            )}

            {/* Compliance reference box */}
            <div className="glass-panel p-5 rounded-2xl border border-[rgba(255,255,255,0.06)] text-[11px] text-slate-400 leading-relaxed space-y-2">
              <p className="font-bold text-white">Legal & Compliance Notice</p>
              <p>
                In California, keeping behavior logs is a foundational requirement under the 
                <strong> Lanterman Act (W&I Code § 4685)</strong> and 
                <strong> IHSS protective supervision</strong> reviews.
              </p>
              <p>
                All data is encrypted in transit and at rest. These logs serve as professional witness records for county appeals.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
