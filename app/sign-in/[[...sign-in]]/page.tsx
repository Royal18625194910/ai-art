'use client';

import { SignIn } from '@clerk/nextjs';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-cyan-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(168,85,247,0.1)_0%,transparent_50%),radial-gradient(circle_at_70%_80%,rgba(6,182,212,0.1)_0%,transparent_50%)]" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="text-center mb-8">
          <a
            href="/"
            className="inline-flex items-center gap-2 group mb-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI Art
            </span>
          </a>
          
          <h1 className="text-2xl font-bold text-foreground mb-2">
            欢迎回来
          </h1>
          <p className="text-muted-foreground">
            登录你的账户继续创作
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-purple-500/10 border border-purple-100 p-6">
          <SignIn
            appearance={{
              elements: {
                formButtonPrimary: 
                  'bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30',
                formFieldInput: 
                  'border-purple-200 focus:border-purple-400 focus:ring-purple-400/20',
                card: 'shadow-none bg-transparent',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
              }
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
