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
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !name) {
      toast.error('🍑 Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);
      
      // Login with email and name
      const { access_token, user } = await authApi.login(email, name);
      
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
      console.error('Login failed:', error);
      toast.error('🍑 Login failed. Please try again.');
      setLoading(false);
    }
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
            Navigate Your TikTok Success with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Data-Driven Insights</span>
          </h2>
          
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Understand your performance, discover growth opportunities, and get personalized recommendations 
            to take your TikTok content to the next level.
          </p>

          {!showLoginForm ? (
            <button
              onClick={() => setShowLoginForm(true)}
              className="inline-flex items-center px-8 py-4 bg-white border border-peach-200 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-peach-800 font-semibold text-lg hover:bg-peach-50"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          ) : (
            <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Welcome to TikTok Creator Compass</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-500 focus:border-transparent"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                >
                  {loading ? 'Creating Account...' : 'Continue'}
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowLoginForm(false)}
                  className="w-full px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Back
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white rounded-2xl p-8 shadow-lg card-hover">
            <div className="w-12 h-12 bg-peach-100 rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl">🍑</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Performance Analytics in Your Niche</h3>
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
              <span className="text-2xl">💝</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Engaged Leads</h3>
            <p className="text-gray-600 leading-relaxed">
              Identify your most engaged followers and get actionable strategies to turn them into collaboration partners.
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
              onClick={() => setShowLoginForm(true)}
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
