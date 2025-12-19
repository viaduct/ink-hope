import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Users, Mail, Plus, ChevronRight, Heart, Calendar, Share2, Lock, Unlock, Sparkles, X, Check, Send, Copy, PenLine, Gift, Coffee, MessageSquare, UserPlus, SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import orangeRipe from "@/assets/emoticons/orange-ripe.png";
import timeCapsuleGif from "@/assets/emoticons/time-capsule.gif";
import { toast } from "sonner";

interface TimeCapsuleContentProps {
  onClose: () => void;
}

// 선물 옵션 (오렌지 제거)
const giftOptions = [
  { id: "starbucks", name: "스타벅스 커피", icon: "☕", price: 6000, description: "따뜻한 커피 한 잔의 마음을 전해요" },
  { id: "flower", name: "꽃다발", icon: "💐", price: 15000, description: "아름다운 꽃과 함께 마음을 전해요" },
  { id: "cake", name: "케이크", icon: "🎂", price: 25000, description: "특별한 날을 위한 달콤한 선물" },
  { id: "snack", name: "간식 세트", icon: "🍪", price: 12000, description: "맛있는 간식으로 힘을 전해요" },
];

// 목업 데이터: 타임캡슐 목록
const mockCapsules = [
  {
    id: 1,
    title: "아버지 출소 축하 편지 모음",
    recipient: "아버지 (홍길동)",
    recipients: [{ name: "아버지 (홍길동)", facility: "서울구치소" }],
    recipientFacility: "서울구치소",
    targetDate: "2025-06-15",
    status: "collecting", // collecting, sealed, opened, sent
    isMultiRecipient: false,
    contributors: [
      { id: 1, name: "어머니", relation: "배우자", avatar: "👩", contributed: true, letterDate: "2025-01-02" },
      { id: 2, name: "나", relation: "자녀", avatar: "🧑", contributed: true, letterDate: "2025-01-05" },
      { id: 3, name: "여동생", relation: "자녀", avatar: "👧", contributed: false, letterDate: null },
      { id: 4, name: "할머니", relation: "부모", avatar: "👵", contributed: true, letterDate: "2024-12-28" },
      { id: 5, name: "삼촌", relation: "형제", avatar: "👨", contributed: false, letterDate: null },
    ],
    letterCount: 3,
    targetLetters: 5,
    daysLeft: 178,
    description: "아버지의 출소를 축하하며 가족 모두가 마음을 담아 편지를 모으고 있어요. 출소 당일 전달됩니다.",
    gifts: [{ id: "orange", quantity: 2 }],
    createdBy: "나",
  },
  {
    id: 2,
    title: "엄마 면회 때 전할 응원 메시지",
    recipient: "어머니 (김영희)",
    recipients: [{ name: "어머니 (김영희)", facility: "청주여자교도소" }],
    recipientFacility: "청주여자교도소",
    targetDate: "2025-01-20",
    status: "collecting",
    isMultiRecipient: false,
    contributors: [
      { id: 1, name: "아버지", relation: "배우자", avatar: "👨", contributed: true, letterDate: "2025-01-10" },
      { id: 2, name: "큰딸", relation: "자녀", avatar: "👩", contributed: true, letterDate: "2025-01-12" },
      { id: 3, name: "작은딸", relation: "자녀", avatar: "👧", contributed: false, letterDate: null },
    ],
    letterCount: 2,
    targetLetters: 3,
    daysLeft: 32,
    description: "면회 때 전할 가족들의 응원 메시지를 모으고 있어요.",
    gifts: [],
    createdBy: "나",
  },
  {
    id: 3,
    title: "오빠 가석방 축하",
    recipient: "오빠 (박민수)",
    recipients: [{ name: "오빠 (박민수)", facility: "의정부교도소" }],
    recipientFacility: "의정부교도소",
    targetDate: "2024-12-20",
    status: "opened",
    isMultiRecipient: false,
    contributors: [
      { id: 1, name: "부모님", relation: "부모", avatar: "👨‍👩‍👧", contributed: true, letterDate: "2024-12-01" },
      { id: 2, name: "나", relation: "동생", avatar: "👧", contributed: true, letterDate: "2024-12-05" },
      { id: 3, name: "여자친구", relation: "연인", avatar: "💑", contributed: true, letterDate: "2024-12-10" },
    ],
    letterCount: 3,
    targetLetters: 3,
    daysLeft: 0,
    description: "오빠의 가석방을 축하하며 모은 편지들이에요. 사회에서 새 출발을 응원해요!",
    gifts: [{ id: "starbucks", quantity: 1 }],
    createdBy: "나",
  },
  {
    id: 4,
    title: "복지시설 어르신들께 보내는 응원 편지",
    recipient: "복지시설 어르신들",
    recipients: [
      { name: "김철수 어르신", facility: "서울구치소" },
      { name: "이영희 어르신", facility: "부산교도소" },
      { name: "박정호 어르신", facility: "대전교도소" },
    ],
    recipientFacility: "전국 교정시설",
    targetDate: "2025-02-01",
    status: "collecting",
    isMultiRecipient: true,
    contributors: [
      { id: 1, name: "봉사자A", relation: "봉사자", avatar: "🙋", contributed: true, letterDate: "2025-01-05" },
      { id: 2, name: "봉사자B", relation: "봉사자", avatar: "🙋‍♀️", contributed: true, letterDate: "2025-01-07" },
      { id: 3, name: "봉사자C", relation: "봉사자", avatar: "🙋‍♂️", contributed: false, letterDate: null },
    ],
    letterCount: 2,
    targetLetters: 10,
    daysLeft: 44,
    description: "복지시설의 여러 어르신들께 함께 응원의 편지를 보내요.",
    gifts: [{ id: "orange", quantity: 3 }],
    createdBy: "봉사단체",
  },
];

// 보낸 타임캡슐 (sent status)
const sentCapsules = [
  {
    id: 101,
    title: "삼촌 출소 축하 편지",
    recipient: "삼촌 (김민호)",
    recipientFacility: "대구교도소",
    targetDate: "2024-11-15",
    sentDate: "2024-11-14",
    status: "sent",
    letterCount: 4,
    gifts: [{ id: "orange", quantity: 1 }, { id: "starbucks", quantity: 1 }],
  },
  {
    id: 102,
    title: "고모 생일 축하 메시지",
    recipient: "고모 (박영미)",
    recipientFacility: "청주여자교도소",
    targetDate: "2024-10-20",
    sentDate: "2024-10-19",
    status: "sent",
    letterCount: 6,
    gifts: [{ id: "cake", quantity: 1 }],
  },
];

const capsuleTypes = [
  { id: "release", label: "출소 축하", icon: "🏠", description: "출소를 축하하는 편지 모음" },
  { id: "parole", label: "가석방 축하", icon: "⚖️", description: "가석방을 축하하는 편지 모음" },
  { id: "birthday", label: "생일 축하", icon: "🎂", description: "수감 중 생일을 축하하는 편지" },
  { id: "encouragement", label: "응원 메시지", icon: "💪", description: "힘내라는 응원의 메시지" },
  { id: "anniversary", label: "기념일", icon: "💝", description: "특별한 기념일을 위한 편지" },
];

export function TimeCapsuleContent({ onClose }: TimeCapsuleContentProps) {
  const navigate = useNavigate();
  const [selectedCapsule, setSelectedCapsule] = useState<typeof mockCapsules[0] | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [selectedGifts, setSelectedGifts] = useState<{id: string, quantity: number}[]>([]);
  const [inviteMessage, setInviteMessage] = useState("함께 타임캡슐에 마음을 담아주세요! 🧡");
  const [isMultiRecipient, setIsMultiRecipient] = useState(false);
  const [multiRecipients, setMultiRecipients] = useState<{name: string, facility: string}[]>([]);

  const collectingCapsules = mockCapsules.filter(c => c.status === "collecting");
  const completedCapsules = mockCapsules.filter(c => c.status === "sealed" || c.status === "opened");

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-gradient-to-br from-purple-50/50 to-pink-50/30">
      {/* Header */}
      <header className="h-14 border-b border-border/40 bg-white/80 backdrop-blur-sm flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-purple-600" />
          <h1 className="text-lg font-semibold text-foreground">타임캡슐</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowCreateModal(true)} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
            <Plus className="w-4 h-4 mr-1" />
            새 타임캡슐 만들기
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            편지함으로 돌아가기
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* 히어로 소개 배너 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 rounded-3xl p-8 text-white shadow-xl"
          >
            {/* 배경 장식 */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative flex items-center gap-8">
              <div className="shrink-0">
                <motion.div 
                  className="w-32 h-32 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center p-3 ring-4 ring-white/30"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <img src={timeCapsuleGif} alt="타임캡슐" className="w-24 h-24 object-contain" />
                </motion.div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">✨ 함께 모으는 마음</span>
                </div>
                <h2 className="text-3xl font-bold mb-3">타임캡슐</h2>
                <p className="text-white/90 leading-relaxed text-base">
                  수감 중인 가족을 위해 여러 사람이 함께 편지를 모아<br />
                  <strong className="text-white">출소일, 가석방일, 생일, 기념일</strong> 등 특별한 순간에 전달하는 서비스예요.
                </p>
                <div className="flex gap-2 mt-4">
                  {capsuleTypes.slice(0, 4).map((type) => (
                    <span key={type.id} className="bg-white/20 backdrop-blur-sm text-xs px-3 py-1.5 rounded-full font-medium">
                      {type.icon} {type.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* 모집 중인 타임캡슐 */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                모집 중인 타임캡슐
              </h2>
              <span className="text-sm text-muted-foreground">{collectingCapsules.length}개</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {collectingCapsules.map((capsule, index) => (
                <motion.div
                  key={capsule.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => navigate(`/time-capsule/${capsule.id}`)}
                  className="bg-white rounded-2xl border border-border/60 shadow-sm p-5 cursor-pointer hover:shadow-md transition-all hover:border-purple-200"
                >
                  {/* 헤더 */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{capsule.title}</h3>
                        <p className="text-xs text-muted-foreground">To. {capsule.recipient}</p>
                        <p className="text-[10px] text-muted-foreground">{capsule.recipientFacility}</p>
                      </div>
                    </div>
                    <div className="bg-purple-100 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-full">
                      D-{capsule.daysLeft}
                    </div>
                  </div>

                  {/* 설명 */}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{capsule.description}</p>

                  {/* 진행률 */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">편지 모음 현황</span>
                      <span className="font-medium text-foreground">{capsule.letterCount}/{capsule.targetLetters}통</span>
                    </div>
                    <Progress value={(capsule.letterCount / capsule.targetLetters) * 100} className="h-2" />
                  </div>

                  {/* 참여자 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <div className="flex -space-x-2">
                        {capsule.contributors.slice(0, 4).map((contributor) => (
                          <div
                            key={contributor.id}
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-sm border-2 border-white ${
                              contributor.contributed ? "bg-green-100" : "bg-gray-100"
                            }`}
                            title={`${contributor.name} ${contributor.contributed ? "(참여완료)" : "(대기중)"}`}
                          >
                            {contributor.avatar}
                          </div>
                        ))}
                        {capsule.contributors.length > 4 && (
                          <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-white">
                            +{capsule.contributors.length - 4}
                          </div>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700">
                      참여하기
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </motion.div>
              ))}

              {/* 새 타임캡슐 만들기 카드 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: collectingCapsules.length * 0.1 }}
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-dashed border-purple-200 p-5 cursor-pointer hover:border-purple-300 transition-all flex flex-col items-center justify-center min-h-[240px]"
              >
                <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                  <Plus className="w-6 h-6 text-purple-600" />
                </div>
                <p className="font-medium text-foreground mb-1">새 타임캡슐 만들기</p>
                <p className="text-sm text-muted-foreground text-center">
                  특별한 날을 위해<br />편지를 모아보세요
                </p>
              </motion.div>
            </div>
          </section>

          {/* 완료된 타임캡슐 */}
          {completedCapsules.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-500" />
                  전달 완료
                </h2>
                <span className="text-sm text-muted-foreground">{completedCapsules.length}개</span>
              </div>
              
              <div className="space-y-3">
                {completedCapsules.map((capsule, index) => (
                  <motion.div
                    key={capsule.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl border border-border/60 p-4 flex items-center gap-4 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
                      {capsule.status === "opened" ? (
                        <Unlock className="w-5 h-5 text-pink-600" />
                      ) : (
                        <Lock className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{capsule.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {capsule.targetDate} · {capsule.letterCount}통의 편지
                      </p>
                    </div>
                    <div className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      capsule.status === "opened" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {capsule.status === "opened" ? "열람완료" : "봉인중"}
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* 보낸 타임캡슐 */}
          {sentCapsules.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <SendHorizontal className="w-5 h-5 text-blue-500" />
                  보낸 타임캡슐
                </h2>
                <span className="text-sm text-muted-foreground">{sentCapsules.length}개</span>
              </div>
              
              <div className="space-y-3">
                {sentCapsules.map((capsule, index) => (
                  <motion.div
                    key={capsule.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl border border-border/60 p-4 flex items-center gap-4 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Send className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{capsule.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        To. {capsule.recipient} · {capsule.recipientFacility}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {capsule.sentDate} 발송 · {capsule.letterCount}통의 편지
                        {capsule.gifts.length > 0 && (
                          <span className="ml-1">
                            · {capsule.gifts.map(g => giftOptions.find(go => go.id === g.id)?.icon).join("")}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
                      발송완료
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* 초대받은 타임캡슐 섹션 */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Share2 className="w-5 h-5 text-blue-500" />
                초대받은 타임캡슐
              </h2>
            </div>
            
            <div className="bg-white rounded-2xl border border-border/60 p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-4">아직 초대받은 타임캡슐이 없어요</p>
              <div className="flex items-center justify-center gap-2">
                <Input 
                  placeholder="초대 코드 입력" 
                  className="max-w-[200px]"
                />
                <Button variant="outline">참여하기</Button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* 새 타임캡슐 만들기 모달 */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCreateModal(false)}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-lg font-semibold mb-4">새 타임캡슐 만들기</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">타임캡슐 종류</label>
                  <div className="grid grid-cols-2 gap-2">
                    {capsuleTypes.map((type) => (
                      <button
                        key={type.id}
                        className="p-3 border border-border rounded-xl text-left hover:border-purple-300 hover:bg-purple-50 transition-all"
                      >
                        <span className="text-xl mr-2">{type.icon}</span>
                        <span className="text-sm font-medium">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">타임캡슐 이름</label>
                  <Input placeholder="예: 아버지 출소 축하 편지 모음" />
                </div>

                {/* 대상 유형 선택 */}
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">대상 유형</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsMultiRecipient(false)}
                      className={`flex-1 p-3 border rounded-xl text-center transition-all ${
                        !isMultiRecipient ? "border-purple-400 bg-purple-50" : "border-border hover:border-purple-200"
                      }`}
                    >
                      <span className="text-lg">👤</span>
                      <p className="text-sm font-medium mt-1">1명에게</p>
                    </button>
                    <button
                      onClick={() => setIsMultiRecipient(true)}
                      className={`flex-1 p-3 border rounded-xl text-center transition-all ${
                        isMultiRecipient ? "border-purple-400 bg-purple-50" : "border-border hover:border-purple-200"
                      }`}
                    >
                      <span className="text-lg">👥</span>
                      <p className="text-sm font-medium mt-1">여러 명에게</p>
                    </button>
                  </div>
                </div>

                {!isMultiRecipient ? (
                  <>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">받는 사람 (수감자)</label>
                      <Input placeholder="예: 홍길동 (아버지)" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">수감 시설</label>
                      <Input placeholder="예: 서울구치소" />
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">받는 사람들 (다수 대상)</label>
                    <p className="text-xs text-muted-foreground mb-2">여러 수감자에게 동시에 편지를 보낼 수 있어요</p>
                    <div className="space-y-2">
                      {multiRecipients.map((r, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <Input 
                            placeholder="이름" 
                            value={r.name}
                            onChange={(e) => {
                              const updated = [...multiRecipients];
                              updated[idx].name = e.target.value;
                              setMultiRecipients(updated);
                            }}
                            className="flex-1"
                          />
                          <Input 
                            placeholder="시설" 
                            value={r.facility}
                            onChange={(e) => {
                              const updated = [...multiRecipients];
                              updated[idx].facility = e.target.value;
                              setMultiRecipients(updated);
                            }}
                            className="flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setMultiRecipients(multiRecipients.filter((_, i) => i !== idx))}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setMultiRecipients([...multiRecipients, { name: "", facility: "" }])}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        대상 추가
                      </Button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">전달 예정일</label>
                  <Input type="date" />
                  <p className="text-xs text-muted-foreground mt-1">출소일, 가석방일, 생일 등</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">목표 편지 수</label>
                  <Input type="number" placeholder="5" defaultValue={5} />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">참여자 초대</label>
                  <p className="text-xs text-muted-foreground mb-2">편지를 함께 모을 가족/지인의 이메일 또는 전화번호</p>
                  <Input placeholder="예: mother@email.com, 010-1234-5678" />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <Button variant="outline" className="flex-1" onClick={() => setShowCreateModal(false)}>
                  취소
                </Button>
                <Button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500">
                  타임캡슐 만들기
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 타임캡슐 상세 모달 */}
      <AnimatePresence>
        {selectedCapsule && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCapsule(null)}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* 헤더 */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white relative">
                <button 
                  onClick={() => setSelectedCapsule(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div>
                  <h2 className="text-xl font-bold">{selectedCapsule.title}</h2>
                  <p className="text-purple-100 text-sm">To. {selectedCapsule.recipient}</p>
                  <p className="text-purple-200 text-xs">{selectedCapsule.recipientFacility}</p>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <div className="bg-white/20 rounded-lg px-3 py-2">
                    <p className="text-xs text-purple-100">전달 예정일</p>
                    <p className="font-semibold">{selectedCapsule.targetDate}</p>
                  </div>
                  <div className="bg-white/20 rounded-lg px-3 py-2">
                    <p className="text-xs text-purple-100">남은 일수</p>
                    <p className="font-semibold">D-{selectedCapsule.daysLeft}</p>
                  </div>
                  <div className="bg-white/20 rounded-lg px-3 py-2">
                    <p className="text-xs text-purple-100">편지 현황</p>
                    <p className="font-semibold">{selectedCapsule.letterCount}/{selectedCapsule.targetLetters}통</p>
                  </div>
                </div>
              </div>

              {/* 콘텐츠 */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* 설명 */}
                <div className="bg-purple-50 rounded-xl p-4">
                  <p className="text-sm text-muted-foreground">{selectedCapsule.description}</p>
                </div>

                {/* 진행률 */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-foreground">편지 모음 진행률</span>
                    <span className="text-purple-600 font-semibold">
                      {Math.round((selectedCapsule.letterCount / selectedCapsule.targetLetters) * 100)}%
                    </span>
                  </div>
                  <Progress value={(selectedCapsule.letterCount / selectedCapsule.targetLetters) * 100} className="h-3" />
                </div>

                {/* 함께 선물하기 */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <Gift className="w-4 h-4 text-amber-600" />
                      함께 선물하기
                    </h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowGiftModal(true)}
                      className="border-amber-300 hover:bg-amber-100"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      선물 추가
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">편지와 함께 마음을 담은 선물을 전달해보세요</p>
                  <div className="grid grid-cols-2 gap-2">
                    {giftOptions.map((gift) => (
                      <button
                        key={gift.id}
                        onClick={() => {
                          const existing = selectedGifts.find(g => g.id === gift.id);
                          if (existing) {
                            setSelectedGifts(selectedGifts.map(g => 
                              g.id === gift.id ? {...g, quantity: g.quantity + 1} : g
                            ));
                          } else {
                            setSelectedGifts([...selectedGifts, { id: gift.id, quantity: 1 }]);
                          }
                          toast.success(`${gift.name} 선물이 추가되었습니다!`);
                        }}
                        className="flex items-center gap-2 p-3 bg-white rounded-lg border border-amber-100 hover:border-amber-300 transition-all text-left"
                      >
                        <span className="text-2xl">{gift.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{gift.name}</p>
                          <p className="text-xs text-muted-foreground">{gift.price.toLocaleString()}원</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  {selectedGifts.length > 0 && (
                    <div className="mt-3 p-2 bg-amber-100/50 rounded-lg">
                      <p className="text-xs font-medium text-amber-800">
                        선택한 선물: {selectedGifts.map(g => {
                          const gift = giftOptions.find(go => go.id === g.id);
                          return `${gift?.icon} ${gift?.name} x${g.quantity}`;
                        }).join(", ")}
                      </p>
                    </div>
                  )}
                </div>

                {/* 참여자 목록 */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-600" />
                      참여자 현황
                    </h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setShowInviteModal(true)}>
                        <UserPlus className="w-3 h-3 mr-1" />
                        참여 요청
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => {
                        navigator.clipboard.writeText("CAPSULE-" + selectedCapsule.id);
                        toast.success("초대 코드가 복사되었습니다!");
                      }}>
                        <Copy className="w-3 h-3 mr-1" />
                        초대 코드 복사
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {selectedCapsule.contributors.map((contributor) => (
                      <div 
                        key={contributor.id}
                        className={`flex items-center justify-between p-3 rounded-xl border ${
                          contributor.contributed 
                            ? "bg-white border-green-200" 
                            : "bg-white border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                            contributor.contributed ? "bg-green-100" : "bg-gray-100"
                          }`}>
                            {contributor.avatar}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{contributor.name}</p>
                            <p className="text-xs text-muted-foreground">{contributor.relation}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {contributor.contributed ? (
                            <div className="flex items-center gap-1 text-green-600">
                              <Check className="w-4 h-4" />
                              <span className="text-sm font-medium">참여완료</span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">대기중</span>
                          )}
                          {contributor.letterDate && (
                            <p className="text-xs text-muted-foreground">{contributor.letterDate}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 내 편지 작성 영역 */}
                <div className="border-t border-border pt-6">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <PenLine className="w-4 h-4 text-purple-600" />
                    내 편지 작성하기
                  </h3>
                  <Textarea 
                    placeholder="마음을 담아 편지를 작성해주세요..."
                    className="min-h-[120px] resize-none"
                  />
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" className="flex-1">
                      임시저장
                    </Button>
                    <Button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500">
                      <Send className="w-4 h-4 mr-1" />
                      편지 제출하기
                    </Button>
                  </div>
                </div>
              </div>

              {/* 푸터 */}
              <div className="border-t border-border p-4 bg-gray-50 flex justify-between items-center">
                <Button variant="ghost" size="sm" onClick={() => setSelectedCapsule(null)}>
                  닫기
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowInviteModal(true)}>
                    <Share2 className="w-4 h-4 mr-1" />
                    공유하기
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 참여 요청 모달 */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowInviteModal(false)}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-purple-600" />
                  가족/지인에게 참여 요청
                </h3>
                <button onClick={() => setShowInviteModal(false)}>
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-4 mb-4">
                <p className="text-sm text-purple-800 font-medium mb-2">💌 참여 요청 메시지</p>
                <Textarea
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  placeholder="참여를 요청하는 메시지를 작성해주세요"
                  className="min-h-[80px] bg-white"
                />
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">전송 방법 선택</p>
                
                <button
                  onClick={() => {
                    const smsBody = encodeURIComponent(`${inviteMessage}\n\n타임캡슐 참여하기: https://orangeletter.app/capsule/invite/CAPSULE-${selectedCapsule?.id || "1"}`);
                    window.open(`sms:?body=${smsBody}`, "_blank");
                    toast.success("문자 앱이 열렸습니다!");
                    setShowInviteModal(false);
                  }}
                  className="w-full flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-200 hover:bg-green-100 transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-medium text-foreground">문자로 보내기</p>
                    <p className="text-xs text-muted-foreground">SMS 문자 메시지로 초대 링크 전송</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>

                <button
                  onClick={() => {
                    const kakaoMessage = encodeURIComponent(`${inviteMessage}\n\n타임캡슐 참여하기: https://orangeletter.app/capsule/invite/CAPSULE-${selectedCapsule?.id || "1"}`);
                    window.open(`https://sharer.kakao.com/talk/friends/picker/link?url=${encodeURIComponent(`https://orangeletter.app/capsule/invite/CAPSULE-${selectedCapsule?.id || "1"}`)}`, "_blank");
                    toast.success("카카오톡으로 공유합니다!");
                    setShowInviteModal(false);
                  }}
                  className="w-full flex items-center gap-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200 hover:bg-yellow-100 transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-2xl">
                    💬
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-medium text-foreground">카카오톡으로 보내기</p>
                    <p className="text-xs text-muted-foreground">카카오톡으로 초대 링크 전송</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${inviteMessage}\n\n타임캡슐 참여하기: https://orangeletter.app/capsule/invite/CAPSULE-${selectedCapsule?.id || "1"}`);
                    toast.success("링크가 복사되었습니다!");
                    setShowInviteModal(false);
                  }}
                  className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <Copy className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-medium text-foreground">링크 복사하기</p>
                    <p className="text-xs text-muted-foreground">초대 링크를 클립보드에 복사</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 선물 추가 모달 */}
      <AnimatePresence>
        {showGiftModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowGiftModal(false)}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Gift className="w-5 h-5 text-amber-600" />
                  함께 선물하기
                </h3>
                <button onClick={() => setShowGiftModal(false)}>
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                편지와 함께 마음을 담은 선물을 보내보세요. 출소 당일 전달됩니다.
              </p>

              <div className="space-y-3">
                {giftOptions.map((gift) => {
                  const selected = selectedGifts.find(g => g.id === gift.id);
                  return (
                    <div
                      key={gift.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                        selected ? "border-amber-400 bg-amber-50" : "border-border hover:border-amber-200"
                      }`}
                    >
                      <span className="text-3xl">{gift.icon}</span>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{gift.name}</p>
                        <p className="text-xs text-muted-foreground">{gift.description}</p>
                        <p className="text-sm font-semibold text-amber-600 mt-1">{gift.price.toLocaleString()}원</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {selected ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (selected.quantity <= 1) {
                                  setSelectedGifts(selectedGifts.filter(g => g.id !== gift.id));
                                } else {
                                  setSelectedGifts(selectedGifts.map(g => 
                                    g.id === gift.id ? {...g, quantity: g.quantity - 1} : g
                                  ));
                                }
                              }}
                            >
                              -
                            </Button>
                            <span className="w-8 text-center font-medium">{selected.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedGifts(selectedGifts.map(g => 
                                  g.id === gift.id ? {...g, quantity: g.quantity + 1} : g
                                ));
                              }}
                            >
                              +
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedGifts([...selectedGifts, { id: gift.id, quantity: 1 }])}
                          >
                            추가
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedGifts.length > 0 && (
                <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-foreground">총 금액</span>
                    <span className="text-lg font-bold text-amber-600">
                      {selectedGifts.reduce((sum, g) => {
                        const gift = giftOptions.find(go => go.id === g.id);
                        return sum + (gift?.price || 0) * g.quantity;
                      }, 0).toLocaleString()}원
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-2 mt-6">
                <Button variant="outline" className="flex-1" onClick={() => setShowGiftModal(false)}>
                  취소
                </Button>
                <Button 
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500"
                  onClick={() => {
                    toast.success("선물이 추가되었습니다!");
                    setShowGiftModal(false);
                  }}
                >
                  선물 추가하기
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
