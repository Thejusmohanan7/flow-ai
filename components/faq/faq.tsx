"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "What is FlowAI?",
    answer:
      "FlowAI is an AI-powered productivity platform that combines task management, note-taking, analytics, and intelligent assistance into a single workspace.",
  },
  {
    question: "Who is FlowAI designed for?",
    answer:
      "FlowAI is built for students, freelancers, developers, startup founders, and anyone looking to stay organized and productive.",
  },
  {
    question: "How does the AI Assistant help me?",
    answer:
      "The AI Assistant can generate summaries, create meeting notes, suggest productivity improvements, help brainstorm ideas, and streamline daily workflows.",
  },
  {
    question: "Can I manage tasks and notes together?",
    answer:
      "Yes. FlowAI provides a centralized workspace where tasks, notes, analytics, and AI assistance work together seamlessly.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. We prioritize security through modern authentication, protected user sessions, and secure data management practices.",
  },
  {
    question: "Does FlowAI support mobile devices?",
    answer:
      "Absolutely. FlowAI is fully responsive and works smoothly across desktops, tablets, and smartphones.",
  },
  {
    question: "Can I use FlowAI for team collaboration?",
    answer:
      "FlowAI is designed to scale with your workflow and can support both individual productivity and collaborative work environments.",
  },
  {
    question: "Do I need technical knowledge to use FlowAI?",
    answer:
      "Not at all. FlowAI is designed with a simple and intuitive interface that anyone can use without technical expertise.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const Faq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-flex rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 shadow-sm">
            Frequently Asked Questions
          </span>

          <h2 className="mt-6 text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
            Everything You Need to Know
          </h2>

          <p className="mt-6 text-lg text-slate-600 dark:text-slate-400">
            Find answers to common questions about FlowAI, its features,
            security, and how it helps you stay productive.
          </p>
        </motion.div>

        {/* FAQ List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 space-y-4"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -2 }}
              className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="flex w-full items-center justify-between px-6 py-5 text-left"
              >
                <span className="text-lg font-semibold text-slate-900 dark:text-white">
                  {faq.question}
                </span>

                <motion.span
                  animate={{
                    rotate: openIndex === index ? 45 : 0,
                  }}
                  transition={{ duration: 0.25 }}
                  className="text-3xl font-light text-slate-500 dark:text-slate-400"
                >
                  +
                </motion.span>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6">
                      <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {/* Support Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-20 relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center shadow-sm"
        >
          {/* Glow */}
          <motion.div
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
            className="absolute inset-0 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 blur-3xl"
          />

          <div className="relative z-10">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
              Still have questions?
            </h3>

            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Our team is always ready to help you get the most out of FlowAI.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 rounded-full bg-slate-900 dark:bg-white px-8 py-3 font-medium text-white dark:text-slate-900 transition hover:bg-slate-800 dark:hover:bg-slate-200"
            >
              Contact Support
            </motion.button>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Faq;