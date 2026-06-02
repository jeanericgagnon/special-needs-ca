'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
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
  saveChildRespiteData
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
      updateChildProfile(childData);
    } else {
      // Create mode
      createChildProfile(childData, user.userId);
    }

    revalidatePath('/dashboard');
    return { success: true };
  } catch (err: any) {
    console.error('Save child action error:', err);
    return { error: err.message || 'Failed to save child profile.' };
  }
}

export async function deleteChildAction(childId: string) {
  try {
    await getSessionUser();
    deleteChildProfile(childId);
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err: any) {
    console.error('Delete child action error:', err);
    return { error: err.message || 'Failed to delete child profile.' };
  }
}

export async function updateProgramStatusAction(childId: string, programId: string, status: string) {
  try {
    await getSessionUser();
    if (status === 'untracked') {
      unsaveProgram(childId, programId);
    } else {
      saveProgramStatus(childId, programId, status);
    }
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err: any) {
    console.error('Update program status action error:', err);
    return { error: err.message || 'Failed to update program status.' };
  }
}

export async function toggleChecklistItemAction(childId: string, documentName: string, isCollected: boolean, programId: string) {
  try {
    await getSessionUser();
    setChecklistItemCollected(childId, documentName, isCollected, programId);
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err: any) {
    console.error('Toggle checklist item error:', err);
    return { error: err.message || 'Failed to update checklist item.' };
  }
}

export async function addReminderAction(childId: string, title: string, dueDate: string, programId: string | null) {
  try {
    await getSessionUser();
    
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

    createReminder(reminder);
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err: any) {
    console.error('Add reminder action error:', err);
    return { error: err.message || 'Failed to add reminder.' };
  }
}

export async function toggleReminderAction(reminderId: string, isCompleted: boolean) {
  try {
    await getSessionUser();
    toggleReminderCompleted(reminderId, isCompleted);
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err: any) {
    console.error('Toggle reminder error:', err);
    return { error: err.message || 'Failed to toggle reminder status.' };
  }
}

export async function deleteReminderAction(reminderId: string) {
  try {
    await getSessionUser();
    deleteReminder(reminderId);
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err: any) {
    console.error('Delete reminder error:', err);
    return { error: err.message || 'Failed to delete reminder.' };
  }
}

export async function saveChildIepAction(
  childId: string, 
  accommodations: string[], 
  goals: { templateId: string; text: string; tokens: Record<string, string> }[]
) {
  try {
    await getSessionUser();
    const success = saveChildIepData(childId, accommodations, goals);
    if (!success) throw new Error('DB write failed');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err: any) {
    console.error('Save child IEP action error:', err);
    return { error: err.message || 'Failed to save child IEP plan.' };
  }
}

export async function saveChildRespiteAction(
  childId: string,
  scores: { safety: number; sleep: number; medical: number; behavior: number }
) {
  try {
    await getSessionUser();
    const success = saveChildRespiteData(childId, scores);
    if (!success) throw new Error('DB write failed');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err: any) {
    console.error('Save child respite action error:', err);
    return { error: err.message || 'Failed to save child respite parameters.' };
  }
}
