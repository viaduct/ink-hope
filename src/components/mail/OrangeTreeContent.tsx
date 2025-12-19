import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TreeDeciduous, Leaf, Calendar, MessageSquare, TrendingUp, Clock, ChevronRight, Plus, Home, Scale, Users, GraduationCap, Gift, Check, Mail, Send, Image, FileText, Settings, ExternalLink, Heart, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  { id: 1, name: "씨앗", level: "Lv.1", minLetters: 0, icon: orangeSeed, color: "from-amber-200 to-amber-300" },
  { id: 2, name: "새싹", level: "Lv.2", minLetters: 5, icon: orangeSprout, color: "from-lime-300 to-green-400" },
  { id: 3, name: "푸른 가지", level: "Lv.3", minLetters: 15, icon: orangeYoungTree, color: "from-green-400 to-emerald-500" },
  { id: 4, name: "흰 꽃나무", level: "Lv.4", minLetters: 30, icon: orangeFullTree, color: "from-emerald-400 to-teal-500" },
  { id: 5, name: "오렌지나무", level: "Lv.5", minLetters: 50, icon: orangeRipe, color: "from-orange-400 to-orange-500" },
];

// 관계 아이콘 정의
const relationIcons: Record<string, { emoji: string; color: string }> = {
  "어머니": { emoji: "👩", color: "bg-pink-100 text-pink-600" },
  "아버지": { emoji: "👨", color: "bg-blue-100 text-blue-600" },
  "여동생": { emoji: "👧", color: "bg-purple-100 text-purple-600" },
  "남동생": { emoji: "👦", color: "bg-cyan-100 text-cyan-600" },
  "아내": { emoji: "👰", color: "bg-rose-100 text-rose-600" },
  "남편": { emoji: "🤵", color: "bg-indigo-100 text-indigo-600" },
  "아들": { emoji: "👦", color: "bg-sky-100 text-sky-600" },
  "딸": { emoji: "👧", color: "bg-fuchsia-100 text-fuchsia-600" },
};

// 우편 종류 아이콘
const mailTypeIcons: Record<string, { icon: React.ReactNode; label: string }> = {
  "편지": { icon: <Mail className="w-3.5 h-3.5" />, label: "편지" },
  "사진": { icon: <Image className="w-3.5 h-3.5" />, label: "사진" },
  "파일": { icon: <FileText className="w-3.5 h-3.5" />, label: "파일" },
};

// 목업 데이터
const mockData = {
  totalLetters: 23,
  sentLetters: 12,
  receivedLetters: 11,
  currentGrowthLevel: 3,
  growthProgress: 53,
  sentThisWeek: false, // 이번 주 편지 발송 여부
  lastLetterDate: "2025-01-02",
  prisonerInfo: {
    name: "홍길동",
    facility: "서울구치소",
    prisonerNumber: "2024-1234",
    admissionDate: "2024-03-15",
    expectedReleaseDate: "2025-06-15",
    daysServed: 280,
    daysRemaining: 178,
  },
  nextVisitDate: "2025-01-15",
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
    { id: 1, action: "편지 발송", target: "어머니", relation: "어머니", date: "2025-01-02", status: "전달완료", mailTypes: ["편지", "사진"] },
    { id: 2, action: "편지 수신", target: "아버지", relation: "아버지", date: "2024-12-28", status: "수신완료", mailTypes: ["편지"] },
    { id: 3, action: "편지 발송", target: "여동생", relation: "여동생", date: "2024-12-25", status: "전달완료", mailTypes: ["편지", "사진", "파일"] },
    { id: 4, action: "편지 발송", target: "아내", relation: "아내", date: "2024-12-20", status: "전달완료", mailTypes: ["편지"] },
  ],
  supportStats: {
    totalVisits: 15,
  }
};

// 선물 옵션
const giftOptions = [
  { id: "starbucks", name: "스타벅스 커피", icon: "☕", price: 6000 },
  { id: "flower", name: "꽃다발", icon: "💐", price: 15000 },
  { id: "cake", name: "케이크", icon: "🎂", price: 25000 },
  { id: "snack", name: "간식 세트", icon: "🍪", price: 12000 },
];

// 롤링 메시지 컴포넌트
function RollingText({ messages }: { messages: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="h-5 overflow-hidden relative">
      <AnimatePresence mode="wait">
        <motion.p
          key={currentIndex}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="text-sm text-green-600 absolute"
        >
          {messages[currentIndex]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

const recipients = ["이재원", "서은우", "임성훈"];

export function OrangeTreeContent({ onClose }: OrangeTreeContentProps) {
  const [selectedGifts, setSelectedGifts] = useState<{id: string, quantity: number}[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState(recipients[0]);
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

  // 성장 속도 롤링 메시지
  const growthMessages = [
    "▲ 지난주 대비 25% 증가",
    "▲ 지난달 대비 25% 증가",
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-gradient-to-br from-orange-50/50 to-amber-50/30">
      {/* Header */}
      <header className="h-14 border-b border-border/40 bg-white/80 backdrop-blur-sm flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <TreeDeciduous className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-semibold text-foreground">오렌지나무</h1>
          <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
            <SelectTrigger className="w-auto h-8 gap-1 border-none bg-orange-100 text-primary font-medium px-3 rounded-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {recipients.map((name) => (
                <SelectItem key={name} value={name}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          편지함으로 돌아가기
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* 편지 발송 유도 알림 - 배너 밖 독립형 */}
          {!mockData.sentThisWeek && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 bg-white rounded-2xl border border-amber-200 shadow-sm p-4"
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="14" r="8" className="stroke-orange-500" />
                    <path d="M12 6V4" className="stroke-orange-500" />
                    <path d="M12 6C8 6 6 4 7 2" className="stroke-orange-500" />
                    <path d="M7 2Q4 3 5 6" className="stroke-orange-500" />
                  </svg>
                </div>
                <motion.div
                  className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-orange-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  이번 주 아직 편지를 보내지 않았어요
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  바쁜 일상 속 편지 한 통이 {mockData.prisonerInfo.name}에게 큰 의지가 됩니다
                </p>
              </div>
              <Button size="sm" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-sm">
                <Send className="w-4 h-4 mr-1" />
                편지 쓰기
              </Button>
            </motion.div>
          )}

          {mockData.sentThisWeek && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 bg-green-50 rounded-2xl border border-green-200 shadow-sm p-4"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                <Heart className="w-5 h-5 text-green-500 fill-green-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  이번 주 편지를 보냈습니다! 💛
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  당신의 편지가 {mockData.prisonerInfo.name}에게 큰 힘이 됩니다
                </p>
              </div>
            </motion.div>
          )}

          {/* 히어로 소개 배너 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-3xl p-8 text-white shadow-xl"
          >
            {/* 배경 장식 */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative">
              <h2 className="text-3xl font-bold mb-2">오렌지나무</h2>
              <p className="text-white/90 leading-relaxed text-sm mb-3">
                안에 있는 사람들은 가족의 사랑과 정으로 버팁니다.<br />
                <strong className="text-white">일주일에 한 번 전하는 편지</strong>가 {mockData.prisonerInfo.name}이(가) 거듭나는 힘이 됩니다.
              </p>
              <div className="flex gap-2">
                <span className="bg-white/20 backdrop-blur-sm text-xs px-3 py-1.5 rounded-full font-medium">🌱 성장 기록</span>
                <span className="bg-white/20 backdrop-blur-sm text-xs px-3 py-1.5 rounded-full font-medium">📅 소중한 날들</span>
                <span className="bg-white/20 backdrop-blur-sm text-xs px-3 py-1.5 rounded-full font-medium">🎁 함께 선물하기</span>
              </div>
            </div>
          </motion.div>


          {/* 수신자 정보 + 성장 진행률 좌우 배치 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 gap-4"
          >
            {/* 수신자 정보 카드 (좌) */}
            <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-5 flex flex-col">
              <p className="text-xs text-muted-foreground mb-1">수신자 정보</p>
              <h2 className="text-xl font-bold text-foreground mb-1">{mockData.prisonerInfo.name}</h2>
              <p className="text-sm text-muted-foreground mb-4">
                {mockData.prisonerInfo.facility} · {mockData.prisonerInfo.prisonerNumber}
              </p>
              
              <div className="bg-gray-100 rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <p className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">{mockData.prisonerInfo.daysRemaining}</p>
                </div>
                <p className="text-gray-500 text-sm mt-1">일 후면, 다시 만날 수 있습니다</p>
              </div>
              
              <div className="flex gap-[30px] mt-auto pt-4 text-sm">
                <div className="flex-1">
                  <span className="text-muted-foreground">함께한 시간</span>
                  <span className="font-semibold text-foreground ml-2">{mockData.prisonerInfo.daysServed}일</span>
                </div>
                <div className="flex-1">
                  <span className="text-muted-foreground">첫 만남</span>
                  <span className="font-semibold text-foreground ml-2">{mockData.prisonerInfo.admissionDate}</span>
                </div>
              </div>
            </div>

            {/* 성장 진행률 카드 (우) */}
            <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-5 flex flex-col">
              <p className="text-xs text-muted-foreground mb-1">성장 정보</p>
              <h2 className="text-xl font-bold text-foreground mb-1">{currentStage.name}</h2>
              <p className="text-sm text-muted-foreground mb-4">
                {currentStage.level} · 총 {mockData.totalLetters}통 발송
              </p>
              
              {/* Lv 1-5 그라데이션 막대 그래프 */}
              <div className="bg-gray-100 rounded-xl p-4 pb-6">
                <div className="flex justify-between text-xs text-muted-foreground mb-3">
                  <span>성장 레벨</span>
                  <span className="font-medium text-primary">{currentStage.level}</span>
                </div>
                <div className="flex gap-1.5 mt-4">
                  {growthStages.map((stage, idx) => {
                    const isActive = idx < mockData.currentGrowthLevel;
                    const isCurrent = idx === mockData.currentGrowthLevel - 1;
                    return (
                      <div key={stage.id} className="flex-1 relative group">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            isActive 
                              ? `bg-gradient-to-r ${stage.color}` 
                              : "bg-gray-200"
                          } ${isCurrent ? "ring-2 ring-primary ring-offset-1" : ""}`}
                        />
                        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2">
                          <span className={`text-[10px] ${isActive ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                            {stage.level.replace("Lv.", "")}
                          </span>
                        </div>
                        {/* 호버 시 스테이지 아이콘 표시 */}
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <motion.img 
                            src={stage.icon} 
                            alt={stage.name}
                            className="w-8 h-8 object-contain"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="flex gap-[30px] mt-auto pt-4 text-sm">
                <div className="flex-1">
                  <span className="text-muted-foreground">다음 단계</span>
                  <span className="font-semibold text-foreground ml-2">{nextStage?.name || "-"}</span>
                </div>
                <div className="flex-1">
                  <span className="text-muted-foreground">남은 편지</span>
                  <span className="font-semibold text-primary ml-2">{nextStage ? `${nextStage.minLetters - mockData.totalLetters}통` : "-"}</span>
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

            {/* 열매 - 소중한 날들 (오렌지 아이콘으로 변경) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-border/60 shadow-sm p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                  <img src={orangeRipe} alt="열매" className="w-6 h-6 object-contain" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">열매</p>
                  <p className="text-xs text-muted-foreground">소중한 날들</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground">{mockData.fruits.length}<span className="text-lg text-muted-foreground ml-1">개</span></p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" className="flex-1 h-8 text-xs bg-primary hover:bg-primary/90">
                  <Send className="w-3 h-3 mr-1" />
                  편지 쓰기
                </Button>
                <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">
                  <Plus className="w-3 h-3 mr-1" />
                  새 날짜 추가
                </Button>
              </div>
            </motion.div>

            {/* 성장 트렌드 - 롤링 애니메이션 */}
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
              <div className="mt-2">
                <RollingText messages={growthMessages} />
              </div>
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
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-orange-500">
                      <circle cx="12" cy="12" r="8" />
                      <path d="M12 4c0-1.5 1-2.5 2-3" strokeLinecap="round" />
                      <path d="M10 5.5c-1 0-2-.5-2.5-1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">소중한 날들</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      출소일, 생일, 기념일 등 중요한 날짜를 등록하면 <strong className="text-orange-600">편지 보낼 날짜에 미리 알림</strong>을 받을 수 있어요!
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    <Send className="w-4 h-4 mr-1" />
                    편지 쓰기
                  </Button>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    새 날짜 추가
                  </Button>
                </div>
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

          {/* 가족 지원 현황 - 면회일 설정으로 변경 */}
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
              {/* 면회 횟수 */}
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{mockData.supportStats.totalVisits}</p>
                <p className="text-xs text-muted-foreground">면회 횟수</p>
              </div>
              
              {/* 다음 면회일 */}
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <Calendar className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-lg font-bold text-foreground">{mockData.nextVisitDate || "미정"}</p>
                <p className="text-xs text-muted-foreground">다음 면회일</p>
              </div>
              
              {/* 면회일 설정/예약 */}
              <div className="flex flex-col gap-2 p-4 bg-amber-50 rounded-xl">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-xs border-amber-300 hover:bg-amber-100"
                >
                  <Settings className="w-3.5 h-3.5 mr-1" />
                  면회일 설정
                </Button>
                <Button 
                  size="sm" 
                  className="w-full text-xs bg-amber-500 hover:bg-amber-600 text-white"
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-1" />
                  지금 접견 예약하기
                </Button>
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

          {/* 최근 활동 - 관계 아이콘 및 우편 종류 아이콘 추가 */}
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
              {mockData.recentActivity.map((activity) => {
                const relationInfo = relationIcons[activity.relation] || { emoji: "👤", color: "bg-gray-100 text-gray-600" };
                
                return (
                  <div key={activity.id} className="p-4 flex items-center gap-3">
                    {/* 관계 아이콘 */}
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg ${relationInfo.color}`}>
                      {relationInfo.emoji}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{activity.action}</span>
                        <span className="text-sm text-muted-foreground">{activity.target}에게</span>
                        
                        {/* 우편 종류 아이콘들 */}
                        <div className="flex items-center gap-1 ml-2">
                          {activity.mailTypes?.map((type, idx) => {
                            const typeInfo = mailTypeIcons[type];
                            if (!typeInfo) return null;
                            return (
                              <div 
                                key={idx} 
                                className="w-5 h-5 rounded bg-muted flex items-center justify-center text-muted-foreground"
                                title={typeInfo.label}
                              >
                                {typeInfo.icon}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">{activity.status}</span>
                    <span className="text-xs text-muted-foreground">{activity.date}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
