import React, { useState } from 'react';
import { login } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, Loader, AlertCircle } from 'lucide-react';
import Cookies from 'js-cookie';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data } = await login(email, password);
      console.log(data)
      Cookies.set('token', data.token, { expires: 10 });
      setUser(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Login card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-white/70 text-sm">Sign in to your account to continue</p>
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
                  emailFocused || email ? 'text-purple-400' : 'text-white/40'
                }`}>
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  className={`w-full pl-12 pr-4 py-4 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 ${
                    emailFocused ? 'border-purple-400 bg-white/10' : 'border-white/20'
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
                  passwordFocused || password ? 'text-purple-400' : 'text-white/40'
                }`}>
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  className={`w-full pl-12 pr-12 py-4 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 ${
                    passwordFocused ? 'border-purple-400 bg-white/10' : 'border-white/20'
                  }`}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-purple-400 transition-colors duration-200"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 transform ${
                isLoading || !email || !password
                  ? 'bg-white/20 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Signing In...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-white/60 text-sm">
              Don't have an account?{' '}
              <button 
                type="button"
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200"
                    onClick={() => navigate('/register')}
              >
                Sign up
              </button>
            </p>
          </div>
        </div>

        {/* Additional decorative element */}
        <div className="absolute -z-10 top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-3xl transform rotate-1"></div>
      </div>
    </div>
  );
};

export default LoginPage;