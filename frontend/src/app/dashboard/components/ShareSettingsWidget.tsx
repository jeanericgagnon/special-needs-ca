'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Share2, 
  Clock, 
  Copy, 
  Trash2, 
  Check, 
  Plus, 
  ExternalLink,
  Lock,
  Unlock,
  AlertCircle
} from 'lucide-react';
import { useChildProfile } from './ChildProfileContext';
import { 
  getActiveSharedPortalTokensAction, 
  generateShareTokenAction, 
  revokeShareTokenAction 
} from '../child-actions';

interface PortalToken {
  id: string;
  child_id: string;
  token: string;
  expires_at: string;
  access_scope: 'read_only' | 'read_write';
  created_at: string;
}

export default function ShareSettingsWidget() {
  const { currentChild, isSpanish } = useChildProfile();
  
  const [tokens, setTokens] = useState<PortalToken[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [generating, setGenerating] = useState<boolean>(false);
  
  // Link builder states
  const [duration, setDuration] = useState<number>(7); // Days
  const [scope, setScope] = useState<'read_only' | 'read_write'>('read_only');
  const [newLink, setNewLink] = useState<string>('');
  
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadTokens = useCallback(async () => {
    if (!currentChild?.id) return;
    setLoading(true);
    const res = await getActiveSharedPortalTokensAction(currentChild.id);
    setLoading(false);
    if (res.success && res.tokens) {
      setTokens(res.tokens as PortalToken[]);
    } else {
      setTokens([]);
    }
  }, [currentChild]);

  useEffect(() => {
    if (!currentChild?.id) return;
    
    const task = setTimeout(() => {
      loadTokens();
      setNewLink('');
      setErrorMsg(null);
    }, 0);

    return () => clearTimeout(task);
  }, [currentChild, loadTokens]);

  const handleGenerateLink = async () => {
    if (!currentChild?.id) return;
    setGenerating(true);
    setErrorMsg(null);

    // Calculate expiration date
    const expiration = new Date();
    expiration.setDate(expiration.getDate() + duration);

    const res = await generateShareTokenAction(currentChild.id, expiration.toISOString(), scope);
    setGenerating(false);

    if (res.success && res.token) {
      // Build fully qualified URL
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const secureUrl = `${origin}/share/log/${res.token.token}`;
      setNewLink(secureUrl);
      loadTokens();
    } else {
      setErrorMsg(res.error || 'Failed to generate link');
    }
  };

  const handleRevokeToken = async (tokenId: string) => {
    if (!currentChild?.id) return;
    if (!confirm(isSpanish 
      ? '¿Está seguro de revocar este enlace de acceso? Los médicos con este enlace ya no podrán ver los registros.' 
      : 'Are you sure you want to revoke this access link? Anyone using it will instantly lose access to your child\'s log.'
    )) return;

    setLoading(true);
    const res = await revokeShareTokenAction(tokenId, currentChild.id);
    setLoading(false);

    if (res.success) {
      loadTokens();
      if (newLink.includes(tokenId)) {
        setNewLink('');
      }
    } else {
      setErrorMsg(res.error || 'Failed to revoke token');
    }
  };

  const handleCopyLink = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-[rgba(255,255,255,0.06)] space-y-6">
      
      {/* Widget Header */}
      <div className="flex items-start justify-between border-b border-[rgba(255,255,255,0.08)] pb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Share2 className="h-5 w-5 text-indigo-400" />
            {isSpanish ? 'Portal de Cuidado Compartido' : 'Shared Care Portals'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {isSpanish 
              ? 'Conceda acceso temporal a pediatras, terapeutas o cuidadores para ver y registrar incidentes.' 
              : 'Provision time-bounded, secure access tokens for clinicians or therapists to inspect behavior logs.'}
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-300 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Access Generator Builder */}
      <div className="space-y-4 bg-[rgba(255,255,255,0.02)] p-4 rounded-xl border border-[rgba(255,255,255,0.04)]">
        <h4 className="font-semibold text-white text-xs uppercase tracking-wider text-slate-300">
          {isSpanish ? 'Generar Nuevo Enlace Seguro' : 'Generate Secure Access Link'}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              {isSpanish ? 'Duración del Enlace' : 'Link Duration'}
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full bg-[rgba(15,23,42,0.6)] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value={1}>{isSpanish ? '1 Día' : '1 Day'}</option>
              <option value={7}>{isSpanish ? '7 Días (Recomendado)' : '7 Days (Recommended)'}</option>
              <option value={30}>{isSpanish ? '30 Días' : '30 Days'}</option>
              <option value={90}>{isSpanish ? '90 Días' : '90 Days'}</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              {isSpanish ? 'Nivel de Permiso' : 'Access Permission Level'}
            </label>
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value as 'read_only' | 'read_write')}
              className="w-full bg-[rgba(15,23,42,0.6)] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="read_only">🔍 {isSpanish ? 'Solo Lectura (Ver registros)' : 'Read-Only (View logs)'}</option>
              <option value="read_write">✍️ {isSpanish ? 'Lectura y Escritura (Registrar incidentes)' : 'Read & Write (Log incidents)'}</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerateLink}
          disabled={generating}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-[rgba(99,102,241,0.2)] disabled:opacity-50"
        >
          {generating ? (
            <Clock className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Plus className="h-3.5 w-3.5" />
          )}
          {isSpanish ? 'Generar Enlace de Acceso' : 'Create Care Link'}
        </button>

        {newLink && (
          <div className="mt-4 p-3 bg-indigo-500/5 border border-indigo-500/20 rounded-lg space-y-2 animate-fade-in">
            <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">
              {isSpanish ? '¡Enlace Generado Exitosamente!' : 'Secure Care Link Created!'}
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={newLink}
                className="grow bg-[rgba(15,23,42,0.6)] border border-[rgba(255,255,255,0.08)] text-[10px] text-slate-300 px-3 py-2 rounded-lg focus:outline-none truncate"
              />
              <button
                onClick={() => handleCopyLink(newLink, 'new-link-btn')}
                className="p-2 bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.08)] text-slate-300 hover:text-white rounded-lg transition-colors shrink-0"
                title={isSpanish ? 'Copiar Enlace' : 'Copy Link'}
              >
                {copiedId === 'new-link-btn' ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
            <p className="text-[9px] text-slate-500 italic">
              {isSpanish 
                ? 'Comparta esta URL con el pediatra o terapeuta para darles acceso instantáneo sin registro.'
                : 'Provide this URL to your child\'s therapist or doctor to grant instant access. No account signup needed.'}
            </p>
          </div>
        )}
      </div>

      {/* Active portal links grid list */}
      <div className="space-y-3">
        <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">
          {isSpanish ? 'Enlaces de Acceso Activos' : 'Active Care Tokens'}
        </h4>

        {loading ? (
          <div className="flex items-center justify-center py-6">
            <Clock className="h-5 w-5 text-indigo-400 animate-spin" />
          </div>
        ) : tokens.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500 border border-dashed border-[rgba(255,255,255,0.06)] rounded-xl italic">
            {isSpanish ? 'No hay enlaces de acceso activos.' : 'No active care portal links generated.'}
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
            {tokens.map((tok) => {
              const isExpired = new Date(tok.expires_at) < new Date();
              const isReadWrite = tok.access_scope === 'read_write';
              const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/share/log/${tok.token}` : '';
              
              return (
                <div 
                  key={tok.id}
                  className={`p-3 border rounded-xl flex items-center justify-between gap-3 text-xs ${
                    isExpired
                      ? 'bg-red-500/5 border-red-500/10 opacity-60'
                      : 'bg-[rgba(255,255,255,0.01)] border-[rgba(255,255,255,0.06)]'
                  }`}
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700 select-all truncate max-w-[120px]">
                        {tok.token.substring(0, 12)}...
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold border flex items-center gap-1 ${
                        isReadWrite 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
                      }`}>
                        {isReadWrite ? (
                          <>
                            <Unlock className="h-2.5 w-2.5" />
                            {isSpanish ? 'Lectura/Escritura' : 'Read/Write'}
                          </>
                        ) : (
                          <>
                            <Lock className="h-2.5 w-2.5" />
                            {isSpanish ? 'Solo Lectura' : 'Read-Only'}
                          </>
                        )}
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-500" />
                      <span>
                        {isSpanish ? 'Expira el:' : 'Expires:'} {new Date(tok.expires_at).toLocaleDateString()}
                      </span>
                      {isExpired && (
                        <span className="text-red-400 font-semibold uppercase text-[9px] ml-1">
                          {isSpanish ? 'EXPIRADO' : 'EXPIRED'}
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {!isExpired && (
                      <>
                        <button
                          onClick={() => handleCopyLink(shareUrl, tok.id)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-[rgba(255,255,255,0.05)] rounded-lg border border-[rgba(255,255,255,0.06)] transition-colors"
                          title={isSpanish ? 'Copiar Enlace' : 'Copy Link'}
                        >
                          {copiedId === tok.id ? (
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                        <a
                          href={shareUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-[rgba(255,255,255,0.05)] rounded-lg border border-[rgba(255,255,255,0.06)] transition-colors"
                          title={isSpanish ? 'Abrir Enlace' : 'Open Link'}
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </>
                    )}
                    <button
                      onClick={() => handleRevokeToken(tok.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg border border-[rgba(255,255,255,0.06)] hover:border-red-500/20 transition-colors"
                      title={isSpanish ? 'Revocar Acceso' : 'Revoke Link'}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
