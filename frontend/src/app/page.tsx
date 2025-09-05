 'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { authApi } from '@/lib/api';
import { User } from '@/types';
import { TrendingUp, Users, BarChart3, Target, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = Cookies.get('access_token');
    if (token && token === 'demo_token_12345') {
      // Demo mode - check if onboarding is complete
      const onboardingComplete = localStorage.getItem('demo_onboarding_complete');
      
      if (onboardingComplete === 'true') {
        // User completed onboarding, go to dashboard
        router.push('/dashboard');
      } else {
        // User needs to complete onboarding
        router.push('/onboarding');
      }
      return;
    } else if (token) {
      // Real authentication mode
      try {
        const userData = await authApi.verifyToken();
        setUser(userData);
        
        if (userData.tiktok_username) {
          router.push('/dashboard');
        } else {
          router.push('/onboarding');
        }
      } catch (error) {
        Cookies.remove('access_token');
      }
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    // Set demo token and clear any previous onboarding state
    Cookies.set('access_token', 'demo_token_12345', { expires: 7 });
    localStorage.removeItem('demo_onboarding_complete');
    
    toast.success('🍑 Welcome to TikTok Creator Compass!');
    
    // Redirect to onboarding
    setTimeout(() => {
      router.push('/onboarding');
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-peach flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-peach-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-peach">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-lg">🍑</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">TikTok Creator Compass</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-12">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Navigate Your TikTok Success with
            <span className="text-transparent bg-clip-text bg-gradient-primary"> Peachy Insights</span>
          </h2>
          
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Understand your performance, discover growth opportunities, and get personalized recommendations 
            to take your TikTok content to the next level.
          </p>

          <button
            onClick={handleGoogleLogin}
            className="inline-flex items-center px-8 py-4 bg-white border border-peach-200 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-peach-800 font-semibold text-lg hover:bg-peach-50"
          >
            <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white rounded-2xl p-8 shadow-lg card-hover">
            <div className="w-12 h-12 bg-peach-100 rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl">🍑</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Performance Analytics</h3>
            <p className="text-gray-600 leading-relaxed">
              Track your reach, engagement, and growth with comprehensive analytics that make complex data simple to understand.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg card-hover">
            <div className="w-12 h-12 bg-peach-200 rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl">🌟</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Creator Recommendations</h3>
            <p className="text-gray-600 leading-relaxed">
              Discover successful creators in your niche and learn what makes them stand out with AI-powered insights.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg card-hover">
            <div className="w-12 h-12 bg-peach-300 rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Personalized Insights</h3>
            <p className="text-gray-600 leading-relaxed">
              Get tailored recommendations based on your content, audience, and business goals to maximize your impact.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <div className="bg-white rounded-2xl p-12 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to grow your TikTok presence?</h3>
            <p className="text-gray-600 mb-8">
              Join thousands of creators who are already using data-driven insights to boost their performance.
            </p>
            <button
              onClick={handleGoogleLogin}
              className="btn-hover px-8 py-4 bg-gradient-primary text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-2xl"
            >
              Get Started for Free
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 mt-20 border-t border-gray-200">
        <div className="text-center text-gray-500">
          <p>&copy; 2024 TikTok Creator Compass. Built with 🍑 for creators.</p>
        </div>
      </footer>
    </div>
  );
}
