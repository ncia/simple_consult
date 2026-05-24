import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, MessageCircle, FileText, Database, ShieldCheck, Eye, Image as ImageIcon } from 'lucide-react';

interface ProcessStep {
  step: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  details: string[];
}

export function ProcessSection() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [showProcessRaw, setShowProcessRaw] = useState(false);
  const lastInteractionTimeRef = useRef<number>(0);

  useEffect(() => {
    if (showProcessRaw) return;
    const sequence = [0, 1, 3, 2];
    const interval = setInterval(() => {
      // 마지막 상호작용 후 10초(10000ms)가 지나기 전에는 자동 전환 일시 정지
      if (Date.now() - lastInteractionTimeRef.current < 10000) return;
      
      setActiveStep((prev) => {
        const currentIndex = sequence.indexOf(prev);
        return sequence[(currentIndex + 1) % 4];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [showProcessRaw]);

  const steps: ProcessStep[] = [
    {
      step: 'STEP 1',
      title: '보험분석 신청',
      icon: <FileText className="text-white" size={20} />,
      color: 'bg-brand-blue',
      details: [
        '초간단 신상 기입을 통한 맞춤 데이터 접수',
        '24시간 내 전문 보장 분석사 자동 배정',
        '신청 즉시 가상 포트폴리오 스캔 대기 시작'
      ]
    },
    {
      step: 'STEP 2',
      title: '데이터 수집∙분석',
      icon: <Database className="text-white" size={20} />,
      color: 'bg-brand-blue',
      details: [
        '국내 29개 보험 전체 전산 실시간 조회망 가동',
        '특약 중복성, 과잉 적립, 납입액 누더기 지수 평가',
        '성별, 연령 대조 표준 통계치 대비 격차 도출'
      ]
    },
    {
      step: 'STEP 4',
      title: '보장분석 리포트 제공',
      icon: <ShieldCheck className="text-white" size={20} />,
      color: 'bg-brand-green-neon',
      details: [
        '최종 정리된 나만의 원클릭 리포트 영구 저장',
        '매월 세이브 가능한 가계 소득 리스트 증명서 제공',
        '보안 등기 혹은 카카오 알림톡 실시간 파일 전송'
      ]
    },
    {
      step: 'STEP 3',
      title: '고객 맞춤 상담',
      icon: <MessageCircle className="text-white" size={20} />,
      color: 'bg-brand-blue',
      details: [
        '불편한 내방 없이 100% 무상 유선 클리닉',
        '의무 가입 등으로 꽁꽁 숨겨진 누수 특약 공개',
        '유지 가능한 범위 안에서 실속형 클리닉 방향 제안'
      ]
    }
  ];

  return (
    <section className="py-14 px-5 bg-neutral-dark text-white relative overflow-hidden">
      {/* Decorative ambient spots */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-green-neon/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-[768px] mx-auto text-center space-y-6 relative z-10">
        <div>
          <span className="text-brand-green-light bg-white/10 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Analysis Method
          </span>
          <h2 className="font-sans font-bold text-2xl text-white mt-2 flex items-center justify-center gap-1.5">
            <span className="text-3xl">📋</span> 보험분석, 이렇게 진행됩니다
          </h2>
          <p className="text-xs text-neutral-muted mt-1">
            간결하고 투명한 절차에 기반하여 복잡한 세부 약관까지 깔끔하게 검검해 드립니다.
          </p>
        </div>

        {/* Toggle between interactive design or original infographic */}
        <div className="flex justify-end">
          <button
            onClick={() => setShowProcessRaw(!showProcessRaw)}
            className="flex items-center gap-1.5 text-xs text-brand-green-light hover:underline bg-white/5 px-3 py-1.5 rounded-lg font-semibold transition"
          >
            {showProcessRaw ? <Eye size={12} /> : <ImageIcon size={12} />}
            <span>{showProcessRaw ? '인터랙티브 가이드 보기' : '원본 인포그래픽 이미지 보기'}</span>
          </button>
        </div>

        {showProcessRaw ? (
          /* Show official process illustration map */
          <div className="max-w-md mx-auto animate-fade-in border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <img
              src="https://lh3.googleusercontent.com/aida/ADBb0ujR0JlQj5YyfpzP3nvlT0SEHEj4Ey3HBQqosUH0ue5tHBahVaq_jN0mJwIkVhISdttULPvvCZk5X5BdktLk62P5oYJ8LHBD1tzvdi3kUTB5cmbZJSvGKQL2Tr6VWtu39y0osOyEYAsgt9Q1G0gXtvD1Ph25JU5XJZPL1oKYU1YDwi8P6Wqa82HPyEst0TOcF2QStlQXcLOMTFpFFqeRbHZ4-5zP6bWftzAuabTcNa0AhRD6sLUVnSM"
              alt="진행 절차 안내도"
              className="w-full h-auto"
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          /* Interactive Quadrant Panel */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full animate-fade-in font-sans">
            {steps.map((item, idx) => {
              const isSelected = activeStep === idx;
              
              // 모바일(1단)일 때는 1-2-3-4 순서, 데스크탑(2단)일 때는 1-2-4-3 순서(박스 스왑 유지)
              let orderClass = '';
              if (item.step === 'STEP 1') orderClass = 'order-1 sm:order-1';
              if (item.step === 'STEP 2') orderClass = 'order-2 sm:order-2';
              if (item.step === 'STEP 3') orderClass = 'order-3 sm:order-4';
              if (item.step === 'STEP 4') orderClass = 'order-4 sm:order-3';

              return (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveStep(idx);
                    lastInteractionTimeRef.current = Date.now();
                  }}
                  className={`text-left p-4 rounded-2xl border transition-all relative overflow-hidden flex flex-col h-full ${orderClass} ${
                    isSelected
                      ? 'bg-neutral-dark border-brand-blue-hover ring-2 ring-brand-blue-hover/60 shadow-xl'
                      : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  {/* Step status */}
                  <div className="mb-2">
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.color === 'bg-brand-green-neon' ? 'text-neutral-dark bg-brand-green-neon' : 'text-white bg-brand-blue'
                    }`}>
                      {item.step}
                    </span>
                  </div>

                  <strong className="text-sm font-bold block mb-1 text-white">{item.title}</strong>
                  <span className="text-[10px] text-neutral-muted">터치해서 상세 정보 조회</span>
                  
                  {isSelected && (
                    <>
                      <div className="absolute right-0 top-0 opacity-10 font-display font-black text-7xl translate-x-3 translate-y-3 pointer-events-none">
                        {React.cloneElement(item.icon as React.ReactElement, { size: '1em' })}
                      </div>
                      <div className="absolute right-2 bottom-2 text-brand-green-light">
                        <Sparkles size={14} className="animate-spin-slow" />
                      </div>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Selected Details Display Card (When not in raw state) */}
        {!showProcessRaw && (
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl text-left w-full animate-fade-in font-sans">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-brand-green-neon"></div>
              <strong className="text-xs text-brand-green-light font-bold">
                {steps[activeStep].step}
              </strong>
              <span className="text-xs font-extrabold text-white">
                {steps[activeStep].title} 세부 지원 내역
              </span>
            </div>
            
            <ul className="space-y-2">
              {steps[activeStep].details.map((detail, index) => (
                <li key={index} className="flex items-start gap-2 text-xs text-neutral-muted leading-relaxed">
                  <span className="text-brand-blue-light mt-1 shrink-0">✓</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* bottom subtext */}
        <div className="pt-6 border-t border-white/10 max-w-md mx-auto text-center space-y-1 flex flex-col items-center">
          <p className="text-brand-blue-light text-xs font-bold">🎯 불편하고 복잡한 청구절차는 이제 그만!</p>
          <h3 className="text-base font-extrabold text-white">청구지원서비스까지 함께 완벽하게 받아보세요</h3>
          
          <button className="relative z-10 mt-4 w-full max-w-[320px] mx-auto h-12 bg-white/15 hover:bg-white/25 text-white rounded-xl font-bold text-sm backdrop-blur-md border border-white/20 shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer">
            🔍 보험금 청구 조회
          </button>
        </div>
      </div>
    </section>
  );
}
