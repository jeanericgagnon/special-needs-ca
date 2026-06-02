'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getUserByEmail, createUser, createChildProfile } from '@/lib/db';
import { hashPassword, verifyPassword, signToken } from '@/lib/auth';

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Please enter both email and password.' };
  }

  try {
    const user = getUserByEmail(email);
    if (!user) {
      return { error: 'Invalid email or password.' };
    }

    const isValid = verifyPassword(password, user.password_hash);
    if (!isValid) {
      return { error: 'Invalid email or password.' };
    }

    const token = signToken({ userId: user.id, email: user.email });
    
    // Set HTTP-Only Cookie
    const cookieStore = await cookies();
    cookieStore.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    });
  } catch (err: any) {
    console.error('Login action error:', err);
    return { error: 'An unexpected error occurred. Please try again.' };
  }

  // Redirect after success
  redirect('/dashboard');
}

export async function registerAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  // Onboarding profile pre-fill optional details
  const nickname = formData.get('nickname') as string;
  const dob = formData.get('dob') as string;
  const countyId = formData.get('countyId') as string;
  const diagnosis = formData.get('diagnosis') as string;

  if (!email || !password || !confirmPassword) {
    return { error: 'All authentication fields are required.' };
  }

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match.' };
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters long.' };
  }

  try {
    const existing = getUserByEmail(email);
    if (existing) {
      return { error: 'An account with this email already exists.' };
    }

    const userId = 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    const passwordHash = hashPassword(password);

    // Create user & family case
    createUser(userId, email, passwordHash);

    // If onboarding child profile info is provided, seed the first child
    if (nickname && dob && countyId) {
      const childId = 'child-' + Date.now();
      createChildProfile({
        id: childId,
        nickname,
        dob,
        county_id: countyId,
        zip_code: '',
        insurance_type: 'private',
        school_status: 'none',
        caregiver_notes: 'Created during registration.',
        conditionIds: diagnosis ? [diagnosis] : [],
        functionalNeedIds: []
      }, userId);
    }

    const token = signToken({ userId, email });
    
    // Set HTTP-Only Cookie
    const cookieStore = await cookies();
    cookieStore.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    });
  } catch (err: any) {
    console.error('Registration action error:', err);
    return { error: 'Registration failed. Please try again.' };
  }

  redirect('/dashboard');
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  redirect('/login');
}
