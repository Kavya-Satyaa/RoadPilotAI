import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(50),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

type RegisterFields = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFields>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFields) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.post('/api/auth/register', data);
      navigate('/login', { state: { registered: true } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden font-sans">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-500/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent-violet/10 blur-[120px]" />

      <div className="w-full max-w-lg p-8 glass-panel rounded-2xl shadow-glass border border-white/5 animate-slide-up z-10 mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-full bg-brand-500/10 text-brand-500 mb-3 shadow-glow">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white m-0">Create Account</h1>
          <p className="text-slate-400 mt-2 text-sm">Join RoadPilot AI and co-pilot your next trip</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-sm flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 flex-shrink-0">
              <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">First Name</label>
              <input
                type="text"
                {...register('firstName')}
                placeholder="John"
                className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-800 rounded-xl focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none text-slate-100 placeholder-slate-600 transition-colors"
              />
            </div>
            {/* Last Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Last Name</label>
              <input
                type="text"
                {...register('lastName')}
                placeholder="Doe"
                className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-800 rounded-xl focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none text-slate-100 placeholder-slate-600 transition-colors"
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Username</label>
            <input
              type="text"
              {...register('username')}
              placeholder="johndoe"
              className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-800 rounded-xl focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none text-slate-100 placeholder-slate-600 transition-colors"
            />
            {errors.username && (
              <span className="text-xs text-rose-400 mt-1 block">{errors.username.message}</span>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Email Address</label>
            <input
              type="email"
              {...register('email')}
              placeholder="john@example.com"
              className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-800 rounded-xl focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none text-slate-100 placeholder-slate-600 transition-colors"
            />
            {errors.email && (
              <span className="text-xs text-rose-400 mt-1 block">{errors.email.message}</span>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Password</label>
            <input
              type="password"
              {...register('password')}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-800 rounded-xl focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none text-slate-100 placeholder-slate-600 transition-colors"
            />
            {errors.password && (
              <span className="text-xs text-rose-400 mt-1 block">{errors.password.message}</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 mt-4 bg-brand-500 hover:bg-brand-600 disabled:bg-brand-800 disabled:cursor-not-allowed text-slate-950 font-bold rounded-xl transition-all shadow-glow hover:shadow-brand-500/20 active:scale-[0.98] duration-200"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-400 hover:underline hover:text-brand-300 font-semibold">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
