'use client';

import React, { useState, useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Mail, Phone, ArrowLeft, RefreshCw, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface OtpVerificationProps {
  email: string;
  phone?: string;
  onSuccess: (result: { email?: string; phone?: string; method: 'email' | 'phone' }) => void;
  onBackToRegister: () => void;
  type?: 'signup' | 'recovery' | 'magiclink';
}

export default function OtpVerification({
  email,
  phone,
  onSuccess,
  onBackToRegister,
  type = 'signup',
}: OtpVerificationProps) {
  const [activeChannel, setActiveChannel] = useState<'email' | 'phone'>(
    phone && !email ? 'phone' : 'email'
  );
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 60-second countdown timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  // Auto-focus first digit on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, [activeChannel]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);
    setError(null);

    // Auto-advance
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits entered
    const fullCode = newDigits.join('');
    if (fullCode.length === 6 && !newDigits.includes('')) {
      handleVerify(fullCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasteData)) {
      const newDigits = pasteData.split('');
      setDigits(newDigits);
      inputRefs.current[5]?.focus();
      handleVerify(pasteData);
    }
  };

  const handleVerify = async (codeOverride?: string) => {
    const token = codeOverride || digits.join('');
    if (token.length !== 6) {
      setError('Please enter all 6 digits of the verification code.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Call verify endpoint
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          phone: phone?.trim(),
          token,
          method: activeChannel,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid or expired OTP code. Please try again.');
      }

      setVerifiedSuccess(true);
      setTimeout(() => {
        onSuccess({
          email,
          phone,
          method: activeChannel,
        });
      }, 1200);
    } catch (err: any) {
      console.error('OTP Verification Error:', err);
      setError(err.message || 'Invalid or expired verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || resending) return;

    try {
      setResending(true);
      setError(null);
      setResendMessage(null);

      if (isSupabaseConfigured && supabase) {
        if (activeChannel === 'phone' && phone) {
          await supabase.auth.resend({
            type: 'sms',
            phone,
          });
        } else {
          await supabase.auth.resend({
            type: 'signup',
            email: email.toLowerCase().trim(),
          });
        }
      }

      setTimer(60);
      setCanResend(false);
      setResendMessage(
        `A fresh 6-digit code has been sent to your ${
          activeChannel === 'phone' ? 'mobile number' : 'email'
        }.`
      );
      setTimeout(() => setResendMessage(null), 5000);
    } catch (err: any) {
      console.error('Resend OTP Error:', err);
      setError(err.message || 'Failed to resend code. Please try again shortly.');
    } finally {
      setResending(false);
    }
  };

  // Verified celebration screen
  if (verifiedSuccess) {
    return (
      <div className="w-full max-w-md mx-auto p-8 rounded-3xl bg-white border border-cocoa-500/10 shadow-soft text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-charcoal-700">
          Account Verified!
        </h2>
        <p className="text-xs text-cocoa-500 max-w-xs mx-auto">
          Your {activeChannel === 'phone' ? 'mobile number' : 'email'} has been confirmed.
          Redirecting you to the login page...
        </p>
        <div className="pt-2">
          <div className="w-8 h-8 border-3 border-strawberry-400 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 rounded-3xl bg-white border border-cocoa-500/10 shadow-soft space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-strawberry-100 border border-strawberry-200 flex items-center justify-center mx-auto text-strawberry-600">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-700">
          Confirm Your Account
        </h2>
        <p className="text-xs text-cocoa-500 max-w-xs mx-auto">
          Enter the 6-digit verification code to activate your parent account.
        </p>

        {/* Verification Channel Tabs (Mail or Mobile Number) */}
        {phone && (
          <div className="flex rounded-full bg-vanilla-100 p-1 border border-cocoa-500/10 mt-3">
            <button
              type="button"
              onClick={() => {
                setActiveChannel('email');
                setDigits(['', '', '', '', '', '']);
                setError(null);
              }}
              className={`flex-1 py-1.5 px-3 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeChannel === 'email'
                  ? 'bg-white text-strawberry-600 shadow-xs'
                  : 'text-cocoa-500 hover:text-charcoal-700'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Verify Email</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveChannel('phone');
                setDigits(['', '', '', '', '', '']);
                setError(null);
              }}
              className={`flex-1 py-1.5 px-3 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeChannel === 'phone'
                  ? 'bg-white text-strawberry-600 shadow-xs'
                  : 'text-cocoa-500 hover:text-charcoal-700'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Verify Mobile</span>
            </button>
          </div>
        )}

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-vanilla-200/80 text-charcoal-700 font-semibold text-xs border border-cocoa-500/10 mt-2">
          {activeChannel === 'phone' ? (
            <>
              <Phone className="w-3.5 h-3.5 text-strawberry-500" />
              <span>{phone}</span>
            </>
          ) : (
            <>
              <Mail className="w-3.5 h-3.5 text-strawberry-500" />
              <span>{email}</span>
            </>
          )}
        </div>
      </div>

      {/* 6 Digit Input Cells */}
      <div className="space-y-4">
        <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-11 h-13 sm:w-12 sm:h-14 text-center font-serif text-xl font-bold text-charcoal-700 bg-vanilla-50 border-2 border-cocoa-500/15 rounded-2xl focus:border-strawberry-400 focus:bg-white focus:outline-none transition-all shadow-xs"
            />
          ))}
        </div>

        {error && (
          <p className="text-xs text-rose-600 text-center font-medium">{error}</p>
        )}

        {resendMessage && (
          <p className="text-xs text-emerald-600 text-center font-medium flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{resendMessage}</span>
          </p>
        )}

        {/* Verify CTA Button */}
        <button
          type="button"
          onClick={() => handleVerify()}
          disabled={loading || digits.includes('')}
          className="w-full py-3.5 px-6 rounded-2xl bg-strawberry-400 hover:bg-strawberry-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-pill transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Verifying Code...</span>
            </span>
          ) : (
            <span>Confirm & Continue to Login</span>
          )}
        </button>
      </div>

      {/* Resend & Change Info Footer */}
      <div className="pt-4 border-t border-cocoa-500/10 flex items-center justify-between text-xs text-cocoa-500">
        <button
          type="button"
          onClick={onBackToRegister}
          className="hover:text-charcoal-700 flex items-center gap-1 font-medium transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Edit Details</span>
        </button>

        <div>
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="font-bold text-strawberry-600 hover:text-strawberry-700 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
              <span>Resend Code</span>
            </button>
          ) : (
            <span className="text-cocoa-400 font-medium">
              Resend in <span className="font-mono font-bold text-charcoal-700">{timer}s</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
