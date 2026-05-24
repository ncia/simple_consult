import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Check, 
  Smartphone, 
  Sparkles, 
  ArrowRight, 
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
    // 라디오 버튼 방식: 무조건 선택한 항목 하나만 배열에 남김
    setFormData({ ...formData, selectedItems: [itemId] });
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
            <section className="relative h-[480px] bg-slate-950 text-white flex flex-col items-center justify-center text-center px-5 relative overflow-hidden">
              {/* background graphic overlays to match sparkles and lights */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/60 via-slate-900 to-black opacity-95"></div>
              
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

              {/* Claims Inquiry Button */}
              <button 
                type="button"
                className="relative z-10 mt-4 w-full max-w-[320px] h-12 bg-white/15 hover:bg-white/25 text-white rounded-xl font-bold text-sm backdrop-blur-md border border-white/20 shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                onClick={() => alert('보험금 청구 조회 서비스는 준비 중입니다.')}
              >
                <span className="text-base">🔍</span>
                <span>보험금 청구 조회</span>
              </button>
            </section>

            {/* EVENT BANNER AD (Beach Background) */}
            <section 
              className="event-banner-ad relative py-12 px-5 text-center flex flex-col items-center justify-center border-b border-neutral-border overflow-hidden bg-cover bg-center"
              style={{ backgroundImage: "url('/assets/event-beach-bg.jpg')" }}
            >
              {/* 투명 글라스 느낌을 내는 오버레이 레이어 */}
              <div className="absolute inset-0 bg-blue-50/20 backdrop-blur-[2px] shadow-inner"></div>

              <div className="relative z-10 max-w-xs w-full flex flex-col items-center gap-5">
                <div className="w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 bg-white hover:scale-[1.02] transition-transform duration-300 backdrop-blur-sm">
                  {/* 첨부된 이미지가 위치할 경로입니다. 실제 파일명/경로로 변경해 주세요. */}
                  <img 
                    src="/assets/mega-coffee-event.png" 
                    alt="보드미 메가커피 이벤트" 
                    className="w-full h-auto object-cover"
                  />
                </div>
                <h3 className="font-sans font-extrabold text-neutral-dark text-[17px] leading-snug break-keep bg-white/75 backdrop-blur-md px-5 py-3.5 rounded-2xl shadow-sm border border-white/60">
                  보드미와 보험 상담 받으시고<br />
                  <span className="text-[#3E80E5] font-black">시원한 메가커피 아이스 아메리카노</span><br />
                  한잔하세요!
                </h3>
              </div>
            </section>

            {/* LIVE APPLICATION FORM SECTION */}
            <section id="signup-form-anchor" className="py-12 px-6 bg-white space-y-6">
              <div className="text-center space-y-1.5 max-w-sm mx-auto">
                <p className="text-[11px] font-display font-bold uppercase tracking-wider text-brand-blue">
                  Bohum Store Service Portal
                </p>
                <h2 className="font-sans font-bold text-xl text-neutral-dark flex items-center justify-center gap-1.5">
                  <span className="text-2xl">📝</span> 보험분석 서비스 신청
                </h2>
                <p className="text-xs text-neutral-gray leading-relaxed text-balance">
                  가계 소중한 생활 소득을 지키는 1분 리밸런싱 예약을 위해 필수 세부 필수 정보를 기입해 주세요.
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="bg-neutral-bg rounded-2xl p-5 sm:p-6 border border-neutral-border space-y-5 w-full">
                <p className="text-xs font-semibold text-neutral-medium border-b border-neutral-border pb-2 flex items-center gap-1.5">
                  <Smartphone size={14} className="text-brand-blue" />
                  <span>상담 필수 정보 입력</span>
                </p>

                {/* Checklist radio selection block */}
                <div className="space-y-2.5 pt-2">
                  <p className="text-xs font-semibold text-neutral-medium">
                    점검 항목 선택
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {CHECK_ITEMS.map((item) => {
                      const selected = formData.selectedItems.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleChipToggle(item.id)}
                          className={`h-11 px-2 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition-all ${
                            selected
                              ? 'bg-brand-blue-pale border-brand-blue text-brand-blue font-bold shadow-sm'
                              : 'bg-white border-neutral-border text-neutral-gray hover:bg-neutral-bg'
                          }`}
                        >
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

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
                        className="flex-1 h-12 bg-white hover:bg-brand-blue border border-brand-blue text-brand-blue hover:text-white rounded-xl text-xs font-bold transition-colors duration-300 shrink-0 active:scale-95"
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
                  className="w-full md:w-1/2 mx-auto h-14 bg-brand-blue text-white rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-brand-blue/15 hover:bg-brand-blue-hover active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 mt-2 cursor-pointer"
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
                <h2 className="font-sans font-bold text-2xl text-neutral-dark flex items-center justify-center gap-2">
                  <span className="text-3xl">🤔</span> 보험분석, 왜 필요할까요?
                </h2>
                <p className="text-xs text-neutral-gray leading-normal">
                  매달 자동이체되고 있는 상당 범위의 누적 보험금, 제대로 보장받고 안전하게 축소하는 법을 알아봅니다.
                </p>
              </div>

              {/* Bento informational block structure */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full text-left font-sans">
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

              {/* Animated Infographic: Coverage Leakage Analysis */}
              <div className="w-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-neutral-border shadow-inner p-5 sm:p-6 mt-8 relative overflow-hidden font-sans">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-blue-pale rounded-full blur-3xl opacity-70 translate-y-1/2 -translate-x-1/2"></div>
                
                <div className="text-center mb-6 relative z-10">
                  <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2.5 py-1 rounded-md mb-2 inline-block border border-red-100">경고 현황</span>
                  <h3 className="font-extrabold text-neutral-dark text-lg">나도 모르게 새는 <span className="text-red-500">보험료 누수 경로</span></h3>
                  <p className="text-[11px] text-neutral-gray mt-1">중복 가입과 불필요한 특약으로 매달 버려지는 금액을 진단합니다.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 relative z-10">
                  
                  {/* Step 1: Duplication */}
                  <div className="bg-white p-4 rounded-xl border border-neutral-border shadow-sm w-full flex-1 text-center relative group">
                    <div className="w-11 h-11 bg-neutral-bg rounded-full mx-auto flex items-center justify-center text-neutral-dark mb-2 border border-neutral-border group-hover:scale-110 transition-transform">
                      <span className="text-lg">📄</span>
                    </div>
                    <strong className="text-[11px] font-bold text-neutral-dark block">무분별한 중복 가입</strong>
                    <p className="text-[10px] text-neutral-gray mt-1 leading-relaxed break-keep">비슷한 보장이 겹쳐 의미 없는 지출 발생</p>
                  </div>

                  {/* Arrow with leaking coins */}
                  <div className="flex flex-col items-center justify-center shrink-0 py-2 sm:py-0 relative">
                    <div className="hidden sm:block w-6 border-t-2 border-dashed border-red-300 relative">
                      <ArrowRight size={14} className="text-red-400 absolute -right-2 -top-[9px]" />
                    </div>
                    <div className="sm:hidden h-6 border-l-2 border-dashed border-red-300 relative">
                      <ArrowRight size={14} className="text-red-400 absolute -bottom-2 -left-[9px] rotate-90" />
                    </div>
                    {/* Leaking animation */}
                    <div className="absolute -top-3 sm:-top-5 flex gap-0.5">
                      <span className="text-[10px] animate-bounce" style={{ animationDelay: '0ms' }}>💸</span>
                      <span className="text-[10px] animate-bounce" style={{ animationDelay: '150ms' }}>💸</span>
                    </div>
                  </div>

                  {/* Step 2: Leakage */}
                  <div className="bg-white p-4 rounded-xl border border-red-200 shadow-md w-full flex-1 text-center relative ring-2 ring-red-500/20 animate-pulse-slow">
                    <div className="w-11 h-11 bg-red-500 text-white rounded-full mx-auto flex items-center justify-center mb-2 shadow-lg shadow-red-500/30">
                      <span className="text-lg">💧</span>
                    </div>
                    <strong className="text-[11px] font-bold text-red-600 block">과도한 보험료 누수</strong>
                    <p className="text-[10px] text-red-400/90 mt-1 leading-relaxed break-keep">월평균 <strong className="text-red-500">약 5~10만원</strong> 불필요한 비용 증발</p>
                  </div>

                  {/* Arrow to resolution */}
                  <div className="flex items-center justify-center shrink-0 py-2 sm:py-0">
                    <div className="hidden sm:block w-6 border-t-2 border-dashed border-brand-green-light relative">
                      <ArrowRight size={14} className="text-brand-green-light absolute -right-2 -top-[9px]" />
                    </div>
                    <div className="sm:hidden h-6 border-l-2 border-dashed border-brand-green-light relative">
                      <ArrowRight size={14} className="text-brand-green-light absolute -bottom-2 -left-[9px] rotate-90" />
                    </div>
                  </div>

                  {/* Step 3: Resolution */}
                  <div className="bg-brand-blue border border-brand-blue-hover p-4 rounded-xl shadow-lg w-full flex-1 text-center relative group overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 to-transparent opacity-50"></div>
                    <div className="w-11 h-11 bg-white/20 rounded-full mx-auto flex items-center justify-center text-white mb-2 backdrop-blur-sm group-hover:rotate-12 transition-transform shadow-inner">
                      <ShieldCheck size={20} />
                    </div>
                    <strong className="text-[11px] font-bold text-white block">보드미 최적화</strong>
                    <p className="text-[10px] text-white/80 mt-1 leading-relaxed break-keep">중복 제거 후 필수 보장만 튼튼하고 저렴하게</p>
                  </div>

                </div>
              </div>
            </section>

            {/* Before / After section modular */}
            <BeforeAfterSection />

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

              {/* Animated Mobile Dashboard Mockup */}
              <div className="max-w-[280px] mx-auto mt-8 relative select-none group">
                {/* Phone Frame */}
                <div className="w-full bg-white rounded-[2.5rem] p-2 sm:p-2.5 shadow-2xl border-4 sm:border-8 border-neutral-100 relative z-10 overflow-hidden transform group-hover:-translate-y-2 transition-transform duration-500">
                  {/* Speaker Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-5 bg-neutral-100 rounded-b-xl z-20"></div>
                  
                  {/* Screen Content */}
                  <div className="bg-slate-50 w-full h-[400px] rounded-[1.8rem] overflow-hidden flex flex-col font-sans border border-neutral-100 relative">
                    
                    {/* Header */}
                    <div className="bg-brand-blue pt-8 pb-5 px-4 text-left relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 animate-pulse-slow"></div>
                      <span className="text-white/80 text-[10px] font-medium">보드미 AI 리포트</span>
                      <h4 className="text-white font-extrabold text-sm mt-0.5">홍길동님의<br/>종합 보장 점수</h4>
                      
                      {/* Animated Score */}
                      <div className="absolute right-4 bottom-4 flex items-baseline gap-0.5">
                        <span className="text-3xl font-black text-white group-hover:scale-110 transition-transform origin-bottom duration-300">85</span>
                        <span className="text-white/80 text-xs font-bold">점</span>
                      </div>
                    </div>

                    {/* Chart Body */}
                    <div className="flex-1 p-4 space-y-4">
                      
                      {/* Bar 1: Score Progress */}
                      <div className="bg-white p-3 rounded-xl shadow-sm border border-neutral-100 group-hover:border-brand-blue/30 transition-colors">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-bold text-neutral-dark">보장 충분도</span>
                          <span className="text-[10px] font-bold text-brand-blue animate-pulse">우수해요</span>
                        </div>
                        <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                          <div className="bg-brand-blue h-full rounded-full w-[85%] relative overflow-hidden">
                            <div className="absolute top-0 bottom-0 -left-10 w-20 bg-white/20 -skew-x-12 translate-x-32 group-hover:translate-x-64 transition-transform duration-1000 ease-in-out delay-100"></div>
                          </div>
                        </div>
                      </div>

                      {/* Bar 2: Premium Comparison */}
                      <div className="bg-white p-3 rounded-xl shadow-sm border border-neutral-100">
                        <h5 className="text-[10px] font-bold text-neutral-dark mb-2">보험료 다이어트 결과</h5>
                        
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between items-end mb-1">
                              <span className="text-[9px] text-neutral-gray">현재 납입액</span>
                              <span className="text-[10px] font-bold text-neutral-dark line-through">185,000원</span>
                            </div>
                            <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-neutral-300 h-full rounded-full w-full"></div>
                            </div>
                          </div>

                          <div className="relative">
                            <div className="flex justify-between items-end mb-1">
                              <span className="text-[9px] font-bold text-brand-green">보드미 추천액</span>
                              <span className="text-[11px] font-extrabold text-brand-green">120,000원</span>
                            </div>
                            <div className="w-full bg-brand-green-light/20 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-brand-green h-full rounded-full w-[65%]"></div>
                            </div>
                            {/* Animated Saving Badge */}
                            <div className="absolute -right-2 -top-6 bg-brand-green text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm animate-bounce">
                              ▼ 6.5만
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Info Cards */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-red-50 p-2.5 rounded-lg border border-red-100 flex flex-col justify-center hover:bg-red-100 transition-colors cursor-default">
                          <span className="text-[9px] text-red-500 font-bold block mb-0.5">중복 가입</span>
                          <strong className="text-xs text-red-600">2건 발견</strong>
                        </div>
                        <div className="bg-brand-blue-pale p-2.5 rounded-lg border border-brand-blue/20 flex flex-col justify-center hover:bg-blue-100 transition-colors cursor-default">
                          <span className="text-[9px] text-brand-blue font-bold block mb-0.5">절감 가능액</span>
                          <strong className="text-xs text-brand-blue font-extrabold">월 6.5만원</strong>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Decorative background blobs */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-brand-blue/5 to-transparent rounded-full blur-3xl -z-10"></div>
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

            {/* Process Section modular */}
            <ProcessSection />

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
                <p className="text-xs font-bold text-brand-green text-center font-bold">손해보험사</p>
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
              <p>2. <strong>준법 감시팀 심의 필증:</strong> 핀토스 준법감시팀-준법심의필2026-733(유효 검증 심의일자: 2026-05-18 ~ 2027-05-17)</p>
              <p>3. <strong>유효기간:</strong> 본 온라인 광고는 업계 정식 광고 심의 규정을 정확히 준수하였으며, 해당 유효기간은 정식 심의 완료일로부터 명확히 1년입니다.</p>
              <p>4. <strong>가입 및 해지 중요주의:</strong> 기존 체결된 적격 계약을 정당한 사유 없이 도중에 강제 해약하고 신설 포트폴리오를 체결하시는 일련의 과정에서, (1) 고의 누락이나 상해 질병 신체 연령 이력 증가로 인수 제안이 전면 취소 거절되거나 표준 요율이 할증 상승할 수 있습니다. (2) 개개 세부 상품 편구에 따라 신규 3대 성인 질환 면책 기한 적용 및 부분 지급 유예 등 부가 불이익 사항이 따를 수 있는 만큼 면밀한 진단과 사전 협의를 부탁드립니다.</p>
            </section>

            {/* LOWER COOPERATIVE BUSINESS FOOTER */}
            <footer className="bg-neutral-bg border-t border-neutral-border">
              <div className="w-full py-8 px-5 flex flex-col gap-5 max-w-container-max mx-auto font-sans">
                <div className="flex justify-between items-end flex-wrap gap-4 border-b border-neutral-border pb-4">
                  <span className="font-display text-xl font-black text-neutral-dark tracking-tight">InsureAnalysis.</span>
                  <div className="flex gap-4.5 text-xs">
                    <span className="font-bold text-neutral-medium">(주)핀토스</span>
                    <button 
                      onClick={() => setActiveTermModal({ isOpen: true, title: '개인정보 처리 위탁 방침 가이드', type: 'privacy' })}
                      className="font-bold text-brand-blue underline"
                    >
                      개인정보처리방침
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-1.5 text-[11px] text-neutral-gray leading-relaxed">
                  <p><strong>공동 사업체 상호:</strong> (주)핀토스  |  <strong>본사 사업자등록번호:</strong> 123-45-67890  |  <strong>대표 고객 센터:</strong> 032-999-0119</p>
                  <p><strong>페이지 실무 보호책임:</strong> 개인정보관리담당 임원 유영환 수석 (메일 문의: security@insucare.net)</p>
                  <p><strong>소재지 주소:</strong> 경기 오산시 남부대로 411-15 원동 푸르지오 109동 804호 상설 법인부스</p>
                  <p className="text-[10px] text-neutral-muted mt-2">© 2026 InsureAnalysis Co., Ltd. All rights reserved. Our values and technologies prioritize the financial security of our client base.</p>
                </div>

                <div className="bg-white/70 p-3.5 rounded-xl text-center border border-neutral-border/85">
                  <p className="text-[10px] text-neutral-medium leading-relaxed">
                    * (주)핀토스는 본 랜딩 분석 페이지 유지 관리 및 대행 보조를 업무로 하며, 연계 대리 상담 판매에 직접 관여하거나 수수료를 고객에게 전가 수취하지 않는 안전한 간접 플랫폼입니다.
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
