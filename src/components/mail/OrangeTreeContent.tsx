import { useState } from "react";
import { ChevronLeft, ChevronRight, Sun } from "lucide-react";
import { AddRecipientModal } from "./AddRecipientModal";

// 담장 패턴 컴포넌트
const WallPattern = () => (
  <div className="absolute inset-0 opacity-[0.66] overflow-hidden">
    {[...Array(6)].map((_, rowIdx) => (
      <div
        key={rowIdx}
        className={`flex gap-[11px] items-center ${rowIdx % 2 === 0 ? 'justify-end' : ''} mb-4`}
      >
        {[...Array(12)].map((_, colIdx) => (
          <div
            key={colIdx}
            className="w-[112px] h-[47px] bg-[rgba(243,226,212,0.58)] border border-[rgba(243,226,212,0.71)] rounded-[4px] flex-shrink-0"
          />
        ))}
      </div>
    ))}
  </div>
);

interface OrangeTreeContentProps {
  onClose: () => void;
  onCompose?: () => void;
}

export function OrangeTreeContent({ onClose, onCompose }: OrangeTreeContentProps) {
  const [showAddRecipientModal, setShowAddRecipientModal] = useState(false);

  // 스케줄 태그 데이터 (예시)
  const scheduleTags = [
    { dDay: "D+20", label: "변호사접견" },
    { dDay: "D+14", label: "출소일" },
    { dDay: "D+3", label: "생일" },
  ];

  return (
    <div className="relative w-full h-full min-h-screen bg-[#FFFDF6] overflow-hidden flex flex-col">
      {/* 상단 네비게이션 */}
      <div className="absolute top-6 left-6 flex items-center gap-4 z-20">
        <button className="p-1 hover:bg-black/5 rounded-lg transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        <button className="p-1 hover:bg-black/5 rounded-lg transition-colors">
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* 오늘의 날씨 */}
      <div className="absolute top-6 right-6 flex items-center gap-2 z-20">
        <span className="text-xs text-orange-500 bg-[#FFDFAD] px-2 py-0.5 rounded-full">
          오늘의 날씨
        </span>
        <span className="text-sm">
          <span className="text-orange-500 font-medium">23°</span>
          <span className="text-orange-500 text-xs">(최고)</span>
          {" "}
          <span className="text-gray-500">10°</span>
          <span className="text-gray-500 text-xs">(최저)</span>
        </span>
        <Sun className="w-[18px] h-[18px] text-orange-400" />
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 flex flex-col items-center justify-start pt-[90px] px-6 relative z-10">
        {/* 타이틀 섹션 */}
        <div className="text-center max-w-[515px] space-y-6">
          {/* 나의 ? 오렌지 나무 */}
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-[24px] text-[#4A2E1B] tracking-[-0.48px]" style={{ fontFamily: "'JejuMyeongjo', serif" }}>
              나의
            </span>
            <button
              onClick={() => setShowAddRecipientModal(true)}
              className="w-[101px] h-[42px] border-2 border-[#875E42] rounded-[2px] flex items-center justify-center hover:bg-[#875E42]/5 transition-colors"
            >
              <span className="text-[24px] text-[#4A2E1B]" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                ?
              </span>
            </button>
            <span className="text-[24px] text-[#4A2E1B] tracking-[-0.48px]" style={{ fontFamily: "'JejuMyeongjo', serif" }}>
              오렌지 나무
            </span>
          </div>

          {/* 설명 문구 */}
          <div className="text-[16px] text-[#4A2E1B] tracking-[-0.32px] leading-[1.8] space-y-4" style={{ fontFamily: "'JejuMyeongjo', serif" }}>
            <p>
              "이 나무는 한 사람을 기다리는 마음에서 시작되었습니다."<br />
              오렌지 나무는 주고받은 마음이 이어져 온 시간과 흔적을 조용히 남깁니다.
            </p>
            <p>
              아직 편지를 써보지 않았다면,<br />
              수신자 등록만 미리 해봐도 괜찮아요.
            </p>
          </div>
        </div>
      </div>

      {/* 담장 배경 */}
      <div className="absolute left-0 right-0 top-[331px] h-[388px] bg-[#FFF7F3] overflow-hidden">
        <WallPattern />
      </div>

      {/* 잔디/땅 영역 */}
      <div className="absolute left-0 right-0 bottom-[136px] h-[227px] bg-[#F7D9C6]" />

      {/* 하단 스케줄 영역 - 담장 위에 배치 */}
      <div className="absolute left-0 right-0 top-[380px] flex flex-col items-center gap-[18px] z-10 px-4">
        {/* 설명 텍스트 */}
        <div className="text-center text-[15px] text-[#875E42] leading-[1.87]" style={{ fontFamily: "'Pretendard', sans-serif" }}>
          <p>이 나무 아래에는 아직 오지 않은 날들이 대기하고 있습니다.</p>
          <p>스케줄에서 등록한 일정 중 얼마 남지않은 순으로 노출됩니다</p>
        </div>

        {/* 스케줄 태그들 */}
        <div className="flex items-center justify-center gap-4">
          {scheduleTags.map((tag, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 bg-[#F4D5C0] px-[22px] py-3 rounded-full"
            >
              <span className="text-[15px] font-bold text-[#997257] tracking-[-0.3px]">
                {tag.dDay}
              </span>
              <span className="text-[15px] font-medium text-[#6C6C6C] tracking-[-0.3px]">
                {tag.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 나무 + 수신자등록 명패 - 하단 잔디 위에 배치 */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[80px] z-10 flex items-end gap-16">
        {/* 새싹 나무 - 피그마에서 내보낸 이미지 */}
        <img
          src="/assets/trees/tree1.svg"
          alt="새싹 나무"
          className="w-[55px] h-[66px]"
        />

        {/* 수신자 등록 명패 */}
        <button
          onClick={() => setShowAddRecipientModal(true)}
          className="flex flex-col items-center hover:scale-105 transition-transform"
        >
          <div className="w-[124px] h-[56px] bg-[#B07946] rounded-[3px] overflow-hidden p-[5px]">
            <div className="w-full h-full bg-white rounded-[3px] flex items-center justify-center">
              <span className="text-[16px] text-[#997257] tracking-[-0.32px]">
                + 수신자 등록
              </span>
            </div>
          </div>
          {/* 명패 기둥 */}
          <div className="w-[17px] h-[28px] bg-[#B07946]" />
        </button>
      </div>

      {/* 푸터 */}
      <div className="absolute left-0 right-0 bottom-0 h-[40px] bg-[#111827] flex items-center justify-center z-20">
        <p className="text-[12px] text-[#D9D9D9]">
          편지 마감까지{" "}
          <span className="text-[14px] font-semibold text-[#FF7430]">01:38:13</span>
          {"  | "}
          <span className="text-[#939393]">오늘 17시 우체국 접수</span>
        </p>
      </div>

      {/* 수신자 등록 모달 */}
      <AddRecipientModal
        open={showAddRecipientModal}
        onOpenChange={setShowAddRecipientModal}
        onSuccess={() => {
          // 수신자 등록 성공 시 처리
          console.log("수신자 등록 완료");
        }}
      />
    </div>
  );
}
