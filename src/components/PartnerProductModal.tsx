import React from 'react';
import { X, Landmark, BadgePercent, Sparkles, TrendingUp, CalendarDays } from 'lucide-react';
import { PartnerCompany } from '../types';

interface PartnerProductModalProps {
  partner: PartnerCompany | null;
  onClose: () => void;
}

export function PartnerProductModal({ partner, onClose }: PartnerProductModalProps) {
  if (!partner) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-neutral-border flex flex-col">
        {/* Header with Blue/Green matching the type of insurance */}
        <div className={`p-5 text-white ${
          partner.type === 'life' ? 'bg-brand-blue' : 'bg-brand-green'
        } flex justify-between items-center relative overflow-hidden`}>
          <div className="absolute right-0 top-0 opacity-10 translate-x-3 translate-y-2">
            <Landmark size={80} />
          </div>
          <div className="relative z-10 space-y-1">
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
              {partner.type === 'life' ? '우수 생명보험사협약' : '신뢰 손해보험사협약'}
            </span>
            <h3 className="font-bold text-lg">{partner.name}화재/생명 추천 상품</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-white relative z-20 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Product specs */}
        <div className="p-6 space-y-4">
          <div className="space-y-1">
            <span className="text-neutral-muted text-[11px] block">공식 추천 우수 상품</span>
            <strong className="text-neutral-dark text-base font-extrabold flex items-center gap-1.5">
              <Sparkles size={16} className="text-yellow-500" />
              {partner.bestProduct}
            </strong>
          </div>

          <div className="p-4 bg-neutral-bg rounded-xl border border-neutral-border space-y-2">
            <p className="text-xs text-neutral-medium leading-relaxed">
              {partner.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-brand-blue-pale/50 rounded-xl border border-brand-blue-light/30">
              <span className="text-neutral-muted text-[10px] block">예상 성인 평균 금액</span>
              <strong className="text-brand-blue font-display text-sm font-black mt-1 block">
                {partner.avgPremium}
              </strong>
            </div>
            <div className="p-3 bg-brand-green-light/10 rounded-xl border border-brand-green/10">
              <span className="text-neutral-muted text-[10px] block">동종업계 평균 할인율</span>
              <strong className="text-brand-green font-display text-sm font-black mt-1 block">
                최대 -15%
              </strong>
            </div>
          </div>

          <div className="p-3.5 bg-yellow-50/60 rounded-xl border border-yellow-200/50 flex gap-2 items-start text-xs text-yellow-800 leading-normal">
            <BadgePercent size={18} className="shrink-0 text-yellow-600 mt-0.5" />
            <p>
              * InsureAnalysis 연계 상담 시 중복 특약 정리 가이드를 받으시면 <strong>이중 보험료 누출 없이 정식 가입</strong>이 직접 지원됩니다.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-neutral-bg border-t border-neutral-border flex gap-2">
          <button
            onClick={onClose}
            className="w-full h-11 bg-neutral-dark hover:bg-neutral-medium text-white font-bold text-xs rounded-xl transition-all"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
