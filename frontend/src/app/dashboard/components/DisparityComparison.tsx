'use client';

import React from 'react';
import { useChildProfile } from './ChildProfileContext';
import { REGIONAL_CENTER_METRICS, STATEWIDE_AVERAGES } from '@/lib/funding-data';
import { Landmark, TrendingUp, AlertTriangle } from 'lucide-react';

interface DisparityComparisonProps {
  isSpanish?: boolean;
}

const CONTEXT_TRANSLATIONS: Record<string, string> = {
  fdlrc: 'Mayor gasto promedio de POS pero disparidades de entrega de servicios significativas en grupos lingüísticos/étnicos, particularmente en servicios de respiro y comportamiento. La escasez de personal en el centro de LA afecta la utilización.',
  sdrc: 'Asignaciones de respiro por debajo del promedio. Los clientes del condado de Imperial enfrentan desiertos severos de personal, resultando en una baja utilización del 42% de las horas autorizadas.',
  rceb: 'Tasa de utilización moderada-alta en comparación con el sur de CA. Presencia fuerte de defensores locales, aunque las listas de espera para programas de recreación social han crecido post-restauración.',
  acrc: 'Utilización relativamente alta debido a redes de agencias robustas en Sacramento. Sin embargo, los condados rurales (ej. Alpine, Sierra) experimentan cuellos de botella por escasez crítica de terapeutas.',
  irc: 'El centro regional más grande de California. Sufre de subfinanciación crítica per cápita y la utilización de respiro más baja (38%) en el estado debido a brechas severas en los salarios de los proveedores.',
  rcoc: 'Niveles altos de gasto promedio y autorizaciones de respiro. Sin embargo, los informes de auditoría muestran brechas de financiamiento de POS sustanciales entre hogares de habla inglesa y no inglesa.',
  ggrc: 'El gasto de POS promedio más alto por consumidor en el estado, impulsado por el alto costo de vida. Sin embargo, la contratación de trabajadores de respiro en SF/Marin es extremadamente difícil.',
  vmrc: 'Gasto moderado con disparidades geográficas significativas entre los centros urbanos de Stockton y los condados de las colinas (Amador/Calaveras) que carecen de proveedores de respiro locales.',
  cvrc: 'Gastos por cliente más bajos que el promedio. Las barreras de acceso lingüístico para las comunidades agrícolas limitan la admisión y autorización de supervisión especializada.',
  unknown: 'Se aplican promedios operativos estándar del centro regional. La utilización directa depende de la disponibilidad de proveedores del condado.'
};

export default function DisparityComparison({ isSpanish = false }: DisparityComparisonProps) {
  const { countyDetails, stateConfig } = useChildProfile();

  if (!stateConfig) return null;

  if (stateConfig.code !== 'CA') {
    const tNonCa = {
      title: isSpanish ? `Puntos de Referencia y Servicios en ${stateConfig.name}` : `${stateConfig.name} Local Agency & Waiver Benchmarks`,
      agencyLabel: isSpanish ? 'Agencia Local de Coordinación' : 'Local Intake Coordination Agency',
      waiverLabel: isSpanish ? 'Programa de Exención HCBS Principal' : 'Primary HCBS Waiver Program',
      medicaidLabel: isSpanish ? 'Programa de Medicaid del Estado' : 'State Medicaid Program',
      supportLabel: isSpanish ? 'Recurso de Apoyo Familiar' : 'Family Support Network',
      disclaimer: isSpanish 
        ? 'Las listas de interés y tiempos de espera para las exenciones de Medicaid varían significativamente según el condado y la disponibilidad de fondos estatales.'
        : 'Waiver interest list wait times and provider availability vary significantly based on county resources and legislative appropriations.'
    };

    return (
      <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.7)', display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', border: '1px solid rgba(var(--primary-rgb), 0.1)' }}>
        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.5rem', color: 'var(--text-main)' }}>
            <Landmark color="var(--primary-color)" size={18} />
            {tNonCa.title}
          </h4>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginTop: '0.3rem', lineHeight: 1.4 }}>
            {stateConfig.catchmentDesc}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem', background: 'rgba(0,0,0,0.02)', borderRadius: '8px' }}>
            <span style={{ color: 'var(--text-light)' }}>{tNonCa.agencyLabel}:</span>
            <strong style={{ color: 'var(--text-main)' }}>{stateConfig.catchmentName} ({stateConfig.localAgencyType})</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem', background: 'rgba(0,0,0,0.02)', borderRadius: '8px' }}>
            <span style={{ color: 'var(--text-light)' }}>{tNonCa.waiverLabel}:</span>
            <strong style={{ color: 'var(--primary-color)' }}>{stateConfig.waiverProgram}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem', background: 'rgba(0,0,0,0.02)', borderRadius: '8px' }}>
            <span style={{ color: 'var(--text-light)' }}>{tNonCa.medicaidLabel}:</span>
            <strong style={{ color: 'var(--text-main)' }}>{stateConfig.medicaidName}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem', background: 'rgba(0,0,0,0.02)', borderRadius: '8px' }}>
            <span style={{ color: 'var(--text-light)' }}>{tNonCa.supportLabel}:</span>
            <strong style={{ color: 'var(--text-main)' }}>{stateConfig.specialEducationSupport}</strong>
          </div>
        </div>

        <div style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px dashed #f59e0b', padding: '0.85rem', borderRadius: '8px', fontSize: '0.78rem', color: '#b45309', lineHeight: 1.4 }}>
          ⚠️ <strong>Waitlist Alert:</strong> {tNonCa.disclaimer}
        </div>
      </div>
    );
  }

  if (!countyDetails || !countyDetails.regionalCenters || countyDetails.regionalCenters.length === 0) {
    return null;
  }

  const activeRc = countyDetails.regionalCenters[0];
  // Match with metrics dataset
  const metrics = REGIONAL_CENTER_METRICS.find(m => 
    m.name.toLowerCase().includes(activeRc.name.toLowerCase()) || 
    activeRc.name.toLowerCase().includes(m.name.toLowerCase())
  ) || {
    id: 'unknown',
    name: activeRc.name,
    counties: countyDetails.name,
    avgPosSpend: 13500,
    avgRespiteHours: 20,
    utilizationRate: 50,
    disparityScore: 5,
    context: 'Standard regional center operational averages apply. Direct utilization depends on county vendor availability.'
  };

  const getPercent = (value: number, max: number) => {
    return Math.min(100, Math.max(5, (value / max) * 100));
  };

  const localizedContext = isSpanish 
    ? (CONTEXT_TRANSLATIONS[metrics.id] || CONTEXT_TRANSLATIONS.unknown)
    : metrics.context;

  const t = {
    title: isSpanish ? 'Auditoría de Disparidad del Centro Regional' : 'Regional Center Disparity Audit',
    subtitle: isSpanish 
      ? `Comparando los puntos de referencia de ${metrics.name} con los promedios estatales de California.`
      : `Comparing ${metrics.name} benchmarks against California statewide averages.`,
    posLabel: isSpanish ? 'Compra Promedio de Servicios (POS) (Anual)' : 'Average POS Purchase of Service (Annual)',
    respiteLabel: isSpanish ? 'Asignación Promedio de Respiro (Mensual)' : 'Average Respite Allocation (Monthly)',
    utilizationLabel: isSpanish ? 'Tasa de Utilización de Horas Autorizadas' : 'Authorized Hours Utilization Rate',
    vsState: isSpanish ? 'vs' : 'vs',
    state: isSpanish ? 'estatal' : 'state',
    hrs: isSpanish ? 'hrs' : 'hrs',
    contextTitle: isSpanish ? 'Contexto Regional' : 'Regional Context',
    warningTitle: isSpanish ? 'Advertencia de Baja Utilización del Servicio' : 'Low Service Utilization Warning',
    warningText: isSpanish 
      ? `Este centro regional tiene una tasa de utilización baja (${metrics.utilizationRate}%). Esto se debe típicamente a la escasez de proveedores de cuidado contratados por agencias en su área. Considere solicitar Respiro Autodirigido (Código de Servicio 896) para contratar a familiares o amigos en su lugar.`
      : `This regional center has a low utilization rate (${metrics.utilizationRate}%). This is typically due to a shortage of agency-employed caregiver vendors in your area. Consider requesting Self-Directed Respite (Service Code 896) to hire family/friends instead.`
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.7)', display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', border: '1px solid rgba(var(--primary-rgb), 0.1)' }}>
      <div>
        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.5rem', color: 'var(--text-main)' }}>
          <Landmark color="var(--primary-color)" size={18} />
          {t.title}
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
          {t.subtitle}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        
        {/* Metric 1: Average POS Spend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600 }}>
            <span>{t.posLabel}</span>
            <span style={{ color: 'var(--primary-color)' }}>${metrics.avgPosSpend.toLocaleString()} <span style={{ fontWeight: 400, color: 'var(--text-light)' }}>{t.vsState} ${STATEWIDE_AVERAGES.avgPosSpend.toLocaleString()} {t.state}</span></span>
          </div>
          <div style={{ height: '8px', background: 'rgba(0,0,0,0.04)', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
            <div style={{ width: `${getPercent(metrics.avgPosSpend, 22000)}%`, height: '100%', background: 'var(--primary-color)', borderRadius: '4px', transition: 'width 0.5s ease' }} />
            <div style={{ left: `${getPercent(STATEWIDE_AVERAGES.avgPosSpend, 22000)}%`, width: '2px', height: '100%', background: '#6b7280', position: 'absolute', top: 0 }} />
          </div>
        </div>

        {/* Metric 2: Average Respite Hours */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600 }}>
            <span>{t.respiteLabel}</span>
            <span style={{ color: '#10b981' }}>{metrics.avgRespiteHours} {t.hrs} <span style={{ fontWeight: 400, color: 'var(--text-light)' }}>{t.vsState} {STATEWIDE_AVERAGES.avgRespiteHours} {t.hrs} {t.state}</span></span>
          </div>
          <div style={{ height: '8px', background: 'rgba(0,0,0,0.04)', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
            <div style={{ width: `${getPercent(metrics.avgRespiteHours, 40)}%`, height: '100%', background: '#10b981', borderRadius: '4px', transition: 'width 0.5s ease' }} />
            <div style={{ left: `${getPercent(STATEWIDE_AVERAGES.avgRespiteHours, 40)}%`, width: '2px', height: '100%', background: '#6b7280', position: 'absolute', top: 0 }} />
          </div>
        </div>

        {/* Metric 3: Utilization Rate */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600 }}>
            <span>{t.utilizationLabel}</span>
            <span style={{ color: metrics.utilizationRate < 45 ? 'var(--danger-color)' : '#d97706' }}>{metrics.utilizationRate}% <span style={{ fontWeight: 400, color: 'var(--text-light)' }}>{t.vsState} {STATEWIDE_AVERAGES.utilizationRate}% {t.state}</span></span>
          </div>
          <div style={{ height: '8px', background: 'rgba(0,0,0,0.04)', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
            <div style={{ width: `${metrics.utilizationRate}%`, height: '100%', background: metrics.utilizationRate < 45 ? 'var(--danger-color)' : '#d97706', borderRadius: '4px', transition: 'width 0.5s ease' }} />
            <div style={{ left: `${STATEWIDE_AVERAGES.utilizationRate}%`, width: '2px', height: '100%', background: '#6b7280', position: 'absolute', top: 0 }} />
          </div>
        </div>

      </div>

      <div style={{ background: 'rgba(var(--primary-rgb), 0.02)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(var(--primary-rgb), 0.05)', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-color)', fontWeight: 600 }}>
          <TrendingUp size={16} /> {t.contextTitle}
        </div>
        <p style={{ color: 'var(--text-light)', lineHeight: 1.4 }}>{localizedContext}</p>
      </div>

      {metrics.utilizationRate < 45 && (
        <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '0.85rem', borderRadius: '8px', display: 'flex', gap: '0.5rem', alignItems: 'start', fontSize: '0.78rem' }}>
          <AlertTriangle color="#d97706" size={16} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
          <div>
            <strong style={{ color: '#b45309' }}>{t.warningTitle}</strong>
            <p style={{ color: '#d97706', marginTop: '0.15rem', lineHeight: 1.3 }}>
              {t.warningText}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
