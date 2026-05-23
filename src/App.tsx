import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Check, 
  Smartphone, 
  Plus, 
  Phone, 
  ExternalLink, 
  ShieldAlert, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  X, 
  Flame, 
  Award,
  ChevronRight,
  Info
} from 'lucide-react';

import { Header } from './components/Header';
import { AgreementModal } from './components/AgreementModal';
import { SMSVerificationModal } from './components/SMSVerificationModal';
import { BeforeAfterSection } from './components/BeforeAfterSection';
import { ProcessSection } from './components/ProcessSection';
import { DiagnosticsReport } from './components/DiagnosticsReport';
import { PartnerProductModal } from './components/PartnerProductModal';

import { 
  InquiryFormState, 
  CHECK_ITEMS, 
  PARTNERS_LIFE, 
  PARTNERS_NONLIFE, 
  PartnerCompany 
} from './types';

export default function App() {
  // Main form state
  const [formData, setFormData] = useState<InquiryFormState>({
    name: '',
    gender: null, // default active selection
    birthdate: '',
    phone: '',
    verificationCode: '',
    isVerified: false,
    selectedItems: [], // default selection
    termAll: false,
    termPrivacy: false,
    termMarketing: false
  });

  // Modal tracking states
  const [isSMSOtpOpen, setIsSMSOtpOpen] = useState(false);
  const [activeTermModal, setActiveTermModal] = useState<{ isOpen: boolean; title: string; type: 'privacy' | 'marketing' | 'terms' }>({
    isOpen: false,
    title: '',
    type: 'privacy'
  });
  const [selectedPartner, setSelectedPartner] = useState<PartnerCompany | null>(null);
  
  // App routing/submission state
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Validation errors mapping
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  // Format phone number live helper (01012345678 -> 010-1234-5678)
  const formatPhone = (val: string) => {
    const raw = val.replace(/[^0-9]/g, '');
    if (raw.length <= 3) return raw;
    if (raw.length <= 7) return `${raw.slice(0, 3)}-${raw.slice(3)}`;
    return `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
  };

  // Format birthdate helper (limit 8 numbers)
  const formatBirthdate = (val: string) => {
    return val.replace(/[^0-9]/g, '').slice(0, 8);
  };

  // Individual handlers
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData.isVerified) return; // lock input once verified
    setFormData({ ...formData, phone: formatPhone(e.target.value) });
    setValidationErrors({ ...validationErrors, phone: '' });
  };

  const handleGenderToggle = (gender: 'male' | 'female') => {
    setFormData({ ...formData, gender });
    setValidationErrors({ ...validationErrors, gender: '' });
  };

  const handleChipToggle = (itemId: string) => {
    let items = [...formData.selectedItems];
    if (items.includes(itemId)) {
      items = items.filter((id) => id !== itemId);
    } else {
      items.push(itemId);
    }
    setFormData({ ...formData, selectedItems: items });
  };

  // Agreements state synchronizer
  const handleTermAllChange = (checked: boolean) => {
    setFormData({
      ...formData,
      termAll: checked,
      termPrivacy: checked,
      termMarketing: checked
    });
  };

  const handleTermIndividualChange = (field: 'termPrivacy' | 'termMarketing', checked: boolean) => {
    const updated = { ...formData, [field]: checked };
    const allChecked = updated.termPrivacy && updated.termMarketing;
    setFormData({ ...updated, termAll: allChecked });
  };

  // Contact support click alert
  const handleContactClick = () => {
    alert('비대면 긴급 지원 고객센터(02-2038-8603)로 자동 연결을 승인합니다. 담당 배정 카운슬러가 가장 안전하게 응대하겠습니다.');
  };

  // Launch simulated OTP sending
  const requestVerification = () => {
    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setValidationErrors({ ...validationErrors, phone: '올바른 휴대전화 번호 10~11자리를 입력해 주세요.' });
      return;
    }
    setValidationErrors({ ...validationErrors, phone: '' });
    setIsSMSOtpOpen(true);
  };

  // Complete OTP verified callback
  const handleVerifySuccess = () => {
    setFormData({ ...formData, isVerified: true });
    alert('본인 휴대전화 인증이 안심 처리되었습니다. 양질의 보장 데이터를 안전하게 대조하겠습니다.');
  };

  // Form final submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      errors.name = '이름을 기입해 주세요.';
    }
    if (formData.birthdate.length !== 8) {
      errors.birthdate = '생년월일 8자리(예: 19850613)를 정확히 입력해 주세요.';
    } else {
      const year = parseInt(formData.birthdate.substring(0, 4), 10);
      if (year < 1920 || year > 2026) {
        errors.birthdate = '올바른 연도 범위(1920~2026년)를 설정해 주세요.';
      }
    }
    if (!formData.isVerified) {
      errors.phone = '휴대전화 본인인증(7777인증)을 완료해 주세요.';
    }
    if (!formData.gender) {
      errors.gender = '성별을 선택해 주세요.';
    }
    if (!formData.termPrivacy) {
      errors.terms = '필수 개인정보 수집 및 활용 동의서에 체크해 주세요.';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      // scroll to topmost invalid item
      const targetElement = document.getElementById('signup-form-anchor');
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    setValidationErrors({});
    setIsSubmitted(true);
  };

  const formattedAgeDisplay = () => {
    if (formData.birthdate && formData.birthdate.length >= 4) {
      const year = parseInt(formData.birthdate.substring(0, 4), 10);
      if (!isNaN(year)) return `${2026 - year}세 ${formData.name || '고객'}님`;
    }
    return "38세 홍길동님";
  };

  return (
    <div className="min-h-screen bg-neutral-bg text-neutral-dark flex flex-col items-center selection:bg-brand-blue-light selection:text-brand-blue-dark">
      
      {/* Top sticky header */}
      <Header onContactClick={handleContactClick} />

      {/* Main Container max width 768px matching specifications */}
      <main className="w-full max-w-[768px] bg-white shadow-2xl overflow-hidden flex flex-col mt-0 border-x border-neutral-border animate-fade-in pb-16">
        
        {isSubmitted ? (
          /* Success Screen -> Direct custom diagnostics generated based on form parameters */
          <DiagnosticsReport 
            formData={formData} 
            onReset={() => {
              setIsSubmitted(false);
              setFormData({ ...formData, isVerified: false, phone: '' });
            }} 
          />
        ) : (
          /* Main Interactive Landing Content */
          <>
            {/* HERO HERO-BG WITH PARALLAX IMPACT */}
            <section className="relative h-[480px] bg-brand-blue text-white flex flex-col items-center justify-center text-center px-5 relative overflow-hidden">
              {/* background graphic overlays to match sparkles and lights */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-blue-hover/60 via-brand-blue to-brand-blue-dark opacity-90"></div>
              
              {/* Dynamic light spot */}
              <div className="absolute -left-16 -top-16 w-80 h-80 bg-brand-green-neon/20 rounded-full blur-3xl animate-pulse-slow"></div>
              <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-brand-blue-light/10 rounded-full blur-3xl animate-pulse-slow"></div>

              {/* Sparkle icons floating in theme */}
              <div className="absolute left-8 top-12 opacity-40 animate-bounce">
                <Sparkles size={24} className="text-white" />
              </div>
              <div className="absolute right-12 bottom-[140px] opacity-30 animate-bounce delay-150">
                <Sparkles size={18} className="text-brand-green-light" />
              </div>

              {/* Title group */}
              <div className="relative z-10 space-y-3 max-w-md">
                <span className="text-[11px] font-sans font-extrabold tracking-widest text-white/85 bg-white/10 px-3 py-1.5 rounded-full uppercase border border-white/5 inline-block">
                  BOHUM STORE SPECIAL
                </span>
                <h1 className="font-display font-black text-3xl sm:text-4xl leading-tight tracking-tight">
                  보험가입, 잘한걸까?<br />
                  <span className="text-brand-green-light">내 보험 바로알기</span>
                </h1>
              </div>

              {/* Hover dynamic result card */}
              <div className="relative z-10 mt-8 bg-white/10 backdrop-blur-md px-6 py-[22px] rounded-2.5xl border border-white/15 shadow-xl inline-block text-left w-full max-w-[320px] transition-transform hover:scale-[1.02]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] uppercase text-brand-green-light font-bold">INSURE ANALYSIS DIAL</span>
                  <span className="font-display text-[10px] text-white/50">85.06.13</span>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-brand-green-light font-sans text-xs font-semibold">{formattedAgeDisplay()}</p>
                    <h2 className="font-sans font-bold text-lg text-white">보험분석 결과 대기</h2>
                  </div>
                  {/* blinking live indicator */}
                  <div className="flex items-center gap-1 bg-red-500/20 text-red-300 font-bold px-2 py-0.5 rounded text-[9px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                    <span>STANDBY</span>
                  </div>
                </div>
              </div>
            </section>

            {/* LIVE APPLICATION FORM SECTION */}
            <section id="signup-form-anchor" className="py-12 px-6 bg-white space-y-6">
              <div className="text-center space-y-1.5 max-w-sm mx-auto">
                <p className="text-[11px] font-display font-bold uppercase tracking-wider text-brand-blue">
                  Bohum Store Service Portal
                </p>
                <h2 className="font-sans font-bold text-xl text-neutral-dark">
                  분석 서비스 신청
                </h2>
                <p className="text-xs text-neutral-gray leading-relaxed text-balance">
                  가계 소중한 생활 소득을 지키는 1분 리밸런싱 예약을 위해 필수 세부 필수 정보를 기입해 주세요.
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="bg-neutral-bg rounded-2xl p-5 sm:p-6 border border-neutral-border space-y-5 max-w-md mx-auto">
                <p className="text-xs font-semibold text-neutral-medium border-b border-neutral-border pb-2 flex items-center gap-1.5">
                  <Smartphone size={14} className="text-brand-blue" />
                  <span>상담 필수 정보 입력</span>
                </p>

                {/* Input Name field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">이름</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      setValidationErrors({ ...validationErrors, name: '' });
                    }}
                    placeholder="이름을 입력하세요."
                    className={`w-full h-12 bg-white rounded-xl border px-4 font-sans text-sm focus:ring-2 focus:outline-none transition-all ${
                      validationErrors.name ? 'border-red-500 focus:ring-red-200' : 'border-neutral-border focus:ring-brand-blue-pale focus:border-brand-blue'
                    }`}
                  />
                  {validationErrors.name && (
                    <p className="text-[11px] text-red-500 font-medium">{validationErrors.name}</p>
                  )}
                </div>

                {/* Phone verification combo */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">연락처</label>
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      disabled={formData.isVerified}
                      placeholder="연락처를 입력하세요."
                      className={`flex-[2] h-12 bg-white rounded-xl border px-4 font-sans text-sm focus:ring-2 focus:outline-none transition-all disabled:opacity-75 disabled:bg-neutral-border/20 ${
                        validationErrors.phone ? 'border-red-500 focus:ring-red-200' : 'border-neutral-border focus:ring-brand-blue-pale focus:border-brand-blue'
                      }`}
                    />
                    
                    {formData.isVerified ? (
                      <div className="flex-1 h-12 bg-brand-green/10 text-brand-green rounded-xl text-xs font-bold border border-brand-green/30 flex items-center justify-center gap-1 shrink-0">
                        <Check size={13} />
                        <span>인증 완료</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={requestVerification}
                        className="flex-1 h-12 bg-white hover:bg-neutral-bg border border-brand-blue text-brand-blue rounded-xl text-xs font-bold transition-all shrink-0 active:scale-95"
                      >
                        인증요청
                      </button>
                    )}
                  </div>
                  {validationErrors.phone && (
                    <p className="text-[11px] text-red-500 font-medium">{validationErrors.phone}</p>
                  )}
                </div>

                {/* Birthdate Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">생년월일</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={8}
                    value={formData.birthdate}
                    onChange={(e) => {
                      setFormData({ ...formData, birthdate: formatBirthdate(e.target.value) });
                      setValidationErrors({ ...validationErrors, birthdate: '' });
                    }}
                    placeholder="생년월일 8자리 (예: 19850613)"
                    className={`w-full h-12 bg-white rounded-xl border px-4 font-sans text-sm focus:ring-2 focus:outline-none transition-all ${
                      validationErrors.birthdate ? 'border-red-500 focus:ring-red-200' : 'border-neutral-border focus:ring-brand-blue-pale focus:border-brand-blue'
                    }`}
                  />
                  {validationErrors.birthdate && (
                    <p className="text-[11px] text-red-500 font-medium">{validationErrors.birthdate}</p>
                  )}
                </div>

                {/* Gender Selectors */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">성별</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleGenderToggle('male')}
                      className={`flex-1 h-12 rounded-xl text-sm font-semibold border transition-all active:scale-95 flex items-center justify-center gap-1.5 ${
                        formData.gender === 'male'
                          ? 'bg-brand-blue-pale border-brand-blue text-brand-blue'
                          : 'bg-white border-neutral-border text-neutral-gray hover:bg-neutral-bg'
                      }`}
                    >
                      <Check size={14} className={formData.gender === 'male' ? 'opacity-100' : 'opacity-0'} />
                      <span>남성</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleGenderToggle('female')}
                      className={`flex-1 h-12 rounded-xl text-sm font-semibold border transition-all active:scale-95 flex items-center justify-center gap-1.5 ${
                        formData.gender === 'female'
                          ? 'bg-brand-blue-pale border-brand-blue text-brand-blue'
                          : 'bg-white border-neutral-border text-neutral-gray hover:bg-neutral-bg'
                      }`}
                    >
                      <Check size={14} className={formData.gender === 'female' ? 'opacity-100' : 'opacity-0'} />
                      <span>여성</span>
                    </button>
                  </div>
                  {validationErrors.gender && (
                    <p className="text-[11px] text-red-500 font-medium">{validationErrors.gender}</p>
                  )}
                </div>

                {/* Checklist chips selection block */}
                <div className="space-y-2.5 pt-2">
                  <p className="text-xs font-semibold text-neutral-medium">
                    점검 희망 항목 선택 (중복 가능)
                  </p>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {CHECK_ITEMS.map((item) => {
                      const selected = formData.selectedItems.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleChipToggle(item.id)}
                          className={`h-11 rounded-lg text-xs font-medium border flex items-center justify-center transition-all ${
                            selected
                              ? 'bg-brand-blue-pale border-brand-blue text-brand-blue font-bold shadow-sm'
                              : 'bg-white border-neutral-border text-neutral-gray hover:bg-neutral-bg'
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Agreement contracts */}
                <div className="pt-3 border-t border-neutral-border/60 space-y-2 select-none">
                  <label className="flex items-center gap-2 cursor-pointer pb-1.5 border-b border-neutral-border/40">
                    <input
                      type="checkbox"
                      checked={formData.termAll}
                      onChange={(e) => handleTermAllChange(e.target.checked)}
                      className="w-4 h-4 rounded border-neutral-border text-brand-blue focus:ring-brand-blue"
                    />
                    <strong className="text-xs text-neutral-dark font-extrabold">전체 동의</strong>
                  </label>

                  <div className="flex justify-between items-center pl-1.5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.termPrivacy}
                        onChange={(e) => handleTermIndividualChange('termPrivacy', e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-neutral-border text-brand-blue focus:ring-brand-blue"
                      />
                      <span className="text-[11px] text-neutral-gray flex items-center gap-1 font-semibold">
                        개인정보 수집∙활용 동의
                        <span className="text-red-500 font-bold text-[10px]">(필수)</span>
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveTermModal({ isOpen: true, title: '개인정보 수집 및 활용 약관', type: 'privacy' })}
                      className="text-[10px] text-neutral-muted hover:text-brand-blue underline"
                    >
                      약관보기
                    </button>
                  </div>

                  <div className="flex justify-between items-center pl-1.5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.termMarketing}
                        onChange={(e) => handleTermIndividualChange('termMarketing', e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-neutral-border text-brand-blue focus:ring-brand-blue"
                      />
                      <span className="text-[11px] text-neutral-gray flex items-center gap-1 font-semibold">
                        마케팅 정보 수신 동의
                        <span className="text-neutral-muted text-[10px] select-none">(선택)</span>
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveTermModal({ isOpen: true, title: '마케팅 활용 및 광고수행 안내', type: 'marketing' })}
                      className="text-[10px] text-neutral-muted hover:text-brand-blue underline"
                    >
                      상세보기
                    </button>
                  </div>
                  
                  {validationErrors.terms && (
                    <p className="text-[11px] text-red-500 font-medium pt-1">{validationErrors.terms}</p>
                  )}
                </div>

                {/* Main Action submit button */}
                <button
                  type="submit"
                  className="w-full h-14 bg-brand-blue text-white rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-brand-blue/15 hover:bg-brand-blue-hover active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 mt-2 cursor-pointer"
                >
                  <ShieldCheck size={18} />
                  <span>실시간 무료 분석 신청하기</span>
                  <ArrowRight size={15} />
                </button>
              </form>
            </section>

            {/* INFORMATION SECTION: WHY */}
            <section className="py-14 px-5 bg-neutral-bg text-center space-y-6">
              <div className="space-y-1.5 max-w-sm mx-auto">
                <span className="text-brand-blue bg-brand-blue-pale text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Need for review
                </span>
                <h2 className="font-sans font-bold text-2xl text-neutral-dark">
                  보험분석, 왜 필요할까요?
                </h2>
                <p className="text-xs text-neutral-gray leading-normal">
                  매달 자동이체되고 있는 상당 범위의 누적 보험금, 제대로 보장받고 안전하게 축소하는 법을 알아봅니다.
                </p>
              </div>

              {/* Bento informational block structure */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-xl mx-auto text-left font-sans">
                <div className="bg-white p-4.5 rounded-xl border border-neutral-border shadow-sm flex gap-3.5 items-start">
                  <div className="w-9 h-9 rounded-full bg-brand-blue-pale text-brand-blue flex items-center justify-center font-bold text-xs shrink-0">
                    01
                  </div>
                  <div className="space-y-1">
                    <strong className="text-xs font-bold text-neutral-dark block leading-normal">중복가입 정리로<br />불필요 구멍 정리</strong>
                    <p className="text-[10px] text-neutral-gray leading-relaxed">자기도 모르게 중 가입되어 수술 세이빙이 안 되거나 벌금이 이중 정산되는 내역 탈출</p>
                  </div>
                </div>

                <div className="bg-white p-4.5 rounded-xl border border-neutral-border shadow-sm flex gap-3.5 items-start">
                  <div className="w-9 h-9 rounded-full bg-brand-blue-pale text-brand-blue flex items-center justify-center font-bold text-xs shrink-0">
                    02
                  </div>
                  <div className="space-y-1">
                    <strong className="text-xs font-bold text-neutral-dark block leading-normal">29개 보험사망<br />공식 가격대비 비교</strong>
                    <p className="text-[10px] text-neutral-gray leading-relaxed">생보사 및 손보사 전체 약관을 대조해 같은 지급 대비 부담을 최소한으로 고착</p>
                  </div>
                </div>

                <div className="bg-white p-4.5 rounded-xl border border-neutral-border shadow-sm flex gap-3.5 items-start">
                  <div className="w-9 h-9 rounded-full bg-brand-blue-pale text-brand-blue flex items-center justify-center font-bold text-xs shrink-0">
                    03
                  </div>
                  <div className="space-y-1">
                    <strong className="text-xs font-bold text-neutral-dark block leading-normal">내 실 소득 상황에<br />맞는 맞춤 세팅</strong>
                    <p className="text-[10px] text-neutral-gray leading-relaxed">가계 유지 가능한 예산율(소득 대비 7% 안팎)로 무해지 포트폴리오 정밀 설계</p>
                  </div>
                </div>
              </div>

              {/* Infographic with shadow */}
              <div className="max-w-md mx-auto bg-white rounded-2xl overflow-hidden border border-neutral-border shadow-md select-none mt-6 hover:scale-[1.01] transition-transform">
                <img 
                  src="https://lh3.googleusercontent.com/aida/ADBb0ugA-ufdGQzGixT_Tx5CdPw5XgtOrh7a35wJyBF7AoFs5I1r64P6c2VqcWZCcZpEoMOsU-OIhAB1dwFTQfUVJs5ZPGRFHkWuQhe_46QaAYEbKauOTbHxuFo6fCjulB1e_oxjy5KmtsDisitRegIgmsn9gsGDoG5_6fHPIF6HeznG5a4yKcVp9xDJi9GTy6cBrgg5hUPjkxRG0xxnmN4qkQ0OvWDWi4fQt0QoQKN5mWO6gSFSFzaPqJw" 
                  alt="보험 보장의 누출 경로 분석 구도" 
                  className="w-full h-auto"
                  referrerPolicy="no-referrer"
                />
              </div>
            </section>

            {/* Before / After section modular */}
            <BeforeAfterSection />

            {/* Process Section modular */}
            <ProcessSection />

            {/* FINAL CONVERSION PERSUADE WRAPPER */}
            <section className="py-14 px-5 bg-white text-center space-y-6">
              <div className="space-y-2 text-center max-w-sm mx-auto">
                <h2 className="font-sans font-extrabold text-2xl text-neutral-dark leading-tight">
                  보험분석 결과를<br />
                  눈으로 직접 확인하세요.
                </h2>
                <p className="text-xs text-neutral-gray leading-relaxed">
                  신청 즉시 가입 보고가 생성되며, 카카오 등기를 거쳐 담당 수석의 안심 유선 코디가 무상으로 병행 지원됩니다.
                </p>
              </div>

              <div className="max-w-xs mx-auto drop-shadow-2xl hover:scale-[1.02] transition-transform select-none">
                <img 
                  src="https://lh3.googleusercontent.com/aida/ADBb0ugtywe0sTbPtNi4mtDYA2lKnJwyvomtWD8CUHFMPZiQsGv1baykLVUSsg0_XB8B3VspPgSVC7ttdSQiCBB_pkFZ_q6GS2x-KjMltf2bHIW265wQhsfnDzLoClKHmSdWGTeA7Q1f095oSCju5TRxi5Kb2m7cqGsM4Xy_F8BXrE5BGDRa9QExsyH4p6Ca0Sy5SGWNFhRYC7O59KouX4mLoRzvQrl-Tl9Gy8RAo5RDfN7UQ9tIkfjO6KQ" 
                  alt="모바일 대시보드 리포트 시안 이미지" 
                  className="w-full h-auto rounded-3xl"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => {
                    const targetElement = document.getElementById('signup-form-anchor');
                    if (targetElement) targetElement.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-blue-hover text-white px-8 py-4 rounded-xl font-bold text-xs shadow-lg shadow-brand-blue/10 active:scale-95 transition-all"
                >
                  <span>지금 간이 분석 신청 시작</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </section>

            {/* PARTNER NETWORKS / EXPERT BRAND GRID */}
            <section className="py-12 px-5 bg-neutral-bg border-t border-neutral-border space-y-7">
              <div className="text-center space-y-1.5 max-w-sm mx-auto">
                <p className="text-[10px] font-sans text-neutral-muted leading-relaxed font-semibold">
                  29개 주요 대형 보험사의 승인 전산망 데이터 연계
                </p>
                <h2 className="font-sans font-bold text-lg text-neutral-dark">
                  고객님의 보험을 분석해 드립니다
                </h2>
                <div className="inline-flex items-center gap-1 bg-white border border-neutral-border px-3 py-1.5 rounded-lg text-[9px] text-neutral-gray leading-normal">
                  <Info size={11} className="text-brand-blue" />
                  <span>각 제휴사 로고를 터치하시면 <strong>주요 특화 추천 상품 정보</strong>를 확인하실 수 있습니다.</span>
                </div>
              </div>

              {/* Life Insu Grid */}
              <div className="space-y-3 font-sans">
                <p className="text-xs font-bold text-brand-blue text-center">생명보험사</p>
                <div className="bg-white rounded-xl p-4.5 grid grid-cols-4 gap-2.5 items-center border border-neutral-border">
                  {PARTNERS_LIFE.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPartner(p)}
                      className="h-9 bg-neutral-bg hover:bg-brand-blue-pale hover:text-brand-blue text-neutral-dark text-xs font-bold flex items-center justify-center rounded-lg border border-neutral-border/50 hover:border-brand-blue transition-all active:scale-95 cursor-pointer"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nonlife Insu Grid */}
              <div className="space-y-3 font-sans">
                <p className="text-xs font-bold text-brand-green text-center font-bold">손해/화재보험사</p>
                <div className="bg-white rounded-xl p-4.5 grid grid-cols-4 gap-2.5 items-center border border-neutral-border">
                  {PARTNERS_NONLIFE.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPartner(p)}
                      className="h-9 bg-neutral-bg hover:bg-brand-green-light/20 hover:text-brand-green text-neutral-dark text-xs font-bold flex items-center justify-center rounded-lg border border-neutral-border/50 hover:border-brand-green transition-all active:scale-95 cursor-pointer"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* MANDATORY COMPLIANCE DISCLAIMER */}
            <section className="bg-neutral-dark text-white/50 p-6 font-sans text-[10px] space-y-2 border-t border-white/5">
              <strong className="text-white text-xs font-extrabold block mb-2">필수 준법 안내 사항</strong>
              <p>1. <strong>법인 대리점 인증 정보:</strong> (주)에즈금융서비스 보험 법인 보험 대리점 (생/손보 제휴 협회 공식 등록 정식 일련번호 : 제2012118012호)</p>
              <p>2. <strong>준법 감시팀 심의 필증:</strong> AZ-준법감시팀-준법심의필2026-733(유효 검증 심의일자: 2026-05-18 ~ 2027-05-17)</p>
              <p>3. <strong>유효기간:</strong> 본 온라인 광고는 업계 정식 광고 심의 규정을 정확히 준수하였으며, 해당 유효기간은 정식 심의 완료일로부터 명확히 1년입니다.</p>
              <p>4. <strong>가입 및 해지 중요주의:</strong> 기존 체결된 적격 계약을 정당한 사유 없이 도중에 강제 해약하고 신설 포트폴리오를 체결하시는 일련의 과정에서, (1) 고의 누락이나 상해 질병 신체 연령 이력 증가로 인수 제안이 전면 취소 거절되거나 표준 요율이 할증 상승할 수 있습니다. (2) 개개 세부 상품 편구에 따라 신규 3대 성인 질환 면책 기한 적용 및 부분 지급 유예 등 부가 불이익 사항이 따를 수 있는 만큼 면밀한 진단과 사전 협의를 부탁드립니다.</p>
            </section>

            {/* LOWER COOPERATIVE BUSINESS FOOTER */}
            <footer className="bg-neutral-bg border-t border-neutral-border">
              <div className="w-full py-8 px-5 flex flex-col gap-5 max-w-container-max mx-auto font-sans">
                <div className="flex justify-between items-end flex-wrap gap-4 border-b border-neutral-border pb-4">
                  <span className="font-display text-xl font-black text-neutral-dark tracking-tight">InsureAnalysis.</span>
                  <div className="flex gap-4.5 text-xs">
                    <span className="font-bold text-neutral-medium">(주)바이츠</span>
                    <button 
                      onClick={() => setActiveTermModal({ isOpen: true, title: '개인정보 처리 위탁 방침 가이드', type: 'privacy' })}
                      className="font-bold text-brand-blue underline"
                    >
                      개인정보처리방침
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-1.5 text-[11px] text-neutral-gray leading-relaxed">
                  <p><strong>공동 사업체 상호:</strong> (주)바이츠  |  <strong>본사 사업자등록번호:</strong> 805-87-00838  |  <strong>대표 연락 유선:</strong> 02-2038-8603</p>
                  <p><strong>페이지 실무 보호책임:</strong> 개인정보관리담당 임원 민인환 수석 (유선 메일 문의: amcoms@naver.com)</p>
                  <p><strong>소재지 주소:</strong> 서울특별시 영등포구 당산로35길 4-3, 5층 상설 법인부스</p>
                  <p className="text-[10px] text-neutral-muted mt-2">© 2026 InsureAnalysis Co., Ltd. All rights reserved. Our values and technologies prioritize the financial security of our client base.</p>
                </div>

                <div className="bg-white/70 p-3.5 rounded-xl text-center border border-neutral-border/85">
                  <p className="text-[10px] text-neutral-medium leading-relaxed">
                    * (주)바이츠는 본 랜딩 분석 페이지 유지 관리 및 대행 보조를 업무로 하며, 연계 대리 상담 판매에 직접 관여하거나 수수료를 고객에게 전가 수취하지 않는 안전한 간접 플랫폼입니다.
                  </p>
                </div>
              </div>
            </footer>
          </>
        )}

      </main>

      {/* RENDER MODAL LAYERS FOR AUTH/TERMS/carrier RECOMMENCES */}
      
      {/* 1. SMS Verification OTP Modal */}
      <SMSVerificationModal 
        isOpen={isSMSOtpOpen} 
        onClose={() => setIsSMSOtpOpen(false)} 
        phoneNumber={formData.phone}
        onVerifySuccess={handleVerifySuccess}
      />

      {/* 2. Standard interactive Terms Modal */}
      <AgreementModal 
        isOpen={activeTermModal.isOpen}
        title={activeTermModal.title}
        type={activeTermModal.type}
        onClose={() => setActiveTermModal({ ...activeTermModal, isOpen: false })}
      />

      {/* 3. Partner Insurer detail recommend card */}
      <PartnerProductModal 
        partner={selectedPartner}
        onClose={() => setSelectedPartner(null)}
      />

    </div>
  );
}
