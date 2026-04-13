import React from 'react';
import Modal from '../Common/Modal';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../features/UserSlice';
import * as authService from '../../services/auth/auth.service';
import { toast } from 'react-hot-toast';

const ProfileModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(setUser(null));
      onClose();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
      // Even if API fails, we should core clear the local state for security
      dispatch(setUser(null));
      onClose();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Profile">
      <div className="flex flex-col items-center gap-6 py-2">
        {/* Profile Header / Avatar */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-3xl font-bold text-accent shadow-accent-glow">
            {user.username.substring(0, 2).toUpperCase()}
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-100">{user.username}</h2>
            <p className="text-sm text-slate-400">{user.email}</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="w-full space-y-4">
          <div className="bg-midnight/50 rounded-xl p-4 border border-slate-800 shadow-sm">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Username</span>
                <span className="text-slate-200 font-semibold">{user.username}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-slate-800/50 pt-3">
                <span className="text-slate-500 font-medium">Email Address</span>
                <span className="text-slate-200 font-semibold">{user.email}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-slate-800/50 pt-3">
                <span className="text-slate-500 font-medium">Joined On</span>
                <span className="text-slate-200 font-semibold">{formatDate(user.createdAt)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-semibold py-3 rounded-xl border border-red-500/20 transition-all duration-200 group mt-2"
          >
            <svg 
              className="group-hover:translate-x-0.5 transition-transform" 
              width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ProfileModal;
