import React, { useState } from 'react';
import Modal from '../Common/Modal';
import { useDispatch } from 'react-redux';
import { setUser } from '../../features/UserSlice';
import * as authService from '../../services/auth/auth.service';
import { toast } from 'react-hot-toast';

const AuthModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      if (isLogin) {
        response = await authService.login({ email: formData.email, password: formData.password });
        toast.success(`Welcome back!`);
      } else {
        response = await authService.register(formData);
        toast.success(`Welcome to CodePilot, ${formData.username}!`);
      }
      
      if (response && response.success) {
        dispatch(setUser(response.data.user));
      }
      
      onClose();
    } catch (err) {
      const errorMessage = err.message || 'Authentication failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={isLogin ? 'Login to CodePilot' : 'Create an Account'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">Username</label>
            <input 
              required
              name="username"
              type="text"
              placeholder="johndoe"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full bg-midnight/50 border border-slate-800 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent/50 transition-colors placeholder:text-slate-600 shadow-sm"
            />
          </div>
        )}
        
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">Email Address</label>
          <input 
            required
            name="email"
            type="email"
            placeholder="name@company.com"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full bg-midnight/50 border border-slate-800 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent/50 transition-colors placeholder:text-slate-600 shadow-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">Password</label>
          <input 
            required
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full bg-midnight/50 border border-slate-800 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent/50 transition-colors placeholder:text-slate-600 shadow-sm"
          />
        </div>


        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-accent hover:bg-accent-hover text-white font-semibold py-2.5 rounded-lg transition-all duration-200 shadow-accent-glow disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            isLogin ? 'Sign In' : 'Create Account'
          )}
        </button>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="ml-1.5 text-accent hover:text-accent-hover font-semibold transition-colors"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </form>
    </Modal>
  );
};

export default AuthModal;
