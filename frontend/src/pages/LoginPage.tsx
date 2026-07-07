import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';

const loginSchema = z.object({
  usernameOrEmail: z.string().min(3, 'Username or email must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFields = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFields) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/auth/login', data);
      const { user, accessToken, refreshToken, userId, username, email } = response.data;
      
      // Store auth in state
      setAuth(
        { userId: userId || user?.userId, username: username || user?.username, email: email || user?.email },
        accessToken,
        refreshToken
      );
      
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden font-sans">
      {/* Decorative premium glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-500/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent-indigo/10 blur-[120px]" />

      <div className="w-full max-w-md p-8 glass-panel rounded-2xl shadow-glass border border-white/5 animate-slide-up z-10 mx-4">
        {/* App Title Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-full bg-brand-500/10 text-brand-500 mb-3 shadow-glow">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white m-0">RoadPilot AI</h1>
          <p className="text-slate-400 mt-2 text-sm">Embark on your intelligent road trip journey</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-sm flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 flex-shrink-0">
              <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Username / Email Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Username or Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.29-.226.395-.612.222-.924a7.993 7.993 0 0 0-4.569-3.744 1.25 1.25 0 0 0-1.784.821 5.96 5.96 0 0 1-5.96 0 1.25 1.25 0 0 0-1.784-.821 7.993 7.993 0 0 0-4.569 3.744Z" />
                </svg>
              </span>
              <input
                type="text"
                {...register('usernameOrEmail')}
                placeholder="Enter username or email"
                className="w-full pl-10 pr-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none text-slate-100 placeholder-slate-500 transition-colors"
              />
            </div>
            {errors.usernameOrEmail && (
              <span className="text-xs text-rose-400 mt-1 block">{errors.usernameOrEmail.message}</span>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
                </svg>
              </span>
              <input
                type="password"
                {...register('password')}
                placeholder="Enter password"
                className="w-full pl-10 pr-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none text-slate-100 placeholder-slate-500 transition-colors"
              />
            </div>
            {errors.password && (
              <span className="text-xs text-rose-400 mt-1 block">{errors.password.message}</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 mt-2 bg-brand-500 hover:bg-brand-600 disabled:bg-brand-800 disabled:cursor-not-allowed text-slate-950 font-bold rounded-xl transition-all shadow-glow hover:shadow-brand-500/20 active:scale-[0.98] duration-200"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-400 hover:underline hover:text-brand-300 font-semibold">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};
