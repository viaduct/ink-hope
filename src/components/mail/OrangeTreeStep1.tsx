import { motion } from "framer-motion";
import { useState } from "react";
import { useFamilyMembers } from "@/hooks/useFamilyMembers";
import { familyMembers as mockFamilyMembers } from "@/data/mockData";
import { AddRecipientModal } from "./AddRecipientModal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UserPlus } from "lucide-react";

interface OrangeTreeStep1Props {
  recipientName?: string;
  events?: Array<{
    id: number;
    dDay: string;
    label: string;
  }>;
  onBack?: () => void;
}

export function OrangeTreeStep1({
  events = [],
}: OrangeTreeStep1Props) {
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { familyMembers: authFamilyMembers } = useFamilyMembers();

  // 로그인 안 된 경우 mockData 사용
  const familyMembers = authFamilyMembers.length > 0 ? authFamilyMembers : mockFamilyMembers;

  const handleSelectRecipient = (name: string) => {
    setSelectedRecipient(name);
    setIsPopoverOpen(false);
  };

  const handleAddNewRecipient = () => {
    setIsPopoverOpen(false);
    setIsAddModalOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#fffcf2]">
      {/* 메인 컨텐츠 - 스크롤 가능 */}
      <div className="flex-1 overflow-auto overflow-x-hidden">
        <div className="flex flex-col items-center justify-end w-full min-h-full">

          {/* 타이틀 영역 - h-[339px] */}
          <motion.div
            className="flex flex-col gap-6 items-center justify-center h-[339px] w-full px-4 shrink-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* 나의 OOO 오렌지 나무 */}
            <div className="flex items-center gap-[10px] flex-wrap justify-center">
              <span
                className="text-[22px] text-[#4a2e1b] tracking-[-0.44px] leading-[1.4]"
                style={{ fontFamily: "'Noto Serif KR', serif" }}
              >
                나의
              </span>
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                  <button className="flex items-center justify-center min-w-[111px] h-[42px] border-2 border-[#875e42] rounded-[2px] px-[14px] py-1 hover:bg-[#f5f0e5] transition-colors cursor-pointer">
                    <span
                      className="text-[24px] text-[#4a2e1b] tracking-[-0.48px] leading-[1.4]"
                      style={{ fontFamily: "'Noto Serif KR', serif" }}
                    >
                      {selectedRecipient || "?"}
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[240px] p-0 bg-white" align="center">
                  <div className="flex flex-col">
                    {/* 수신자 목록 */}
                    {familyMembers.length > 0 && (
                      <div className="border-b border-gray-100">
                        <div className="px-3 py-2 text-xs text-gray-500 font-medium">
                          수신자 선택
                        </div>
                        {familyMembers.map((member) => (
                          <button
                            key={member.id}
                            onClick={() => handleSelectRecipient(member.name)}
                            className="w-full px-3 py-2.5 text-left hover:bg-[#fff8f0] transition-colors flex items-center gap-3"
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${member.color || 'bg-orange-100 text-orange-600'}`}>
                              {member.avatar || member.name.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-[#4a2e1b]">{member.name}</span>
                              <span className="text-xs text-gray-400">{member.relation}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    {/* 수신자 등록하기 */}
                    <button
                      onClick={handleAddNewRecipient}
                      className="w-full px-3 py-3 text-left hover:bg-[#fff8f0] transition-colors flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#875e42] flex items-center justify-center">
                        <UserPlus className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-[#875e42]">수신자 등록하기</span>
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
              <span
                className="text-[22px] text-[#4a2e1b] tracking-[-0.44px] leading-[1.4]"
                style={{ fontFamily: "'Noto Serif KR', serif" }}
              >
                오렌지 나무
              </span>
            </div>

            {/* 설명 텍스트 */}
            <div
              className="flex flex-col items-center gap-[15px] text-[16px] text-[#4a2e1b] tracking-[-0.32px] leading-[1.8] text-center"
              style={{ fontFamily: "'Jeju Myeongjo', serif" }}
            >
              <div>
                <p>"이 나무는 한 사람을 기다리는 마음에서 시작되었습니다."</p>
                <p>오렌지 나무는 주고받은 마음이 이어져 온 시간과 흔적을 조용히 남깁니다.</p>
              </div>
              <div>
                <p>아직 편지를 써보지 않았다면,</p>
                <p>수신자 등록만 미리 해봐도 괜찮아요.</p>
              </div>
            </div>
          </motion.div>

          {/* 벽 + 새싹 + 바닥 컨테이너 */}
          <div className="flex flex-col items-center justify-center w-full shrink-0">

            {/* 벽 이미지 - h-[380px] */}
            <div className="relative w-full h-[380px] overflow-hidden -mb-[1px]">
              <img
                src="/orange-tree-wall.png"
                alt=""
                className="absolute left-0 w-full h-[126%] object-cover block"
                style={{ top: '-26%' }}
              />
            </div>

            {/* 바닥 이미지 컨테이너 - 새싹 포함 */}
            <div className="relative w-full -mt-[1px]">
              <img
                src="/orange-tree-bottom.png"
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* 새싹 이미지 - 바닥 위에 겹쳐서 표시 */}
              <div className="relative z-10 flex flex-col items-center w-full">
                <div className="w-[400px] h-[368px] -mt-[280px]">
                  <video
                    src="/sprout-animation-transparent.webm"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* 타임캡슐 영역 + 팻말 */}
                <div className="relative flex flex-col items-center justify-center gap-[18px] w-full px-4 pt-[15px] pb-[50px]">
                  {/* 팻말 - 우측 배치 */}
                  <div
                    className="absolute flex flex-col items-center"
                    style={{ left: 'calc(50% + 240px)', top: '-80px' }}
                  >
                    <img
                      src="/sign-post.png"
                      alt="팻말"
                      className="w-[140px] h-auto"
                    />
                    <span
                      className="absolute top-[35px] text-[24px] text-[#4a2e1b] font-bold"
                      style={{ fontFamily: "'Pretendard', sans-serif" }}
                    >
                      {selectedRecipient || "?"}
                    </span>
                  </div>
                  {/* 안내 텍스트 */}
                  <div
                    className="text-[15px] text-[#7c522d] leading-[1.87] text-center"
                    style={{ fontFamily: "'Pretendard', sans-serif" }}
                  >
                    <p>이 나무 아래에는 아직 오지 않은 날들이 대기하고 있습니다.</p>
                    <p>스케줄에서 등록한 일정 중 얼마 남지않은 순으로 노출됩니다</p>
                  </div>

                  {/* D-Day 태그들 */}
                  <div className="flex items-center justify-center gap-4 flex-wrap">
                    {events.length > 0 ? (
                      events.map((event) => (
                        <div
                          key={event.id}
                          className="bg-[#d1ab8a] rounded-[46px] px-[22px] py-3 flex items-center gap-2"
                        >
                          <span
                            className="text-[#ffe9d6] font-bold text-[15px] tracking-[-0.3px] leading-[1.4]"
                            style={{ fontFamily: "'Pretendard', sans-serif" }}
                          >
                            {event.dDay}
                          </span>
                          <span
                            className="text-[#ffe9d6] font-medium text-[15px] tracking-[-0.3px] leading-[1.4]"
                            style={{ fontFamily: "'Pretendard', sans-serif" }}
                          >
                            {event.label}
                          </span>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="bg-[#d1ab8a] rounded-[46px] px-[22px] py-3 flex items-center gap-2">
                          <span className="text-[#ffe9d6] font-bold text-[15px] tracking-[-0.3px]">D+20</span>
                          <span className="text-[#ffe9d6] font-medium text-[15px] tracking-[-0.3px]">변호사접견</span>
                        </div>
                        <div className="bg-[#d1ab8a] rounded-[46px] px-[22px] py-3 flex items-center gap-2">
                          <span className="text-[#ffe9d6] font-bold text-[15px] tracking-[-0.3px]">D+14</span>
                          <span className="text-[#ffe9d6] font-medium text-[15px] tracking-[-0.3px]">출소일</span>
                        </div>
                        <div className="bg-[#d1ab8a] rounded-[46px] px-[22px] py-3 flex items-center gap-2">
                          <span className="text-[#ffe9d6] font-bold text-[15px] tracking-[-0.3px]">D+3</span>
                          <span className="text-[#ffe9d6] font-medium text-[15px] tracking-[-0.3px]">생일</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 수신자 등록 모달 */}
      <AddRecipientModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSuccess={() => {
          // 새로 등록한 수신자가 자동으로 familyMembers에 추가됨
        }}
      />
    </div>
  );
}
