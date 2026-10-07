import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import FormInput from '../components/common/FormInput';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errs.email = 'Please provide a valid email';
    }
    if (!password) {
      errs.password = 'Password is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  const handleDemoLogin = async () => {
    setEmail('demo@freelancer.com');
    setPassword('password123');
    setIsLoading(true);
    const result = await login('demo@freelancer.com', 'password123');
    setIsLoading(false);
    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-brand-50/30 to-indigo-50/40 p-4 sm:p-6">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-200 mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Freelancer Project & Income Tracker</h1>
          <p className="mt-2 text-sm text-slate-500">Sign in to manage your clients, projects & revenue</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 backdrop-blur-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Email Address"
              name="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
              }}
              placeholder="you@domain.com"
              icon={Mail}
              required
              error={errors.email}
            />

            <FormInput
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
              }}
              placeholder="••••••••"
              icon={Lock}
              required
              error={errors.password}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700 shadow-md shadow-brand-200 transition-all duration-150 disabled:opacity-60"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-brand-200 bg-brand-50/60 text-brand-700 text-xs font-semibold hover:bg-brand-100 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-brand-600" />
              <span>Fill & Login with Demo Account</span>
            </button>
          </div>

          {/* Register Link */}
          <p className="mt-6 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
