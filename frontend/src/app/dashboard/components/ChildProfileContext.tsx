'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  County,
  TaxonomyCondition,
  FunctionalNeed,
  ChildProfile,
  Program,
  ProgramStatus,
  ChecklistItem,
  Reminder,
  ChildIepData,
  ChildRespiteData,
  CoreProgramMatch,
  IepAdvocate,
  ChildWaiver,
  CountyOffice,
  SchoolDistrict,
  NonprofitOrganization,
  RegionalCenter,
  Selpa
} from '@/lib/db';

export type TabType = 'roadmap' | 'benefits' | 'iep' | 'dds' | 'ihss' | 'appeals' | 'actions' | 'county' | 'waivers' | 'knowledge' | 'waitlists' | 'iepprep' | 'transition' | 'support';
export type LetterTemplateType = 'iep-request' | 'ihss-appeal' | 'rc-appeal' | 'ssi-reconsideration' | 'epsdt-therapy';

interface ChildProfileContextProps {
  // Config & Taxonomy
  counties: County[];
  conditions: TaxonomyCondition[];
  needs: FunctionalNeed[];
  
  // Children & Selected Profile
  childrenList: ChildProfile[];
  selectedChildId: string | null;
  setSelectedChildId: (id: string | null) => void;
  currentChild: ChildProfile | null;
  deleteChild: (id: string) => Promise<{ success: boolean; error?: string }>;

  // Datasets
  matchedPrograms: CoreProgramMatch[];
  crawlerPrograms: Program[];
  savedStatuses: ProgramStatus[];
  savedChecklist: ChecklistItem[];
  savedReminders: Reminder[];
  countyDetails: (County & {
    countyOffices: CountyOffice[];
    schoolDistricts: SchoolDistrict[];
    localOrganizations: NonprofitOrganization[];
    regionalCenters: RegionalCenter[];
    selpas: Selpa[];
  }) | null;
  savedIepData: ChildIepData;
  savedRespiteData: ChildRespiteData | null;
  localAdvocates: IepAdvocate[];
  savedWaivers: ChildWaiver[];

  // Global Routing & Prefills
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  activeTemplate: LetterTemplateType;
  setActiveTemplate: (tpl: LetterTemplateType) => void;
  parentName: string;
  setParentName: (name: string) => void;
  childName: string;
  setChildName: (name: string) => void;
}

const ChildProfileContext = createContext<ChildProfileContextProps | undefined>(undefined);

export function ChildProfileProvider({
  children,
  initialTab,
  ...props
}: {
  children: React.ReactNode;
  initialTab?: string | null;
  counties: County[];
  conditions: TaxonomyCondition[];
  needs: FunctionalNeed[];
  childrenList: ChildProfile[];
  selectedChildId: string | null;
  matchedPrograms: CoreProgramMatch[];
  crawlerPrograms: Program[];
  savedStatuses: ProgramStatus[];
  savedChecklist: ChecklistItem[];
  savedReminders: Reminder[];
  countyDetails: (County & {
    countyOffices: CountyOffice[];
    schoolDistricts: SchoolDistrict[];
    localOrganizations: NonprofitOrganization[];
    regionalCenters: RegionalCenter[];
    selpas: Selpa[];
  }) | null;
  savedIepData: ChildIepData;
  savedRespiteData: ChildRespiteData | null;
  localAdvocates?: IepAdvocate[];
  savedWaivers?: ChildWaiver[];
}) {
  const [selectedChildId, setSelectedChildId] = useState<string | null>(props.selectedChildId);
  const [activeTab, setActiveTab] = useState<TabType>(
    (initialTab && ['roadmap', 'benefits', 'iep', 'dds', 'ihss', 'appeals', 'actions', 'county', 'waivers', 'knowledge', 'waitlists', 'iepprep', 'transition', 'support'].includes(initialTab))
      ? (initialTab as TabType)
      : 'roadmap'
  );
  const [activeTemplate, setActiveTemplate] = useState<LetterTemplateType>('iep-request');
  const [parentName, setParentName] = useState('');
  const [childName, setChildName] = useState('');

  // Find active child profile
  const currentChild = props.childrenList.find(c => c.id === selectedChildId) || props.childrenList[0] || null;

  // Hydrate custom prefill details
  useEffect(() => {
    if (currentChild) {
      Promise.resolve().then(() => {
        setChildName(currentChild.nickname);
        const savedParentName = localStorage.getItem('caregiver_name') || localStorage.getItem('funding_parent_name');
        if (savedParentName) setParentName(savedParentName);
      });
    }
  }, [currentChild]);

  // Handle URL changes
  useEffect(() => {
    if (initialTab && ['roadmap', 'benefits', 'iep', 'dds', 'ihss', 'appeals', 'actions', 'county', 'waivers', 'knowledge', 'waitlists', 'iepprep', 'transition', 'support'].includes(initialTab)) {
      Promise.resolve().then(() => {
        setActiveTab(initialTab as TabType);
      });
    }
  }, [initialTab]);

  const deleteChild = async () => {
    // Delete action wrapper could be called here or handled in components
    return { success: true };
  };

  return (
    <ChildProfileContext.Provider
      value={{
        counties: props.counties,
        conditions: props.conditions,
        needs: props.needs,
        childrenList: props.childrenList,
        selectedChildId,
        setSelectedChildId,
        currentChild,
        deleteChild,
        matchedPrograms: props.matchedPrograms,
        crawlerPrograms: props.crawlerPrograms,
        savedStatuses: props.savedStatuses,
        savedChecklist: props.savedChecklist,
        savedReminders: props.savedReminders,
        countyDetails: props.countyDetails,
        savedIepData: props.savedIepData,
        savedRespiteData: props.savedRespiteData,
        localAdvocates: props.localAdvocates || [],
        savedWaivers: props.savedWaivers || [],
        activeTab,
        setActiveTab,
        activeTemplate,
        setActiveTemplate,
        parentName,
        setParentName,
        childName,
        setChildName
      }}
    >
      {children}
    </ChildProfileContext.Provider>
  );
}

export function useChildProfile() {
  const context = useContext(ChildProfileContext);
  if (!context) {
    throw new Error('useChildProfile must be used within a ChildProfileProvider');
  }
  return context;
}
