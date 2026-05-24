import React, { useState } from 'react';
import { ArrowDown, Check, Coins, TrendingDown, BadgeAlert, Sparkles, Image as ImageIcon, Eye } from 'lucide-react';

export function BeforeAfterSection() {
  const [activeTab, setActiveTab] = useState<'before' | 'after'>('after');


  return (
    <section className="py-14 px-5 bg-white border-y border-neutral-border">
      <div className="max-w-[768px] mx-auto text-center space-y-6">
        <div>
          <span className="text-brand-blue bg-brand-blue-pale text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Optimized Clinic
          </span>
          <h2 className="font-sans font-bold text-2xl text-neutral-dark mt-2 flex items-center justify-center gap-1.5">
            <span className="text-3xl">✨</span> 보험분석, 극적인 변화
          </h2>
          <p className="text-xs text-neutral-gray mt-1">
            중복 가입으로 비싸게 지불하던 기존 구성을 실속 패키지로 바꾼 설계 예시입니다.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-neutral-bg p-1.5 rounded-2xl max-w-[340px] mx-auto border border-neutral-border">
          <button
            onClick={() => setActiveTab('before')}
            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'before'
                ? 'bg-red-600 shadow-sm text-white'
                : 'text-neutral-gray hover:text-neutral-dark'
            }`}
          >
            보험분석 전 기존보험
          </button>
          <button
            onClick={() => setActiveTab('after')}
            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'after'
                ? 'bg-brand-blue shadow-sm text-white'
                : 'text-neutral-gray hover:text-neutral-dark'
            }`}
          >
            보험분석 후 추천플랜
          </button>
        </div>

        {/* Comparison Display */}
        <div className="w-full">
            <div 
              className="grid cursor-pointer w-full text-left animate-fade-in font-sans [perspective:1500px]"
              onClick={() => setActiveTab(activeTab === 'before' ? 'after' : 'before')}
            >
              {/* Before Card */}
              <div 
                className={`col-start-1 row-start-1 w-full transition-transform duration-700 ease-in-out [transform-style:preserve-3d] [backface-visibility:hidden] ${activeTab === 'before' ? '[transform:rotateY(0deg)] z-10' : '[transform:rotateY(180deg)] z-0 pointer-events-none'}`}
              >
                <div className="bg-white border-2 border-red-200 shadow-md rounded-2xl p-6 space-y-4 h-full hover:shadow-lg transition-shadow">
                  {/* Summary Box */}
                  <div className="flex justify-between items-center bg-red-50 p-4 rounded-xl border border-red-100">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-red-500 bg-red-100 px-2 py-0.5 rounded-full">
                        보험분석 전
                      </span>
                      <p className="font-display font-black text-2xl text-red-600 mt-1">480,300원</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-neutral-gray block">가입건수</span>
                      <strong className="text-neutral-dark text-base font-extrabold">총 6건</strong>
                    </div>
                  </div>

                  {/* List of leak items */}
                  <p className="text-xs font-bold text-neutral-dark border-b border-neutral-border pb-2">
                    지출 내역 진단 결과
                  </p>
                  <div className="space-y-2.5">
                    {[
                      { name: 'A사 실비보험', price: '38,500원', badge: '중복 가입 누수', desc: '다른 보험과 보장이 겹쳐 불필요한 보험료가 지출되고 있습니다.' },
                      { name: 'B사 암보험', price: '54,200원', badge: '보장 범위 부족', desc: '가장 빈번한 소액암에 대한 보장 한도가 크게 미달됩니다.' },
                      { name: 'C사 건강보험', price: '135,000원', badge: '고액 적립료', desc: '소멸성 대비 무의미하고 비싼 적립 보험료가 포함되어 있습니다.' },
                      { name: 'D사 운전자보험', price: '25,100원', badge: '한도 미정비', desc: '강화된 법률에 맞지 않는 민사 벌금 한도로 위험이 존재합니다.' },
                      { name: 'E사 변액보험', price: '210,000원', badge: '원금 손실', desc: '낮은 정기이율과 원금 손실 방치로 투자 가치가 떨어집니다.' },
                      { name: 'F사 운전자보험', price: '17,500원', badge: '중복 특약', desc: 'D사 운전자보험과 완전히 중복되는 불필요한 특약입니다.' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start text-xs pb-2 border-b border-dashed border-neutral-border/60">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <strong className="text-neutral-dark text-sm block">{item.name}</strong>
                            <span className="text-[9px] text-red-600 bg-red-100 font-bold px-1.5 py-0.5 rounded">
                              {item.badge}
                            </span>
                          </div>
                          <span className="text-[10px] text-neutral-gray leading-normal">{item.desc}</span>
                        </div>
                        <span className="font-display font-extrabold text-neutral-dark text-sm shrink-0">{item.price}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-red-50/50 p-3.5 rounded-xl border border-red-100/80 flex items-start gap-2">
                    <BadgeAlert size={16} className="text-red-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-800 leading-normal">
                      보험료가 과하게 책정되어 있으며, 실비와 운전자보험이 <strong>불필요하게 중복 가입</strong>되어 매월 소중한 생활 캐시가 불필요하게 낭비되는 원인입니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* After Card */}
              <div 
                className={`col-start-1 row-start-1 w-full transition-transform duration-700 ease-in-out [transform-style:preserve-3d] [backface-visibility:hidden] ${activeTab === 'after' ? '[transform:rotateY(0deg)] z-10' : '[transform:rotateY(-180deg)] z-0 pointer-events-none'}`}
              >
                <div className="bg-neutral-bg border-2 border-brand-blue shadow-lg rounded-2xl p-6 space-y-4 h-full hover:shadow-xl transition-shadow">
                  {/* Summary Box */}
                  <div className="flex justify-between items-center bg-brand-blue text-white p-5 rounded-xl shadow-inner relative overflow-hidden">
                    <div className="absolute right-0 top-0 opacity-10 font-display font-black text-7xl translate-x-3 translate-y-3">
                      SA
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-brand-green-light bg-neutral-dark/40 px-2 py-0.5 rounded-full">
                        보험 분석 후
                      </span>
                      <p className="font-display font-black text-3xl text-white mt-1">162,250원</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-brand-blue-light block">남은 계약</span>
                      <strong className="text-lg font-extrabold text-brand-green-light">총 4건</strong>
                    </div>
                  </div>

                  {/* Saving Banner */}
                  <div className="bg-brand-green-neon text-white px-4 py-3 rounded-xl flex justify-between items-center shadow-md shadow-brand-green/10 animate-bounce">
                    <div className="flex items-center gap-1.5">
                      <Coins size={14} />
                      <span className="text-xs font-bold">매월 세이브 가능한 가계소득</span>
                    </div>
                    <strong className="font-display font-black text-sm">318,050원 절감 (-66.2%)</strong>
                  </div>

                  {/* List of optimized items */}
                  <p className="text-xs font-bold text-neutral-dark border-b border-neutral-border pb-2">
                    최적화 결과 맞춤 포트폴리오
                  </p>
                  <div className="space-y-2.5">
                    {[
                      { name: 'G사 실비보험', price: '17,450원', action: '상품변경', desc: '과도한 미 청약 세대 실손에서 합리적인 신실손 이동' },
                      { name: 'B사 암보험', price: '53,100원', action: '필요보장추가', desc: '납입은 다운시키고 전이 부위까지 특별 특약 보강 완료' },
                      { name: 'C사 건강보험', price: '72,500원', action: '적립보험료제거', desc: '소멸성 중심 세팅으로 만기 무의미한 저축료 전면 적출' },
                      { name: 'D사 운전자보험', price: '19,200원', action: '중복보장제거', desc: '벌금 형사 합의금 합법 한도 맥스 정비 및 중복 해약' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start text-xs pb-2 border-b border-dashed border-neutral-border/60">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <strong className="text-neutral-dark text-sm block">{item.name}</strong>
                            <span className="text-[9px] text-white bg-brand-green-neon font-bold px-1.5 py-0.5 rounded">
                              {item.action}
                            </span>
                          </div>
                          <span className="text-[10px] text-neutral-gray leading-normal">{item.desc}</span>
                        </div>
                        <span className="font-display font-extrabold text-brand-blue text-sm shrink-0">{item.price}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-brand-blue-pale p-3.5 rounded-xl border border-brand-blue-light flex items-start gap-2">
                    <Check size={16} className="text-brand-blue shrink-0 mt-0.5" />
                    <p className="text-xs text-brand-blue-dark leading-normal">
                      보험 리모델링을 통해 매월 약 31만원 상당의 보험료 절감하면서 필요한 핵심 보장은 든든하게 점검해 드렸습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </section>
  );
}
