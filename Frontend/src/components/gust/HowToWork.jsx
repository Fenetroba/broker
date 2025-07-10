import React from 'react'
import { motion } from 'framer-motion';
import Logo from '../../assets/Logo.png';
import { CheckCircle, ArrowRightCircle, Sparkles } from 'lucide-react';

const steps = [
  {
    title: 'Sign Up',
    desc: 'Create your free account in seconds and join our platform.',
    icon: <CheckCircle className="w-10 h-10 text-green-500" />,
    img: Logo,
  },
  {
    title: 'Browse & Connect',
    desc: 'Explore opportunities and connect with trusted partners.',
    icon: <ArrowRightCircle className="w-10 h-10 text-blue-500" />,
    img: Logo,
  },
  {
    title: 'Start Working',
    desc: 'Begin your journey and achieve your goals with our support.',
    icon: <Sparkles className="w-10 h-10 text-yellow-500" />,
    img: Logo,
  },
];

const container = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80 } },
};

const HowToWork = () => {
  return (
    <section className="w-full py-16 bg-gradient-to-br from-[var(--parent1)]/10 to-[var(--parent4)]/10 rounded-3xl mt-10">
      <div className="max-w-5xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl font-extrabold text-center mb-4 text-[var(--parent1)] drop-shadow-lg"
        >
          How It Works
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg text-center text-gray-600 mb-12"
        >
          Follow these simple steps to get started and make the most of our platform.
        </motion.p>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-10"
        >
          {steps.map((step, idx) => (
            <motion.div
              key={step.title}
              variants={item}
              className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center hover:scale-105 transition-transform duration-300 group relative overflow-hidden"
            >
              <div className="absolute -top-5 -right-5 opacity-10 group-hover:opacity-20 transition-all duration-300">
                <img src={step.img} alt={step.title} className="w-32 h-32 object-contain rotate-1" />
              </div>
              <div className="z-10 mb-4">{step.icon}</div>
              <h3 className="text-2xl font-bold mb-2 text-[var(--parent1)] drop-shadow-sm z-10">{step.title}</h3>
              <p className="text-gray-600 text-center z-10">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default HowToWork