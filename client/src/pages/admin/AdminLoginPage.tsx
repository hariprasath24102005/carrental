import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Car, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('23ec034@drngpit.ac.in');
  const [password, setPassword] = useState('Hari@2005');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Invalid administrator credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center pt-24 pb-16 px-4 bg-slate-50">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl space-y-8 border border-slate-200 shadow-2xl shadow-slate-200/80">
        
        {/* LOGO HEADER */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center mx-auto shadow-md">
            <Car className="w-8 h-8 text-white stroke-[2.5]" />
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-slate-950 uppercase tracking-tight">
            ADMIN PORTAL
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Log in to access the Anti Gravity management console.
          </p>
        </div>

        {/* DEMO CREDENTIALS HINT BOX */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-800">
            <span className="font-bold text-red-600 uppercase tracking-wider text-[11px]">Admin Credentials:</span>
          </div>
          <p className="text-slate-600">Username / Email: <code className="text-slate-950 font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200">23ec034@drngpit.ac.in</code></p>
          <p className="text-slate-600">Password: <code className="text-slate-950 font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200">Hari@2005</code></p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Admin Email / ID</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs text-slate-900 font-medium focus:outline-none focus:border-red-600 focus:bg-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs text-slate-900 font-medium focus:outline-none focus:border-red-600 focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-sm shadow-md shadow-red-600/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Sign In to Admin Dashboard
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
