import { useState } from "react";
import { motion } from "framer-motion";
import { TreeDeciduous, ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import orangeSeed from "@/assets/emoticons/orange-seed-icon.png";
import orangeSprout from "@/assets/emoticons/orange-sprout-icon.png";
import orangeYoungTree from "@/assets/emoticons/orange-young-tree-icon.png";
import orangeFullTree from "@/assets/emoticons/orange-full-tree-icon.png";
import orangeRipe from "@/assets/emoticons/orange-ripe-icon.png";

interface OrangeTreeContentProps {
  onClose: () => void;
}

// 성장 단계 정의
const growthStages = [
  { id: 1, name: "씨앗", minLetters: 0, icon: orangeSeed },
  { id: 2, name: "새싹", minLetters: 5, icon: orangeSprout },
  { id: 3, name: "푸른 가지", minLetters: 15, icon: orangeYoungTree },
  { id: 4, name: "흰 꽃나무", minLetters: 30, icon: orangeFullTree },
  { id: 5, name: "오렌지나무", minLetters: 50, icon: orangeRipe },
];

// 수신자별 데이터
const recipientsData = [
  {
    id: 1,
    name: "이재원",
    facility: "서울구치소",
    currentGrowthLevel: 4,
    totalLetters: 32,
    daysRemaining: 120,
    expectedReleaseDate: "2025-04-19",
  },
  {
    id: 2,
    name: "서은우",
    facility: "안양교도소",
    currentGrowthLevel: 2,
    totalLetters: 8,
    daysRemaining: 450,
    expectedReleaseDate: "2026-03-15",
  },
  {
    id: 3,
    name: "임성훈",
    facility: "대전교도소",
    currentGrowthLevel: 3,
    totalLetters: 18,
    daysRemaining: 280,
    expectedReleaseDate: "2025-09-25",
  },
];

export function OrangeTreeContent({ onClose }: OrangeTreeContentProps) {
  const [selectedRecipient, setSelectedRecipient] = useState<typeof recipientsData[0] | null>(null);

  if (selectedRecipient) {
    const currentStage = growthStages[selectedRecipient.currentGrowthLevel - 1];
    const nextStage = growthStages[selectedRecipient.currentGrowthLevel];
    const progress = nextStage 
      ? ((selectedRecipient.totalLetters - currentStage.minLetters) / (nextStage.minLetters - currentStage.minLetters)) * 100
      : 100;

    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-gradient-to-br from-orange-50/50 to-amber-50/30">
        <header className="h-14 border-b border-border/40 bg-white/80 backdrop-blur-sm flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedRecipient(null)}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              돌아가기
            </Button>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            편지함으로 돌아가기
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-border/60 shadow-lg p-8 text-center"
            >
              {/* 나무 이미지 */}
              <motion.div 
                className="relative inline-block mb-6"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-40 h-40 mx-auto bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center">
                  <img 
                    src={currentStage.icon} 
                    alt={currentStage.name}
                    className="w-28 h-28 object-contain"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-sm font-bold px-4 py-1.5 rounded-full shadow-md">
                  Lv.{selectedRecipient.currentGrowthLevel} {currentStage.name}
                </div>
              </motion.div>

              {/* 수신자 정보 */}
              <h2 className="text-2xl font-bold text-foreground mb-1">{selectedRecipient.name}</h2>
              <p className="text-muted-foreground text-sm mb-6">{selectedRecipient.facility}</p>

              {/* 통계 */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-orange-50 rounded-xl p-4">
                  <p className="text-2xl font-bold text-primary">{selectedRecipient.totalLetters}</p>
                  <p className="text-xs text-muted-foreground">주고받은 편지</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-2xl font-bold text-green-600">D-{selectedRecipient.daysRemaining}</p>
                  <p className="text-xs text-muted-foreground">출소까지</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-2xl font-bold text-blue-600">
                    {nextStage ? nextStage.minLetters - selectedRecipient.totalLetters : 0}
                  </p>
                  <p className="text-xs text-muted-foreground">다음 단계까지</p>
                </div>
              </div>

              {/* 성장 진행률 */}
              <div className="bg-muted/30 rounded-xl p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">
                    {nextStage ? `${nextStage.name}까지` : "최고 레벨 달성!"}
                  </span>
                  <span className="font-medium text-primary">{Math.round(progress)}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-primary to-amber-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* 감성 메시지 */}
              <p className="text-muted-foreground text-sm mt-6">
                떨어져 있어도, 마음은 자라고 있어요 💛
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-gradient-to-b from-sky-100 via-sky-50 to-amber-100">
      {/* Header */}
      <header className="h-14 border-b border-border/40 bg-white/80 backdrop-blur-sm flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <TreeDeciduous className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-semibold text-foreground">오렌지나무</h1>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          편지함으로 돌아가기
        </Button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* 감성 메시지 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl font-bold text-foreground mb-2">마음을 심고, 함께 키워요</h2>
          <p className="text-muted-foreground">편지를 주고받을수록 나무가 자라나요</p>
        </motion.div>

        {/* 흙과 나무들 */}
        <div className="relative w-full max-w-3xl">
          {/* 흙 배경 */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-amber-800 via-amber-700 to-amber-600 rounded-t-[100%] shadow-inner" />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-amber-900 to-amber-800 rounded-t-[100%]" />
          
          {/* 잔디 효과 */}
          <div className="absolute bottom-20 left-0 right-0 flex justify-around px-20">
            {[...Array(12)].map((_, i) => (
              <div 
                key={i} 
                className="w-1 bg-green-500 rounded-full"
                style={{ 
                  height: `${8 + Math.random() * 12}px`,
                  opacity: 0.4 + Math.random() * 0.3
                }}
              />
            ))}
          </div>

          {/* 나무들 */}
          <div className="relative flex justify-around items-end pb-28 pt-8">
            {recipientsData.map((recipient, index) => {
              const stage = growthStages[recipient.currentGrowthLevel - 1];
              const sizes = ["w-20 h-20", "w-24 h-24", "w-28 h-28", "w-32 h-32", "w-36 h-36"];
              const sizeClass = sizes[recipient.currentGrowthLevel - 1] || sizes[2];
              
              return (
                <motion.div
                  key={recipient.id}
                  initial={{ opacity: 0, y: 50, scale: 0.5 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.2, duration: 0.5, type: "spring" }}
                  className="flex flex-col items-center cursor-pointer group"
                  onClick={() => setSelectedRecipient(recipient)}
                >
                  {/* 나무 이미지 */}
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2 + index * 0.5, repeat: Infinity, ease: "easeInOut" }}
                    className={`${sizeClass} flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <img 
                      src={stage.icon} 
                      alt={stage.name}
                      className="w-full h-full object-contain drop-shadow-lg"
                    />
                  </motion.div>

                  {/* 푯말 */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.2 + 0.5 }}
                    className="relative mt-2"
                  >
                    {/* 푯말 기둥 */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-8 bg-amber-700 rounded-b" />
                    
                    {/* 푯말 판 */}
                    <div className="relative bg-amber-100 border-2 border-amber-600 rounded-lg px-4 py-2 shadow-md group-hover:bg-amber-50 transition-colors">
                      <div className="absolute -top-1 left-2 w-2 h-2 bg-amber-700 rounded-full" />
                      <div className="absolute -top-1 right-2 w-2 h-2 bg-amber-700 rounded-full" />
                      
                      <p className="font-bold text-amber-900 text-center whitespace-nowrap">
                        {recipient.name}
                      </p>
                      <p className="text-xs text-amber-700 text-center">
                        Lv.{recipient.currentGrowthLevel} {stage.name}
                      </p>
                    </div>
                  </motion.div>

                  {/* 호버 시 상세 정보 */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    className="absolute -top-16 bg-white rounded-xl shadow-lg px-4 py-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  >
                    <p className="text-sm font-medium text-foreground">{recipient.facility}</p>
                    <p className="text-xs text-muted-foreground">편지 {recipient.totalLetters}통 · D-{recipient.daysRemaining}</p>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
                      <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white" />
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 안내 문구 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-muted-foreground text-sm mt-8 flex items-center gap-1"
        >
          나무를 터치하면 상세 정보를 볼 수 있어요
          <ChevronRight className="w-4 h-4" />
        </motion.p>
      </div>
    </div>
  );
}
