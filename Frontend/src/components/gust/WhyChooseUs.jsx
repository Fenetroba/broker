import React from 'react'
import { ShieldCheck, Briefcase, TrendingUp, Globe2 } from 'lucide-react';

const points = [
  {
    icon: <ShieldCheck className="w-7 h-7 text-green-600" />, // or emoji: '🔒'
    title: 'Safe, verified sellers',
    desc: 'All sellers are thoroughly vetted for your security.'
  },
  {
    icon: <Briefcase className="w-7 h-7 text-blue-600" />, // or emoji: '💼'
    title: 'Fair commission model',
    desc: 'Transparent, competitive fees that benefit everyone.'
  },
  {
    icon: <TrendingUp className="w-7 h-7 text-yellow-500" />, // or emoji: '📈'
    title: 'Helps you grow your business',
    desc: 'Tools and support to help you scale and succeed.'
  },
  {
    icon: <Globe2 className="w-7 h-7 text-purple-600" />, // or emoji: '🌍'
    title: 'Expand your customer base',
    desc: 'Reach new markets and customers worldwide.'
  },
];

const WhyChooseUs = () => {
  return (
    <section className="w-full py-14 bg-white rounded-3xl shadow-lg mt-10">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-[var(--parent1)]">Why Choose Us?</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
          {points.map((point, idx) => (
            <li key={point.title} className="flex items-start gap-4 bg-[var(--two3m)]/10 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <span className="flex-shrink-0">{point.icon}</span>
              <div>
                <h3 className="text-xl font-semibold mb-1 text-[var(--parent1)]">{point.title}</h3>
                <p className="text-gray-600 text-base">{point.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default WhyChooseUs