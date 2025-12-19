import { useState } from "react";
import { motion } from "framer-motion";
import { TreeDeciduous, Leaf, Apple, Calendar, MessageSquare, TrendingUp, Clock, ChevronRight, Plus, Home, Scale, Users, GraduationCap, Phone, Banknote, Gift, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import orangeSeed from "@/assets/emoticons/orange-seed-icon.png";
import orangeSprout from "@/assets/emoticons/orange-sprout-icon.png";
import orangeYoungTree from "@/assets/emoticons/orange-young-tree-icon.png";
import orangeFullTree from "@/assets/emoticons/orange-full-tree-icon.png";
import orangeRipe from "@/assets/emoticons/orange-ripe-icon.png";
import orangeCharacter from "@/assets/emoticons/orange-character.gif";

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

// 목업 데이터
const mockData = {
  totalLetters: 23,
  sentLetters: 12,
  receivedLetters: 11,
  currentGrowthLevel: 3,
  growthProgress: 53, // 현재 레벨에서의 진행률
  prisonerInfo: {
    name: "홍길동",
    facility: "서울구치소",
    prisonerNumber: "2024-1234",
    admissionDate: "2024-03-15",
    expectedReleaseDate: "2025-06-15",
    daysServed: 280,
    daysRemaining: 178,
  },
  fruits: [
    { id: 1, type: "release", title: "출소 예정일", date: "2025-06-15", description: "D-178 남음", icon: "🏠" },
    { id: 2, type: "birthday", title: "생일", date: "2025-03-20", description: "길동이의 생일", icon: "🎂" },
    { id: 3, type: "anniversary", title: "결혼기념일", date: "2025-04-10", description: "10주년 결혼기념일", icon: "💍" },
    { id: 4, type: "visit", title: "가족 면회", date: "2025-01-08", description: "어머니, 여동생 면회 예정", icon: "👨‍👩‍👧" },
    { id: 5, type: "program", title: "교육 수료", date: "2025-03-01", description: "제빵 기능사 과정 수료 예정", icon: "🎓" },
    { id: 6, type: "trial", title: "재판일", date: "2025-02-15", description: "항소심 재판", icon: "⚖️" },
    { id: 7, type: "health", title: "건강검진", date: "2025-02-01", description: "정기 건강검진", icon: "🏥" },
  ],
  recentActivity: [
    { id: 1, action: "편지 발송", target: "어머니에게", date: "2025-01-02", status: "전달완료" },
    { id: 2, action: "편지 수신", target: "아버지로부터", date: "2024-12-28", status: "수신완료" },
    { id: 3, action: "사진 동봉", target: "여동생에게", date: "2024-12-25", status: "전달완료" },
    { id: 4, action: "영치금 입금", target: "어머니로부터", date: "2024-12-20", status: "입금확인" },
  ],
  supportStats: {
    totalVisits: 15,
    totalCalls: 8,
    totalDeposits: 12,
  }
};

// 선물 옵션 (오렌지 제거)
const giftOptions = [
  { id: "starbucks", name: "스타벅스 커피", icon: "☕", price: 6000 },
  { id: "flower", name: "꽃다발", icon: "💐", price: 15000 },
  { id: "cake", name: "케이크", icon: "🎂", price: 25000 },
  { id: "snack", name: "간식 세트", icon: "🍪", price: 12000 },
];

export function OrangeTreeContent({ onClose }: OrangeTreeContentProps) {
  const [selectedGifts, setSelectedGifts] = useState<{id: string, quantity: number}[]>([]);
  const currentStage = growthStages[mockData.currentGrowthLevel - 1];
  const nextStage = growthStages[mockData.currentGrowthLevel];

  const toggleGift = (giftId: string) => {
    setSelectedGifts(prev => {
      const existing = prev.find(g => g.id === giftId);
      if (existing) {
        if (existing.quantity >= 3) {
          return prev.filter(g => g.id !== giftId);
        }
        return prev.map(g => g.id === giftId ? { ...g, quantity: g.quantity + 1 } : g);
      }
      return [...prev, { id: giftId, quantity: 1 }];
    });
  };

  const getTotalPrice = () => {
    return selectedGifts.reduce((sum, sg) => {
      const gift = giftOptions.find(g => g.id === sg.id);
      return sum + (gift?.price || 0) * sg.quantity;
    }, 0);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-gradient-to-br from-orange-50/50 to-amber-50/30">
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

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* 재소자 정보 & 출소 카운트다운 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <div>
                  <p className="text-orange-100 text-sm mb-1">수신자 정보</p>
                  <h2 className="text-2xl font-bold mb-1">{mockData.prisonerInfo.name}</h2>
                  <p className="text-orange-100 text-sm">
                    {mockData.prisonerInfo.facility} · {mockData.prisonerInfo.prisonerNumber}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4">
                  <p className="text-4xl font-bold">{mockData.prisonerInfo.daysRemaining}</p>
                  <p className="text-orange-100 text-sm mt-1">일 후면, 다시 만날 수 있습니다</p>
                  <p className="text-orange-100/80 text-xs mt-2">끝이 있다는 것, 그것이 희망입니다</p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="text-orange-100">함께한 시간</span>
                  <span className="font-semibold ml-2">{mockData.prisonerInfo.daysServed}일</span>
                </div>
                <div>
                  <span className="text-orange-100">첫 만남</span>
                  <span className="font-semibold ml-2">{mockData.prisonerInfo.admissionDate}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 나무 성장 현황 카드 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start gap-6">
                {/* 나무 이미지 */}
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center p-2 ring-4 ring-primary/60">
                      <div className="w-full h-full rounded-full bg-white/80 flex items-center justify-center overflow-hidden">
                        <motion.img 
                          src={currentStage.icon} 
                          alt={currentStage.name}
                          className="w-14 h-14 object-contain"
                          animate={{ scale: [1, 1.02, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 성장 정보 */}
                <div className="flex-1">
                  {nextStage && (
                    <div className="mb-2">
                      <span className="text-sm text-muted-foreground">
                        다음 단계 <span className="font-medium text-foreground">{nextStage.name}</span>까지 
                        <span className="text-primary font-bold ml-1">{nextStage.minLetters - mockData.totalLetters}통</span> 남음
                      </span>
                    </div>
                  )}
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    떨어져 있어도, 마음은 자라고 있어요 💛
                  </p>

                  {/* 진행률 바 */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">성장 진행률</span>
                      <span className="font-medium text-primary">{mockData.growthProgress}%</span>
                    </div>
                    <Progress value={mockData.growthProgress} className="h-3" />
                  </div>

                  {/* 성장 단계 표시 */}
                  <div className="flex items-center gap-1 mt-4">
                    {growthStages.map((stage, index) => {
                      const isCurrent = index === mockData.currentGrowthLevel - 1;
                      const isPast = index < mockData.currentGrowthLevel - 1;
                      
                      return (
                        <div key={stage.id} className="flex items-center">
                          <div className="flex flex-col items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all overflow-hidden ${
                              isCurrent 
                                ? "bg-white ring-2 ring-primary ring-offset-2 scale-110" 
                                : isPast 
                                  ? "bg-white ring-2 ring-primary/60" 
                                  : "bg-white ring-2 ring-muted"
                            }`}>
                              <img src={stage.icon} alt={stage.name} className="w-8 h-8 object-contain" />
                            </div>
                            <span className={`text-[10px] mt-1 ${
                              isCurrent ? "font-bold text-primary" : "text-muted-foreground"
                            }`}>
                              {stage.name}
                            </span>
                          </div>
                          {index < growthStages.length - 1 && (
                            <div className={`w-4 h-0.5 mb-4 ${
                              isPast ? "bg-primary" : "bg-muted"
                            }`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 통계 카드 그리드 */}
          <div className="grid grid-cols-3 gap-4">
            {/* 잎사귀 - 편지 개수 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-border/60 shadow-sm p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">잎사귀</p>
                  <p className="text-xs text-muted-foreground">총 편지 개수</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground">{mockData.totalLetters}<span className="text-lg text-muted-foreground ml-1">통</span></p>
              <div className="flex gap-4 mt-3 text-sm">
                <span className="text-muted-foreground">보낸 편지 <span className="text-foreground font-medium">{mockData.sentLetters}</span></span>
                <span className="text-muted-foreground">받은 편지 <span className="text-foreground font-medium">{mockData.receivedLetters}</span></span>
              </div>
            </motion.div>

            {/* 열매 - 소중한 날들 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-border/60 shadow-sm p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                  <Apple className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">열매</p>
                  <p className="text-xs text-muted-foreground">소중한 날들</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground">{mockData.fruits.length}<span className="text-lg text-muted-foreground ml-1">개</span></p>
              <Button variant="ghost" size="sm" className="mt-2 text-primary hover:text-primary/80 -ml-2">
                <Plus className="w-4 h-4 mr-1" />
                기념일 추가
              </Button>
            </motion.div>

            {/* 성장 트렌드 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl border border-border/60 shadow-sm p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">성장 속도</p>
                  <p className="text-xs text-muted-foreground">이번 달</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground">+5<span className="text-lg text-muted-foreground ml-1">통</span></p>
              <p className="text-sm text-green-600 mt-2">▲ 지난달 대비 25% 증가</p>
            </motion.div>
          </div>

          {/* 열매 (타임라인 일정) 섹션 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-border/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Apple className="w-5 h-5 text-orange-500" />
                  <div>
                    <h3 className="font-semibold text-foreground">소중한 날들</h3>
                    <p className="text-xs text-muted-foreground">출소일, 생일, 기념일 등 잊지 말아야 할 특별한 날을 기록해요</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  기념일 추가
                </Button>
              </div>
            </div>
            <div className="divide-y divide-border/40">
              {mockData.fruits.map((fruit, index) => {
                const getIconAndColor = () => {
                  switch (fruit.type) {
                    case "release": return { icon: <Home className="w-5 h-5 text-green-600" />, bg: "bg-green-100" };
                    case "birthday": return { icon: <Calendar className="w-5 h-5 text-pink-600" />, bg: "bg-pink-100" };
                    case "anniversary": return { icon: <Calendar className="w-5 h-5 text-red-600" />, bg: "bg-red-100" };
                    case "visit": return { icon: <Users className="w-5 h-5 text-amber-600" />, bg: "bg-amber-100" };
                    case "program": return { icon: <GraduationCap className="w-5 h-5 text-indigo-600" />, bg: "bg-indigo-100" };
                    case "trial": return { icon: <Scale className="w-5 h-5 text-purple-600" />, bg: "bg-purple-100" };
                    case "health": return { icon: <Calendar className="w-5 h-5 text-teal-600" />, bg: "bg-teal-100" };
                    default: return { icon: <Calendar className="w-5 h-5 text-gray-600" />, bg: "bg-gray-100" };
                  }
                };
                const { icon, bg } = getIconAndColor();
                const getTypeLabel = () => {
                  switch (fruit.type) {
                    case "release": return "출소";
                    case "birthday": return "생일";
                    case "anniversary": return "기념일";
                    case "visit": return "면회";
                    case "program": return "교육";
                    case "trial": return "재판";
                    case "health": return "건강";
                    default: return "마일스톤";
                  }
                };

                return (
                  <motion.div
                    key={fruit.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="p-4 hover:bg-muted/30 transition-colors cursor-pointer flex items-center gap-4"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg}`}>
                      {icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{fruit.title}</p>
                        {fruit.type === "release" && (
                          <span className="bg-green-100 text-green-700 text-[10px] font-medium px-1.5 py-0.5 rounded">중요</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{fruit.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{fruit.date}</p>
                      <p className="text-xs text-muted-foreground">{getTypeLabel()}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* 가족 지원 현황 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl border border-border/60 shadow-sm p-5"
          >
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              가족 지원 현황
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{mockData.supportStats.totalVisits}</p>
                <p className="text-xs text-muted-foreground">면회 횟수</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <Phone className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{mockData.supportStats.totalCalls}</p>
                <p className="text-xs text-muted-foreground">전화 통화</p>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-xl">
                <Banknote className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{mockData.supportStats.totalDeposits}</p>
                <p className="text-xs text-muted-foreground">영치금 입금</p>
              </div>
            </div>
          </motion.div>

          {/* 함께 선물하기 섹션 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200/60 shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-amber-200/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-600" />
                <div>
                  <h3 className="font-semibold text-foreground">함께 선물하기</h3>
                  <p className="text-xs text-muted-foreground">편지와 함께 마음을 담은 선물을 전달해보세요</p>
                </div>
              </div>
              {selectedGifts.length > 0 && (
                <div className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full">
                  {selectedGifts.reduce((sum, g) => sum + g.quantity, 0)}개 선택됨
                </div>
              )}
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 gap-3">
                {giftOptions.map((gift) => {
                  const selected = selectedGifts.find(g => g.id === gift.id);
                  return (
                    <motion.button
                      key={gift.id}
                      onClick={() => toggleGift(gift.id)}
                      className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                        selected 
                          ? "border-primary bg-white shadow-md" 
                          : "border-transparent bg-white hover:border-amber-300 hover:shadow-sm"
                      }`}
                      whileTap={{ scale: 0.98 }}
                    >
                      {selected && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{selected.quantity}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{gift.icon}</span>
                        <div>
                          <p className="font-medium text-foreground">{gift.name}</p>
                          <p className="text-sm text-muted-foreground">{gift.price.toLocaleString()}원</p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
              
              {/* 선택된 선물 요약 */}
              {selectedGifts.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 p-4 bg-white rounded-xl border border-amber-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-muted-foreground">선택한 선물:</span>
                      {selectedGifts.map(sg => {
                        const gift = giftOptions.find(g => g.id === sg.id);
                        return (
                          <span key={sg.id} className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-sm px-2 py-0.5 rounded-full">
                            {gift?.icon} {gift?.name} x{sg.quantity}
                          </span>
                        );
                      })}
                    </div>
                    <div className="font-bold text-primary text-lg">
                      {getTotalPrice().toLocaleString()}원
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* 최근 활동 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-border/40">
              <h3 className="font-semibold text-foreground">최근 활동</h3>
            </div>
            <div className="divide-y divide-border/40">
              {mockData.recentActivity.map((activity) => (
                <div key={activity.id} className="p-4 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <span className="text-sm text-foreground">{activity.action}</span>
                    <span className="text-sm text-muted-foreground ml-1">{activity.target}</span>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">{activity.status}</span>
                  <span className="text-xs text-muted-foreground">{activity.date}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
