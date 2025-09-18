'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { tiktokApi } from '@/lib/api';
import { TrendingUp, User as UserIcon, Target, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OnboardingPage() {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    tiktokUsername: '',
    offerDescription: '',
    targetAudience: ''
  });
  const router = useRouter();

  useEffect(() => {
    // Check if user already completed onboarding
    const onboardingComplete = localStorage.getItem('onboarding_complete');
    if (onboardingComplete === 'true') {
      router.push('/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Store onboarding data locally (no backend auth needed)
      localStorage.setItem('onboarding_complete', 'true');
      localStorage.setItem('user_data', JSON.stringify({
        tiktok_username: formData.tiktokUsername,
        offer_description: formData.offerDescription,
        target_audience: formData.targetAudience
      }));
      
      toast.success('🍑 Profile setup complete! Welcome to your dashboard.');
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
      
    } catch (error) {
      console.error('Onboarding failed:', error);
      toast.error('🍑 Setup failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🍑</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Creator Compass!</h1>
            <p className="text-xl text-gray-600">
              Let's set up your profile to get personalized insights and recommendations.
            </p>
          </div>

          {/* Onboarding Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* TikTok Username */}
              <div>
                <label className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                  <UserIcon className="w-5 h-5 mr-2 text-primary-600" />
                  What's your TikTok username?
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">@</span>
                  <input
                    type="text"
                    name="tiktokUsername"
                    value={formData.tiktokUsername}
                    onChange={handleInputChange}
                    placeholder="your_username"
                    className="w-full pl-8 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                    required
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  We'll analyze your public TikTok profile to provide personalized insights.
                </p>
              </div>

              {/* Offer Description */}
              <div>
                <label className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                  <Target className="w-5 h-5 mr-2 text-primary-600" />
                  What is your offer?
                </label>
                <textarea
                  name="offerDescription"
                  value={formData.offerDescription}
                  onChange={handleInputChange}
                  placeholder="Describe what you offer (e.g., fitness coaching, cooking tutorials, comedy content, etc.)"
                  rows={4}
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg resize-none"
                  required
                />
              </div>

              {/* Target Audience */}
              <div>
                <label className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                  <UserIcon className="w-5 h-5 mr-2 text-primary-600" />
                  Who is your target audience?
                </label>
                <textarea
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleInputChange}
                  placeholder="Describe your ideal audience (e.g., fitness enthusiasts aged 18-35, aspiring entrepreneurs, etc.)"
                  rows={4}
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg resize-none"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Setting up your profile...
                  </>
                ) : (
                  <>
                    Complete Setup
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mt-8 space-x-2">
            <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
            <div className="w-8 h-1 bg-primary-600 rounded-full"></div>
            <div className="w-3 h-3 bg-primary-200 rounded-full"></div>
            <div className="w-8 h-1 bg-primary-200 rounded-full"></div>
            <div className="w-3 h-3 bg-primary-200 rounded-full"></div>
          </div>
          <p className="text-center text-gray-500 mt-2">Step 1 of 3: Profile Setup</p>
        </div>
      </div>
    </div>
  );
}
