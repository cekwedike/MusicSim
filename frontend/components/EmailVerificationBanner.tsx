import React, { useState, useEffect } from 'react';
import { Mail, X } from 'lucide-react';
import authServiceSupabase from '../services/authService.supabase';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';

export const EmailVerificationBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isVerified, setIsVerified] = useState(true);
  const [resending, setResending] = useState(false);
  const [isOAuthUser, setIsOAuthUser] = useState(false);
  const toast = useToast();
  const { user } = useAuth();

  useEffect(() => {
    checkVerificationStatus();
  }, [user]);

  const checkVerificationStatus = async () => {
    // Don't show banner if not authenticated
    if (!user) {
      setIsVisible(false);
      return;
    }

    // Check if user previously dismissed the banner this session
    const dismissed = sessionStorage.getItem('email_verification_dismissed');
    if (dismissed === 'true') {
      setIsVisible(false);
      return;
    }

    // Get verification status
    const status = await authServiceSupabase.getEmailVerificationStatus();
    setIsVerified(status.isVerified);
    setIsOAuthUser(status.isOAuthUser);

    // Only show banner for unverified email/password users
    setIsVisible(!status.isVerified && !status.isOAuthUser);
  };

  const handleResend = async () => {
    setResending(true);
    const result = await authServiceSupabase.resendVerificationEmail();
    setResending(false);

    toast.show(result.message, result.success ? 'success' : 'error');

    // If successful, keep banner visible but show they need to check email
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Store dismissal in sessionStorage (not localStorage) so it shows again on page refresh
    sessionStorage.setItem('email_verification_dismissed', 'true');
  };

  if (!isVisible || isVerified || isOAuthUser) {
    return null;
  }

  return (
    <div className="bg-yellow-500 text-white px-4 py-3 flex items-center justify-between shadow-md z-50">
      <div className="flex items-center gap-3">
        <Mail className="w-5 h-5 flex-shrink-0" />
        <div className="text-sm">
          <span className="font-medium">Please verify your email address</span>
          <span className="hidden sm:inline"> to secure your account and unlock all features.</span>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={handleResend}
          disabled={resending}
          className="text-sm underline hover:no-underline disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {resending ? 'Sending...' : 'Resend email'}
        </button>
        <button
          onClick={handleDismiss}
          className="hover:bg-yellow-600 rounded p-1 transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
