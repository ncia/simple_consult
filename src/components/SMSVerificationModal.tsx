import React, { useState, useEffect } from 'react';
import { X, Smartphone, CheckCircle, Flame, ArrowRight, MessageSquareCode } from 'lucide-react';

interface SMSVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber: string;
  onVerifySuccess: () => void;
}

export function SMSVerificationModal({ isOpen, onClose, phoneNumber, onVerifySuccess }: SMSVerificationModalProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(180); // 3 minutes
  const [otpCode] = useState('7777'); // standard simulation code

  useEffect(() => {
    if (!isOpen) return;
    setTimer(180);
    setError('');
    setCode('');
    
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (timer === 0) {
      setError('인증 시간 초과! 다시 인증을 요청해 주세요.');
      return;
    }
    if (code === otpCode) {
      onVerifySuccess();
      onClose();
    } else {
      setError('올바르지 않은 인증번호입니다. "7777"을 입력해 가상 검증을 완료해 주세요!');
    }
  };

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-neutral-border flex flex-col p-6 space-y-4">
        {/* Close and Icon */}
        <div className="flex justify-between items-start">
          <div className="bg-brand-blue-pale text-brand-blue p-2.5 rounded-xl">
            <MessageSquareCode size={24} />
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-neutral-bg text-neutral-gray transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messaging */}
        <div className="space-y-1.5">
          <h3 className="font-sans font-bold text-lg text-neutral-dark">SMS 본인 인증 (가상)</h3>
          <p className="text-xs text-neutral-gray leading-normal">
            입력하신 번호 <strong className="text-neutral-dark">{phoneNumber}</strong> (으)로 인증 코드가 발송되었습니다.
          </p>
          <div className="p-3 bg-brand-green-light/10 text-brand-green border border-brand-green/20 rounded-xl text-xs flex items-center gap-1.5">
            <Flame size={14} className="animate-bounce" />
            <span>가상 테스트 인증 코드: <strong className="font-extrabold text-sm text-brand-green">7777</strong></span>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleVerify} className="space-y-3">
          <div className="relative">
            <input
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              maxLength={4}
              value={code}
              onChange={(e) => {
                setCode(e.target.value.replace(/[^0-9]/g, ''));
                setError('');
              }}
              placeholder="인증번호 4자리"
              className="w-full h-14 bg-neutral-bg border border-neutral-border rounded-xl px-4 text-center font-display text-xl font-bold tracking-widest focus:ring-2 focus:ring-brand-blue focus:outline-none"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-display text-xs font-bold text-red-500">
              {formattedTime}
            </span>
          </div>

          {error && (
            <p className="text-xs text-red-500 font-medium text-center">
              {error}
            </p>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setTimer(180);
                setError('');
                setCode('');
              }}
              className="flex-1 h-12 bg-neutral-bg text-neutral-dark hover:bg-neutral-border font-semibold text-xs rounded-xl transition-all"
            >
              재전송
            </button>
            <button
              type="submit"
              disabled={code.length !== 4}
              className="flex-[2] h-12 bg-brand-blue disabled:bg-neutral-medium disabled:opacity-50 text-white hover:bg-brand-blue-hover font-bold text-xs rounded-xl shadow-lg shadow-brand-blue/10 flex items-center justify-center gap-1 transition-all active:scale-95"
            >
              <span>인증 확인</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
