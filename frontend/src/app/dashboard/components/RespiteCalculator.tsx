'use client';

import React, { useState, useEffect } from 'react';
import { useChildProfile } from './ChildProfileContext';
import DisparityComparison from './DisparityComparison';
import { 
  saveChildRespiteAction, 
  getCaregiverFinancialProfileAction, 
  saveCaregiverFinancialProfileAction,
  getChildSdpBudgetAction,
  saveChildSdpBudgetAction
} from '../child-actions';
import { 
  Calculator, Mail, Sparkles, Scale, Trash2, Award
} from 'lucide-react';
import CopyButton from '@/components/copy-button';
import { calculateRespiteTier, compileJustificationBulletPoints } from '@/lib/funding-data';

interface UnmetNeed {
  id: string;
  name: string;
  costType: 'hourly' | 'flat';
  hourlyRate: number;
  hoursPerWeek: number;
  durationWeeks: number;
  flatAmount: number;
  justification: string;
}

interface RespiteCalculatorProps {
  isSpanish?: boolean;
}

export default function RespiteCalculator({ isSpanish = false }: RespiteCalculatorProps) {
  const { currentChild, savedRespiteData, stateConfig } = useChildProfile();

  const [sdpSubTab, setSdpSubTab] = useState<'respite' | 'sdp' | 'eligibility'>('respite');

  // Respite Evaluator states
  const [safetyScore, setSafetyScore] = useState<number>(0);
  const [sleepScore, setSleepScore] = useState<number>(0);
  const [medicalScore, setMedicalScore] = useState<number>(0);
  const [behaviorScore, setBehaviorScore] = useState<number>(0);
  const [respiteSaveStatus, setRespiteSaveStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [financialSaveStatus, setFinancialSaveStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [sdpSaveStatus, setSdpSaveStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  // SDP budget formulation states
  const [posSpend, setPosSpend] = useState<number>(15000);
  const [oneTimeDeductions, setOneTimeDeductions] = useState<number>(0);
  const [unmetNeeds, setUnmetNeeds] = useState<UnmetNeed[]>([]);
  const [newNeedName, setNewNeedName] = useState('');
  const [newNeedCostType, setNewNeedCostType] = useState<'hourly' | 'flat'>('flat');
  const [newNeedFlatAmount, setNewNeedFlatAmount] = useState<number>(1200);
  const [newNeedHourlyRate, setNewNeedHourlyRate] = useState<number>(25);
  const [newNeedHoursPerWeek, setNewNeedHoursPerWeek] = useState<number>(4);
  const [newNeedDurationWeeks, setNewNeedDurationWeeks] = useState<number>(52);
  const [fmsModel, setFmsModel] = useState<string>('bill-payer');

  // SDP Spending Plan allocations
  const [sdpCommunity, setSdpCommunity] = useState<number>(5000);
  const [sdpRespite, setSdpRespite] = useState<number>(5000);
  const [sdpTherapies, setSdpTherapies] = useState<number>(3000);
  const [sdpEquipment, setSdpEquipment] = useState<number>(2000);

  // Asset Limits & Deeming Helper states
  const [isRcClient, setIsRcClient] = useState<boolean>(true);
  const [hasDiagnosis, setHasDiagnosis] = useState<boolean>(true);
  const [majorLimitations, setMajorLimitations] = useState<number>(3);
  const [hasMedicalNeeds, setHasMedicalNeeds] = useState<boolean>(false);
  const [childMediCal, setChildMediCal] = useState<boolean>(false);
  const [familySize, setFamilySize] = useState<number>(3);
  const [grossIncome, setGrossIncome] = useState<number>(85000);
  const [rcChildren, setRcChildren] = useState<number>(1);
  const [savingsAmount, setSavingsAmount] = useState<number>(15000);
  const [fundingSource, setFundingSource] = useState<'parents' | 'inheritance' | 'child-injury'>('parents');
  const [expectedBalance, setExpectedBalance] = useState<'low' | 'mid' | 'high'>('low');
  const [spendingTimeline, setSpendingTimeline] = useState<'immediate' | 'longterm' | 'mixed'>('immediate');
  const [showDeemingLetter, setShowDeemingLetter] = useState<boolean>(false);

  // Hydrate child-specific respite scores on swap
  useEffect(() => {
    if (currentChild) {
      Promise.resolve().then(() => {
        setRespiteSaveStatus({ type: null, message: '' });
        const localRespiteKey = `respite_scores_${currentChild.id}`;
        let safety = 0;
        let sleep = 0;
        let medical = 0;
        let behavior = 0;

        if (savedRespiteData) {
          safety = savedRespiteData.safety_score;
          sleep = savedRespiteData.sleep_score;
          medical = savedRespiteData.medical_score;
          behavior = savedRespiteData.behavior_score;
        } else {
          try {
            const cached = localStorage.getItem(localRespiteKey);
            if (cached) {
              const parsed = JSON.parse(cached);
              safety = parsed.safety || 0;
              sleep = parsed.sleep || 0;
              medical = parsed.medical || 0;
              behavior = parsed.behavior || 0;
            }
          } catch {}
        }

        setSafetyScore(safety);
        setSleepScore(sleep);
        setMedicalScore(medical);
        setBehaviorScore(behavior);
      });
    }
  }, [currentChild, savedRespiteData]);

  // Hydrate Deeming & Financial states from DB, fallback to localStorage
  useEffect(() => {
    if (currentChild) {
      Promise.resolve().then(() => {
        setFinancialSaveStatus({ type: null, message: '' });
      });
      getCaregiverFinancialProfileAction(currentChild.id).then(res => {
        if (res.success && res.profile) {
          const p = res.profile;
          setSavingsAmount(p.savings ?? 15000);
          setFundingSource((p.funding_source as unknown as 'parents' | 'inheritance' | 'child-injury') ?? 'parents');
          setExpectedBalance((p.expected_balance as unknown as 'low' | 'mid' | 'high') ?? 'low');
          setSpendingTimeline((p.spending_timeline as unknown as 'immediate' | 'longterm' | 'mixed') ?? 'immediate');
          setIsRcClient(p.is_rc_client === 1);
          setHasDiagnosis(p.has_diagnosis === 1);
          setMajorLimitations(p.major_limitations ?? 3);
          setHasMedicalNeeds(p.has_medical_needs === 1);
          setChildMediCal(p.child_medi_cal === 1);
          setFamilySize(p.family_size ?? 3);
          setGrossIncome(p.gross_income ?? 85000);
          setRcChildren(p.rc_children ?? 1);
        } else {
          try {
            const savedSavings = localStorage.getItem(`wealth_savings_${currentChild.id}`);
            const savedSource = localStorage.getItem(`wealth_source_${currentChild.id}`);
            const savedBalance = localStorage.getItem(`wealth_balance_${currentChild.id}`);
            const savedTimeline = localStorage.getItem(`wealth_timeline_${currentChild.id}`);
            const savedRcClient = localStorage.getItem(`deeming_rc_client_${currentChild.id}`);
            const savedDiag = localStorage.getItem(`deeming_diagnosis_${currentChild.id}`);
            const savedLimit = localStorage.getItem(`deeming_limit_${currentChild.id}`);
            const savedMedNeeds = localStorage.getItem(`deeming_med_needs_${currentChild.id}`);
            const savedChildMediCal = localStorage.getItem(`deeming_child_medical_${currentChild.id}`);
            const savedFamSize = localStorage.getItem(`deeming_family_size_${currentChild.id}`);
            const savedGrossIncome = localStorage.getItem(`deeming_gross_income_${currentChild.id}`);
            const savedRcChildren = localStorage.getItem(`deeming_rc_children_${currentChild.id}`);

            if (savedSavings) setSavingsAmount(parseInt(savedSavings));
            if (savedSource) setFundingSource(savedSource as unknown as 'parents' | 'inheritance' | 'child-injury');
            if (savedBalance) setExpectedBalance(savedBalance as unknown as 'low' | 'mid' | 'high');
            if (savedTimeline) setSpendingTimeline(savedTimeline as unknown as 'immediate' | 'longterm' | 'mixed');
            if (savedRcClient) setIsRcClient(savedRcClient === 'true');
            if (savedDiag) setHasDiagnosis(savedDiag === 'true');
            if (savedLimit) setMajorLimitations(parseInt(savedLimit));
            if (savedMedNeeds) setHasMedicalNeeds(savedMedNeeds === 'true');
            if (savedChildMediCal) setChildMediCal(savedChildMediCal === 'true');
            if (savedFamSize) setFamilySize(parseInt(savedFamSize));
            if (savedGrossIncome) setGrossIncome(parseInt(savedGrossIncome));
            if (savedRcChildren) setRcChildren(parseInt(savedRcChildren));
          } catch {}
        }
      });
    }
  }, [currentChild]);

  const handleSaveFinancialProfile = async () => {
    if (!currentChild) return;
    setFinancialSaveStatus({ type: null, message: '' });
    const profile = {
      savings: savingsAmount,
      funding_source: fundingSource,
      expected_balance: expectedBalance,
      spending_timeline: spendingTimeline,
      is_rc_client: isRcClient ? 1 : 0,
      has_diagnosis: hasDiagnosis ? 1 : 0,
      major_limitations: majorLimitations,
      has_medical_needs: hasMedicalNeeds ? 1 : 0,
      child_medi_cal: childMediCal ? 1 : 0,
      family_size: familySize,
      gross_income: grossIncome,
      rc_children: rcChildren
    };
    const res = await saveCaregiverFinancialProfileAction(currentChild.id, profile);
    if (res.success) {
      setFinancialSaveStatus({ type: 'success', message: 'Asset limits & deeming parameters saved!' });
      setTimeout(() => setFinancialSaveStatus({ type: null, message: '' }), 4000);
    } else {
      setFinancialSaveStatus({ type: 'error', message: res.error || 'Failed to save financial profile.' });
    }
  };

  // Hydrate child SDP budget on mount/child change
  useEffect(() => {
    if (currentChild) {
      Promise.resolve().then(() => {
        setSdpSaveStatus({ type: null, message: '' });
      });
      getChildSdpBudgetAction(currentChild.id).then(res => {
        if (res.success && res.budget) {
          const b = res.budget;
          setPosSpend(b.pos_spend ?? 15000);
          setOneTimeDeductions(b.one_time_deductions ?? 0);
          setFmsModel(b.fms_model ?? 'bill-payer');
          setSdpCommunity(b.allocated_community ?? 5000);
          setSdpRespite(b.allocated_respite ?? 5000);
          setSdpTherapies(b.allocated_therapies ?? 3000);
          setSdpEquipment(b.allocated_equipment ?? 2000);
          try {
            const parsed = JSON.parse(b.unmet_needs_json || '[]');
            setUnmetNeeds(parsed);
          } catch {
            setUnmetNeeds([]);
          }
        } else {
          // Reset to defaults
          setPosSpend(15000);
          setOneTimeDeductions(0);
          setFmsModel('bill-payer');
          setSdpCommunity(5000);
          setSdpRespite(5000);
          setSdpTherapies(3000);
          setSdpEquipment(2000);
          setUnmetNeeds([]);
        }
      });
    }
  }, [currentChild]);

  const handleSaveSdpBudget = async () => {
    if (!currentChild) return;
    setSdpSaveStatus({ type: null, message: '' });
    
    const budgetData = {
      pos_spend: posSpend,
      one_time_deductions: oneTimeDeductions,
      fms_model: fmsModel,
      allocated_community: sdpCommunity,
      allocated_respite: sdpRespite,
      allocated_therapies: sdpTherapies,
      allocated_equipment: sdpEquipment,
      unmet_needs_json: JSON.stringify(unmetNeeds)
    };

    const res = await saveChildSdpBudgetAction(currentChild.id, budgetData);
    if (res.success) {
      setSdpSaveStatus({ type: 'success', message: 'Proposed budget saved to profile!' });
      setTimeout(() => setSdpSaveStatus({ type: null, message: '' }), 4000);
    } else {
      setSdpSaveStatus({ type: 'error', message: res.error || 'Failed to save proposed budget.' });
    }
  };

  if (!currentChild) return null;

  // Calculators
  const respiteResults = calculateRespiteTier({
    safety: safetyScore,
    sleep: sleepScore,
    medical: medicalScore,
    behavior: behaviorScore
  });

  const justificationText = compileJustificationBulletPoints({
    safety: safetyScore,
    sleep: sleepScore,
    medical: medicalScore,
    behavior: behaviorScore
  });

  const customSubject = isSpanish
    ? `Solicitud de revisión del Plan de Servicios / Adición de Servicios de Respiro - ${currentChild.nickname}`
    : `Request for Service Plan Review / Addition of In-Home Respite Services - ${currentChild.nickname}`;

  const customBody = isSpanish
    ? `Estimado Coordinador,

Espero que este correo se encuentre bien. Le escribo para solicitar formalmente una reunión de revisión de nuestro plan de servicios para solicitar Servicios de Respiro en el Hogar para mi hijo, ${currentChild.nickname} (Fecha de nacimiento: ${currentChild.dob || 'N/A'}).

Durante los últimos meses, las demandas de cuidado de ${currentChild.nickname} han aumentado significativamente, superando con creces los requisitos de cuidado de un niño neurotípico de la misma edad:
${justificationText}

La adición de horas de Respiro en el Hogar es fundamental para prevenir el agotamiento del cuidador, mantener la estabilidad familiar y garantizar la seguridad de ${currentChild.nickname} en nuestro hogar. Con base en nuestros parámetros de cuidado calculados, solicitamos una asignación de ${respiteResults.suggestedHours}.

Atentamente,
Padre Cuidador`
    : `Dear Coordinator,

I hope this email finds you well. I am writing to formally request a service plan review meeting to request In-Home Respite Services for my child, ${currentChild.nickname} (DOB: ${currentChild.dob || 'N/A'}).

Over the past several months, the care demands for ${currentChild.nickname} have increased significantly, far exceeding the care requirements of a neurotypical child of the same age:
${justificationText}

The addition of In-Home Respite hours is critical to prevent caregiver burnout, maintain family stability, and ensure ${currentChild.nickname}'s safety in our home. Based on our calculated care parameters, we request an allocation of ${respiteResults.suggestedHours}.

Sincerely,
Caregiver Parent`;

  const handleSaveRespiteScores = async () => {
    setRespiteSaveStatus({ type: null, message: '' });
    const scores = {
      safety: safetyScore,
      sleep: sleepScore,
      medical: medicalScore,
      behavior: behaviorScore
    };

    const res = await saveChildRespiteAction(currentChild.id, scores);
    localStorage.setItem(`respite_scores_${currentChild.id}`, JSON.stringify(scores));

    if (res.success) {
      setRespiteSaveStatus({ type: 'success', message: 'Care demands & Respite parameters saved to profile!' });
      setTimeout(() => setRespiteSaveStatus({ type: null, message: '' }), 4000);
    } else {
      setRespiteSaveStatus({ type: 'error', message: res.error || 'Failed to save Respite profile.' });
    }
  };

  const exceedsSsiLimit = savingsAmount > 2000;
  const exceedsCalableSsiLimit = savingsAmount > 100000;

  const calculateFplInfo = () => {
    const baseFpl = 15060 + (familySize - 1) * 5380;
    const threshold400 = baseFpl * 4;
    const fplRatio = (grossIncome / baseFpl) * 100;
    let copayPct = 0;
    
    if (fplRatio >= 400 && fplRatio < 500) copayPct = 10;
    else if (fplRatio >= 500 && fplRatio < 600) copayPct = 20;
    else if (fplRatio >= 600 && fplRatio < 700) copayPct = 40;
    else if (fplRatio >= 700 && fplRatio < 800) copayPct = 60;
    else if (fplRatio >= 800 && fplRatio < 900) copayPct = 80;
    else if (fplRatio >= 900) copayPct = 100;

    if (rcChildren > 1 && copayPct > 0) {
      copayPct = Math.round(copayPct / 2);
    }

    const isExemptIncome = grossIncome < threshold400;
    const isFullyExempt = isExemptIncome || childMediCal;

    return {
      baseFpl,
      threshold400: Math.round(threshold400),
      fplRatio: Math.round(fplRatio),
      copayPct: isFullyExempt ? 0 : copayPct,
      afpfFee: isFullyExempt ? 0 : 150,
      isFullyExempt
    };
  };

  const getDeemingRecommendation = () => {
    if (!isRcClient) {
      if (hasMedicalNeeds) {
        return {
          path: isSpanish ? `Vía del Programa de Exención de Alternativas en el Hogar` : `Home & Community-Based Waiver Pathway`,
          desc: isSpanish
            ? `Su hijo no recibe servicios de ${stateConfig.catchmentName}, pero tiene necesidades médicas/de enfermería complejas. Es un fuerte candidato para la Exención de base médica de ${stateConfig.name}. Esto evita por completo los límites de ingresos parentales.`
            : `Your child does not receive ${stateConfig.catchmentName} services, but has complex medical/nursing needs. They are a strong candidate for ${stateConfig.name}'s medical-based waiver program. This waiver completely bypasses parental income, giving the child full ${stateConfig.medicaidName}.`,
          action: isSpanish
            ? `Comuníquese con una agencia local de exenciones de salud en su condado para solicitar una evaluación.`
            : `Contact a local Medicaid waiver agency in your county to request an intake assessment.`
        };
      }
      return {
        path: isSpanish ? `Vía de Admisión de ${stateConfig.catchmentName}` : `${stateConfig.catchmentName} Intake Pathway`,
        desc: isSpanish
          ? `La exención de ingresos parentales se procesa principalmente para clientes activos de ${stateConfig.catchmentName}.`
          : `Parental income deeming waivers are primarily processed for active ${stateConfig.catchmentName} clients. To qualify, your child must establish eligibility.`,
        action: isSpanish
          ? `Solicite una evaluación de admisión en su ${stateConfig.catchmentName} local.`
          : `Request an intake assessment at your local ${stateConfig.catchmentName}.`
      };
    }

    if (majorLimitations >= 3 && hasDiagnosis) {
      return {
        path: isSpanish ? `Exención de Medicaid (Exención de Ingresos Parentales)` : `${stateConfig.name} Medicaid Waiver (Parental Deeming)`,
        desc: isSpanish
          ? `Según el estado activo de su hijo en ${stateConfig.catchmentName} y limitaciones funcionales, es altamente elegible para la exención de Medicaid de ${stateConfig.name}. Los ingresos parentales se omiten al 100%, otorgando al niño cobertura completa.`
          : `Based on your child's active ${stateConfig.catchmentName} status and functional limitations, they are highly eligible for the ${stateConfig.name} Medicaid Waiver. Parental income is 100% bypassed, granting the child full ${stateConfig.medicaidName} regardless of your family earnings.`,
        action: isSpanish
          ? `Envíe un correo electrónico a su coordinador de servicios directamente y solicite el paquete de exención de Medicaid.`
          : `Email your Service Coordinator directly and request the Medicaid Waiver Deeming packet. Once approved, the child qualifies for full ${stateConfig.medicaidName} with zero parent premium copays.`
      };
    }

    return {
      path: isSpanish ? `Vía de Reevaluación de ${stateConfig.catchmentName}` : `${stateConfig.catchmentName} Reassessment Pathway`,
      desc: isSpanish
        ? `La exención de ingresos parentales requiere que el cliente cumpla con los criterios de nivel de cuidado institucional o intermedio, lo que incluye limitaciones funcionales significativas.`
        : `Medicaid deeming requires the client to meet specific care criteria, which includes significant functional limitations in major life activities.`,
      action: isSpanish
        ? `Solicite una reunión de planificación de servicios con su coordinador para discutir las limitaciones de su hijo.`
        : `Request a service planning meeting with your coordinator to discuss your child's escalating limitations.`
    };
  };

  const compileDeemingLetter = () => {
    return `Subject: Request for Medicaid Waiver (Parental Income Deeming) Enrollment - ${currentChild.nickname}

Dear Coordinator,

I hope this email finds you well. I am writing to request that the agency initiate the process to enroll my child, ${currentChild.nickname} (DOB: ${currentChild.dob || 'N/A'}), in the ${stateConfig.name} Medicaid Waiver (Parental Deeming).

As a client of ${stateConfig.catchmentName}, ${currentChild.nickname} exhibits significant functional limitations. Enrollment in this waiver is crucial for our family as it bypasses parental income limitations, granting ${currentChild.nickname} eligibility for ${stateConfig.medicaidName}.

Thank you,
Caregiver Parent`;
  };

  const getWealthRecommendation = () => {
    if (fundingSource === 'child-injury') {
      return {
        title: isSpanish ? `Fideicomiso de Necesidades Especiales de Primer Tercero con envoltura opcional de ${stateConfig.ableProgram}` : `First-Party Special Needs Trust (SNT) with optional ${stateConfig.ableProgram} wrapper`,
        desc: isSpanish
          ? `Dado que los fondos pertenecen directamente al niño, se requiere legalmente un SNT de primer tercero para proteger los beneficios. Puede transferir hasta $18,000 anuales del fideicomiso a una cuenta ${stateConfig.ableProgram} para facilitar los gastos diarios libres de impuestos.`
          : `Since funds belong directly to the child (e.g. lawsuit settlement or direct inheritance), a First-Party SNT is generally required to protect benefits. You can transfer up to $18,000 annually from the trust into an ${stateConfig.ableProgram} account to support qualified disability expenses without trustee signatures for every purchase.`,
        recoveryNote: isSpanish
          ? `Nota: Los SNT de primer tercero requieren una disposición de recuperación estatal de Medicaid tras el fallecimiento.`
          : `Note: First-Party SNTs require a Medicaid state-recovery provision upon the beneficiary's passing.`
      };
    }

    if (expectedBalance === 'high' || fundingSource === 'inheritance') {
      return {
        title: isSpanish ? `Combinación de Fideicomiso de Necesidades Especiales de Terceros + Cuenta ${stateConfig.ableProgram}` : `Third-Party Special Needs Trust + ${stateConfig.ableProgram} account combination`,
        desc: isSpanish
          ? `Para saldos que superen los $100,000 o fondos de testamentos familiares, establezca un SNT de terceros para proteger los activos de la recuperación de Medicaid, complementado con transferencias a una cuenta ${stateConfig.ableProgram} para gastos diarios.`
          : `This is the gold-standard setup. For balances exceeding $100,000 or funds originating from family wills, establish a Third-Party SNT. This protects the estate from Medicaid recovery. Supplement this by transferring funds into an ${stateConfig.ableProgram} account for daily disability expenditures (QDEs) to maximize flexibility.`,
        recoveryNote: isSpanish
          ? `Los SNT de terceros no tienen disposiciones de recuperación de Medicaid.`
          : `Third-Party SNTs have no Medicaid clawback provisions. Unused funds pass directly to secondary heirs.`
      };
    }

    return {
      title: isSpanish ? `Cuenta Directa de ${stateConfig.ableProgram} (Independiente)` : `Direct ${stateConfig.ableProgram} Account (Standalone)`,
      desc: isSpanish
        ? `Para ahorros previstos menores de $100,000 financiado principalmente por los padres, una cuenta ${stateConfig.ableProgram} es la herramienta más rentable. Se abre en línea y permite gastar directamente para Gastos Calificados de Discapacidad (QDE).`
        : `For expected savings under $100,000 primarily funded by parents or wages, an ${stateConfig.ableProgram} account is the most cost-effective and immediate tool. It takes 15 minutes to open online, carries minimal fees, and allows the child or parents to spend money directly using a debit card for Qualified Disability Expenses.`,
      recoveryNote: isSpanish
        ? `La mayoría de los estados no permiten la recuperación estatal de Medicaid en cuentas ABLE para residentes.`
        : `Most states restrict or forbid Medicaid estate recovery on ABLE accounts for residents, making it highly safe.`
    };
  };

  return (
    <div className="animate-fade-in">
      {/* Sub-Tabs Switcher */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', overflowX: 'auto' }} className="no-print">
        <button
          onClick={() => setSdpSubTab('respite')}
          className={`tab-btn ${sdpSubTab === 'respite' ? 'active' : ''}`}
          style={{
            background: sdpSubTab === 'respite' ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.4)',
            color: sdpSubTab === 'respite' ? '#ffffff' : 'var(--text-main)',
            border: '1px solid var(--glass-border)',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontSize: '0.88rem',
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          Respite Estimator
        </button>
        <button
          onClick={() => setSdpSubTab('sdp')}
          className={`tab-btn ${sdpSubTab === 'sdp' ? 'active' : ''}`}
          style={{
            background: sdpSubTab === 'sdp' ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.4)',
            color: sdpSubTab === 'sdp' ? '#ffffff' : 'var(--text-main)',
            border: '1px solid var(--glass-border)',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontSize: '0.88rem',
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          {stateConfig.code === 'CA' ? 'SDP' : 'Self-Direction'} Budget Planner
        </button>
        <button
          onClick={() => setSdpSubTab('eligibility')}
          className={`tab-btn ${sdpSubTab === 'eligibility' ? 'active' : ''}`}
          style={{
            background: sdpSubTab === 'eligibility' ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.4)',
            color: sdpSubTab === 'eligibility' ? '#ffffff' : 'var(--text-main)',
            border: '1px solid var(--glass-border)',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontSize: '0.88rem',
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          Asset & Deeming Helper
        </button>
      </div>

      {sdpSubTab === 'respite' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }} className="iep-grid-layout animate-fade-in">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Estimator Quiz */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <Calculator size={20} color="var(--primary-color)" />
                Respite Evaluation Matrix
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <label style={{ fontWeight: 600 }}>1. Safety & Wandering Oversight</label>
                    <span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>{safetyScore} / 5</span>
                  </div>
                  <input type="range" min="0" max="5" value={safetyScore} onChange={(e) => setSafetyScore(parseInt(e.target.value))} style={{ accentColor: 'var(--primary-color)' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <label style={{ fontWeight: 600 }}>2. Night Waking Supervision</label>
                    <span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>{sleepScore} / 4</span>
                  </div>
                  <input type="range" min="0" max="4" value={sleepScore} onChange={(e) => setSleepScore(parseInt(e.target.value))} style={{ accentColor: 'var(--primary-color)' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <label style={{ fontWeight: 600 }}>3. Diapering / Medical Tasks</label>
                    <span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>{medicalScore} / 4</span>
                  </div>
                  <input type="range" min="0" max="4" value={medicalScore} onChange={(e) => setMedicalScore(parseInt(e.target.value))} style={{ accentColor: 'var(--primary-color)' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <label style={{ fontWeight: 600 }}>4. Behavioral / Meltdown Severity</label>
                    <span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>{behaviorScore} / 4</span>
                  </div>
                  <input type="range" min="0" max="4" value={behaviorScore} onChange={(e) => setBehaviorScore(parseInt(e.target.value))} style={{ accentColor: 'var(--primary-color)' }} />
                </div>
              </div>
            </div>

            {/* Letter Builder */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
                  <Mail size={16} /> Coordinator Request Letter
                </h4>
                <CopyButton text={`Subject: ${customSubject}\n\n${customBody}`} size={16} />
              </div>
              <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px', fontSize: '0.85rem', whiteSpace: 'pre-wrap', lineHeight: 1.6, fontStyle: 'italic' }}>
                {customBody}
              </div>
            </div>

          </div>

          {/* Estimator Summary & Disparity Chart */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-panel animate-fade-in" style={{ border: '2px solid var(--primary-color)', padding: '1.25rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary-color)', textTransform: 'uppercase' }}>Calculated Impact</span>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '0.2rem', marginBottom: '0.75rem' }}>Tier: {respiteResults.tier}</h3>
              
              <div style={{ background: 'var(--glass-bg)', padding: '0.75rem', borderRadius: '8px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
                {respiteResults.suggestedHours}
              </div>

              <button 
                onClick={handleSaveRespiteScores}
                className="btn-primary"
                style={{ padding: '0.6rem 1rem', fontSize: '0.9rem', width: '100%' }}
              >
                Save Care Demands
              </button>

              {respiteSaveStatus.message && (
                <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: respiteSaveStatus.type === 'success' ? '#10b981' : '#ef4444', textAlign: 'center', fontWeight: 600 }}>
                  {respiteSaveStatus.message}
                </div>
              )}
            </div>

            {/* Disparity chart */}
            <DisparityComparison isSpanish={isSpanish} />
          </div>
        </div>
      )}

      {sdpSubTab === 'sdp' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }} className="iep-grid-layout animate-fade-in">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.5rem' }}>
                <Calculator size={20} color="var(--primary-color)" /> {stateConfig.code === 'CA' ? 'SDP' : 'Self-Direction'} Individual Budget Formulation
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px', gap: '1rem', alignItems: 'center' }}>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.9rem' }}>Prior 12-Month POS Expenditures</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>Total spent by {stateConfig.catchmentName} on services under traditional model.</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={posSpend}
                    onChange={(e) => setPosSpend(Math.max(0, parseInt(e.target.value) || 0))}
                    style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem', width: '100%', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)' }}
                  />
                </div>

                {/* Unmet Needs */}
                <div style={{ borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Adjustments & Unmet Needs</h3>
                  
                  {unmetNeeds.length === 0 ? (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontStyle: 'italic' }}>No unmet needs listed. Add one below.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                      {unmetNeeds.map(need => {
                        const cost = need.costType === 'flat' ? need.flatAmount : (need.hourlyRate * need.hoursPerWeek * need.durationWeeks);
                        return (
                          <div key={need.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.02)', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.05)' }}>
                            <div>
                              <strong style={{ fontSize: '0.88rem', display: 'block' }}>{need.name}</strong>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                                {need.costType === 'flat' ? 'Flat Cost' : `$${need.hourlyRate}/hr × ${need.hoursPerWeek} hrs/wk × ${need.durationWeeks} weeks`}
                              </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-color)' }}>${cost.toLocaleString()}</span>
                              <button onClick={() => setUnmetNeeds(prev => prev.filter(n => n.id !== need.id))} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Add Unmet Need Form */}
                  <div style={{ background: 'rgba(var(--primary-rgb), 0.03)', border: '1px dashed rgba(var(--primary-rgb), 0.2)', padding: '1rem', borderRadius: '12px' }}>
                    <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '0.75rem' }}>➕ Add Unmet Care Need / Circumstance Change</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <input
                        type="text"
                        placeholder="e.g. Specialized Swim Safety Lessons"
                        value={newNeedName}
                        onChange={(e) => setNewNeedName(e.target.value)}
                        style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', width: '100%', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)' }}
                      />
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <select
                          value={newNeedCostType}
                          onChange={(e) => setNewNeedCostType(e.target.value as 'hourly' | 'flat')}
                          style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', width: '100%', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)' }}
                        >
                          <option value="flat">Flat Cost</option>
                          <option value="hourly">Hourly Rate</option>
                        </select>
                        {newNeedCostType === 'flat' ? (
                          <input
                            type="number"
                            value={newNeedFlatAmount}
                            onChange={(e) => setNewNeedFlatAmount(Math.max(0, parseInt(e.target.value) || 0))}
                            style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', width: '100%', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)' }}
                          />
                        ) : (
                          <input
                            type="number"
                            value={newNeedHourlyRate}
                            onChange={(e) => setNewNeedHourlyRate(Math.max(0, parseInt(e.target.value) || 0))}
                            style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', width: '100%', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)' }}
                          />
                        )}
                      </div>
                      {newNeedCostType === 'hourly' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                          <input
                            type="number"
                            placeholder="Hours / Week"
                            value={newNeedHoursPerWeek}
                            onChange={(e) => setNewNeedHoursPerWeek(Math.max(0, parseFloat(e.target.value) || 0))}
                            style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', width: '100%', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)' }}
                          />
                          <input
                            type="number"
                            placeholder="Weeks"
                            value={newNeedDurationWeeks}
                            onChange={(e) => setNewNeedDurationWeeks(Math.max(0, parseInt(e.target.value) || 0))}
                            style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', width: '100%', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)' }}
                          />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          if (!newNeedName.trim()) return;
                          setUnmetNeeds(prev => [...prev, {
                            id: `unmet-${Date.now()}`,
                            name: newNeedName,
                            costType: newNeedCostType,
                            hourlyRate: newNeedHourlyRate,
                            hoursPerWeek: newNeedHoursPerWeek,
                            durationWeeks: newNeedDurationWeeks,
                            flatAmount: newNeedFlatAmount,
                            justification: ''
                          }]);
                          setNewNeedName('');
                        }}
                        className="btn-primary"
                        style={{ padding: '0.5rem', fontSize: '0.8rem' }}
                      >
                        Add Adjustments
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 150px', gap: '1rem', alignItems: 'center' }}>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.9rem' }}>One-Time Deductions (-)</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>Subtract non-recurring historic costs.</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={oneTimeDeductions}
                    onChange={(e) => setOneTimeDeductions(Math.max(0, parseInt(e.target.value) || 0))}
                    style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem', width: '100%', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)' }}
                  />
                </div>
              </div>
            </div>

            {/* proposed spending plan */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.5rem' }}>
                <Sparkles size={20} color="var(--primary-color)" /> Proposed {stateConfig.code === 'CA' ? 'SDP' : 'Self-Direction'} Spending Plan
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>FMS Model</label>
                  <select
                    value={fmsModel}
                    onChange={(e) => setFmsModel(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', fontSize: '0.88rem', marginTop: '0.3rem' }}
                  >
                    <option value="bill-payer">Bill Payer Model (~$150/mo | $1,800/yr)</option>
                    <option value="sole-employer">Sole Employer Model (~$200/mo | $2,400/yr)</option>
                    <option value="co-employer">Co-Employer Model (~$250/mo | $3,000/yr)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1.25rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <label style={{ fontSize: '0.88rem' }}>Community Integration</label>
                      <strong style={{ color: 'var(--primary-color)' }}>${sdpCommunity.toLocaleString()}</strong>
                    </div>
                    <input type="range" min="0" max={50000} step="100" value={sdpCommunity} onChange={(e) => setSdpCommunity(parseInt(e.target.value))} style={{ width: '100%', accentColor: 'var(--primary-color)' }} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <label style={{ fontSize: '0.88rem' }}>In-Home Respite & Care</label>
                      <strong style={{ color: 'var(--primary-color)' }}>${sdpRespite.toLocaleString()}</strong>
                    </div>
                    <input type="range" min="0" max={50000} step="100" value={sdpRespite} onChange={(e) => setSdpRespite(parseInt(e.target.value))} style={{ width: '100%', accentColor: 'var(--primary-color)' }} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <label style={{ fontSize: '0.88rem' }}>Therapies & Clinic</label>
                      <strong style={{ color: 'var(--primary-color)' }}>${sdpTherapies.toLocaleString()}</strong>
                    </div>
                    <input type="range" min="0" max={50000} step="100" value={sdpTherapies} onChange={(e) => setSdpTherapies(parseInt(e.target.value))} style={{ width: '100%', accentColor: 'var(--primary-color)' }} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <label style={{ fontSize: '0.88rem' }}>Equipment & Tech</label>
                      <strong style={{ color: 'var(--primary-color)' }}>${sdpEquipment.toLocaleString()}</strong>
                    </div>
                    <input type="range" min="0" max={50000} step="100" value={sdpEquipment} onChange={(e) => setSdpEquipment(parseInt(e.target.value))} style={{ width: '100%', accentColor: 'var(--primary-color)' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Budget Calculator */}
          <div style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {(() => {
              const calculatedIB = posSpend + unmetNeeds.reduce((acc, need) => acc + (need.costType === 'flat' ? need.flatAmount : need.hourlyRate * need.hoursPerWeek * need.durationWeeks), 0) - oneTimeDeductions;
              const fmsAnnualFee = fmsModel === 'co-employer' ? 3000 : (fmsModel === 'sole-employer' ? 2400 : 1800);
              const totalAllocated = sdpCommunity + sdpRespite + sdpTherapies + sdpEquipment + fmsAnnualFee;
              const remaining = calculatedIB - totalAllocated;
              const isOverBudget = remaining < 0;

              return (
                <>
                  <div className="glass-panel" style={{ border: `2px solid ${isOverBudget ? '#ef4444' : 'var(--primary-color)'}`, padding: '1.25rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: isOverBudget ? '#ef4444' : 'var(--primary-color)', textTransform: 'uppercase' }}>{stateConfig.code === 'CA' ? 'SDP' : 'Self-Direction'} Budget Summary</span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '0.2rem', marginBottom: '0.75rem' }}>Target IB: ${calculatedIB.toLocaleString()}</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', margin: '0.5rem 0 1rem 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Total Allocated:</span>
                        <strong>${totalAllocated.toLocaleString()}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '0.5rem' }}>
                        <span>FMS Fee:</span>
                        <strong>${fmsAnnualFee.toLocaleString()}/yr</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed rgba(0,0,0,0.06)', paddingTop: '0.5rem' }}>
                        <span>Remaining:</span>
                        <strong style={{ color: isOverBudget ? '#ef4444' : '#10b981' }}>${remaining.toLocaleString()}</strong>
                      </div>
                    </div>

                    <button 
                      onClick={handleSaveSdpBudget}
                      className="btn-primary"
                      style={{ padding: '0.6rem 1rem', fontSize: '0.9rem', width: '100%', background: isOverBudget ? '#64748b' : 'var(--primary-color)' }}
                      disabled={isOverBudget}
                    >
                      Save proposed budget
                    </button>
                    {sdpSaveStatus.message && (
                      <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: sdpSaveStatus.type === 'success' ? '#10b981' : '#ef4444', textAlign: 'center', fontWeight: 600 }}>
                        {sdpSaveStatus.message}
                      </div>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {sdpSubTab === 'eligibility' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }} className="iep-grid-layout animate-fade-in">
          {/* Deeming and AFPF */}
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
              <Award size={18} color="var(--primary-color)" /> Medi-Cal Deeming & FCPP Copays
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem' }}>RC Client Status:</span>
                <select value={isRcClient ? 'yes' : 'no'} onChange={(e) => setIsRcClient(e.target.value === 'yes')} style={{ padding: '0.3rem', fontSize: '0.8rem' }}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '0.6rem' }}>
                <span style={{ fontSize: '0.85rem' }}>Diagnosis Verified:</span>
                <select value={hasDiagnosis ? 'yes' : 'no'} onChange={(e) => setHasDiagnosis(e.target.value === 'yes')} style={{ padding: '0.3rem', fontSize: '0.8rem' }}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div style={{ borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '0.6rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span>Life Activity Limitations:</span>
                  <strong>{majorLimitations} of 7</strong>
                </div>
                <input type="range" min="0" max="7" value={majorLimitations} onChange={(e) => setMajorLimitations(parseInt(e.target.value))} style={{ width: '100%', accentColor: 'var(--primary-color)' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '0.6rem' }}>
                <span style={{ fontSize: '0.85rem' }}>Gross Annual Income:</span>
                <input type="number" step="5000" value={grossIncome} onChange={(e) => setGrossIncome(Math.max(0, parseInt(e.target.value) || 0))} style={{ padding: '0.3rem', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '0.6rem' }}>
                <span style={{ fontSize: '0.85rem' }}>Family Size:</span>
                <input type="number" value={familySize} onChange={(e) => setFamilySize(Math.max(1, parseInt(e.target.value) || 1))} style={{ padding: '0.3rem', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }} />
              </div>
            </div>

            {(() => {
              const deemingRec = getDeemingRecommendation();
              const fplInfo = calculateFplInfo();
              return (
                <div style={{ background: 'rgba(0,0,0,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem' }}><strong>Pathway:</strong> {deemingRec.path}</span>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', margin: 0 }}>{deemingRec.desc}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', borderTop: '1px solid #eee', paddingTop: '0.4rem', marginTop: '0.2rem' }}>
                    <span>Income Ratio:</span>
                    <strong>{fplInfo.fplRatio}% FPL</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                    <span>Calculated Co-pay:</span>
                    <strong>{fplInfo.copayPct}%</strong>
                  </div>

                  {isRcClient && majorLimitations >= 3 && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <button onClick={() => setShowDeemingLetter(!showDeemingLetter)} className="btn-secondary" style={{ width: '100%', padding: '0.4rem', fontSize: '0.75rem' }}>
                        {showDeemingLetter ? 'Hide Request Letter' : 'Show Request Letter'}
                      </button>
                      {showDeemingLetter && (
                        <div className="animate-fade-in" style={{ background: '#fff', border: '1px solid #eee', padding: '0.5rem', borderRadius: '6px', fontSize: '0.75rem', marginTop: '0.5rem', maxHeight: '150px', overflowY: 'auto' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                            <span>Request Letter Draft</span>
                            <CopyButton text={compileDeemingLetter()} size={12} />
                          </div>
                          <pre style={{ whiteSpace: 'pre-wrap', fontStyle: 'italic', margin: 0, fontFamily: 'inherit', fontSize: '0.72rem', color: '#555' }}>
                            {compileDeemingLetter()}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Asset Limits Shielding */}
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
              <Scale size={18} color="var(--primary-color)" /> Asset Limits Shielding
            </h3>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span>Planned Savings Amount:</span>
                <strong>${savingsAmount.toLocaleString()}</strong>
              </div>
              <input type="range" min="500" max="150000" step="500" value={savingsAmount} onChange={(e) => setSavingsAmount(parseInt(e.target.value))} style={{ width: '100%', accentColor: 'var(--primary-color)' }} />
            </div>

            <div style={{ background: 'rgba(0,0,0,0.02)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                <span>Unprotected SSI Account Cap:</span>
                <span style={{ color: exceedsSsiLimit ? '#ef4444' : '#10b981', fontWeight: 700 }}>{exceedsSsiLimit ? 'Exceeded ($2k limit)' : 'Safe'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{stateConfig.ableProgram} Protected:</span>
                <span style={{ color: exceedsCalableSsiLimit ? '#f59e0b' : '#10b981', fontWeight: 700 }}>{exceedsCalableSsiLimit ? 'SSI Suspended' : 'Shielded'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.8rem' }}>Funds Source</label>
              <select value={fundingSource} onChange={(e) => setFundingSource(e.target.value as 'parents' | 'inheritance' | 'child-injury')} style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                <option value="parents">Parents wages/savings</option>
                <option value="inheritance">Inheritance from wills/trusts</option>
                <option value="child-injury">Personal injury/direct child assets</option>
              </select>
            </div>

            {(() => {
              const rec = getWealthRecommendation();
              return (
                <div style={{ background: 'rgba(0,0,0,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.04)', fontSize: '0.78rem' }}>
                  <strong>Recommendation:</strong> <span style={{ color: 'var(--primary-color)', fontWeight: 700 }}>{rec.title}</span>
                  <p style={{ color: 'var(--text-light)', margin: '0.3rem 0 0 0', lineHeight: 1.3 }}>{rec.desc}</p>
                </div>
              );
            })()}
            
            <button 
              onClick={handleSaveFinancialProfile}
              className="btn-primary"
              style={{ padding: '0.6rem 1rem', fontSize: '0.9rem', width: '100%', marginTop: '1rem' }}
            >
              Save Asset & Deeming Profiles
            </button>
            {financialSaveStatus.message && (
              <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: financialSaveStatus.type === 'success' ? '#10b981' : '#ef4444', textAlign: 'center', fontWeight: 600 }}>
                {financialSaveStatus.message}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Legal & Financial Estimates Disclaimer */}
      <div style={{ marginTop: '2.5rem', padding: '1.25rem', borderTop: '1px dashed rgba(0,0,0,0.08)', fontSize: '0.78rem', color: 'var(--text-light)', lineHeight: 1.4 }}>
        <strong>Legal & Estimates Disclaimer:</strong> All calculations, tiers, SDP budget suggestions, deeming exemptions, and wealth protection recommendations are for educational and planning purposes only. Funding tiers, respite hours, FPL multipliers, FCPP copays, and special needs trusts are subject to changing state guidelines and individual county discretion (DDS, DHCS, or Social Security Administration). This calculator does not constitute official legal, tax, or medical advice.
      </div>
    </div>
  );
}
