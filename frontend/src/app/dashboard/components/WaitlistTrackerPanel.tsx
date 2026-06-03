'use client';

import React, { useState, useEffect } from 'react';
import { useChildProfile } from './ChildProfileContext';
import { 
  ClipboardList, Calendar, Phone, 
  Trash2, Plus, Sparkles, Info 
} from 'lucide-react';

interface WaitlistItem {
  id: string;
  providerName: string;
  category: 'clinical' | 'therapy' | 'regional-center';
  dateJoined: string;
  position: string;
  phone: string;
  notes: string;
  status: 'waiting' | 'contacted' | 'scheduled' | 'active';
}

interface WaitlistTrackerPanelProps {
  isSpanish?: boolean;
}

export default function WaitlistTrackerPanel({ isSpanish = false }: WaitlistTrackerPanelProps) {
  const { currentChild } = useChildProfile();
  const [items, setItems] = useState<WaitlistItem[]>([]);
  
  // Form states
  const [providerName, setProviderName] = useState('');
  const [category, setCategory] = useState<'clinical' | 'therapy' | 'regional-center'>('therapy');
  const [dateJoined, setDateJoined] = useState('');
  const [position, setPosition] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'waiting' | 'contacted' | 'scheduled' | 'active'>('waiting');
  
  const [showAddForm, setShowAddForm] = useState(false);

  // Load items from localStorage on mount/child change
  useEffect(() => {
    if (currentChild) {
      const saved = localStorage.getItem(`waitlists_${currentChild.id}`);
      let loadedItems: WaitlistItem[] = [];
      if (saved) {
        try {
          loadedItems = JSON.parse(saved);
        } catch {
          // ignore
        }
      } else {
        // Seed default waitlist items for demonstration
        const defaultItems: WaitlistItem[] = [
          {
            id: 'demo-1',
            providerName: 'Children\'s Hospital LA (CHLA) Developmental Ped',
            category: 'clinical',
            dateJoined: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            position: '142',
            phone: '(323) 361-2000',
            notes: 'Wait time estimated at 12-18 months. Need to follow up monthly.',
            status: 'waiting'
          },
          {
            id: 'demo-2',
            providerName: 'Milestones Pediatric Speech Therapy',
            category: 'therapy',
            dateJoined: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            position: '12',
            phone: '(818) 555-0192',
            notes: 'In-network with L.A. Care. Initial intake scheduled but actual services waitlisted.',
            status: 'contacted'
          }
        ];
        loadedItems = defaultItems;
        localStorage.setItem(`waitlists_${currentChild.id}`, JSON.stringify(defaultItems));
      }

      Promise.resolve().then(() => {
        setItems(loadedItems);
      });
    }
  }, [currentChild]);

  // Persist items
  const saveItems = (newItems: WaitlistItem[]) => {
    setItems(newItems);
    if (currentChild) {
      localStorage.setItem(`waitlists_${currentChild.id}`, JSON.stringify(newItems));
    }
  };

  if (!currentChild) return null;

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!providerName.trim()) return;

    const newItem: WaitlistItem = {
      id: `item-${Date.now()}`,
      providerName,
      category,
      dateJoined: dateJoined || new Date().toISOString().split('T')[0],
      position: position || 'N/A',
      phone,
      notes,
      status
    };

    const updated = [...items, newItem];
    saveItems(updated);
    
    // Reset form
    setProviderName('');
    setCategory('therapy');
    setDateJoined('');
    setPosition('');
    setPhone('');
    setNotes('');
    setStatus('waiting');
    setShowAddForm(false);
  };

  const handleDeleteItem = (id: string) => {
    const updated = items.filter(item => item.id !== id);
    saveItems(updated);
  };

  const handleStatusChange = (id: string, newStatus: WaitlistItem['status']) => {
    const updated = items.map(item => {
      if (item.id === id) {
        return { ...item, status: newStatus };
      }
      return item;
    });
    saveItems(updated);
  };

  const getCategoryLabel = (cat: WaitlistItem['category']) => {
    if (isSpanish) {
      switch (cat) {
        case 'clinical': return 'Evaluación Clínica';
        case 'therapy': return 'Terapia Directa';
        case 'regional-center': return 'Centro Regional';
      }
    } else {
      switch (cat) {
        case 'clinical': return 'Clinical Evaluation';
        case 'therapy': return 'Direct Therapy';
        case 'regional-center': return 'Regional Center';
      }
    }
  };

  const getStatusBadgeColor = (stat: WaitlistItem['status']) => {
    switch (stat) {
      case 'waiting': return { bg: 'rgba(245, 158, 11, 0.1)', text: '#d97706' };
      case 'contacted': return { bg: 'rgba(59, 130, 246, 0.1)', text: '#2563eb' };
      case 'scheduled': return { bg: 'rgba(139, 92, 246, 0.1)', text: '#7c3aed' };
      case 'active': return { bg: 'rgba(16, 185, 129, 0.1)', text: '#059669' };
    }
  };

  const getStatusLabel = (stat: WaitlistItem['status']) => {
    if (isSpanish) {
      switch (stat) {
        case 'waiting': return 'En Espera';
        case 'contacted': return 'Contactado';
        case 'scheduled': return 'Programado';
        case 'active': return 'Activo';
      }
    } else {
      switch (stat) {
        case 'waiting': return 'Waiting';
        case 'contacted': return 'Contacted';
        case 'scheduled': return 'Scheduled';
        case 'active': return 'Active';
      }
    }
  };

  // Translations
  const t = {
    title: isSpanish ? 'Rastreador de Lista de Espera de Proveedores' : 'Provider Waitlist & Shortage Tracker',
    subtitle: isSpanish 
      ? 'Monitoree los tiempos de espera clínicos, de terapia y de servicios del Centro Regional. Registre las fechas de seguimiento para evitar perder su lugar.'
      : 'Monitor clinical, therapy, and Regional Center service wait times. Track follow-up dates to ensure your child remains active in the queue.',
    intakeTitle: isSpanish ? 'Guía de Preparación para Admisión Clínica' : 'Clinical Intake Prep Checklist',
    intakeSubtitle: isSpanish 
      ? 'Asegure estos documentos clave antes de su cita de admisión para acelerar las aprobaciones de servicio:'
      : 'Secure these key items before your intake appointment to accelerate service authorizations:',
    referral: isSpanish ? 'Referencia médica del pediatra' : 'Pediatrician clinical referral / script',
    diagnoses: isSpanish ? 'Informes de diagnóstico psicológico o médico previos' : 'Prior psychological or clinical diagnoses reports',
    iep: isSpanish ? 'Evaluación del IEP escolar o plan 504' : 'School IEP evaluation or 504 plan reports',
    safetylog: isSpanish ? 'Registro detallado de incidentes de seguridad (24 horas)' : 'Detailed 24-hour safety behavior log',
    insurance: isSpanish ? 'Código de autorización previa del seguro de salud' : 'Health insurance prior authorization code',
    emptyText: isSpanish 
      ? 'No hay proveedores registrados en la lista de espera de este perfil. Agregue uno a continuación para comenzar el seguimiento.'
      : 'No active waitlist items registered for this profile. Add a provider below to begin tracking.',
    addBtn: isSpanish ? 'Agregar Proveedor a Lista de Espera' : 'Add Waitlist Provider',
    formTitle: isSpanish ? 'Detalles de la Lista de Espera' : 'Waitlist Provider Details',
    providerName: isSpanish ? 'Nombre del Proveedor / Centro' : 'Provider / Clinic Name',
    category: isSpanish ? 'Categoría de Servicio' : 'Service Category',
    dateJoined: isSpanish ? 'Fecha de Registro' : 'Date Joined',
    position: isSpanish ? 'Número / Posición en Lista' : 'Waitlist Position / Number',
    phone: isSpanish ? 'Número de Teléfono' : 'Contact Phone Number',
    notes: isSpanish ? 'Notas y Historial de Contacto' : 'Notes & Follow-up History',
    status: isSpanish ? 'Estado de Lista' : 'Waitlist Status',
    saveBtn: isSpanish ? 'Guardar Proveedor' : 'Save Provider',
    cancelBtn: isSpanish ? 'Cancelar' : 'Cancel',
    categoryClinical: isSpanish ? 'Evaluación Clínica / Diagnóstico' : 'Clinical Assessment / Diagnosis',
    categoryTherapy: isSpanish ? 'Terapia Directa (Speech, OT, ABA)' : 'Direct Therapy (Speech, OT, ABA)',
    categoryRC: isSpanish ? 'Servicios del Centro Regional' : 'Regional Center Intake / Services',
    phName: isSpanish ? 'ej. Clínica de Terapia Pediátrica' : 'e.g. Pediatric Therapy Clinic',
    phPos: isSpanish ? 'ej. 14 o Desconocido' : 'e.g. 14 or Unknown',
    phNotes: isSpanish ? 'ej. Llamar el primer martes de cada mes para verificar el estado.' : 'e.g. Call first Tuesday of every month to verify status.',
    statusWaiting: isSpanish ? 'En Espera (Pendiente)' : 'Waiting (Pending Queue)',
    statusContacted: isSpanish ? 'Contactado (Llamada de seguimiento)' : 'Contacted (Follow-up Call)',
    statusScheduled: isSpanish ? 'Intake Programado' : 'Scheduled (Intake Appt Set)',
    statusActive: isSpanish ? 'Activo (Recibiendo Terapia)' : 'Active (Therapy Started)'
  };

  return (
    <div className="animate-fade-in iep-grid-layout" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', alignItems: 'start' }}>
      
      {/* Left: Waitlist Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '2rem', background: 'rgba(255, 255, 255, 0.85)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <ClipboardList size={22} color="var(--primary-color)" />
                {t.title}
              </h3>
              <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginTop: '0.25rem', lineHeight: 1.4 }}>
                {t.subtitle}
              </p>
            </div>
            
            {!showAddForm && (
              <button 
                onClick={() => setShowAddForm(true)} 
                className="btn-primary" 
                style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.85rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <Plus size={16} />
                <span>{t.addBtn}</span>
              </button>
            )}
          </div>

          {/* Add Form */}
          {showAddForm && (
            <form onSubmit={handleAddItem} className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(var(--primary-rgb), 0.02)', borderColor: 'rgba(var(--primary-rgb), 0.1)', marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>{t.formTitle}</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>{t.providerName}</label>
                  <input 
                    type="text" 
                    required 
                    value={providerName} 
                    onChange={(e) => setProviderName(e.target.value)} 
                    placeholder={t.phName}
                    style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', width: '100%' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>{t.category}</label>
                    <select 
                      value={category} 
                      onChange={(e) => setCategory(e.target.value as WaitlistItem['category'])} 
                      style={{ padding: '0.5rem', fontSize: '0.85rem', width: '100%' }}
                    >
                      <option value="therapy">{t.categoryTherapy}</option>
                      <option value="clinical">{t.categoryClinical}</option>
                      <option value="regional-center">{t.categoryRC}</option>
                    </select>
                  </div>

                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>{t.dateJoined}</label>
                    <input 
                      type="date" 
                      value={dateJoined} 
                      onChange={(e) => setDateJoined(e.target.value)} 
                      style={{ padding: '0.5rem', fontSize: '0.85rem', width: '100%' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>{t.position}</label>
                    <input 
                      type="text" 
                      value={position} 
                      onChange={(e) => setPosition(e.target.value)} 
                      placeholder={t.phPos}
                      style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', width: '100%' }}
                    />
                  </div>

                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>{t.phone}</label>
                    <input 
                      type="text" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      placeholder="(555) 012-3456"
                      style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', width: '100%' }}
                    />
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>{t.status}</label>
                  <select 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value as WaitlistItem['status'])} 
                    style={{ padding: '0.5rem', fontSize: '0.85rem', width: '100%' }}
                  >
                    <option value="waiting">{t.statusWaiting}</option>
                    <option value="contacted">{t.statusContacted}</option>
                    <option value="scheduled">{t.statusScheduled}</option>
                    <option value="active">{t.statusActive}</option>
                  </select>
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>{t.notes}</label>
                  <textarea 
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)} 
                    placeholder={t.phNotes}
                    style={{ width: '100%', minHeight: '60px', fontSize: '0.85rem', padding: '0.5rem', borderRadius: '8px' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <button 
                    type="button" 
                    onClick={() => setShowAddForm(false)} 
                    className="btn-secondary" 
                    style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                  >
                    {t.cancelBtn}
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary" 
                    style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                  >
                    {t.saveBtn}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Waitlist List */}
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1.5rem', border: '1px dashed var(--glass-border)', borderRadius: '12px', background: 'rgba(0,0,0,0.01)' }}>
              <Info size={32} color="var(--text-light)" style={{ margin: '0 auto 1rem' }} />
              <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: 1.5 }}>
                {t.emptyText}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {items.map(item => {
                const badge = getStatusBadgeColor(item.status);
                return (
                  <div 
                    key={item.id} 
                    style={{ 
                      padding: '1.25rem', 
                      background: 'rgba(255,255,255,0.5)', 
                      border: '1px solid var(--glass-border)', 
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <span style={{ fontSize: '0.72rem', background: 'rgba(0,0,0,0.04)', padding: '0.15rem 0.4rem', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-light)' }}>
                          {getCategoryLabel(item.category)}
                        </span>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0.2rem 0 0 0', color: 'var(--text-main)' }}>
                          {item.providerName}
                        </h4>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <select 
                          value={item.status} 
                          onChange={(e) => handleStatusChange(item.id, e.target.value as WaitlistItem['status'])}
                          style={{ 
                            fontSize: '0.75rem', 
                            padding: '0.25rem 0.5rem', 
                            background: badge?.bg, 
                            color: badge?.text,
                            border: '1px solid transparent',
                            borderRadius: '6px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            width: 'auto'
                          }}
                        >
                          <option value="waiting" style={{ color: 'black', background: 'white' }}>{getStatusLabel('waiting')}</option>
                          <option value="contacted" style={{ color: 'black', background: 'white' }}>{getStatusLabel('contacted')}</option>
                          <option value="scheduled" style={{ color: 'black', background: 'white' }}>{getStatusLabel('scheduled')}</option>
                          <option value="active" style={{ color: 'black', background: 'white' }}>{getStatusLabel('active')}</option>
                        </select>

                        <button 
                          onClick={() => handleDeleteItem(item.id)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.25rem' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.78rem', color: 'var(--text-light)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={13} />
                        <strong>{isSpanish ? 'Registrado:' : 'Joined:'}</strong> {item.dateJoined}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <ClipboardList size={13} />
                        <strong>{isSpanish ? 'Lugar/Posición:' : 'Position:'}</strong> #{item.position}
                      </span>
                      {item.phone && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Phone size={13} />
                          <a href={`tel:${item.phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>{item.phone}</a>
                        </span>
                      )}
                    </div>

                    {item.notes && (
                      <div style={{ background: 'rgba(0,0,0,0.02)', padding: '0.75rem', borderRadius: '8px', borderLeft: '3px solid var(--text-light)', fontSize: '0.8rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                        {item.notes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right: Intake Checklist Info */}
      <div className="glass-panel" style={{ padding: '2rem', background: 'rgba(255, 255, 255, 0.85)' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>
          <Sparkles size={18} color="var(--primary-color)" />
          {t.intakeTitle}
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
          {t.intakeSubtitle}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { key: 'ref', text: t.referral },
            { key: 'diag', text: t.diagnoses },
            { key: 'iep', text: t.iep },
            { key: 'saf', text: t.safetylog },
            { key: 'ins', text: t.insurance }
          ].map(chk => (
            <label 
              key={chk.key} 
              style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '0.5rem', 
                fontSize: '0.82rem', 
                cursor: 'pointer',
                padding: '0.6rem 0.75rem',
                borderRadius: '8px',
                background: 'rgba(0,0,0,0.02)',
                border: '1px solid var(--glass-border)',
                lineHeight: 1.4
              }}
            >
              <input type="checkbox" style={{ marginTop: '3px', cursor: 'pointer', width: 'auto' }} />
              <span>{chk.text}</span>
            </label>
          ))}
        </div>

        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(99,102,241,0.05)', border: '1px dashed rgba(99,102,241,0.2)', borderRadius: '12px', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
          <Info size={16} color="var(--primary-color)" style={{ marginTop: '2px', flexShrink: 0 }} />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-main)', lineHeight: 1.4, margin: 0 }}>
            {isSpanish 
              ? 'Consejo legal: De acuerdo con las normas de Medi-Cal de California, las derivaciones y evaluaciones médicas que documentan la necesidad clínica de terapias deben procesarse en un plazo de 15 a 30 días.'
              : 'Statutory Tip: California Medi-Cal Managed Care Rules mandate that clinical therapy referrals must be authorized or denied within 5 business days of request receipt.'
            }
          </p>
        </div>
      </div>

    </div>
  );
}
