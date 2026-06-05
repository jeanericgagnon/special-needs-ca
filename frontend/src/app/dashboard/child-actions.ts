'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';
import { verifyToken } from '@/lib/auth';
import { 
  createChildProfile, 
  updateChildProfile, 
  deleteChildProfile,
  saveProgramStatus,
  unsaveProgram,
  setChecklistItemCollected,
  createReminder,
  toggleReminderCompleted,
  deleteReminder,
  Reminder,
  saveChildIepData,
  saveChildRespiteData,
  saveChildWaiver,
  deleteChildWaiver,
  ChildWaiver,
  getSafetyIncidents,
  saveSafetyIncident,
  deleteSafetyIncident,
  getParentDeclaration,
  saveParentDeclaration,
  SafetyIncident,
  getCaregiverProfile,
  saveCaregiverProfile,
  getChildTransitionTasks,
  toggleTransitionTask,
  getSelfCareLog,
  saveSelfCareLog,
  getChildCoordinator,
  saveChildCoordinator,
  verifyChildOwnership,
  getChildIdByReminder,
  getChildIdByWaiver,
  getChildIdBySafetyIncident,
  getCaregiverFinancialProfile,
  saveCaregiverFinancialProfile,
  getChildWaitlistItems,
  saveChildWaitlistItem,
  deleteChildWaitlistItem,
  getChildIepPrepData,
  saveChildIepPrepData,
  getIhssOvertimeSchedule,
  saveIhssOvertimeSchedule,
  getChildSdpBudget,
  saveChildSdpBudget,
  searchKnowledgeArticles,
  CaregiverFinancialProfile,
  WaitlistItem as DbWaitlistItem,
  ChildIepPrepData,
  IhssOvertimeSchedule,
  ChildSdpBudget,
  getChildClinicalDocuments,
  saveClinicalDocument,
  deleteClinicalDocument,
  getConsultationThreads,
  getThreadMessages,
  createConsultationThread,
  insertMessage,
  saveSharedPortalToken,
  getActiveSharedPortalTokens,
  revokeShareToken,
  getIepAdvocates,
  verifyShareToken,
  ChildClinicalDocument,
  ConsultationMessage,
  SharedPortalToken
} from '@/lib/db';

// Helper to check authentication
async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  const session = token ? verifyToken(token) : null;
  if (!session) {
    throw new Error('Unauthorized access');
  }
  return session;
}

async function assertOwnership(childId: string) {
  const user = await getSessionUser();
  if (!await verifyChildOwnership(childId, user.userId)) {
    throw new Error('Access Denied: Child profile does not belong to user session');
  }
}

export async function saveChildAction(formData: FormData) {
  try {
    const user = await getSessionUser();
    
    const childId = formData.get('childId') as string; // Present if editing
    const nickname = formData.get('nickname') as string;
    const dob = formData.get('dob') as string;
    const countyId = formData.get('countyId') as string;
    const zipCode = formData.get('zipCode') as string || '';
    const insuranceType = formData.get('insuranceType') as string || 'private';
    const schoolStatus = formData.get('schoolStatus') as string || 'none';
    const caregiverNotes = formData.get('caregiverNotes') as string || '';

    // Multiple selection values for conditions and needs
    const conditionIds = formData.getAll('conditionIds') as string[];
    const functionalNeedIds = formData.getAll('functionalNeedIds') as string[];

    if (!nickname || !dob || !countyId) {
      return { error: 'Nickname, Date of Birth, and County are required.' };
    }

    const childData = {
      id: childId || 'child-' + Date.now(),
      nickname,
      dob,
      county_id: countyId,
      zip_code: zipCode,
      insurance_type: insuranceType,
      school_status: schoolStatus,
      caregiver_notes: caregiverNotes,
      conditionIds,
      functionalNeedIds
    };

    if (childId) {
      // Edit mode
      await assertOwnership(childId);
      await updateChildProfile(childData);
    } else {
      // Create mode
      await createChildProfile(childData, user.userId);
    }

    revalidatePath('/dashboard');
    return { success: true };
  } catch (err) {
    console.error('Save child action error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to save child profile.' };
  }
}

export async function deleteChildAction(childId: string) {
  try {
    await assertOwnership(childId);
    await deleteChildProfile(childId);
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err) {
    console.error('Delete child action error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to delete child profile.' };
  }
}

export async function updateProgramStatusAction(childId: string, programId: string, status: string) {
  try {
    await assertOwnership(childId);
    if (status === 'untracked') {
      await unsaveProgram(childId, programId);
    } else {
      await saveProgramStatus(childId, programId, status);
    }
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err) {
    console.error('Update program status action error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to update program status.' };
  }
}

export async function toggleChecklistItemAction(childId: string, documentName: string, isCollected: boolean, programId: string) {
  try {
    await assertOwnership(childId);
    await setChecklistItemCollected(childId, documentName, isCollected, programId);
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err) {
    console.error('Toggle checklist item error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to update checklist item.' };
  }
}

export async function addReminderAction(childId: string, title: string, dueDate: string, programId: string | null) {
  try {
    await assertOwnership(childId);
    
    if (!title || !dueDate) {
      return { error: 'Title and due date are required for reminders.' };
    }

    const reminder: Reminder = {
      id: 'rem-' + Date.now(),
      child_id: childId,
      program_id: programId,
      title,
      due_date: dueDate,
      is_completed: 0
    };

    await createReminder(reminder);
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err) {
    console.error('Add reminder action error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to add reminder.' };
  }
}

export async function toggleReminderAction(reminderId: string, isCompleted: boolean) {
  try {
    const childId = await getChildIdByReminder(reminderId);
    if (!childId) throw new Error('Reminder not found');
    await assertOwnership(childId);
    await toggleReminderCompleted(reminderId, isCompleted);
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err) {
    console.error('Toggle reminder error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to toggle reminder status.' };
  }
}

export async function deleteReminderAction(reminderId: string) {
  try {
    const childId = await getChildIdByReminder(reminderId);
    if (!childId) throw new Error('Reminder not found');
    await assertOwnership(childId);
    await deleteReminder(reminderId);
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err) {
    console.error('Delete reminder error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to delete reminder.' };
  }
}

export async function saveChildIepAction(
  childId: string, 
  accommodations: string[], 
  goals: { templateId: string; text: string; tokens: Record<string, string> }[]
) {
  try {
    await assertOwnership(childId);
    const success = await saveChildIepData(childId, accommodations, goals);
    if (!success) throw new Error('DB write failed');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err) {
    console.error('Save child IEP action error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to save child IEP plan.' };
  }
}

export async function saveChildRespiteAction(
  childId: string,
  scores: { safety: number; sleep: number; medical: number; behavior: number }
) {
  try {
    await assertOwnership(childId);
    const success = await saveChildRespiteData(childId, scores);
    if (!success) throw new Error('DB write failed');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err) {
    console.error('Save child respite action error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to save child respite parameters.' };
  }
}

export async function saveChildWaiverAction(waiver: ChildWaiver) {
  try {
    await assertOwnership(waiver.child_id);
    await saveChildWaiver(waiver);
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err) {
    console.error('Save child waiver action error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to save waiver.' };
  }
}

export async function deleteChildWaiverAction(waiverId: string) {
  try {
    const childId = await getChildIdByWaiver(waiverId);
    if (!childId) throw new Error('Waiver not found');
    await assertOwnership(childId);
    await deleteChildWaiver(waiverId);
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err) {
    console.error('Delete child waiver action error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to delete waiver.' };
  }
}

export async function getSafetyIncidentsAction(childId: string) {
  try {
    await assertOwnership(childId);
    const incidents = await getSafetyIncidents(childId);
    return { success: true, incidents };
  } catch (err) {
    console.error('Get safety incidents action error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to retrieve safety incidents.' };
  }
}

export async function saveSafetyIncidentAction(incident: Omit<SafetyIncident, 'child_id'> & { child_id?: string }, childId: string) {
  try {
    await assertOwnership(childId);
    const fullIncident: SafetyIncident = {
      id: incident.id,
      child_id: childId,
      time: incident.time,
      category: incident.category,
      risk_level: incident.risk_level,
      details: incident.details,
      intervention: incident.intervention
    };
    await saveSafetyIncident(fullIncident);
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err) {
    console.error('Save safety incident action error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to save safety incident.' };
  }
}

export async function deleteSafetyIncidentAction(id: string) {
  try {
    const childId = await getChildIdBySafetyIncident(id);
    if (!childId) throw new Error('Incident not found');
    await assertOwnership(childId);
    await deleteSafetyIncident(id);
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err) {
    console.error('Delete safety incident action error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to delete safety incident.' };
  }
}

export async function getParentDeclarationAction(childId: string) {
  try {
    await assertOwnership(childId);
    const declaration = await getParentDeclaration(childId);
    return { success: true, declaration };
  } catch (err) {
    console.error('Get parent declaration action error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to retrieve parent declaration.' };
  }
}

export async function saveParentDeclarationAction(childId: string, text: string, doctorName: string) {
  try {
    await assertOwnership(childId);
    await saveParentDeclaration(childId, text, doctorName);
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err) {
    console.error('Save parent declaration action error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to save parent declaration.' };
  }
}

export async function getCaregiverProfileAction() {
  try {
    const user = await getSessionUser();
    const profile = await getCaregiverProfile(user.userId);
    return { success: true, profile };
  } catch (err) {
    console.error('Get caregiver profile action error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to retrieve caregiver profile.' };
  }
}

export async function saveCaregiverProfileAction(name: string, email: string, phone: string, address: string) {
  try {
    const user = await getSessionUser();
    await saveCaregiverProfile(user.userId, name, email, phone, address);
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err) {
    console.error('Save caregiver profile action error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to save caregiver profile.' };
  }
}

export async function getChildTransitionTasksAction(childId: string) {
  try {
    await assertOwnership(childId);
    const tasks = await getChildTransitionTasks(childId);
    return { success: true, tasks };
  } catch (err) {
    console.error('Get child transition tasks action error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to retrieve transition tasks.' };
  }
}

export async function toggleTransitionTaskAction(childId: string, taskId: string, isCompleted: boolean) {
  try {
    await assertOwnership(childId);
    await toggleTransitionTask(childId, taskId, isCompleted);
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err) {
    console.error('Toggle transition task action error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to toggle transition task.' };
  }
}

export async function getSelfCareLogAction(childId: string) {
  try {
    await assertOwnership(childId);
    const log = await getSelfCareLog(childId);
    return { success: true, log };
  } catch (err) {
    console.error('Get self care log action error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to retrieve self-care log.' };
  }
}

export async function saveSelfCareLogAction(childId: string, days: Record<string, boolean>) {
  try {
    await assertOwnership(childId);
    await saveSelfCareLog(childId, days);
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err) {
    console.error('Save self care log action error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to save self-care log.' };
  }
}

export async function getChildCoordinatorAction(childId: string) {
  try {
    await assertOwnership(childId);
    const name = await getChildCoordinator(childId);
    return { success: true, name };
  } catch (err) {
    console.error('Get child coordinator action error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to retrieve coordinator.' };
  }
}

export async function saveChildCoordinatorAction(childId: string, coordinatorName: string) {
  try {
    await assertOwnership(childId);
    await saveChildCoordinator(childId, coordinatorName);
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err) {
    console.error('Save child coordinator action error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to save coordinator.' };
  }
}


export async function getCaregiverFinancialProfileAction(childId: string) {
  try {
    await assertOwnership(childId);
    const profile = await getCaregiverFinancialProfile(childId);
    return { success: true, profile };
  } catch (err) {
    console.error('Get caregiver financial profile action error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to retrieve financial profile.' };
  }
}

export async function saveCaregiverFinancialProfileAction(childId: string, profile: Record<string, unknown>) {
  try {
    await assertOwnership(childId);
    const success = await saveCaregiverFinancialProfile({
      child_id: childId,
      ...profile
    } as unknown as CaregiverFinancialProfile);
    if (!success) throw new Error('DB write failed');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err) {
    console.error('Save caregiver financial profile action error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to save financial profile.' };
  }
}

export async function getChildWaitlistItemsAction(childId: string) {
  try {
    await assertOwnership(childId);
    const items = await getChildWaitlistItems(childId);
    return { success: true, items };
  } catch (err) {
    console.error('Get child waitlist items action error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to retrieve waitlist items.' };
  }
}

export async function saveChildWaitlistItemAction(item: Record<string, unknown>, childId: string) {
  try {
    await assertOwnership(childId);
    const success = await saveChildWaitlistItem({
      child_id: childId,
      ...item
    } as unknown as DbWaitlistItem);
    if (!success) throw new Error('DB write failed');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err) {
    console.error('Save child waitlist item action error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to save waitlist item.' };
  }
}

export async function deleteChildWaitlistItemAction(id: string, childId: string) {
  try {
    await assertOwnership(childId);
    const success = await deleteChildWaitlistItem(id);
    if (!success) throw new Error('DB delete failed');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err) {
    console.error('Delete child waitlist item action error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to delete waitlist item.' };
  }
}

export async function getChildIepPrepDataAction(childId: string) {
  try {
    await assertOwnership(childId);
    const data = await getChildIepPrepData(childId);
    return { success: true, data };
  } catch (err) {
    console.error('Get IEP prep data action error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to retrieve IEP prep data.' };
  }
}

export async function saveChildIepPrepDataAction(childId: string, data: Record<string, unknown>) {
  try {
    await assertOwnership(childId);
    const success = await saveChildIepPrepData({
      child_id: childId,
      ...data
    } as unknown as ChildIepPrepData);
    if (!success) throw new Error('DB write failed');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err) {
    console.error('Save IEP prep data action error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to save IEP prep data.' };
  }
}

export async function getIhssOvertimeScheduleAction(childId: string) {
  try {
    await assertOwnership(childId);
    const schedule = await getIhssOvertimeSchedule(childId);
    return { success: true, schedule };
  } catch (err) {
    console.error('Get IHSS overtime schedule action error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to retrieve IHSS overtime schedule.' };
  }
}

export async function saveIhssOvertimeScheduleAction(childId: string, schedule: Record<string, unknown>) {
  try {
    await assertOwnership(childId);
    const success = await saveIhssOvertimeSchedule({
      child_id: childId,
      ...schedule
    } as unknown as IhssOvertimeSchedule);
    if (!success) throw new Error('DB write failed');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err) {
    console.error('Save IHSS overtime schedule action error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to save IHSS overtime schedule.' };
  }
}

export async function getChildSdpBudgetAction(childId: string) {
  try {
    await assertOwnership(childId);
    const budget = await getChildSdpBudget(childId);
    return { success: true, budget };
  } catch (err) {
    console.error('Get child SDP budget action error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to retrieve child SDP budget.' };
  }
}

export async function saveChildSdpBudgetAction(childId: string, budget: Record<string, unknown>) {
  try {
    await assertOwnership(childId);
    const success = await saveChildSdpBudget({
      child_id: childId,
      ...budget
    } as unknown as ChildSdpBudget);
    if (!success) throw new Error('DB write failed');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err) {
    console.error('Save child SDP budget action error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to save child SDP budget.' };
  }
}

export async function searchArticlesAction(query: string) {
  try {
    const articles = await searchKnowledgeArticles(query);
    return { success: true, articles };
  } catch (err) {
    console.error('Search articles action error:', err);
    return { error: 'Failed to search articles.' };
  }
}

// -------------------------------------------------------------
// CLINICAL DOCUMENTS ACTIONS
// -------------------------------------------------------------

export async function getChildClinicalDocumentsAction(childId: string) {
  try {
    await assertOwnership(childId);
    const documents = await getChildClinicalDocuments(childId);
    return { success: true, documents };
  } catch (err) {
    console.error('Get child clinical documents error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to retrieve clinical documents.' };
  }
}

export async function saveClinicalDocumentAction(childId: string, doc: Omit<ChildClinicalDocument, 'child_id'>) {
  try {
    await assertOwnership(childId);
    const fullDoc: ChildClinicalDocument = {
      ...doc,
      child_id: childId
    };
    const success = await saveClinicalDocument(fullDoc);
    if (!success) throw new Error('DB write failed');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err) {
    console.error('Save clinical document error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to save clinical document.' };
  }
}

export async function deleteClinicalDocumentAction(docId: string, childId: string) {
  try {
    await assertOwnership(childId);
    const success = await deleteClinicalDocument(docId);
    if (!success) throw new Error('DB delete failed');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err) {
    console.error('Delete clinical document error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to delete clinical document.' };
  }
}

// -------------------------------------------------------------
// CONSULTATION MESSAGING ACTIONS
// -------------------------------------------------------------

export async function getConsultationThreadsAction(childId: string) {
  try {
    await assertOwnership(childId);
    const threads = await getConsultationThreads(childId);
    return { success: true, threads };
  } catch (err) {
    console.error('Get consultation threads error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to retrieve threads.' };
  }
}

export async function getThreadMessagesAction(threadId: string, childId: string) {
  try {
    await assertOwnership(childId);
    const messages = await getThreadMessages(threadId);
    return { success: true, messages };
  } catch (err) {
    console.error('Get thread messages error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to retrieve messages.' };
  }
}

export async function createConsultationThreadAction(childId: string, advocateId: string) {
  try {
    await assertOwnership(childId);
    const id = 'thread-' + Date.now();
    const success = await createConsultationThread(id, childId, advocateId);
    if (!success) throw new Error('DB write failed');
    revalidatePath('/dashboard');
    return { success: true, threadId: id };
  } catch (err) {
    console.error('Create consultation thread error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to create thread.' };
  }
}

export async function sendConsultationMessageAction(
  threadId: string,
  childId: string,
  text: string,
  senderRole: 'parent' | 'advocate',
  attachmentsJson: string | null = null
) {
  try {
    await assertOwnership(childId);
    const msg: ConsultationMessage = {
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      thread_id: threadId,
      sender_role: senderRole,
      message_text: text,
      attachments_json: attachmentsJson,
      created_at: new Date().toISOString()
    };
    const success = await insertMessage(msg);
    if (!success) throw new Error('DB write failed');
    
    revalidatePath('/dashboard');
    return { success: true, message: msg };
  } catch (err) {
    console.error('Send message error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to send message.' };
  }
}

// -------------------------------------------------------------
// TIME-BOUNDED PORTAL TOKENS ACTIONS
// -------------------------------------------------------------

export async function getActiveSharedPortalTokensAction(childId: string) {
  try {
    await assertOwnership(childId);
    const tokens = await getActiveSharedPortalTokens(childId);
    return { success: true, tokens };
  } catch (err) {
    console.error('Get active shared portal tokens error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to retrieve share tokens.' };
  }
}

export async function generateShareTokenAction(childId: string, expiresAt: string, accessScope: 'read_only' | 'read_write') {
  try {
    await assertOwnership(childId);
    const tokenBytes = crypto.randomBytes(24).toString('hex');
    const token: SharedPortalToken = {
      id: 'tok-' + Date.now(),
      child_id: childId,
      token: tokenBytes,
      expires_at: expiresAt,
      access_scope: accessScope,
      created_at: new Date().toISOString()
    };
    const success = await saveSharedPortalToken(token);
    if (!success) throw new Error('DB write failed');
    revalidatePath('/dashboard');
    return { success: true, token };
  } catch (err) {
    console.error('Generate share token error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to generate share token.' };
  }
}

export async function revokeShareTokenAction(tokenId: string, childId: string) {
  try {
    await assertOwnership(childId);
    const success = await revokeShareToken(tokenId);
    if (!success) throw new Error('DB delete failed');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err) {
    console.error('Revoke share token error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to revoke share token.' };
  }
}

export async function getIepAdvocatesAction(countyId?: string) {
  try {
    const advocates = await getIepAdvocates(countyId);
    return { success: true, advocates };
  } catch (err) {
    console.error('Get IEP advocates error:', err);
    return { error: 'Failed to retrieve advocates list.' };
  }
}

export async function saveSharedIncidentAction(tokenStr: string, incident: Omit<SafetyIncident, 'child_id'>) {
  try {
    const tokenObj = await verifyShareToken(tokenStr);
    if (!tokenObj || tokenObj.access_scope !== 'read_write') {
      throw new Error('Access Denied: Invalid or read-only token');
    }
    
    const fullIncident: SafetyIncident = {
      id: incident.id || 'inc-' + Date.now(),
      child_id: tokenObj.child_id,
      time: incident.time,
      category: incident.category,
      risk_level: incident.risk_level,
      details: incident.details,
      intervention: incident.intervention
    };
    await saveSafetyIncident(fullIncident);
    revalidatePath(`/share/log/${tokenStr}`);
    return { success: true };
  } catch (err) {
    console.error('Save shared incident error:', err);
    return { error: err instanceof Error ? err.message : 'Failed to save incident.' };
  }
}
