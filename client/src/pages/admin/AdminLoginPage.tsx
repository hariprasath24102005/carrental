import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Car, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('HARI');
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
    <div className="min-h-[85vh] flex items-center justify-center pt-24 pb-16 px-4">
      <div className="w-full max-w-md glass-panel p-8 sm:p-10 rounded-3xl space-y-8 border border-ag-cyan/30 cyan-glow">
        
        {/* LOGO HEADER */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-ag-cyan to-blue-600 flex items-center justify-center mx-auto cyan-glow">
            <Car className="w-8 h-8 text-slate-950 stroke-[2.5]" />
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-white">
            ADMIN PORTAL
          </h1>
          <p className="text-xs text-slate-400">
            Log in to access the Anti Gravity management console.
          </p>
        </div>

        {/* DEMO CREDENTIALS HINT BOX */}
        <div className="p-3.5 rounded-2xl bg-ag-surface/80 border border-ag-border text-xs space-y-1">
          <div className="flex items-center justify-between text-slate-300">
            <span className="font-bold text-ag-gold">Admin Credentials:</span>
          </div>
          <p className="text-slate-400">Username / Email: <code className="text-white">HARI</code></p>
          <p className="text-slate-400">Password: <code className="text-white">Hari@2005</code></p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-ag-surface border border-ag-border rounded-xl pl-11 pr-4 py-3 text-xs text-white focus:outline-none focus:border-ag-cyan"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-ag-surface border border-ag-border rounded-xl pl-11 pr-4 py-3 text-xs text-white focus:outline-none focus:border-ag-cyan"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 rounded-2xl bg-gradient-to-r from-ag-cyan to-blue-500 text-slate-950 font-black text-sm cyan-glow hover:scale-[1.01] transition-transform flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
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
