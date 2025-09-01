'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi } from '@/lib/api';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      toast.error('Authentication failed');
      router.push('/');
      return;
    }

    if (!code) {
      toast.error('No authorization code received');
      router.push('/');
      return;
    }

    try {
      // Exchange code for token
      const { access_token, user } = await authApi.googleCallback(code);
      
      // Store token
      Cookies.set('access_token', access_token, { expires: 7 });
      
      toast.success(`Welcome, ${user.name}!`);
      
      // Redirect based on onboarding status
      if (user.tiktok_username) {
        router.push('/dashboard');
      } else {
        router.push('/onboarding');
      }
    } catch (error) {
      console.error('Auth callback error:', error);
      toast.error('Authentication failed');
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-warm flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
}
