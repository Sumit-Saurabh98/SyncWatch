import React, { useState } from 'react';
import { motion } from "framer-motion";
import { 
  KeyRound, 
  Mail, 
  CheckCircle2, 
  ArrowRight, 
  Loader2 
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { BeatLoader } from 'react-spinners';

const ForgotPassword = () => {
  const naviagte = useNavigate();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [stage, setStage] = useState<'email' | 'reset'>('email');

  const {
    resetPassword, 
    sendtokenForresetPassword, 
    isResettingPassword, 
    isSendingEmailForPasswordReset
  } = useAuthStore();

  const handleSendToken = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await sendtokenForresetPassword(email);
    if (success) {
      setStage('reset');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await resetPassword(token, newPassword);
    if (success) {
      naviagte('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900 flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-md bg-indigo-800/30 backdrop-blur-md rounded-2xl border border-indigo-700/50 p-8 shadow-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-400">
            {stage === 'email' ? 'Reset Password' : 'Create New Password'}
          </h1>
          <p className="text-gray-300">
            {stage === 'email' 
              ? 'Enter your email to receive a reset token' 
              : 'Enter the token and your new password'}
          </p>
        </div>

        {stage === 'email' ? (
          <form onSubmit={handleSendToken} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input 
                type="email" 
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 py-3 bg-indigo-900/50 border-indigo-700/50 focus:border-pink-500 text-white"
                required
              />
            </div>

            <Button 
              type="submit" 
              disabled={isSendingEmailForPasswordReset}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-0"
            >
              {isSendingEmailForPasswordReset ? (
                <BeatLoader color="white" size={8} className="mr-2 h-4 w-4" />
              ) : (
                <>
                  Send Reset Token 
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="relative mb-4">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input 
                type="text" 
                placeholder="Enter reset token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="pl-10 py-3 bg-indigo-900/50 border-indigo-700/50 focus:border-pink-500 text-white"
                required
              />
            </div>

            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input 
                type="password" 
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pl-10 py-3 bg-indigo-900/50 border-indigo-700/50 focus:border-pink-500 text-white"
                required
              />
            </div>

            <Button 
              type="submit" 
              disabled={isResettingPassword}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-0"
            >
              {isResettingPassword ? (
                <BeatLoader color="white" size={10} />
              ) : (
                <>
                  Reset Password 
                  <CheckCircle2 className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link 
            to="/login" 
            className="text-gray-400 hover:text-pink-400 transition"
          >
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;