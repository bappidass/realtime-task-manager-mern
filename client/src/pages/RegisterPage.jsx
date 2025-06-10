import React, { useState } from 'react';
import { register } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Loader, AlertCircle, UserPlus } from 'lucide-react';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await register(email, password);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-800 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Register card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Join Us Today</h1>
            <p className="text-white/70 text-sm">Create your account to get started</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6 flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email field */}
            <div className="relative">
              <label className="block text-white/80 text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
                  emailFocused || email ? 'text-emerald-400' : 'text-white/40'
                }`}>
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  className={`w-full pl-12 pr-4 py-4 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200 ${
                    emailFocused ? 'border-emerald-400 bg-white/10' : 'border-white/20'
                  }`}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password field */}
            <div className="relative">
              <label className="block text-white/80 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
                  passwordFocused || password ? 'text-emerald-400' : 'text-white/40'
                }`}>
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  className={`w-full pl-12 pr-12 py-4 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200 ${
                    passwordFocused ? 'border-emerald-400 bg-white/10' : 'border-white/20'
                  }`}
                  placeholder="Create a password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-emerald-400 transition-colors duration-200"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Password strength indicator */}
            {password && (
              <div className="space-y-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
                        password.length >= level * 2
                          ? password.length >= 8
                            ? 'bg-emerald-400'
                            : password.length >= 6
                            ? 'bg-yellow-400'
                            : 'bg-red-400'
                          : 'bg-white/20'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-white/60">
                  {password.length < 6
                    ? 'Password too short'
                    : password.length < 8
                    ? 'Password strength: Medium'
                    : 'Password strength: Strong'}
                </p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 transform ${
                isLoading || !email || !password
                  ? 'bg-white/20 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-white/60 text-sm">
              Already have an account?{' '}
              <button 
                type="button"
                className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors duration-200"
                onClick={() => navigate('/login')}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>

        {/* Additional decorative element */}
        <div className="absolute -z-10 top-0 left-0 w-full h-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-3xl blur-3xl transform -rotate-1"></div>
      </div>
    </div>
  );
};

export default RegisterPage;