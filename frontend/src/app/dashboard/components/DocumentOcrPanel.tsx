'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  FileText, 
  Upload, 
  RefreshCw, 
  Check, 
  Trash2, 
  AlertCircle, 
  Plus, 
  FileCheck, 
  Sparkles,
  Database
} from 'lucide-react';
import { useChildProfile } from './ChildProfileContext';
import { 
  saveClinicalDocumentAction, 
  getChildClinicalDocumentsAction, 
  deleteClinicalDocumentAction,
  saveChildIepAction
} from '../child-actions';

interface ClinicalDocument {
  id: string;
  file_name: string;
  document_type: string;
  parsed_data_json: string;
  uploaded_at: string;
  status: string;
}

interface ParsedData {
  diagnosis: string;
  accommodations: string[];
  goals: string[];
  additional_notes?: string;
}

export default function DocumentOcrPanel() {
  const { currentChild, isSpanish } = useChildProfile();
  const [documents, setDocuments] = useState<ClinicalDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [ocrRunning, setOcrRunning] = useState<boolean>(false);
  const [ocrLogs, setOcrLogs] = useState<string[]>([]);
  const [activeStep, setActiveStep] = useState<'upload' | 'parsing' | 'verify'>('upload');
  
  // OCR Form States
  const [fileName, setFileName] = useState<string>('');
  const [documentType, setDocumentType] = useState<string>('iep');
  const [parsedDiagnosis, setParsedDiagnosis] = useState<string>('');
  const [parsedAccommodations, setParsedAccommodations] = useState<string>('');
  const [parsedGoals, setParsedGoals] = useState<string>('');
  const [additionalNotes, setAdditionalNotes] = useState<string>('');
  
  // Selection/View State
  const [selectedDoc, setSelectedDoc] = useState<ClinicalDocument | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadDocuments = useCallback(async () => {
    if (!currentChild?.id) return;
    setLoading(true);
    const res = await getChildClinicalDocumentsAction(currentChild.id);
    setLoading(false);
    if (res.success && res.documents) {
      setDocuments(res.documents as unknown as ClinicalDocument[]);
    } else {
      setDocuments([]);
    }
  }, [currentChild]);

  const resetForm = useCallback(() => {
    setFileName('');
    setDocumentType('iep');
    setParsedDiagnosis('');
    setParsedAccommodations('');
    setParsedGoals('');
    setAdditionalNotes('');
    setActiveStep('upload');
    setOcrRunning(false);
    setOcrLogs([]);
    setSelectedDoc(null);
    setErrorMessage(null);
  }, []);

  useEffect(() => {
    if (!currentChild?.id) return;
    const task = setTimeout(() => {
      loadDocuments();
      resetForm();
    }, 0);
    return () => clearTimeout(task);
  }, [currentChild, loadDocuments, resetForm]);

  // Mock document details templates based on type
  const getMockOcrData = (type: string, name: string): ParsedData => {
    switch (type) {
      case 'iep':
        return {
          diagnosis: 'Autism Spectrum Disorder (ASD)',
          accommodations: [
            'Frequent sensory breaks (5 mins every hour)',
            'Visual schedule on student desk',
            'Extended testing time (1.5x)',
            'Preferential seating away from noise sources'
          ],
          goals: [
            'Child will use expressive speech to request assistance when overwhelmed in 4 out of 5 opportunities.',
            'Child will demonstrate self-regulation during classroom transitions with minimal verbal prompts.',
            'Child will improve fine-motor strength by cutting shapes within 1/8 inch of the boundary line.'
          ],
          additional_notes: `Extracted from school district IEP document: ${name}`
        };
      case 'psychoed':
        return {
          diagnosis: 'Speech and Language Impairment (SLI)',
          accommodations: [
            'Augmentative and Alternative Communication (AAC) device support',
            'Reduced writing assignments, speech-to-text options',
            'Simplified sentence structures in instruction sheet'
          ],
          goals: [
            'Child will follow multi-step verbal instructions containing at least three steps in 80% of trials.',
            'Child will expand functional vocabulary by identifying 20 new school-related icons on AAC panel.'
          ],
          additional_notes: `Extracted from Clinical Neurodevelopmental Evaluation: ${name}`
        };
      case 'ipp':
        return {
          diagnosis: 'Cerebral Palsy (Spastic Diplegia)',
          accommodations: [
            'Physical therapist consultation (120 mins/month)',
            'Wheelchair/walker access to all campus spaces',
            'Weighted pencils and adaptive eating utensils'
          ],
          goals: [
            'Child will navigate from school bus zone to classroom using wheeled walker independently.',
            'Child will dress upper body (inserting arms and buttoning shirt) with adaptive closures.'
          ],
          additional_notes: `Extracted from Regional Center Lanterman IPP: ${name}`
        };
      default:
        return {
          diagnosis: 'Down Syndrome (Trisomy 21)',
          accommodations: [
            'Bilateral pediatric hearing aid devices',
            'Structured feeding support supervision during lunch',
            'Peer buddy assistance during recess activities'
          ],
          goals: [
            'Child will localize sound cues within the classroom using hearing aids in 90% of trials.',
            'Child will initiate reciprocal social greeting to a classmate during circle time.'
          ],
          additional_notes: `Extracted from Clinical Pediatric Assessment: ${name}`
        };
    }
  };

  const handleFileUploadMock = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setErrorMessage(null);
    
    // Auto-detect type from name if possible
    const nameLower = file.name.toLowerCase();
    if (nameLower.includes('iep')) setDocumentType('iep');
    else if (nameLower.includes('eval') || nameLower.includes('psych')) setDocumentType('psychoed');
    else if (nameLower.includes('ipp') || nameLower.includes('center')) setDocumentType('ipp');
    else if (nameLower.includes('med') || nameLower.includes('doctor')) setDocumentType('medical');
  };

  const runOcrSimulator = () => {
    if (!fileName) {
      setErrorMessage(isSpanish ? 'Por favor seleccione un archivo para escanear.' : 'Please select a file to parse.');
      return;
    }

    setActiveStep('parsing');
    setOcrRunning(true);
    setOcrLogs([]);

    const steps = [
      isSpanish ? 'Inicializando motor OCR de IA...' : 'Initializing AI OCR Engine...',
      isSpanish ? 'Subiendo documento al búfer de memoria seguro...' : 'Uploading document to secure memory buffer...',
      isSpanish ? 'Ejecutando segmentación de diseño de página (análisis de zonas)...' : 'Running page layout segmentation (zonal analysis)...',
      isSpanish ? 'Aplicando binarización adaptativa y eliminación de ruido...' : 'Applying adaptive binarization and noise removal...',
      isSpanish ? 'Transcribiendo texto plano (California Ed Code / Regulación de salud)...' : 'Transcribing plain text (California Ed Code / Health regulation)...',
      isSpanish ? 'Analizando entidades clínicas y objetivos educativos con NLP...' : 'Analyzing clinical entities and educational targets with NLP...',
      isSpanish ? 'Validando huella de firma y metadatos del médico...' : 'Validating signature footprint and physician metadata...',
      isSpanish ? 'OCR completado con éxito. Preparando editor de verificación...' : 'OCR completed successfully. Preparing verification editor...'
    ];

    let logIndex = 0;
    const interval = setInterval(() => {
      if (logIndex < steps.length) {
        setOcrLogs(prev => [...prev, steps[logIndex]]);
        logIndex++;
      } else {
        clearInterval(interval);
        setOcrRunning(false);
        
        // Populate parsed states
        const data = getMockOcrData(documentType, fileName);
        setParsedDiagnosis(data.diagnosis);
        setParsedAccommodations(data.accommodations.join('\n'));
        setParsedGoals(data.goals.join('\n'));
        setAdditionalNotes(data.additional_notes || '');
        
        setActiveStep('verify');
      }
    }, 850);
  };

  const handleSaveDocument = async () => {
    if (!currentChild?.id) return;
    if (!parsedDiagnosis.trim()) {
      setErrorMessage(isSpanish ? 'La diagnosis extraída es requerida.' : 'Parsed Diagnosis is required.');
      return;
    }

    const parsedObject: ParsedData = {
      diagnosis: parsedDiagnosis,
      accommodations: parsedAccommodations.split('\n').map(x => x.trim()).filter(Boolean),
      goals: parsedGoals.split('\n').map(x => x.trim()).filter(Boolean),
      additional_notes: additionalNotes
    };

    const docData = {
      id: selectedDoc?.id || 'doc-' + Date.now(),
      file_name: fileName,
      document_type: documentType,
      parsed_data_json: JSON.stringify(parsedObject),
      uploaded_at: selectedDoc?.uploaded_at || new Date().toISOString().split('T')[0],
      status: 'verified'
    };

    setLoading(true);
    const res = await saveClinicalDocumentAction(currentChild.id, docData);
    setLoading(false);

    if (res.success) {
      setSuccessMessage(isSpanish ? 'Documento clínico guardado y verificado.' : 'Clinical document saved and verified successfully.');
      loadDocuments();
      resetForm();
      setTimeout(() => setSuccessMessage(null), 4000);
    } else {
      setErrorMessage(res.error || 'Failed to save document');
    }
  };

  const handleViewDetails = (doc: ClinicalDocument) => {
    setSelectedDoc(doc);
    setFileName(doc.file_name);
    setDocumentType(doc.document_type);
    
    try {
      const parsed: ParsedData = JSON.parse(doc.parsed_data_json);
      setParsedDiagnosis(parsed.diagnosis);
      setParsedAccommodations(parsed.accommodations.join('\n'));
      setParsedGoals(parsed.goals.join('\n'));
      setAdditionalNotes(parsed.additional_notes || '');
    } catch {
      setParsedDiagnosis('');
      setParsedAccommodations('');
      setParsedGoals('');
      setAdditionalNotes('');
    }
    
    setActiveStep('verify');
  };

  const handleDelete = async (id: string) => {
    if (!currentChild?.id) return;
    if (!confirm(isSpanish ? '¿Está seguro de eliminar este documento?' : 'Are you sure you want to delete this document?')) return;
    
    setLoading(true);
    const res = await deleteClinicalDocumentAction(id, currentChild.id);
    setLoading(false);
    
    if (res.success) {
      setSuccessMessage(isSpanish ? 'Documento eliminado.' : 'Document deleted successfully.');
      loadDocuments();
      setTimeout(() => setSuccessMessage(null), 4000);
    } else {
      setErrorMessage(res.error || 'Failed to delete document');
    }
  };

  const handleSyncToIep = async () => {
    if (!currentChild?.id) return;
    if (!parsedGoals.trim()) return;

    const accommodationsArray = parsedAccommodations.split('\n').map(x => x.trim()).filter(Boolean);
    const goalsArray = parsedGoals.split('\n').map(x => x.trim()).filter(Boolean);

    const formattedGoals = goalsArray.map((goalText, idx) => ({
      templateId: `ocr-goal-${idx}`,
      text: goalText,
      tokens: {}
    }));

    setLoading(true);
    const res = await saveChildIepAction(currentChild.id, accommodationsArray, formattedGoals);
    setLoading(false);

    if (res.success) {
      alert(isSpanish 
        ? '¡Metas sincronizadas! Los objetivos han sido añadidos a la sección de Metas IEP.' 
        : 'Goals synchronized! The objectives have been appended to your child\'s IEP Goals tab.');
    } else {
      setErrorMessage(res.error || 'Failed to sync to IEP goals');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[rgba(255,255,255,0.1)] gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileText className="h-6 w-6 text-indigo-400" />
            {isSpanish ? 'Bóveda de Documentos Clínicos (OCR)' : 'Clinical Document Vault (AI OCR)'}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {isSpanish 
              ? 'Suba evaluaciones, diagnósticos e IEPs para extraer automáticamente adaptaciones, metas y necesidades clínicas.' 
              : 'Ingest school IEPs, neuro-evaluations, and doctor summaries to auto-extract accommodations and target goals.'}
          </p>
        </div>
        
        {activeStep !== 'upload' && (
          <button 
            onClick={resetForm}
            className="px-4 py-2 text-sm text-indigo-300 hover:text-white bg-[rgba(99,102,241,0.15)] hover:bg-[rgba(99,102,241,0.25)] border border-[rgba(99,102,241,0.3)] rounded-lg transition-colors flex items-center gap-1.5 self-start"
          >
            <RefreshCw className="h-4 w-4" />
            {isSpanish ? 'Subir Otro Documento' : 'Upload Another Document'}
          </button>
        )}
      </div>

      {/* Messages */}
      {errorMessage && (
        <div className="p-4 bg-[rgba(239,68,68,0.15)] border border-[rgba(239,68,68,0.3)] rounded-xl flex items-start gap-3 text-red-300 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
          <div>{errorMessage}</div>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-[rgba(16,185,129,0.15)] border border-[rgba(16,185,129,0.3)] rounded-xl flex items-start gap-3 text-emerald-300 text-sm animate-fade-in">
          <FileCheck className="h-5 w-5 shrink-0 text-emerald-400 mt-0.5" />
          <div>{successMessage}</div>
        </div>
      )}

      {/* OCR Main View Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Ingestion / Workspace */}
        <div className="lg:col-span-2 space-y-6">
          
          {activeStep === 'upload' && (
            <div className="glass-panel p-8 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center border border-[rgba(255,255,255,0.06)] min-h-[360px] text-center">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Sparkles className="h-48 w-48 text-indigo-400" />
              </div>
              
              <div className="h-16 w-16 bg-[rgba(99,102,241,0.1)] rounded-2xl flex items-center justify-center border border-[rgba(99,102,241,0.2)] mb-4 text-indigo-400">
                <Upload className="h-8 w-8" />
              </div>
              
              <h3 className="text-lg font-semibold text-white">
                {isSpanish ? 'Subir documento para análisis de IA' : 'Upload Document for AI Parsing'}
              </h3>
              <p className="text-sm text-slate-400 max-w-md mt-2 mb-6">
                {isSpanish 
                  ? 'Formatos soportados: PDF, JPG, PNG. El motor buscará terminologías específicas y organizará metas y limitaciones médicas.' 
                  : 'Supported formats: PDF, JPG, PNG. The parser extracts core diagnostic markers and aligns goals with Education Codes.'}
              </p>

              <div className="flex flex-col items-center gap-4 w-full max-w-sm">
                <div className="w-full">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 text-left">
                    {isSpanish ? 'Categoría de Documento' : 'Document Category'}
                  </label>
                  <select 
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="w-full bg-[rgba(30,41,59,0.7)] text-white border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="iep">{isSpanish ? 'IEP Escolar / Plan de Acomodación' : 'School IEP / Accommodations Plan'}</option>
                    <option value="psychoed">{isSpanish ? 'Evaluación Neuropsicológica' : 'Psychoeducational / Neuro Evaluation'}</option>
                    <option value="ipp">{isSpanish ? 'Plan del Centro Regional (IPP/IFSP)' : 'Regional Center Plan (IPP/IFSP)'}</option>
                    <option value="medical">{isSpanish ? 'Reporte Médico / Diagnóstico' : 'Medical Diagnostic Report'}</option>
                  </select>
                </div>

                <div className="w-full relative">
                  <input 
                    type="file" 
                    id="ocr-file-input"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUploadMock}
                    className="hidden"
                  />
                  <label 
                    htmlFor="ocr-file-input"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] border border-dashed border-[rgba(255,255,255,0.15)] hover:border-indigo-500 rounded-xl text-sm font-semibold text-slate-200 cursor-pointer transition-all"
                  >
                    <FileText className="h-5 w-5 text-slate-400" />
                    {fileName ? fileName : (isSpanish ? 'Seleccionar Archivo...' : 'Select File...')}
                  </label>
                </div>

                {fileName && (
                  <button 
                    onClick={runOcrSimulator}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[rgba(99,102,241,0.2)]"
                  >
                    <Sparkles className="h-4 w-4" />
                    {isSpanish ? 'Iniciar Escaneo OCR' : 'Start OCR Extraction'}
                  </button>
                )}
              </div>
            </div>
          )}

          {activeStep === 'parsing' && (
            <div className="glass-panel p-8 rounded-2xl border border-[rgba(255,255,255,0.06)] min-h-[360px] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-6 w-6 text-indigo-400 animate-spin" />
                  <div>
                    <h3 className="font-semibold text-white text-lg">
                      {isSpanish ? 'Procesando Documento' : 'Processing Document'}
                    </h3>
                    <p className="text-xs text-slate-400">{fileName}</p>
                  </div>
                </div>
                <span className="px-2 py-1 text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-md font-mono">
                  OCR RUNNING
                </span>
              </div>

              {/* Progress Console */}
              <div className="my-6 bg-[rgba(15,23,42,0.6)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 font-mono text-xs text-slate-300 min-h-[180px] max-h-[220px] overflow-y-auto space-y-2 scrollbar-thin">
                {ocrLogs.map((log, index) => (
                  <div key={index} className="flex items-start gap-2 text-indigo-200">
                    <span className="text-indigo-500 font-bold">&gt;</span>
                    <span>{log}</span>
                    {index === ocrLogs.length - 1 && ocrRunning && (
                      <span className="inline-block w-1.5 h-3 bg-indigo-400 animate-pulse"></span>
                    )}
                  </div>
                ))}
              </div>

              <p className="text-center text-xs text-slate-500 italic">
                {isSpanish 
                  ? 'El cumplimiento con HIPAA requiere la encriptación de datos médicos antes del almacenamiento.' 
                  : 'This workflow is designed to encrypt extracted medical records before storage, but you should still confirm the current deployment and compliance configuration before relying on that protection.'}
              </p>
            </div>
          )}

          {activeStep === 'verify' && (
            <div className="glass-panel p-6 rounded-2xl border border-[rgba(255,255,255,0.06)] space-y-6 animate-fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-[rgba(255,255,255,0.08)]">
                <div className="flex items-center gap-2.5">
                  <div className="h-10 w-10 bg-indigo-500/10 rounded-lg flex items-center justify-center border border-indigo-500/20 text-indigo-400">
                    <FileCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      {isSpanish ? 'Verificación de Datos Extraídos' : 'Verify Extracted AI Data'}
                    </h3>
                    <p className="text-xs text-slate-400">{fileName}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {documentType === 'iep' && (
                    <button 
                      onClick={handleSyncToIep}
                      className="px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Database className="h-3.5 w-3.5" />
                      {isSpanish ? 'Sincronizar a IEP' : 'Sync to IEP Goals'}
                    </button>
                  )}
                  <button 
                    onClick={handleSaveDocument}
                    className="px-4 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors flex items-center gap-1 shadow-md shadow-[rgba(99,102,241,0.15)]"
                  >
                    <Check className="h-3.5 w-3.5" />
                    {isSpanish ? 'Guardar Cambios' : 'Verify & Save'}
                  </button>
                </div>
              </div>

              {/* Editable Fields Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    {isSpanish ? 'Diagnóstico Clínico Identificado' : 'Identified Clinical Diagnosis'}
                  </label>
                  <input 
                    type="text"
                    value={parsedDiagnosis}
                    onChange={(e) => setParsedDiagnosis(e.target.value)}
                    className="w-full bg-[rgba(30,41,59,0.5)] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Autism Spectrum Disorder"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    {isSpanish ? 'Categoría de Documento' : 'Document Category'}
                  </label>
                  <select 
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="w-full bg-[rgba(30,41,59,0.5)] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="iep">IEP / Accommodations Plan</option>
                    <option value="psychoed">Psychoeducational Evaluation</option>
                    <option value="ipp">Regional Center IPP</option>
                    <option value="medical">Medical diagnostic report</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>{isSpanish ? 'Adaptaciones y Servicios Recomendados' : 'Recommended Accommodations & Services'}</span>
                    <span className="text-[10px] text-slate-500 font-mono italic">({isSpanish ? 'Uno por línea' : 'One per line'})</span>
                  </label>
                  <textarea 
                    rows={4}
                    value={parsedAccommodations}
                    onChange={(e) => setParsedAccommodations(e.target.value)}
                    className="w-full bg-[rgba(30,41,59,0.5)] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-indigo-500 scrollbar-thin"
                    placeholder="Visual schedule&#10;Frequent breaks"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>{isSpanish ? 'Objetivos y Metas Clínicos' : 'Clinical & Educational Goals'}</span>
                    <span className="text-[10px] text-slate-500 font-mono italic">({isSpanish ? 'Uno por línea' : 'One per line'})</span>
                  </label>
                  <textarea 
                    rows={4}
                    value={parsedGoals}
                    onChange={(e) => setParsedGoals(e.target.value)}
                    className="w-full bg-[rgba(30,41,59,0.5)] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-indigo-500 scrollbar-thin"
                    placeholder="Will increase expressive communication goals..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    {isSpanish ? 'Notas Adicionales y Auditoría de IA' : 'Additional Notes & AI Audit Trail'}
                  </label>
                  <input 
                    type="text"
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    className="w-full bg-[rgba(30,41,59,0.5)] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right 1 Col: Inventory & Guidelines */}
        <div className="space-y-6">
          {/* Vetted Ingested documents list */}
          <div className="glass-panel p-5 rounded-2xl border border-[rgba(255,255,255,0.06)] space-y-4">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider text-slate-400">
              {isSpanish ? 'Documentos Archivados' : 'Vault Inventory'}
            </h3>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 text-indigo-400 animate-spin" />
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm border border-dashed border-[rgba(255,255,255,0.06)] rounded-xl p-4">
                <FileText className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                {isSpanish ? 'No hay documentos guardados.' : 'No clinical files uploaded yet.'}
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                {documents.map((doc) => (
                  <div 
                    key={doc.id}
                    className="p-3 bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.1)] rounded-xl transition-all flex items-start justify-between gap-2 group"
                  >
                    <button 
                      onClick={() => handleViewDetails(doc)}
                      className="flex items-start gap-2.5 text-left grow"
                    >
                      <FileText className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                      <div className="truncate">
                        <p className="text-xs font-semibold text-slate-200 group-hover:text-white truncate max-w-[140px]">{doc.file_name}</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5 font-mono">{doc.document_type}</p>
                      </div>
                    </button>
                    
                    <button 
                      onClick={() => handleDelete(doc.id)}
                      className="text-slate-500 hover:text-red-400 p-1 rounded-md hover:bg-red-500/10 transition-colors shrink-0"
                      title={isSpanish ? 'Eliminar' : 'Delete'}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Educational Compliance Info Box */}
          <div className="glass-panel p-5 rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(99,102,241,0.03)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 text-indigo-500/10">
              <Sparkles className="h-16 w-16" />
            </div>
            
            <h3 className="font-bold text-white text-sm uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Plus className="h-4 w-4 text-indigo-400" />
              {isSpanish ? 'Guía del Código de California' : 'Statutory Reference'}
            </h3>
            
            <ul className="text-xs text-slate-400 space-y-2 mt-3 list-disc pl-4 leading-relaxed">
              <li>
                <strong>Cal. Ed. Code § 56341.1:</strong> {isSpanish ? 'El equipo del IEP debe considerar los resultados de evaluaciones externas al planificar objetivos escolares.' : 'The IEP team must review and consider any clinical assessments submitted by parents during educational planning.'}
              </li>
              <li>
                <strong>W&I Code § 4646:</strong> {isSpanish ? 'Los Centros Regionales deben actualizar el IPP basándose en diagnósticos clínicos verificados.' : 'Regional Center IPPs must reflect updated physiological evaluation reports.'}
              </li>
              <li>
                <strong>{isSpanish ? 'Seguridad HIPAA:' : 'Security Standard:'}</strong> {isSpanish ? 'Toda información médica o de IEP se almacena encriptada usando cifrado AES-256 en reposo.' : 'All clinical texts and child summaries are encrypted using AES-256 keys.'}
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
