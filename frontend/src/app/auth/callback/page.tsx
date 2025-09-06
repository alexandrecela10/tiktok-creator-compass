'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AuthCallback() {
  const router = useRouter();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');

      if (error) {
        toast.error('🍑 Authentication cancelled');
        router.push('/');
        return;
      }

      if (!code) {
        toast.error('🍑 No authorization code received');
        router.push('/');
        return;
      }

      // Exchange code for token with backend
      const { access_token, user } = await authApi.googleCallback(code);
      
      // Store token
      Cookies.set('access_token', access_token, { expires: 7 });
      
      // Redirect based on onboarding status
      if (!user.tiktok_username) {
        toast.success('🍑 Welcome! Let\'s set up your profile.');
        router.push('/onboarding');
      } else {
        toast.success(`🍑 Welcome back, ${user.name}!`);
        router.push('/dashboard');
      }
      
    } catch (error) {
      console.error('Auth callback error:', error);
      toast.error('🍑 Authentication failed. Please try again.');
      router.push('/');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-peach flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-peach-600 mx-auto mb-4"></div>
        <p className="text-peach-700">🍑 Completing authentication...</p>
        {!processing && (
          <p className="text-peach-600 mt-2 text-sm">Redirecting...</p>
        )}
      </div>
    </div>
  );
}
