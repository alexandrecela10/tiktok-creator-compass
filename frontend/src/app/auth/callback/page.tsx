'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // For demo mode, simulate successful authentication
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');

      if (error) {
        router.push('/');
        return;
      }

      if (code || window.location.hostname.includes('netlify.app') || window.location.hostname.includes('vercel.app')) {
        // Set demo token for deployed environments
        Cookies.set('access_token', 'demo_token_12345', { expires: 7 });
        router.push('/dashboard');
      } else {
        router.push('/');
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-warm flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
}
