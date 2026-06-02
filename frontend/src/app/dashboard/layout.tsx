import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  const session = token ? verifyToken(token) : null;

  if (!session) {
    redirect('/login');
  }

  return <>{children}</>;
}
