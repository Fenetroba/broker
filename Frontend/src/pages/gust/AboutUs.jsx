import React from 'react';
import { Users, ShieldCheck, Globe, Heart } from 'lucide-react';
import HeroImg from '../../assets/grow.png';
import Header from '@/components/gust/Header';


const About = () => {
  return (
     <section><Header/>
    <div className="min-h-screen bg-gradient-to-br from-[var(--two5m)] to-[var(--parent4)] flex flex-col items-center justify-center py-10 px-4">
      {/* Hero Section */}
      
      <div className="max-w-3xl w-full bg-white/80 rounded-2xl shadow-lg p-8 flex flex-col md:flex-row items-center gap-8 mb-10">
        <img src={HeroImg} alt="About Hero" className="w-40 h-40 object-cover rounded-full shadow-md border-4 border-[var(--parent3)]" />
        <div>
          <h1 className="text-4xl font-bold text-[var(--parent1)] mb-2">Fasion Link</h1>
          <p className="text-lg text-[var(--parent3)] mb-4">Empowering families for a safer, smarter digital world.</p>
          <p className="text-gray-700">GashKids is dedicated to helping parents and children navigate the online world with confidence. Our platform offers powerful tools for digital safety, healthy screen habits, and family connection—all in a fun, easy-to-use experience.</p>
        </div>
      </div>
      {/* Features Section */}
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center hover:scale-105 transition-transform">
          <ShieldCheck className="w-10 h-10 text-[var(--parent3)] mb-2" />
          <h2 className="text-xl font-semibold mb-1">Safety First</h2>
          <p className="text-gray-600">Advanced content filtering and activity monitoring keep your children safe online.</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center hover:scale-105 transition-transform">
          <Users className="w-10 h-10 text-[var(--parent3)] mb-2" />
          <h2 className="text-xl font-semibold mb-1">Family Connection</h2>
          <p className="text-gray-600">Tools for parents and kids to communicate, learn, and grow together in the digital age.</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center hover:scale-105 transition-transform">
          <Globe className="w-10 h-10 text-[var(--parent3)] mb-2" />
          <h2 className="text-xl font-semibold mb-1">Global Community</h2>
          <p className="text-gray-600">Join a supportive network of families and experts sharing tips and resources worldwide.</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center hover:scale-105 transition-transform">
          <Heart className="w-10 h-10 text-[var(--parent3)] mb-2" />
          <h2 className="text-xl font-semibold mb-1">Wellbeing & Balance</h2>
          <p className="text-gray-600">Promote healthy screen time and digital habits for a happier, more balanced family life.</p>
        </div>
      </div>
      {/* Call to Action */}
      <div className="mt-12 text-center">
        <h3 className="text-2xl font-bold text-[var(--parent1)] mb-2">Ready to join the GashKids family?</h3>
        <p className="text-lg text-gray-700 mb-4">Sign up today and start your journey to a safer, smarter digital future!</p>
        <a href="/auth/register" className="inline-block bg-[var(--two2m)] text-white font-bold py-3 px-8 rounded-2xl shadow hover:bg-[var(--two3m)] transition">Get Started</a>
      </div>
    </div>
    
    </section>
  );
};

export default About;