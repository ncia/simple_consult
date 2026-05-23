import React, { useState, useEffect } from 'react';
import { ShieldCheck, Sparkles, AlertTriangle, ArrowRight, UserCheck, PhoneCall, Download, RotateCcw, Landmark } from 'lucide-react';
import { InquiryFormState, CHECK_ITEMS } from '../types';

interface DiagnosticsReportProps {
  formData: InquiryFormState;
  onReset: () => void;
}

export function DiagnosticsReport({ formData, onReset }: DiagnosticsReportProps) {
  const [loadingStage, setLoadingStage] = useState(0);
  const [progress, setProgress] = useState(0);

  // Calculate age based on birthyear (e.g., 19850613)
  const getAge = (birthStr: string) => {
    if (!birthStr || birthStr.length < 4) return 38;
    const year = parseInt(birthStr.substring(0, 4), 10);
    if (isNaN(year)) return 38;
    return 2026 - year; // 2026 is current runtime year context
  };

  const calculatedAge = getAge(formData.birthdate);
  const userName = formData.name || '고객';

  const stages = [
    '29개 보험 전산 전력망 실시간 연결 중...',
    '본인 인증 기반 개인 보장 내역 호출 중...',
    '보장 중복 및 납입료 누출 알고리즘 연산 중...',
    '나이/성별 표준 대조 통계 시뮬레이션 적용 중...',
    '1:1 전담 분석사 매칭 및 리포트 작성 완료!'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const stageIndex = Math.min(Math.floor((progress / 100) * stages.length), stages.length - 1);
    setLoadingStage(stageIndex);
  }, [progress]);

  if (progress < 100) {
    return (
      <div className="py-20 px-5 text-center bg-white min-h-[500px] flex flex-col justify-center items-center space-y-6 font-sans">
        <div className="relative">
          {/* Circular Spinner */}
          <div className="w-24 h-24 rounded-full border-4 border-brand-blue-pale border-t-brand-blue animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-brand-blue font-bold">
            {progress}%
          </div>
        </div>

        <div className="space-y-2 max-w-sm">
          <h3 className="font-bold text-lg text-neutral-dark">가입 내역을 정밀 분석하고 있습니다</h3>
          <p className="text-xs text-brand-blue animate-pulse font-semibold">
            {stages[loadingStage]}
          </p>
          <p className="text-[10px] text-neutral-gray leading-normal">
            개인 식별 데이터는 정식 암호 보안 프로토콜을 통과하며 제3자에게 임의 양도되지 않습니다.
          </p>
        </div>
      </div>
    );
  }

  // Savings and simulated indicators based on user's selected chips
  const estimatedSavings = 100000 + (formData.selectedItems.length * 35000);
  const formattedSavings = estimatedSavings.toLocaleString('ko-KR');

  return (
    <div className="py-10 px-5 bg-neutral-bg animate-fade-in font-sans">
      <div className="max-w-[760px] mx-auto space-y-6">
        
        {/* Top Celebration */}
        <div className="bg-brand-blue text-white p-6 rounded-2xl text-center relative overflow-hidden shadow-xl shadow-brand-blue/10">
          <div className="absolute right-0 top-0 opacity-10 translate-x-4 translate-y-4">
            <ShieldCheck size={180} />
          </div>
          
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold">
              <Sparkles size={12} className="text-brand-green-light" />
              <span>실시간 자가 진단 보고서 작성 완료</span>
            </div>
            <h2 className="font-extrabold text-2xl">
              {calculatedAge}세 {userName}님<br />
              <span className="text-brand-green-light">보장 최적화 리포트</span>
            </h2>
            <p className="text-xs text-brand-blue-light max-w-xs mx-auto leading-relaxed">
              신청하신 동의 내역을 분석한 결과, 매월 상당 범위의 보험료 최적화 마진이 감지되었습니다.
            </p>
          </div>
        </div>

        {/* Savings Card */}
        <div className="bg-white border-2 border-brand-green-neon p-5 rounded-2xl shadow-md space-y-3">
          <span className="text-[10px] font-bold text-brand-green bg-brand-green-light/20 px-2.5 py-0.5 rounded-full uppercase">
            Estimated Monthly Savings
          </span>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs text-neutral-gray">진단 기준 가계 회생 추천액</p>
              <strong className="font-display font-black text-3xl text-brand-green">
                월 {formattedSavings}원 주택세이브
              </strong>
            </div>
            <span className="text-right text-[11px] font-bold text-brand-blue underline leading-normal">
              연간 { (estimatedSavings * 12).toLocaleString() }원 비축 가능
            </span>
          </div>
        </div>

        {/* Categorized Diagnoses based on selected items */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-border space-y-4">
          <h3 className="text-sm font-extrabold text-neutral-dark border-b border-neutral-border pb-2.5">
            선택하신 항목별 간이 진단 요약
          </h3>

          <div className="space-y-4.5">
            {formData.selectedItems.map((itemId) => {
              const matched = CHECK_ITEMS.find((c) => c.id === itemId);
              if (!matched) return null;

              // Generate tailored insights
              let advice = '정밀 조회를 통해 세부 누수 유무를 긴급 탐지할 주 상담 예정입니다.';
              let intensity: 'danger' | 'warning' | 'positive' = 'warning';

              if (matched.label === '숨은보험금') {
                advice = '조회 결과, 만기 미청약 고액 예치금 혹은 정산 과정 배당 환급금 의심 내역이 1건(최대 84,000원 상당) 있습니다. 유선 통화 시 본인 명의 수령 요령을 안내해 드립니다.';
                intensity = 'danger';
              } else if (matched.label === '보험료확인') {
                advice = `${calculatedAge}세 동연령 표준 표준 납입 중간값(평균 13만 원) 대비 약 22%가량 초과 부담 중인 것으로 진단됩니다. 과다 소멸 적립 이율 축소 조정이 필수적입니다.`;
                intensity = 'danger';
              } else if (matched.label === '내보험점검') {
                advice = '질병 3대 진단비(암·뇌·심) 지급 가입 특약 범위가 좁거나 보장 시기가 80세 만기로 설계되어 연장 수술비 보강 보정이 권장되는 패턴입니다.';
                intensity = 'warning';
              } else if (matched.label === '보험상품비교') {
                advice = '기존 대형사 대위 청약 구조를 다이렉트 무해지 통합 패키지로 재조합할 경우, 동일 수령 조건 기준 월 보장 비용을 최대 35% 즉시 다운시킬 수 있습니다.';
                intensity = 'warning';
              } else if (matched.label === '만기환급금') {
                advice = '만기 시 받는 환급금은 결국 본인이 낸 무이자의 과세 적립료입니다. 소멸형 저비용 상품으로 조정 후 남은 돈을 셀프 저축하는 구조가 100% 무조건 이득입니다.';
                intensity = 'positive';
              } else if (matched.label === '청구문의') {
                advice = '미청구 복잡 질병 서류 전산망 간편 누락 정리 서비스를 동의하셨습니다. 청구 전문 코디네이터가 3개년치 누적 진료비 내역을 무상 연계 지원 접수합니다.';
                intensity = 'positive';
              }

              return (
                <div key={itemId} className="p-4 rounded-xl bg-neutral-bg border border-neutral-border flex gap-3">
                  <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                    intensity === 'danger' ? 'bg-red-50 text-red-500' :
                    intensity === 'warning' ? 'bg-yellow-50 text-yellow-600' : 'bg-brand-blue-pale text-brand-blue'
                  }`}>
                    {intensity === 'danger' ? '!' : intensity === 'warning' ? '?' : '✓'}
                  </div>
                  <div className="space-y-1">
                    <strong className="text-sm font-bold block text-neutral-dark">
                      {matched.label} 진단 결과
                    </strong>
                    <p className="text-xs text-neutral-gray leading-relaxed text-slate-700">
                      {advice}
                    </p>
                  </div>
                </div>
              );
            })}

            {formData.selectedItems.length === 0 && (
              <p className="text-xs text-neutral-muted text-center py-4">
                선택하신 특정 진단 세부 항목이 없어 종합 다이렉트 솔루션을 기반으로 점검 포트폴리오를 작성합니다.
              </p>
            )}
          </div>
        </div>

        {/* Assigned Agent Card */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-border space-y-4 font-sans">
          <h3 className="text-sm font-extrabold text-neutral-dark border-b border-neutral-border pb-2">
            1:1 지정 보장 설계사 매칭 정보
          </h3>
          
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-brand-blue shadow bg-brand-blue-pale flex items-center justify-center font-display font-bold text-brand-blue">
              AZ
            </div>
            <div className="space-y-1 my-auto">
              <div>
                <strong className="text-sm text-neutral-dark">민인환 수석분석사</strong>
                <span className="text-[10px] ml-1.5 text-brand-blue font-bold tracking-wider">
                  (주)에즈금융 보장컨설팅 소속
                </span>
              </div>
              <p className="text-xs text-neutral-gray">
                협회공인 보험대리점 등록번호: <strong className="text-neutral-dark">제2012118012호</strong>
              </p>
              <div className="flex gap-2">
                <span className="text-[9px] bg-brand-blue-pale text-brand-blue font-bold px-1.5 py-0.5 rounded">
                  ★ 우수품질인증 (2024~2026)
                </span>
                <span className="text-[9px] bg-brand-green-light/20 text-brand-green font-bold px-1.5 py-0.5 rounded">
                  고객만족율 98%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-brand-blue-pale text-brand-blue-dark p-3 rounded-xl border border-brand-blue-light/50 text-xs leading-relaxed flex items-center gap-2">
            <PhoneCall size={16} className="shrink-0 text-brand-blue" />
            <p>
              영업일 기준 **24시간 이내**에 담당자 유선전화 등을 통해 종합 무상 상담 안내 및 맞춤 파일 파일 발송 일정이 연락될 예정입니다. 안심 편의 전화 보장!
            </p>
          </div>
        </div>

        {/* Dynamic Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onReset}
            className="flex-1 h-14 bg-white border border-neutral-border font-semibold text-xs text-neutral-gray hover:text-neutral-dark rounded-xl flex items-center justify-center gap-1.5 transition-all"
          >
            <RotateCcw size={14} />
            <span>신청 정보 수정하기</span>
          </button>
          
          <button
            onClick={() => alert('PDF 생성 시뮬레이션: "InsureAnalysis_보장진단_리포트.pdf" 파일 다운로드 대기열에 추가되었습니다.')}
            className="flex-1 h-14 bg-brand-blue text-white hover:bg-brand-blue-hover font-bold text-xs rounded-xl shadow-lg shadow-brand-blue/10 flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <Download size={14} />
            <span>PDF 소장본 예약하기</span>
          </button>
        </div>

      </div>
    </div>
  );
}
