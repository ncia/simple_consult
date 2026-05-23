import React from 'react';
import { X, ShieldAlert, Check } from 'lucide-react';

interface AgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: 'privacy' | 'marketing' | 'terms';
}

export function AgreementModal({ isOpen, onClose, title, type }: AgreementModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-neutral-border flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-neutral-bg px-5 py-4 border-b border-neutral-border flex justify-between items-center">
          <div className="flex items-center gap-2 text-brand-blue">
            <ShieldAlert size={18} />
            <h3 className="font-sans font-bold text-sm text-neutral-dark">{title}</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-neutral-border text-neutral-gray transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-neutral-gray leading-relaxed font-sans">
          {type === 'privacy' && (
            <>
              <p className="font-bold text-neutral-dark text-sm">개인정보 수집 및 이용 동의 (필수사항)</p>
              <p>본 서비스는 원활한 보험 보장 분석 서비스 신청 및 전문가 맞춤형 상담의 이행을 위해 아래와 같은 개인정보를 수집하고 있습니다.</p>
              
              <div className="bg-neutral-bg p-3 rounded-lg border border-neutral-border space-y-1.5">
                <p><strong>1. 수집 항목:</strong> 이름, 성별, 생년월일, 휴대전화번호, 점검 희망 항목 목록</p>
                <p><strong>2. 수집 목적:</strong> 본인 확인 절차 이행, 가입 보험 점검 분석 리포트 생성 및 전면 전송, 전문 카운슬러 매칭 및 비대면/대면 유선 상담 제공</p>
                <p><strong>3. 보유 및 이용 기간:</strong> <span className="text-brand-blue font-bold">수집 시점으로부터 1년</span> (또는 고객의 철회 요청 시까지 즉시 파기)</p>
              </div>

              <p>※ 고객님은 본 동의를 거부할 권리가 있으나, 거부 시 본인 동의에 기반한 모바일 보험 보장 점검 및 전문 분석 컨설팅 서비스 이용이 전면 불가합니다.</p>
            </>
          )}

          {type === 'marketing' && (
            <>
              <p className="font-bold text-neutral-dark text-sm">마케팅 정보 및 혜택 수신 동의 (선택사항)</p>
              <p>에즈금융서비스가 제공하는 신규 보험 상품 소개, 미 청구 보험금 찾기 긴급 알림, 세미나 초청 및 각종 할인 쿠폰/이벤트 혜택 정보를 수신하는 것에 동의합니다.</p>
              
              <div className="bg-neutral-bg p-3 rounded-lg border border-neutral-border space-y-1.5">
                <p><strong>1. 전송 채널:</strong> 휴대폰 문자메시지 (SMS/LMS), 알림톡, 유선 통화</p>
                <p><strong>2. 동의철회 방법:</strong> 고객센터(02-2038-8603) 유선 유선 연락을 통한 수신 전면 거부 등록</p>
                <p><strong>3. 보유 기간:</strong> 동의일로부터 1년 혹은 수신 동의 전면 철회 시 즉시 삭제</p>
              </div>

              <p>※ 본 동의는 선택 사항이며, 동의하지 않으셔도 주요 기본 가입 보험 분석 결과 확인 및 상담 서비스는 완전하게 동일하게 이용 가능합니다.</p>
            </>
          )}

          {type === 'terms' && (
            <>
              <p className="font-bold text-neutral-dark text-sm">InsureAnalysis 서비스 이용 만족 협약</p>
              <p>InsureAnalysis에서 제공하는 점검 및 가상 견적 리포트는 29개 보험사 공개 수식에 준거해 산출된 리포트입니다.</p>
              
              <ul className="list-disc pl-4 space-y-1">
                <li>본 서비스의 진단과 통계는 참고용이며, 상세 질병 이력이나 인수 심사 조건에 의거하여 공식 청약 시 최종 보험금 및 상품 금액이 변경될 수 있습니다.</li>
                <li>기존 계약을 도중에 중도 해약 및 전환하실 경우 이율 손실이나 특정 제한이 따를 수 있는 점 숙지 부탁드립니다.</li>
                <li>청결하고 친절한 상담 품질 보증을 위해 모든 유선 통화는 고객 동의 하에 안심녹취가 권장될 수 있습니다.</li>
              </ul>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-border flex justify-end bg-neutral-bg gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-brand-blue text-white font-semibold text-xs rounded-xl shadow-md shadow-brand-blue/10 hover:bg-brand-blue-hover active:scale-95 transition-all flex items-center gap-1"
          >
            <Check size={12} />
            <span>확인했습니다</span>
          </button>
        </div>
      </div>
    </div>
  );
}
