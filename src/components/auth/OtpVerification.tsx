'use client';

import React, { useState, useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Mail, ArrowLeft, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';

interface OtpVerificationProps {
  email: string;
  onSuccess: (session: any) => void;
  onBackToEmail: () => void;
  type?: 'signup' | 'recovery' | 'magiclink';
}

export default function OtpVerification({
  email,
  onSuccess,
  onBackToEmail,
  type = 'signup',
}: OtpVerificationProps) {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

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
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value.slice(-1); // Only take last typed character
    setDigits(newDigits);
    setError(null);

    // Auto-advance to next cell
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are entered
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

    if (!isSupabaseConfigured || !supabase) {
      setError('Supabase Auth is not yet connected to verify live OTP.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: email.toLowerCase().trim(),
        token,
        type: type === 'signup' ? 'signup' : 'recovery',
      });

      if (verifyError) throw verifyError;

      onSuccess(data.session);
    } catch (err: any) {
      console.error('OTP Verification Error:', err);
      setError(err.message || 'Invalid or expired verification code. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || resending) return;

    if (!isSupabaseConfigured || !supabase) {
      setError('Supabase Auth is not yet connected to resend live OTP.');
      return;
    }

    try {
      setResending(true);
      setError(null);
      setResendMessage(null);

      const { error: resendError } = await supabase.auth.resend({
        type: type === 'signup' ? 'signup' : 'signup',
        email: email.toLowerCase().trim(),
      });

      if (resendError) throw resendError;

      setTimer(60);
      setCanResend(false);
      setResendMessage('A fresh 6-digit code has been sent to your email.');
      setTimeout(() => setResendMessage(null), 5000);
    } catch (err: any) {
      console.error('Resend OTP Error:', err);
      setError(err.message || 'Failed to resend code. Please try again in a moment.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 rounded-3xl bg-white border border-cocoa-500/10 shadow-soft space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-strawberry-100 border border-strawberry-200 flex items-center justify-center mx-auto text-strawberry-600">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-700">
          Verify Your Email
        </h2>
        <p className="text-xs text-cocoa-500 max-w-xs mx-auto">
          We&apos;ve sent a 6-digit security code to:
        </p>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-vanilla-200/80 text-charcoal-700 font-semibold text-xs border border-cocoa-500/10">
          <Mail className="w-3.5 h-3.5 text-strawberry-500" />
          <span>{email}</span>
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
            <span>Verify & Complete Registration</span>
          )}
        </button>
      </div>

      {/* Resend & Change Email Footer */}
      <div className="pt-4 border-t border-cocoa-500/10 flex items-center justify-between text-xs text-cocoa-500">
        <button
          type="button"
          onClick={onBackToEmail}
          className="hover:text-charcoal-700 flex items-center gap-1 font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Change Email</span>
        </button>

        <div>
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="font-bold text-strawberry-600 hover:text-strawberry-700 transition-colors flex items-center gap-1"
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
