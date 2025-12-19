import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Clock, Users, Mail, ChevronLeft, Heart, Calendar, Share2, 
  Lock, Unlock, Sparkles, X, Check, Send, Copy, PenLine, 
  Gift, MessageSquare, UserPlus, CheckCircle2, Package, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import timeCapsuleGif from "@/assets/emoticons/time-capsule.gif";
import { toast } from "sonner";

// 선물 옵션 (오렌지 제거)
const giftOptions = [
  { id: "starbucks", name: "스타벅스 커피", icon: "☕", price: 6000, description: "따뜻한 커피 한 잔의 마음을 전해요" },
  { id: "flower", name: "꽃다발", icon: "💐", price: 15000, description: "아름다운 꽃과 함께 마음을 전해요" },
  { id: "cake", name: "케이크", icon: "🎂", price: 25000, description: "특별한 날을 위한 달콤한 선물" },
  { id: "snack", name: "간식 세트", icon: "🍪", price: 12000, description: "맛있는 간식으로 힘을 전해요" },
];

// 목업 데이터
const mockCapsuleData = {
  1: {
    id: 1,
    title: "아버지 출소 축하 편지 모음",
    recipient: "아버지 (홍길동)",
    recipients: [{ name: "아버지 (홍길동)", facility: "서울구치소" }],
    recipientFacility: "서울구치소",
    targetDate: "2025-06-15",
    status: "collecting",
    isMultiRecipient: false,
    contributors: [
      { id: 1, name: "어머니", relation: "배우자", avatar: "👩", contributed: true, letterDate: "2025-01-02", letterPreview: "사랑하는 여보, 힘든 시간 잘 견뎌줘서 고마워요..." },
      { id: 2, name: "나", relation: "자녀", avatar: "🧑", contributed: true, letterDate: "2025-01-05", letterPreview: "아버지, 저도 많이 성장했어요. 곧 만나요!" },
      { id: 3, name: "여동생", relation: "자녀", avatar: "👧", contributed: false, letterDate: null, letterPreview: null },
      { id: 4, name: "할머니", relation: "부모", avatar: "👵", contributed: true, letterDate: "2024-12-28", letterPreview: "우리 아들, 건강하게 잘 지내고 있지?" },
      { id: 5, name: "삼촌", relation: "형제", avatar: "👨", contributed: false, letterDate: null, letterPreview: null },
    ],
    letterCount: 3,
    targetLetters: 5,
    daysLeft: 178,
    description: "아버지의 출소를 축하하며 가족 모두가 마음을 담아 편지를 모으고 있어요. 출소 당일 전달됩니다.",
    gifts: [{ id: "starbucks", quantity: 2 }, { id: "cake", quantity: 1 }],
    createdBy: "나",
    createdAt: "2024-12-01",
  },
  2: {
    id: 2,
    title: "엄마 면회 때 전할 응원 메시지",
    recipient: "어머니 (김영희)",
    recipients: [{ name: "어머니 (김영희)", facility: "청주여자교도소" }],
    recipientFacility: "청주여자교도소",
    targetDate: "2025-01-20",
    status: "collecting",
    isMultiRecipient: false,
    contributors: [
      { id: 1, name: "아버지", relation: "배우자", avatar: "👨", contributed: true, letterDate: "2025-01-10", letterPreview: "여보, 항상 응원하고 있어. 곧 만나자." },
      { id: 2, name: "큰딸", relation: "자녀", avatar: "👩", contributed: true, letterDate: "2025-01-12", letterPreview: "엄마 사랑해요! 빨리 만나고 싶어요." },
      { id: 3, name: "작은딸", relation: "자녀", avatar: "👧", contributed: false, letterDate: null, letterPreview: null },
    ],
    letterCount: 2,
    targetLetters: 3,
    daysLeft: 32,
    description: "면회 때 전할 가족들의 응원 메시지를 모으고 있어요.",
    gifts: [],
    createdBy: "나",
    createdAt: "2025-01-01",
  },
};

export default function TimeCapsuleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedGifts, setSelectedGifts] = useState<{id: string, quantity: number}[]>([]);
  const [letterContent, setLetterContent] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const capsule = mockCapsuleData[Number(id) as keyof typeof mockCapsuleData];

  if (!capsule) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50/50 to-pink-50/30 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">타임캡슐을 찾을 수 없습니다</p>
          <Button onClick={() => navigate("/")}>돌아가기</Button>
        </div>
      </div>
    );
  }

  const progressPercent = Math.round((capsule.letterCount / capsule.targetLetters) * 100);
  const contributedCount = capsule.contributors.filter(c => c.contributed).length;
  let totalGiftPrice = 0;
  capsule.gifts.forEach((g) => {
    const gift = giftOptions.find(go => go.id === g.id);
    totalGiftPrice += (gift?.price || 0) * g.quantity;
  });

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/50 to-pink-50/30">
      {/* Header */}
      <header className="sticky top-0 z-10 h-14 border-b border-border/40 bg-white/80 backdrop-blur-sm flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            돌아가기
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => {
            navigator.clipboard.writeText(`CAPSULE-${capsule.id}`);
            toast.success("초대 코드가 복사되었습니다!");
          }}>
            <Copy className="w-4 h-4 mr-1" />
            초대 코드
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-1" />
            공유
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* 히어로 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 rounded-3xl p-8 text-white shadow-xl"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative flex items-start gap-6">
            <motion.div 
              className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center p-2 ring-4 ring-white/30 shrink-0"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <img src={timeCapsuleGif} alt="타임캡슐" className="w-20 h-20 object-contain" />
            </motion.div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">
                  {capsule.status === "collecting" ? "🔓 모집중" : "📬 전달완료"}
                </span>
                <span className="bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">
                  D-{capsule.daysLeft}
                </span>
              </div>
              <h1 className="text-2xl font-bold mb-2">{capsule.title}</h1>
              <p className="text-white/80 text-sm mb-1">To. {capsule.recipient}</p>
              <p className="text-white/60 text-xs">{capsule.recipientFacility}</p>
            </div>
          </div>

          {/* 통계 카드 */}
          <div className="relative grid grid-cols-4 gap-3 mt-6">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{capsule.letterCount}/{capsule.targetLetters}</p>
              <p className="text-xs text-white/80">모은 편지</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{contributedCount}/{capsule.contributors.length}</p>
              <p className="text-xs text-white/80">참여 현황</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{capsule.gifts.length}</p>
              <p className="text-xs text-white/80">함께 보낸 선물</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{capsule.targetDate.split("-")[1]}/{capsule.targetDate.split("-")[2]}</p>
              <p className="text-xs text-white/80">전달 예정일</p>
            </div>
          </div>

          {/* 진행률 */}
          <div className="relative mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/80">편지 모음 진행률</span>
              <span className="font-bold">{progressPercent}%</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-white rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
        </motion.div>

        {/* 탭 네비게이션 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-4 bg-white border border-border/60 rounded-xl p-1 h-auto">
            <TabsTrigger value="overview" className="flex items-center gap-1.5 py-2.5 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 rounded-lg">
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">개요</span>
            </TabsTrigger>
            <TabsTrigger value="participants" className="flex items-center gap-1.5 py-2.5 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 rounded-lg">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">참여자</span>
            </TabsTrigger>
            <TabsTrigger value="write" className="flex items-center gap-1.5 py-2.5 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 rounded-lg">
              <PenLine className="w-4 h-4" />
              <span className="hidden sm:inline">편지쓰기</span>
            </TabsTrigger>
            <TabsTrigger value="gifts" className="flex items-center gap-1.5 py-2.5 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 rounded-lg">
              <Gift className="w-4 h-4" />
              <span className="hidden sm:inline">선물</span>
            </TabsTrigger>
          </TabsList>

          {/* 개요 탭 */}
          <TabsContent value="overview" className="mt-6 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-border/60 shadow-sm p-6"
            >
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                타임캡슐 소개
              </h3>
              <p className="text-muted-foreground leading-relaxed">{capsule.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-border/40">
                <div>
                  <p className="text-sm text-muted-foreground">생성일</p>
                  <p className="font-medium">{capsule.createdAt}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">만든 사람</p>
                  <p className="font-medium">{capsule.createdBy}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">전달 예정일</p>
                  <p className="font-medium">{capsule.targetDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">상태</p>
                  <p className="font-medium">{capsule.status === "collecting" ? "모집중" : "전달완료"}</p>
                </div>
              </div>
            </motion.div>

            {/* 최근 참여 활동 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-border/60 shadow-sm p-6"
            >
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                최근 활동
              </h3>
              <div className="space-y-3">
                {capsule.contributors
                  .filter(c => c.contributed)
                  .sort((a, b) => new Date(b.letterDate!).getTime() - new Date(a.letterDate!).getTime())
                  .map((contributor) => (
                    <div key={contributor.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-lg">
                        {contributor.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{contributor.name}님이 편지를 작성했어요</p>
                        <p className="text-xs text-muted-foreground">{contributor.letterDate}</p>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                  ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* 참여자 탭 */}
          <TabsContent value="participants" className="mt-6 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-border/60 shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  참여자 현황 ({contributedCount}/{capsule.contributors.length})
                </h3>
                <Button variant="outline" size="sm">
                  <UserPlus className="w-4 h-4 mr-1" />
                  참여 요청
                </Button>
              </div>

              <div className="space-y-3">
                {capsule.contributors.map((contributor) => (
                  <motion.div 
                    key={contributor.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      contributor.contributed 
                        ? "bg-green-50 border-green-200" 
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                          contributor.contributed ? "bg-green-100" : "bg-gray-100"
                        }`}>
                          {contributor.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{contributor.name}</p>
                          <p className="text-sm text-muted-foreground">{contributor.relation}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {contributor.contributed ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <Check className="w-5 h-5" />
                            <span className="font-medium">참여완료</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground bg-gray-100 px-3 py-1 rounded-full text-sm">대기중</span>
                        )}
                        {contributor.letterDate && (
                          <p className="text-xs text-muted-foreground mt-1">{contributor.letterDate}</p>
                        )}
                      </div>
                    </div>
                    {contributor.letterPreview && (
                      <div className="mt-3 p-3 bg-white rounded-lg border border-green-100">
                        <p className="text-sm text-muted-foreground italic">"{contributor.letterPreview}"</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* 편지 쓰기 탭 */}
          <TabsContent value="write" className="mt-6 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-border/60 shadow-sm p-6"
            >
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <PenLine className="w-5 h-5 text-purple-600" />
                내 편지 작성하기
              </h3>
              
              <div className="bg-purple-50 rounded-xl p-4 mb-4">
                <p className="text-sm text-purple-800">
                  💌 <strong>{capsule.recipient}</strong>에게 전할 마음을 담아 편지를 작성해주세요.
                  <br />작성한 편지는 <strong>{capsule.targetDate}</strong>에 함께 전달됩니다.
                </p>
              </div>

              <Textarea 
                placeholder="마음을 담아 편지를 작성해주세요..."
                value={letterContent}
                onChange={(e) => setLetterContent(e.target.value)}
                className="min-h-[250px] resize-none text-base leading-relaxed"
              />
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/40">
                <p className="text-sm text-muted-foreground">{letterContent.length}자 작성됨</p>
                <div className="flex gap-2">
                  <Button variant="outline">
                    임시저장
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-purple-500 to-pink-500"
                    disabled={letterContent.length < 10}
                  >
                    <Send className="w-4 h-4 mr-1" />
                    편지 제출하기
                  </Button>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* 선물 탭 */}
          <TabsContent value="gifts" className="mt-6 space-y-4">
            {/* 함께 보낸 선물 */}
            {capsule.gifts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-border/60 shadow-sm p-6"
              >
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-green-600" />
                  함께 보낸 선물
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {capsule.gifts.map((gift) => {
                    const giftInfo = giftOptions.find(g => g.id === gift.id);
                    return (
                      <div key={gift.id} className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                        <span className="text-3xl">{giftInfo?.icon}</span>
                        <div>
                          <p className="font-medium text-foreground">{giftInfo?.name}</p>
                          <p className="text-sm text-muted-foreground">x{gift.quantity} · {((giftInfo?.price || 0) * gift.quantity).toLocaleString()}원</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 p-3 bg-green-100 rounded-xl text-center">
                  <p className="text-green-800 font-medium">총 {totalGiftPrice.toLocaleString()}원의 선물이 함께 전달됩니다</p>
                </div>
              </motion.div>
            )}

            {/* 선물 추가하기 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Gift className="w-5 h-5 text-amber-600" />
                    함께 선물하기
                  </h3>
                  <p className="text-sm text-muted-foreground">편지와 함께 마음을 담은 선물을 전달해보세요</p>
                </div>
              </div>

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
                        <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{selected.quantity}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{gift.icon}</span>
                        <div>
                          <p className="font-medium text-foreground">{gift.name}</p>
                          <p className="text-sm text-muted-foreground">{gift.price.toLocaleString()}원</p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {selectedGifts.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 p-4 bg-white rounded-xl border border-amber-200"
                >
                  <div className="flex items-center justify-between mb-3">
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
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-primary text-lg">
                      {selectedGifts.reduce((sum, sg) => {
                        const gift = giftOptions.find(g => g.id === sg.id);
                        return sum + (gift?.price || 0) * sg.quantity;
                      }, 0).toLocaleString()}원
                    </p>
                    <Button className="bg-gradient-to-r from-amber-500 to-orange-500">
                      선물 추가하기
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
