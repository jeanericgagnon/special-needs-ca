'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Mail, 
  Send, 
  Paperclip, 
  User, 
  MessageSquare, 
  Clock, 
  FileText, 
  ShieldCheck, 
  ArrowRight, 
  RefreshCw
} from 'lucide-react';
import type { ChildClinicalDocument, SafetyIncident } from '@/lib/db';
import { useChildProfile } from './ChildProfileContext';
import { 
  getConsultationThreadsAction, 
  getThreadMessagesAction, 
  createConsultationThreadAction, 
  sendConsultationMessageAction,
  getIepAdvocatesAction,
  getChildClinicalDocumentsAction,
  getSafetyIncidentsAction
} from '../child-actions';

interface Advocate {
  id: string;
  name: string;
  credentials: string;
  experience_years: number;
  price_rate: string;
  counties_served: string;
  languages_spoken: string;
  phone: string;
  email: string;
  website: string;
  specialties?: string;
  regional_center_vendorized?: number;
  organization_affiliation?: string;
  description?: string;
}

interface Thread {
  id: string;
  child_id: string;
  advocate_id: string;
  status: string;
  created_at: string;
  advocate_name?: string;
  advocate_credentials?: string;
}

interface ChatMessage {
  id: string;
  thread_id: string;
  sender_role: 'parent' | 'advocate';
  message_text: string;
  attachments_json: string | null;
  created_at: string;
}

interface AttachmentOption {
  type: 'clinical_doc' | 'safety_log';
  id: string;
  label: string;
  payload: ChildClinicalDocument | SafetyIncident;
}

export default function InboxPanel() {
  const { currentChild, isSpanish } = useChildProfile();
  
  const [threads, setThreads] = useState<Thread[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  
  // Attachments lookup states
  const [clinicalDocs, setClinicalDocs] = useState<ChildClinicalDocument[]>([]);
  const [safetyIncidents, setSafetyIncidents] = useState<SafetyIncident[]>([]);
  
  // Form states
  const [inputText, setInputText] = useState<string>('');
  const [showAttachMenu, setShowAttachMenu] = useState<boolean>(false);
  const [attachedItems, setAttachedItems] = useState<AttachmentOption[]>([]);
  
  // Loading & UI States
  const [loadingThreads, setLoadingThreads] = useState<boolean>(false);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);
  const [typing, setTyping] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleSelectThread = useCallback(async (thread: Thread) => {
    setSelectedThread(thread);
    setLoadingMessages(true);
    setAttachedItems([]);
    setInputText('');
    
    const res = await getThreadMessagesAction(thread.id, currentChild!.id);
    setLoadingMessages(false);
    
    if (res.success && res.messages) {
      setMessages(res.messages as ChatMessage[]);
    } else {
      setMessages([]);
    }
  }, [currentChild]);

  const loadInboxData = useCallback(async () => {
    if (!currentChild?.id) return;
    setLoadingThreads(true);
    
    // 1. Fetch Threads
    const threadsRes = await getConsultationThreadsAction(currentChild.id);
    // 2. Fetch Advocates
    const advocatesRes = await getIepAdvocatesAction(currentChild.county_id);
    // 3. Fetch attachments options
    const docsRes = await getChildClinicalDocumentsAction(currentChild.id);
    const logsRes = await getSafetyIncidentsAction(currentChild.id);

    setLoadingThreads(false);

    if (threadsRes.success && threadsRes.threads) {
      const activeThreads = threadsRes.threads as Thread[];
      setThreads(activeThreads);
      if (activeThreads.length > 0) {
        handleSelectThread(activeThreads[0]);
      } else {
        setSelectedThread(null);
        setMessages([]);
      }
    }

    if (advocatesRes.success && advocatesRes.advocates) {
      setAdvocates(advocatesRes.advocates as Advocate[]);
    }

    if (docsRes.success && docsRes.documents) {
      setClinicalDocs(docsRes.documents);
    }
    if (logsRes.success && logsRes.incidents) {
      setSafetyIncidents(logsRes.incidents);
    }
  }, [currentChild, handleSelectThread]);

  useEffect(() => {
    if (!currentChild?.id) return;
    
    const task = setTimeout(() => {
      loadInboxData();
    }, 0);

    return () => clearTimeout(task);
  }, [currentChild, loadInboxData]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing, scrollToBottom]);

  const handleConnectAdvocate = async (advocateId: string) => {
    if (!currentChild?.id) return;
    
    // Check if thread already exists for this advocate
    const existing = threads.find(t => t.advocate_id === advocateId);
    if (existing) {
      handleSelectThread(existing);
      return;
    }

    setLoadingThreads(true);
    const res = await createConsultationThreadAction(currentChild.id, advocateId);
    if (res.success && res.threadId) {
      // Re-fetch threads
      const fetchRes = await getConsultationThreadsAction(currentChild.id);
      if (fetchRes.success && fetchRes.threads) {
        setThreads(fetchRes.threads as Thread[]);
        const newThread = (fetchRes.threads as Thread[]).find(t => t.id === res.threadId);
        if (newThread) {
          handleSelectThread(newThread);
        }
      }
    } else {
      setLoadingThreads(false);
      alert(res.error || 'Failed to start thread');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentChild?.id || !selectedThread) return;
    if (!inputText.trim() && attachedItems.length === 0) return;

    setSending(true);
    const attachmentsPayload = attachedItems.length > 0 
      ? JSON.stringify(attachedItems.map(item => ({ type: item.type, id: item.id, label: item.label })))
      : null;

    const res = await sendConsultationMessageAction(
      selectedThread.id,
      currentChild.id,
      inputText,
      'parent',
      attachmentsPayload
    );

    setSending(false);
    if (res.success && res.message) {
      setMessages(prev => [...prev, res.message as ChatMessage]);
      setInputText('');
      setAttachedItems([]);
      setShowAttachMenu(false);

      // Trigger Advocate Simulated Auto-Response
      triggerSimulatedAdvocateReply(selectedThread.advocate_id);
    } else {
      alert(res.error || 'Failed to send message');
    }
  };

  // Automated Consultant Response Logic based on their specialty persona
  const triggerSimulatedAdvocateReply = (advocateId: string) => {
    setTyping(true);
    
    // Select custom template depending on advocate persona
    setTimeout(async () => {
      let replyText = '';
      if (isSpanish) {
        if (advocateId === 'adv-marisol' || advocateId.includes('torres')) {
          replyText = `¡Hola! Gracias por enviarme los detalles del caso de ${currentChild?.nickname || 'su hijo'}. He revisado la información. Es muy importante que solicitemos la evaluación de educación especial por escrito al distrito escolar. En California, según el Código de Educación § 56321, el distrito tiene exactamente 15 días calendario para enviarle un plan de evaluación desde que recibe nuestra carta. ¿Cuándo podemos agendar una videollamada para preparar la solicitud?`;
        } else {
          replyText = `Hola, he recibido su mensaje y los archivos adjuntos sobre ${currentChild?.nickname || 'su caso'}. Revisaré detalladamente las adaptaciones recomendadas. Recuerde que bajo la Ley Lanterman de California, usted es miembro principal del equipo de planificación del Centro Regional. Hablamos pronto para estructurar nuestra estrategia de apelación.`;
        }
      } else {
        if (advocateId === 'adv-sarah' || advocateId.includes('jenkins')) {
          replyText = `Hi there! Thank you for sharing ${currentChild?.nickname || 'your child'}'s record. I reviewed the details you provided. For the accommodations draft, I highly recommend we cite California Education Code § 56341.1 to request specific speech services. Let's schedule a Zoom call to align on our targets before your next school IEP meeting.`;
        } else if (advocateId === 'adv-katelyn' || advocateId.includes('vance')) {
          replyText = `Hello! I reviewed ${currentChild?.nickname || 'your child'}'s safety logs. These documented incidents of wandering/elopement are absolutely crucial for securing Protective Supervision hours under California IHSS guidelines. Let's build a clean evidence file for the county social worker's next audit.`;
        } else if (advocateId === 'adv-david' || advocateId.includes('chen')) {
          replyText = `Hello, I received your message. I am analyzing the IEP and the evaluations. In California, if you disagree with the school's assessment, you have a right to request an Independent Educational Evaluation (IEE) at public expense under 34 CFR § 300.502. We should prepare that request letter next.`;
        } else {
          replyText = `Hello! Thank you for reaching out. I have received the consultation packet for ${currentChild?.nickname || 'your child'}. I will review the documents and write back with our recommended options. Speak soon!`;
        }
      }

      const res = await sendConsultationMessageAction(
        selectedThread!.id,
        currentChild!.id,
        replyText,
        'advocate',
        null
      );

      setTyping(false);
      if (res.success && res.message) {
        setMessages(prev => [...prev, res.message as ChatMessage]);
      }
    }, 2000);
  };

  const handleAddAttachment = (type: 'clinical_doc' | 'safety_log', item: ChildClinicalDocument | SafetyIncident) => {
    const isAlreadyAttached = attachedItems.some(x => x.id === item.id && x.type === type);
    if (isAlreadyAttached) return;

    let label = '';
    if (type === 'clinical_doc') {
      label = (item as ChildClinicalDocument).file_name;
    } else {
      const incident = item as SafetyIncident;
      label = `${incident.category} incident (${incident.time})`;
    }

    const option: AttachmentOption = {
      type,
      id: item.id,
      label,
      payload: item
    };

    setAttachedItems(prev => [...prev, option]);
    setShowAttachMenu(false);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachedItems(prev => prev.filter(x => x.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[rgba(255,255,255,0.1)] gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Mail className="h-6 w-6 text-indigo-400" />
            {isSpanish ? 'Centro de Mensajería y Asesoría' : 'Parent-Advocate Consultation Hub'}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {isSpanish 
              ? 'Conéctese directamente con defensores del IEP y asesores de IHSS locales para compartir reportes de comportamiento y documentos clínicos.' 
              : 'Securely message local special ed advocates and IHSS coordinators. Share safety logs and parsed clinical documents for review.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[500px]">
        
        {/* Left Column: Thread List / Vetted Advocates List */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="glass-panel p-4 rounded-xl border border-[rgba(255,255,255,0.06)] flex flex-col grow max-h-[500px] overflow-hidden">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400 mb-3">
              {isSpanish ? 'Consultas Activas' : 'Active Referrals'}
            </h3>
            
            {loadingThreads ? (
              <div className="flex justify-center py-6 grow">
                <Clock className="h-5 w-5 text-indigo-400 animate-spin" />
              </div>
            ) : threads.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500 italic grow border border-dashed border-[rgba(255,255,255,0.05)] rounded-xl flex flex-col justify-center">
                {isSpanish ? 'No hay consultas activas.' : 'No active consultations.'}
              </div>
            ) : (
              <div className="space-y-2 overflow-y-auto pr-1 grow scrollbar-thin">
                {threads.map((thread) => (
                  <button
                    key={thread.id}
                    onClick={() => handleSelectThread(thread)}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                      selectedThread?.id === thread.id
                        ? 'bg-[rgba(99,102,241,0.15)] border-indigo-500/40 text-white'
                        : 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.05)] text-slate-300'
                    }`}
                  >
                    <div className="h-8 w-8 bg-indigo-500/10 rounded-full flex items-center justify-center border border-indigo-500/20 text-indigo-400 shrink-0">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="truncate text-xs">
                      <p className="font-semibold truncate">{thread.advocate_name}</p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{thread.advocate_credentials}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* List Vetted advocates in County */}
            <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.08)] space-y-3">
              <h4 className="font-bold text-white text-[10px] uppercase tracking-wider text-slate-400">
                {isSpanish ? 'Defensores en su Condado' : 'County Advocates'}
              </h4>
              
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin">
                {advocates.map((adv) => (
                  <div 
                    key={adv.id}
                    className="p-2 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-lg flex items-center justify-between text-xs gap-1.5"
                  >
                    <div className="truncate">
                      <p className="font-semibold text-slate-200 truncate">{adv.name}</p>
                      <p className="text-[9px] text-slate-400 truncate">{adv.price_rate}</p>
                    </div>
                    <button
                      onClick={() => handleConnectAdvocate(adv.id)}
                      className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] font-bold rounded transition-colors"
                    >
                      {isSpanish ? 'Mensaje' : 'Chat'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right 3 Columns: Active Chat Pane */}
        <div className="lg:col-span-3 flex flex-col">
          {selectedThread ? (
            <div className="glass-panel rounded-xl border border-[rgba(255,255,255,0.06)] flex flex-col h-[500px] overflow-hidden">
              
              {/* Header Profile Bar */}
              <div className="p-4 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between bg-[rgba(255,255,255,0.01)] shrink-0">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-indigo-500/10 rounded-full flex items-center justify-center border border-indigo-500/20 text-indigo-400">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{selectedThread.advocate_name}</h3>
                    <p className="text-xs text-slate-400">{selectedThread.advocate_credentials}</p>
                  </div>
                </div>
                
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  {isSpanish ? 'Cifrado HIPAA' : 'HIPAA Protected'}
                </span>
              </div>

              {/* Chat Message list bubbles */}
              <div className="grow p-4 overflow-y-auto space-y-4 bg-[rgba(15,23,42,0.15)] scrollbar-thin">
                {loadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <Clock className="h-6 w-6 text-indigo-400 animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 text-xs text-center p-6 space-y-2">
                    <MessageSquare className="h-8 w-8 text-slate-600" />
                    <p>{isSpanish ? 'Envíe un mensaje para comenzar la consulta.' : 'Send a message to begin your initial case consult.'}</p>
                    <p className="text-[10px] text-slate-600 max-w-xs">{isSpanish ? 'Puede adjuntar logs de incidentes o IEPs usando el clip de papel.' : 'Attach behavior logs or clinical profiles using the clip attachment icon.'}</p>
                  </div>
                ) : (
                  <>
                    {messages.map((msg) => {
                      const isParent = msg.sender_role === 'parent';
                      let parsedAttachments: AttachmentOption[] = [];
                      if (msg.attachments_json) {
                        try {
                          parsedAttachments = JSON.parse(msg.attachments_json);
                        } catch {}
                      }
                      
                      return (
                        <div 
                          key={msg.id}
                          className={`flex ${isParent ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[70%] rounded-2xl p-3 text-xs leading-relaxed ${
                            isParent 
                              ? 'bg-indigo-600 text-white rounded-tr-none'
                              : 'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.06)] text-slate-200 rounded-tl-none'
                          }`}>
                            <p>{msg.message_text}</p>
                            
                            {/* Render attachments chips */}
                            {parsedAttachments.length > 0 && (
                              <div className="mt-2.5 pt-2 border-t border-[rgba(255,255,255,0.15)] space-y-1">
                                {parsedAttachments.map((att, i) => (
                                  <div 
                                    key={i}
                                    className="flex items-center gap-1.5 px-2 py-1 bg-[rgba(0,0,0,0.2)] rounded text-[10px] text-slate-300 border border-[rgba(255,255,255,0.05)] truncate"
                                  >
                                    <FileText className="h-3 w-3 text-indigo-400 shrink-0" />
                                    <span className="truncate">{att.label}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            <span className="block text-[9px] text-slate-400 mt-1.5 text-right font-mono">
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    {typing && (
                      <div className="flex justify-start">
                        <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.06)] rounded-2xl rounded-tl-none p-3 text-xs flex items-center gap-1 text-slate-400 font-mono">
                          <RefreshCw className="h-3.5 w-3.5 animate-spin text-indigo-400" />
                          {isSpanish ? 'Asesor escribiendo...' : 'Advocate typing...'}
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Chat Send Message and Attachment Builder Forms */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.01)] shrink-0 space-y-2 relative">
                
                {/* Active attached files bar */}
                {attachedItems.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pb-2 border-b border-[rgba(255,255,255,0.05)] text-[10px]">
                    {attachedItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                        <FileText className="h-3 w-3 shrink-0" />
                        <span>{item.label}</span>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveAttachment(item.id)}
                          className="hover:text-red-400 font-bold ml-1"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowAttachMenu(!showAttachMenu)}
                      className={`p-2 rounded-xl border transition-colors ${
                        showAttachMenu 
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400'
                          : 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)] text-slate-400 hover:text-slate-200'
                      }`}
                      title={isSpanish ? 'Adjuntar Registro' : 'Attach Record'}
                    >
                      <Paperclip className="h-4 w-4" />
                    </button>

                    {/* Popover Attachment Selector */}
                    {showAttachMenu && (
                      <div className="absolute bottom-12 left-0 w-64 bg-[rgba(30,41,59,0.95)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] rounded-xl shadow-2xl p-3 z-30 space-y-2.5 text-xs">
                        
                        <div>
                          <p className="font-bold text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">{isSpanish ? 'Documentos Clínicos OCR' : 'Clinical OCR Vault'}</p>
                          {clinicalDocs.length === 0 ? (
                            <p className="text-[10px] text-slate-500 italic px-2">{isSpanish ? 'Sin archivos verificados.' : 'No verified files.'}</p>
                          ) : (
                            <div className="space-y-1 max-h-[80px] overflow-y-auto pr-1 scrollbar-thin">
                              {clinicalDocs.map((doc) => (
                                <button
                                  type="button"
                                  key={doc.id}
                                  onClick={() => handleAddAttachment('clinical_doc', doc)}
                                  className="w-full text-left px-2 py-1 bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.06)] rounded truncate text-[10px] text-slate-300 block"
                                >
                                  {doc.file_name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        <div>
                          <p className="font-bold text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">{isSpanish ? 'Registros de Comportamiento' : 'IHSS Safety Logs'}</p>
                          {safetyIncidents.length === 0 ? (
                            <p className="text-[10px] text-slate-500 italic px-2">{isSpanish ? 'Sin incidentes registrados.' : 'No safety logs.'}</p>
                          ) : (
                            <div className="space-y-1 max-h-[80px] overflow-y-auto pr-1 scrollbar-thin">
                              {safetyIncidents.map((log) => (
                                <button
                                  type="button"
                                  key={log.id}
                                  onClick={() => handleAddAttachment('safety_log', log)}
                                  className="w-full text-left px-2 py-1 bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.06)] rounded truncate text-[10px] text-slate-300 block"
                                >
                                  {log.category} ({log.risk_level})
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                      </div>
                    )}
                  </div>

                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="grow bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] focus:border-indigo-500 text-white placeholder-slate-500 px-4 py-2.5 rounded-xl text-xs focus:outline-none"
                    placeholder={isSpanish ? 'Escriba un mensaje...' : 'Ask your advocate a question or share case data...'}
                  />

                  <button
                    type="submit"
                    disabled={sending || typing}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-md shadow-[rgba(99,102,241,0.2)] disabled:opacity-50"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>

            </div>
          ) : (
            <div className="glass-panel rounded-xl border border-[rgba(255,255,255,0.06)] flex flex-col items-center justify-center grow h-[500px] text-center p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-[0.02]">
                <MessageSquare className="h-64 w-64 text-indigo-400" />
              </div>
              
              <div className="h-14 w-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 text-indigo-400 mb-4">
                <MessageSquare className="h-6 w-6" />
              </div>
              
              <h3 className="text-base font-semibold text-white">
                {isSpanish ? 'Consulte con un Defensor' : 'Connect with a Specialist'}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1.5 mb-6 leading-relaxed">
                {isSpanish 
                  ? 'Seleccione una consulta activa de la izquierda o conéctese con un defensor de IEP en su condado para solicitar revisiones de planes y soporte legal.' 
                  : 'Start a messaging thread with a special ed expert. Ask questions, send incident graphs, or attach clinical paperwork.'}
              </p>

              {advocates.length > 0 && (
                <div className="w-full max-w-xs space-y-2">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-left pl-1">{isSpanish ? 'Defensores sugeridos' : 'Recommended Advisors'}</p>
                  {advocates.slice(0, 2).map((adv) => (
                    <button
                      key={adv.id}
                      onClick={() => handleConnectAdvocate(adv.id)}
                      className="w-full p-3 bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.06)] rounded-xl flex items-center justify-between text-xs transition-all group text-left"
                    >
                      <div>
                        <p className="font-semibold text-slate-200 group-hover:text-white">{adv.name}</p>
                        <p className="text-[10px] text-slate-400">{adv.credentials}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
