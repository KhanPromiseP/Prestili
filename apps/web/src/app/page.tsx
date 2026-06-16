'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function HomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [presentations, setPresentations] = useState([]);

  useEffect(() => {
    if (session) {
      fetchPresentations();
    }
  }, [session]);

  const fetchPresentations = async () => {
    try {
      const response = await fetch('/api/presentations');
      if (response.ok) {
        const data = await response.json();
        setPresentations(data);
      }
    } catch (error) {
      console.error('Error fetching presentations:', error);
    }
  };

  const handleGetStarted = () => {
    router.push('/create');
  };

  const handleCreateNew = () => {
    router.push('/create');
  };

  const handleOpenPresentation = (id: string) => {
    router.push(`/editor?id=${id}`);
  };

  // Show loading state while checking auth
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  // Show dashboard if logged in
  if (session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Navigation */}
        <nav className="flex items-center justify-between px-8 py-6 bg-white/5 backdrop-blur-lg border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="text-white text-2xl font-bold">Prestili</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white">{session.user?.email}</span>
            <button
              onClick={() => signOut()}
              className="text-white hover:text-purple-300 transition px-4 py-2"
            >
              Sign Out
            </button>
          </div>
        </nav>

        {/* Dashboard Content */}
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-white">My Presentations</h1>
            <button
              onClick={handleCreateNew}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition shadow-lg"
            >
              + Create New
            </button>
          </div>

          {presentations.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📊</div>
              <h2 className="text-2xl font-bold text-white mb-2">No presentations yet</h2>
              <p className="text-gray-300 mb-6">Create your first AI-powered presentation</p>
              <button
                onClick={handleCreateNew}
                className="bg-white text-purple-900 px-8 py-3 rounded-full font-semibold hover:bg-purple-100 transition"
              >
                Create Your First Presentation
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {presentations.map((presentation: any) => (
                <div
                  key={presentation.id}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-white/40 transition cursor-pointer"
                  onClick={() => handleOpenPresentation(presentation.id)}
                >
                  <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-4xl">📊</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{presentation.title}</h3>
                  <p className="text-gray-300 text-sm mb-2">
                    {new Date(presentation.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-400 text-sm">{presentation.slideCount || 0} slides</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show landing page if not logged in
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 flex items-center justify-between px-8 py-6">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="text-white text-2xl font-bold">Prestili</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/signin">
              <button className="text-white hover:text-purple-300 transition px-4 py-2">
                Sign In
              </button>
            </Link>
            <Link href="/auth/signup">
              <button className="bg-white text-purple-900 px-6 py-2 rounded-full font-semibold hover:bg-purple-100 transition">
                Get Started Free
              </button>
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-8 py-20">
          <div className="text-center">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Create Stunning
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Presentations
              </span>
              with AI
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Transform your ideas into beautiful, professional presentations in minutes. 
              Powered by advanced AI, designed for impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:opacity-90 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Start Creating Free
              </button>
              <button className="border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition">
                Watch Demo
              </button>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">AI-Powered</h3>
                <p className="text-gray-300 text-sm">Generate content, design, and structure automatically with advanced AI</p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">Professional Templates</h3>
                <p className="text-gray-300 text-sm">Choose from hundreds of professionally designed templates</p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">Real-time Collaboration</h3>
                <p className="text-gray-300 text-sm">Work together with your team in real-time, anywhere</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 bg-white/5 backdrop-blur-lg border-y border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to create something amazing?</h2>
            <p className="text-gray-300 mb-8">Join thousands of creators who trust Prestili for their presentations</p>
            <button
              onClick={handleGetStarted}
              className="bg-white text-purple-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-purple-100 transition shadow-lg"
            >
              Start Your Free Presentation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}