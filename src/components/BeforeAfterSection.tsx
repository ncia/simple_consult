import React, { useState } from 'react';
import { ArrowDown, Check, Coins, TrendingDown, BadgeAlert, Sparkles, Image as ImageIcon, Eye } from 'lucide-react';

export function BeforeAfterSection() {
  const [activeTab, setActiveTab] = useState<'before' | 'after'>('after');
  const [showRawImages, setShowRawImages] = useState(false);

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
                ? 'bg-white shadow-sm text-red-600'
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

        {/* Mode Toggle Layout */}
        <div className="flex justify-end w-full">
          <button
            onClick={() => setShowRawImages(!showRawImages)}
            className="flex items-center gap-1.5 text-xs text-brand-blue hover:underline bg-brand-blue-pale px-3 py-1.5 rounded-lg font-semibold transition"
          >
            {showRawImages ? <Eye size={12} /> : <ImageIcon size={12} />}
            <span>{showRawImages ? '상세분석 진단표 보기' : '원본 홍보 이미지 보기'}</span>
          </button>
        </div>

        {/* Comparison Display */}
        <div className="w-full">
          {showRawImages ? (
            /* Render official hotlinked images requested by the user */
            <div className="space-y-4 animate-fade-in">
              <p className="text-[11px] text-neutral-muted italic">
                ※ 실제 광고 페이지에 활용된 원본 이미지를 원터치로 감상하실 수 있습니다.
              </p>
              {activeTab === 'before' ? (
                <div className="border border-neutral-border rounded-2xl overflow-hidden shadow-lg hover:scale-[1.01] transition-transform">
                  <img
                    src="https://lh3.googleusercontent.com/aida/ADBb0uhxktfMkmWU6jvPTviqevZMeBWwFX2AXX0LR2Vk_Wp6ROz236OrPdFwXGV2c6YvPg35pGIIKMfzxqTXb7FN399X0tnBJie7EmBYugaQ8F7SYzE-LwUXfitS0KB5DkqG4696kadD-ILmICIrFYBc4nFabpwuhLFmqvWGMvnFr9-T09PvPmL_rqn06x8887EX83FvCKd2kYur8OeUk3Ny728pbNhAX8k0qiZ76gMFNFIJ8WLALAtE9wM"
                    alt="보험분석 Before 원본 이미지"
                    className="w-full h-auto object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div className="border-4 border-brand-blue rounded-2xl overflow-hidden shadow-xl hover:scale-[1.01] transition-transform">
                  <img
                    src="https://lh3.googleusercontent.com/aida/ADBb0ugGkO8KUUEBxTSw0nTfUKv3ec_ceMXFlqHo5pCcAvhaKmuE-Nq9kB52UqqCKeX_boLE0-o7-pngLErIQa1ZgTFkCLmUZpi0_cM5vM90t7uplVLlRCYHSh8hi9HqvANsjX7s52G5oKGJE04WFnt5edPWS6MzSUi69WFT4qjwZkHBNM6PLrf_1j0J5XIS37u506g_YaPpOoc_t3LgFUkUFGa31iDImzi2DAhgLfnTMm8sbRTvGwIPF9bM"
                    alt="보험분석 After 원본 이미지"
                    className="w-full h-auto object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
            </div>
          ) : (
            /* Premium Styled Diagnostic Interactive Visualizations */
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
                        기존 보험 가입
                      </span>
                      <p className="font-display font-black text-2xl text-red-600 mt-1">459,000원</p>
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
                      { name: 'A사 실비보험', price: '36,000원', tag: '중복 가입 누수', bad: true },
                      { name: 'B사 암보험', price: '51,500원', tag: '보장 범위 부족(소액암 미달)', bad: true },
                      { name: 'C사 건강보험', price: '130,000원', tag: '불필요 고액 적립료 포함', bad: true },
                      { name: 'D사 운전자보험', price: '23,500원', tag: '민사 벌금 한도 미정비', bad: true },
                      { name: 'E사 변액보험', price: '200,000원', tag: '원금 손실 방치 / 정기이율 미비', bad: true },
                      { name: 'F사 운전자보험', price: '18,000원', tag: 'D사 중복 가입 쓰레기 특약', bad: true },
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs pb-2 border-b border-dashed border-neutral-border/60">
                        <div>
                          <strong className="text-neutral-dark text-sm block">{item.name}</strong>
                          <span className="text-[10px] text-red-500 font-semibold">{item.tag}</span>
                        </div>
                        <span className="font-display font-extrabold text-neutral-dark">{item.price}</span>
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
                        설계 리밸런싱 After
                      </span>
                      <p className="font-display font-black text-3xl text-white mt-1">156,692원</p>
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
                    <strong className="font-display font-black text-sm">302,308원 절감 (-65.8%)</strong>
                  </div>

                  {/* List of optimized items */}
                  <p className="text-xs font-bold text-neutral-dark border-b border-neutral-border pb-2">
                    최적화 결과 맞춤 포트폴리오
                  </p>
                  <div className="space-y-2.5">
                    {[
                      { name: 'G사 실비보험', price: '16,210원', action: '상품변경', desc: '과도한 미 청약 세대 실손에서 합리적인 신실손 이동' },
                      { name: 'B사 암보험', price: '51,982원', action: '필요보장추가', desc: '납입은 다운시키고 전이 부위까지 특별 특약 보강 완료' },
                      { name: 'C사 건강보험', price: '70,180원', action: '적립보험료제거', desc: '소멸성 중심 세팅으로 만기 무의미한 저축료 전면 적출' },
                      { name: 'D사 운전자보험', price: '18,320원', action: '중복보장제거', desc: '벌금 형사 합의금 합법 한도 맥스 정비 및 중복 해약' },
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
                      불필요 변액 자산을 해약 및 통합하여 자산 안정을 잡았습니다. <strong>체험 특화 리밸런싱</strong>을 통해 매월 약 30만 원 상당의 가계부 유동성을 영구 회생했습니다!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Helper Note */}
        <div className="p-3.5 rounded-lg bg-neutral-bg text-center w-full">
          <p className="text-[10px] text-neutral-muted leading-relaxed">
            * 해당 내용은 고객의 이해를 돕기 위한 보장 제안 시뮬레이션 예시로 고객님의 성별, 연령, 직종, 질병 이력 및 보유 이력에 따라 진단 결과와 절감액은 달라질 수 있습니다.
          </p>
        </div>
      </div>
    </section>
  );
}
