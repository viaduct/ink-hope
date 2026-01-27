import { motion } from "framer-motion";

interface OrangeTreeContentProps {
  onClose: () => void;
  onCompose?: () => void;
}

export function OrangeTreeContent({ onClose }: OrangeTreeContentProps) {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#fffdf6]">
      {/* Header - 다른 화면과 동일한 스타일 */}
      <header className="h-14 border-b border-border/40 bg-white flex items-center justify-between px-4">
        <h1 className="text-lg font-bold text-foreground">오렌지 나무</h1>
        <button
          onClick={onClose}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          편지함
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto flex flex-col items-center px-4 py-[90px]">
        {/* 타이틀 영역 */}
        <div className="flex flex-col gap-6 items-center max-w-[715px] text-center mb-12">
          <h2
            className="text-[22px] text-[#4a2e1b] tracking-[-0.44px] leading-[1.4]"
            style={{ fontFamily: "'Noto Serif KR', serif" }}
          >
            오렌지 나무, 시작
          </h2>
          <div
            className="flex flex-col gap-[15px] text-[18px] text-[#4a2e1b] tracking-[-0.36px] leading-[1.8]"
            style={{ fontFamily: "'Noto Serif KR', serif" }}
          >
            <p>
              오렌지나무는 한 사람을 기다리는 시간을<br />
              '기록'으로 남깁니다.
            </p>
            <p>
              편지를 쓰는 순간마다 잎이 하나씩 쌓이고,<br />
              시간이 지나며 나무는 조금씩 자라납니다.
            </p>
          </div>
        </div>

        {/* 오렌지나무 이미지 - 책 열림 애니메이션 */}
        <div className="relative w-[208px] h-[302px] mb-auto">
          {/* Frame 524 - 열린 상태 (뒤) */}
          <motion.img
            src="/orange-tree-open.svg"
            alt="오렌지 나무 열린 상태"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-contain"
          />

          {/* Frame 523 - 닫힌 상태 (앞) */}
          <motion.img
            src="/orange-tree-closed.svg"
            alt="오렌지 나무 닫힌 상태"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 1, duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-contain"
          />
        </div>

        {/* 입장하기 버튼 */}
        <button
          className="border border-[#d7d3c2] px-[30px] py-[9px] text-[18px] text-[#875e42] tracking-[-0.36px] leading-[1.8] font-semibold mt-auto mb-10"
          style={{ fontFamily: "'Noto Serif KR', serif" }}
        >
          + 오렌지나무 입장하기
        </button>
      </div>
    </div>
  );
}
