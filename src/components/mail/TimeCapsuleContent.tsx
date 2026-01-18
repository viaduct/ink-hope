import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TimeCapsuleContentProps {
  onClose: () => void;
}

// 목업 데이터 - 등록된 수신자 기반 타임캡슐
const mockCapsules = [
  {
    id: 1,
    recipientName: "서은우",
    tags: ["출소 축하"],
    daysLeft: 180,
    daysLeftLabel: "전달까지 180일 남았습니다",
    collectingDays: 3,
    collectingDaysLabel: "3일 뒤",
    status: "collecting", // collecting, delivered
  },
];

export function TimeCapsuleContent({ onClose }: TimeCapsuleContentProps) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const canNavigate = mockCapsules.length > 1;

  const handlePrev = () => {
    if (!canNavigate) return;
    setCurrentIndex((prev) => (prev === 0 ? mockCapsules.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (!canNavigate) return;
    setCurrentIndex((prev) => (prev === mockCapsules.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
      {/* Header - 간소화 */}
      <header className="h-14 border-b border-border/40 bg-white flex items-center justify-between px-4">
        <h1 className="text-lg font-bold text-foreground">타임캡슐</h1>
        <button onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          편지함
        </button>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-12 lg:px-6">

          {/* 타이틀 섹션 */}
          <section className="text-center mb-12">
            <p
              className="text-[#ff7430] text-[18px] font-bold tracking-[1.8px] uppercase mb-2"
              style={{ fontFamily: 'Anonymous Pro, monospace' }}
            >
              Time Capsule
            </p>
            <p className="text-[#525252] text-[20px] font-normal leading-[1.5] mb-1">
              한 사람을 위해, 여러 사람들이 모여
            </p>
            <h1 className="text-black text-[28px] font-semibold leading-[1.4]">
              특별한 날에 타임캡슐을 전달해요.
            </h1>
          </section>

          {/* 타임캡슐 카드 캐러셀 */}
          {mockCapsules.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center justify-center gap-4">
                {/* 왼쪽 화살표 */}
                <button
                  onClick={handlePrev}
                  disabled={!canNavigate}
                  className={`p-2 transition-all ${
                    canNavigate
                      ? "text-[#666] hover:text-[#ff7430]"
                      : "text-gray-300 cursor-not-allowed"
                  }`}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                {/* 카드 */}
                <div className="relative p-4">
                  <AnimatePresence mode="wait">
                    {mockCapsules.map((capsule, index) => (
                      index === currentIndex && (
                        <motion.div
                          key={capsule.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          whileHover={{ y: -4, boxShadow: "0px 4px 50px 0px rgba(255, 116, 48, 0.25)" }}
                          onClick={() => navigate(`/time-capsule/${capsule.id}`)}
                          className="relative w-[290px] bg-white border border-[#f8f8f8] rounded-[20px] shadow-[0px_1px_40px_0px_rgba(0,0,0,0.09)] px-5 py-[30px] cursor-pointer transition-shadow"
                        >
                          {/* 예시카드 배지 */}
                          <span className="absolute top-3 right-3 text-[10px] text-[#666] bg-[#f0f0f0] px-1.5 pt-0.5 pb-[5px] rounded">
                            예시카드
                          </span>

                          {/* D-Day & Message */}
                          <div className="flex gap-3 items-start">
                            <div className="bg-[#ff7430] rounded-[4px] px-2 py-1.5 flex flex-col items-center justify-center flex-shrink-0">
                              <span className="text-white text-[12px] font-bold leading-normal">{capsule.collectingDaysLabel}</span>
                              <span className="text-white text-[12px] font-bold leading-normal" style={{ fontFamily: 'Paperlogy, sans-serif' }}>
                                D-{capsule.collectingDays}
                              </span>
                            </div>
                            <p className="text-[#3d3d3d] text-[13px] font-medium leading-[1.5] tracking-[-0.26px] flex-1">
                              곧 마음이 모이는 날이에요.<br />
                              지금부터 천천히 적어도 괜찮아요
                            </p>
                          </div>

                          {/* Capsule Image */}
                          <div className="relative w-[196px] h-[207px] mx-auto my-2">
                            <img
                              src="/timecapsule-orange.png"
                              alt="타임캡슐"
                              className="w-full h-full object-contain"
                            />
                            {/* 하단 그라데이션 페이드 */}
                            <div className="absolute bottom-0 left-0 right-0 h-[40px] bg-gradient-to-t from-white to-transparent" />
                          </div>

                          {/* Recipient & Tags */}
                          <div className="flex flex-col gap-[14px]">
                            <p className="text-[#010101] text-[22px] font-semibold tracking-[-0.44px] leading-[1.4]">
                              To. <span className="font-bold">{capsule.recipientName}</span>
                            </p>
                            <div className="flex gap-1 flex-wrap">
                              {capsule.tags.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="bg-[#fdf3e3] text-[#ff7430] text-[12px] px-2.5 py-1 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                              <span className="bg-[#fdf3e3] text-[#ff7430] text-[12px] px-2.5 py-1 rounded-full">
                                {capsule.daysLeftLabel}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )
                    ))}
                  </AnimatePresence>
                </div>

                {/* 오른쪽 화살표 */}
                <button
                  onClick={handleNext}
                  disabled={!canNavigate}
                  className={`p-2 transition-all ${
                    canNavigate
                      ? "text-[#666] hover:text-[#ff7430]"
                      : "text-gray-300 cursor-not-allowed"
                  }`}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* 페이지 인디케이터 (2개 이상일 때만) */}
              {canNavigate && (
                <div className="flex justify-center gap-2 mt-4">
                  {mockCapsules.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentIndex ? "bg-[#ff7430] w-4" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* 타임캡슐이 없을 때 빈 상태 카드 */}
          {mockCapsules.length === 0 && (
            <section className="mb-12">
              <div className="flex flex-col items-center">
                <div className="w-[290px] bg-white border border-[#f8f8f8] rounded-[20px] shadow-[0px_1px_40px_0px_rgba(0,0,0,0.09)] px-5 py-[30px]">
                  {/* D-Day & Message */}
                  <div className="flex gap-3 items-start">
                    <div className="bg-gray-300 rounded-[4px] px-2 py-1.5 flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-white text-[12px] font-bold leading-normal">?일 뒤</span>
                      <span className="text-white text-[12px] font-bold leading-normal">D-?</span>
                    </div>
                    <p className="text-[#3d3d3d] text-[13px] font-medium leading-[1.5] tracking-[-0.26px] flex-1">
                      아직 타임캡슐이 없어요.<br />
                      특별한 날을 위해 만들어보세요
                    </p>
                  </div>

                  {/* Empty Capsule Image */}
                  <div className="relative w-[196px] h-[207px] mx-auto my-2 opacity-50">
                    <img
                      src="/timecapsule-orange.png"
                      alt="타임캡슐"
                      className="w-full h-full object-contain grayscale"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-[40px] bg-gradient-to-t from-white to-transparent" />
                  </div>

                  {/* 안내 텍스트 */}
                  <div className="text-center">
                    <p className="text-[#010101] text-[18px] font-semibold mb-1">타임캡슐을 만들어보세요</p>
                    <p className="text-[#808080] text-[13px]">소중한 사람을 위한 마음을 모아보세요</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 하단 CTA 섹션 */}
          <section className="flex flex-col items-center gap-[15px]">
            <Button
              onClick={() => navigate("/time-capsule/create")}
              className="w-full max-w-[290px] bg-[#ff7512] hover:bg-[#ff6b24] text-white text-[16px] font-semibold leading-[1.5] px-8 py-2.5 rounded-[27px] h-auto"
            >
              + 새 타임캡슐 생성하기
            </Button>
            <p className="text-[#808080] text-[15px] text-center leading-[1.7]">
              의미 있는 그 날을 위해, 지금부터 타임캡슐을 만들어 둘 수 있어요.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
