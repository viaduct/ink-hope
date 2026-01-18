import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

// 롤링 메시지 데이터
const messages = [
  {
    id: 1,
    type: '쪽지',
    content: '별일 없어도 안부 남기고 싶었어 오늘도 잘 견뎌줘서 고마워. 무사히 하루 보냈기를 바라.',
    sender: '친구',
    date: '2026.2.12 10:00',
    avatar: '/7fbdbcaf3cf21c7f39c2da9974d9094a8234e755.png',
  },
  {
    id: 2,
    type: '쪽지',
    content: '네가 나오는 날까지 우리 다 너 기다리고 있으니까, 힘내자!',
    sender: '김흥오(엄마)',
    date: '2026.2.12 10:00',
    avatar: '/2ae7077bc7abdb19b28ad47b8561f4b6154115ee.png',
  },
  {
    id: 3,
    type: '선물',
    content: '커피쿠폰 5장 선물을 보냈습니다  🧡',
    sender: '김흥오(엄마)',
    date: '2026.2.12 10:00',
    avatar: '/2ae7077bc7abdb19b28ad47b8561f4b6154115ee.png',
  },
];

// 목업 데이터
const mockCapsuleData: Record<string, {
  id: number;
  recipientName: string;
  eventLabel: string;
  targetDate: string;
  daysLeft: number;
  letterCount: number;
  giftCount: number;
}> = {
  "1": {
    id: 1,
    recipientName: "서은우",
    eventLabel: "출소 축하",
    targetDate: "2026.12.23",
    daysLeft: 180,
    letterCount: 9,
    giftCount: 5,
  },
};

type TabType = "write" | "status" | "gift" | "prepare";

// 선물 카드 데이터
interface GiftCard {
  id: string;
  category: string;
  name: string;
  price: number;
  description: string;
  exampleMessage: string;
  image?: string;
}

const giftCards: GiftCard[] = [
  {
    id: "coffee",
    category: "가볍게 툭",
    name: "스타벅스 커피쿠폰",
    price: 5500,
    description: "예시 메시지",
    exampleMessage: "날씨도 추운데, 매일 같이 가던 카페에서\n커피한잔하기 딱 좋은날이네",
  },
  {
    id: "gukbap",
    category: "밥한번 사줄게요",
    name: "국밥 한그릇",
    price: 9000,
    description: "예시 메시지",
    exampleMessage: "밥한번 같이 먹고싶다. 나와서 맛있는 국밥 먹으러가자. 기다리고있으마. 힘내자",
  },
  {
    id: "chimaek",
    category: "같이 쓰는 약속형",
    name: "치맥",
    price: 25000,
    description: "예시 메시지",
    exampleMessage: "이맘때쯤 너랑 우리집에서 치맥하면서\n밤새 술마신거 생각난다! 나오면 맥주한잔하자 친구야",
  },
  {
    id: "orange",
    category: "오렌지 나무",
    name: "오렌지",
    price: 10000,
    description: "그날을 위해 남겨두는 마음",
    exampleMessage: "하나 선물하면 마이페이지\n내 선물내역에서 확인할 수 있어요.",
    image: "/present-orange-thumbnail.png",
  },
];

export default function TimeCapsuleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("write");
  const [message, setMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // 결제 관련 상태
  const [selectedGift, setSelectedGift] = useState<GiftCard | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentSuccessModal, setShowPaymentSuccessModal] = useState(false);
  const [userPoints, setUserPoints] = useState(10000); // 사용자 보유 포인트
  const [giftMessage, setGiftMessage] = useState("");

  // 선물 카드 선택 핸들러
  const handleSelectGift = (gift: GiftCard) => {
    setSelectedGift(gift);
    setGiftMessage("");
    setShowPaymentModal(true);
  };

  // 결제 처리 핸들러
  const handlePayment = () => {
    if (!selectedGift) return;
    if (userPoints < selectedGift.price) {
      alert("포인트가 부족합니다.");
      return;
    }
    // 포인트 차감
    setUserPoints(prev => prev - selectedGift.price);
    setShowPaymentModal(false);
    setShowPaymentSuccessModal(true);
  };

  // 쪽지 보내기 핸들러
  const handleSendMessage = () => {
    if (!message.trim()) return;
    setMessage("");
    setShowSuccessModal(true);
  };

  const capsule = mockCapsuleData[id || "1"];

  const tabs: { id: TabType; label: string }[] = [
    { id: "write", label: "쪽지 작성하기" },
    { id: "status", label: "타임캡슐 현황" },
    { id: "gift", label: "선물하기" },
  ];

  // 무한 롤링을 위해 메시지 복제
  const duplicatedMessages = [...messages, ...messages];

  if (!capsule) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">타임캡슐을 찾을 수 없습니다</p>
            <Button onClick={() => navigate("/time-capsule")}>돌아가기</Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Helmet>
        <title>To. {capsule.recipientName} - Orange Mail</title>
      </Helmet>

      {/* CSS for animations */}
      <style>{`
        @keyframes scroll-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .animate-scroll-up {
          animation: scroll-up 20s linear infinite;
        }
        @keyframes bounce-slow-1 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes bounce-slow-2 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes bounce-slow-3 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes bounce-slow-4 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-7px); }
        }
        @keyframes bounce-slow-5 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes bounce-slow-6 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-bounce-slow-1 { animation: bounce-slow-1 2s ease-in-out infinite; }
        .animate-bounce-slow-2 { animation: bounce-slow-2 2.2s ease-in-out infinite 0.2s; }
        .animate-bounce-slow-3 { animation: bounce-slow-3 1.8s ease-in-out infinite 0.4s; }
        .animate-bounce-slow-4 { animation: bounce-slow-4 2.4s ease-in-out infinite 0.1s; }
        .animate-bounce-slow-5 { animation: bounce-slow-5 2s ease-in-out infinite 0.3s; }
        .animate-bounce-slow-6 { animation: bounce-slow-6 2.1s ease-in-out infinite 0.5s; }
      `}</style>

      <div className="h-full overflow-auto bg-muted/30 relative">
        {/* Header */}
        <header className="h-14 border-b border-border/40 bg-white/80 backdrop-blur-sm flex items-center justify-between px-3 md:px-6">
          <button
            onClick={() => navigate("/time-capsule")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm hidden md:inline">타임캡슐로 돌아가기</span>
          </button>
          <div className="flex items-center gap-2 md:gap-4">
            <span className="text-[#ff7430] text-[13px] md:text-[14px] font-semibold">
              전달일: {capsule.targetDate}
            </span>
            <button
              onClick={() => navigate(`/time-capsule/${id}/edit`)}
              className="bg-[#ff7d3c] text-white text-[13px] md:text-[14px] font-medium px-3 md:px-4 py-1.5 md:py-2 rounded-[8px] flex items-center gap-1 md:gap-1.5 hover:bg-[#ff6b24] transition-colors"
            >
              <svg className="w-4 h-4 hidden md:block" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.25 12.9375V15.75H5.0625L13.3575 7.455L10.545 4.6425L2.25 12.9375ZM15.5325 5.28C15.825 4.9875 15.825 4.515 15.5325 4.2225L13.7775 2.4675C13.485 2.175 13.0125 2.175 12.72 2.4675L11.3475 3.84L14.16 6.6525L15.5325 5.28Z" fill="white"/>
              </svg>
              <span className="md:hidden">수정</span>
              <span className="hidden md:inline">타임캡슐 수정하기</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center py-9 px-4 pb-10">
          {/* Header */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <span className="bg-[#fdf3e3] text-[#ff7430] px-4 py-1.5 rounded-full text-[15px] font-medium">
              {capsule.eventLabel}
            </span>
            <h1 className="text-[#010101] text-[24px] tracking-[-0.48px]">
              <span className="font-semibold">To. </span>
              <span className="font-bold">{capsule.recipientName}</span>
              <span className="font-normal text-[22px] tracking-[-0.44px]">를 위한 타임캡슐</span>
            </h1>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 w-full max-w-[491px]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2.5 rounded-full text-[14px] md:text-[16px] transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#ff7512] text-white font-semibold'
                    : 'bg-white border border-[#e4e4e4] text-[#767676]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'write' && (
              <motion.div
                key="write"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full max-w-[491px]"
              >
                {/* Write Card */}
                <div className="bg-white border border-[rgba(253,116,47,0.68)] rounded-[17px] shadow-[0px_0px_12.3px_0px_rgba(0,0,0,0.08)] p-7 mb-8">
                  <div className="flex flex-col items-center gap-0">
                    <div className="w-full">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="말한마디가 정말 큰 힘이됩니다."
                        className="w-full h-[164px] border border-[rgba(0,0,0,0.2)] rounded-[14px] p-4 text-[17px] text-[#333] placeholder-[#bebebe] resize-none focus:outline-none focus:border-[#ff7430]"
                      />
                      <p className="text-[13px] text-[#999] mt-[5px] text-right">2026.3.23</p>
                    </div>
                    <button
                      onClick={handleSendMessage}
                      className="bg-[#ff7d3c] text-white text-[16px] font-semibold leading-[24px] px-6 py-3.5 rounded-[14px] hover:bg-[#ff6b24] transition-colors"
                    >
                      쪽지 보내기
                    </button>
                  </div>
                </div>

                {/* Messages List with Rolling Animation */}
                <div className="w-full max-w-[502px] h-[300px] overflow-hidden relative mx-auto">
                  <div className="absolute top-0 left-0 right-0 h-[80px] bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
                  <div className="animate-scroll-up flex flex-col gap-4 pt-[80px]">
                    {duplicatedMessages.map((msg, index) => (
                      <div key={`${msg.id}-${index}`} className="flex gap-2">
                        <div className="w-[46px] h-[46px] rounded-full border border-[#ff7430] bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                          {msg.avatar ? (
                            <img src={msg.avatar} alt={msg.sender} className="w-[34px] h-[34px] rounded-full object-cover" />
                          ) : (
                            <div className="w-[34px] h-[34px] rounded-full bg-gray-200" />
                          )}
                        </div>
                        <div className="flex-1 flex flex-col gap-4">
                          <div className="bg-[#f9f9f9] rounded-tl-[20px] rounded-tr-[4px] rounded-br-[20px] rounded-bl-[4px] px-3 py-3.5">
                            <div className="flex gap-1.5 items-start">
                              <span className="bg-[#ffdfad] text-[#fd752f] text-[12px] px-2 py-0.5 rounded-full tracking-[-0.24px] flex-shrink-0">
                                {msg.type}
                              </span>
                              <p className="text-[#333] text-[16px] leading-[1.4] tracking-[-0.32px] whitespace-pre-wrap">
                                {msg.content}
                              </p>
                            </div>
                          </div>
                          <p className="text-right text-[14px] text-[#898989] tracking-[-0.28px]">
                            <span className="font-semibold">{msg.sender}</span> {msg.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-[60px] bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
                </div>
              </motion.div>
            )}

            {activeTab === 'status' && (
              <motion.div
                key="status"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full max-w-[896px] flex flex-col lg:flex-row gap-5"
              >
                {/* Left Card - 이만큼 모았어요 */}
                <div className="flex-1 flex flex-col">
                  {/* Card Header */}
                  <div className="bg-white border border-[#d4d4d4] rounded-t-[20px] p-[10px] relative">
                    <div className="flex items-center gap-1">
                      <span className="text-[#ff9500] text-lg">●</span>
                      <span className="text-[#ffb800] text-lg">●</span>
                      <span className="text-[#4cd964] text-lg">●</span>
                    </div>
                    <p className="text-[15px] font-medium text-black tracking-[-0.3px] text-center absolute left-0 right-0 top-1/2 -translate-y-1/2 pointer-events-none">이만큼 모았어요!</p>
                  </div>

                  {/* Card Body */}
                  <div className="bg-white border border-t-0 border-[#d4d4d4] rounded-b-[11px] p-8 flex-1 flex flex-col items-center justify-center">
                    <div className="relative">
                      <img src="/timecapsule-data.png" alt="타임캡슐 현황" className="max-w-full h-auto" />

                      {/* 프로필 이미지들 - 궤도 주변 바운스 효과 */}
                      <div className="absolute top-[12%] left-[44%] w-[40px] h-[40px] rounded-full bg-white overflow-hidden shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] animate-bounce-slow-1">
                        <img src="/timecapsule-img1.png" alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute top-[12%] right-[2%] w-[38px] h-[38px] rounded-full bg-white overflow-hidden shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] animate-bounce-slow-2">
                        <img src="/timecapsule-img2.png" alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute top-[52%] -left-[3%] w-[43px] h-[43px] rounded-full border border-[#ff7430] bg-white overflow-hidden shadow-[0px_0px_3.4px_0px_rgba(95,95,95,0.24)] animate-bounce-slow-3">
                        <img src="/timecapsule-img3.png" alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute top-[44%] right-[0%] w-[44px] h-[44px] rounded-full bg-white overflow-hidden shadow-[0px_0px_3.4px_0px_rgba(95,95,95,0.24)] animate-bounce-slow-4">
                        <img src="/timecapsule-img4.png" alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute bottom-[8%] left-[24%] w-[31px] h-[31px] rounded-full bg-white overflow-hidden shadow-[0px_0px_3.1px_0px_rgba(0,0,0,0.15)] animate-bounce-slow-5">
                        <img src="/timecapsule-img5.png" alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute bottom-[6%] right-[28%] w-[43px] h-[43px] rounded-full bg-white overflow-hidden shadow-[0px_0px_3.4px_0px_rgba(95,95,95,0.24)] animate-bounce-slow-6">
                        <img src="/timecapsule-img6.png" alt="" className="w-full h-full object-cover" />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-center gap-5 mt-8">
                      <span className="text-black text-[16px] font-medium tracking-[-0.32px]">🧡 쪽지: {capsule.letterCount}개</span>
                      <span className="text-black text-[16px] font-medium tracking-[-0.32px]">🧡 선물: {capsule.giftCount}개</span>
                    </div>
                  </div>
                </div>

                {/* Right Card - AI 요약 */}
                <div className="flex-1 flex flex-col">
                  {/* Card Header */}
                  <div className="bg-white border border-[#d4d4d4] rounded-t-[20px] p-[10px] relative">
                    <div className="flex items-center gap-1">
                      <span className="text-[#ff9500] text-lg">●</span>
                      <span className="text-[#ffb800] text-lg">●</span>
                      <span className="text-[#4cd964] text-lg">●</span>
                    </div>
                    <p className="text-[15px] font-medium text-black tracking-[-0.3px] text-center absolute left-0 right-0 top-1/2 -translate-y-1/2 pointer-events-none">🤖 <span className="font-semibold text-[#2f2f2f]">AI 요약</span></p>
                  </div>

                  {/* Card Body */}
                  <div className="bg-white border border-t-0 border-[#d4d4d4] rounded-b-[20px] p-6 flex-1 overflow-y-auto h-[400px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    <div className="flex flex-col gap-6">
                      {/* Message 1 */}
                      <div className="flex gap-2">
                        <div className="w-[46px] h-[46px] rounded-full border border-[#ff7430] bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                          <img src="/2ae7077bc7abdb19b28ad47b8561f4b6154115ee.png" alt="" className="w-[34px] h-[34px] rounded-full object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col gap-4">
                          <div className="bg-[#f9f9f9] rounded-tl-[20px] rounded-tr-[4px] rounded-br-[20px] rounded-bl-[4px] px-3 py-3.5">
                            <div className="flex gap-1.5 items-start">
                              <span className="bg-[#ffdfad] text-[#fd752f] text-[12px] px-2 py-0.5 rounded-full flex-shrink-0">쪽지</span>
                              <p className="text-[#333] text-[16px] leading-[1.4]">오늘 하루도 정말 고생많았어!! 화이팅하자~오늘 하루도 정말 고생많았어!! 화이팅하자~오늘 하루도 정말 고생많았어!! 화이팅하자~</p>
                            </div>
                          </div>
                          <div className="bg-[#f9f9f9] rounded-tl-[20px] rounded-tr-[4px] rounded-br-[20px] rounded-bl-[4px] px-3 py-3.5">
                            <div className="flex gap-1.5 items-center">
                              <span className="bg-[#ffdfad] text-[#fd752f] text-[12px] px-2 py-0.5 rounded-full flex-shrink-0">선물</span>
                              <p className="text-[#333] text-[16px] leading-[1.4]">커피쿠폰 5장 선물을 보냈습니다 🧡</p>
                            </div>
                          </div>
                          <p className="text-right text-[14px] text-[#898989]">
                            <span className="font-semibold">김흥오(엄마)</span> 2026.2.12 10:00
                          </p>
                        </div>
                      </div>

                      {/* AI Message */}
                      <div className="flex gap-2">
                        <div className="w-[44px] h-[44px] rounded-full border border-[#ff7430] bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                          <div className="w-[24px] h-[24px] rounded-full bg-gradient-to-br from-orange-400 to-orange-500" />
                        </div>
                        <div className="flex-1">
                          <div className="bg-[#fff6e7] rounded-tl-[20px] rounded-tr-[4px] rounded-br-[20px] rounded-bl-[4px] px-3 py-3.5">
                            <p className="text-[#333] text-[16px] leading-[1.4]">우와! 이번주 총 20개의 쪽지들이 모였어요 🙌🏻</p>
                          </div>
                        </div>
                      </div>

                      {/* Message 2 */}
                      <div className="flex gap-2">
                        <div className="w-[46px] h-[46px] rounded-full border border-[#ff7430] bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                          <img src="/2ae7077bc7abdb19b28ad47b8561f4b6154115ee.png" alt="" className="w-[34px] h-[34px] rounded-full object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col gap-4">
                          <div className="bg-[#f9f9f9] rounded-tl-[20px] rounded-tr-[4px] rounded-br-[20px] rounded-bl-[4px] px-3 py-3.5">
                            <div className="flex gap-1.5 items-start">
                              <span className="bg-[#ffdfad] text-[#fd752f] text-[12px] px-2 py-0.5 rounded-full flex-shrink-0">쪽지</span>
                              <p className="text-[#333] text-[16px] leading-[1.4]">오늘 하루도 정말 고생많았어!! 화이팅하자~오늘 하루도 정말 고생많았어!! 화이팅하자~오늘 하루도 정말 고생많았어!! 화이팅하자~</p>
                            </div>
                          </div>
                          <p className="text-right text-[14px] text-[#898989]">
                            <span className="font-semibold">김흥오(엄마)</span> 2026.2.12 10:00
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'gift' && (
              <motion.div
                key="gift"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full max-w-[896px]"
              >
                {/* Title */}
                <h2 className="text-[20px] font-semibold text-black tracking-[-0.4px] leading-[1.2] mb-4">
                  이런 선물 해보는건 어때요?
                </h2>

                {/* Notice */}
                <div className="flex items-center gap-2 mb-8">
                  <span className="text-[#fd752f] text-[14px] font-bold tracking-[-0.28px]">필독</span>
                  <span className="text-[#4b4b4b] text-[13px] tracking-[-0.26px]">
                    투오렌지는 선물을 사용 가능한 형태로 전환해 필요한 순간에 닿을 수 있도록 전달합니다.
                  </span>
                </div>

                {/* 보유 포인트 표시 */}
                <div className="flex items-center justify-end mb-6">
                  <div className="bg-[#fff8ed] px-4 py-2 rounded-full flex items-center gap-2">
                    <span className="text-[14px] text-[#5f5f63]">보유 포인트</span>
                    <span className="text-[16px] font-bold text-[#ff7430]">{userPoints.toLocaleString()}P</span>
                  </div>
                </div>

                {/* Gift Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-8">
                  {giftCards.map((gift) => (
                    <div key={gift.id}>
                      <h3 className="text-[18px] font-semibold text-[#5f5f63] tracking-[-0.36px] leading-[1.5] mb-4">
                        {gift.category}
                      </h3>
                      <div
                        onClick={() => handleSelectGift(gift)}
                        className={`border ${
                          selectedGift?.id === gift.id ? 'border-[#ff7430]' : 'border-[#eaeaea]'
                        } rounded-[8px] p-5 flex gap-[18px] items-center cursor-pointer hover:border-[#fd752f] hover:shadow-md transition-all`}
                      >
                        <div className="w-[117px] h-[117px] bg-[#fff8ed] rounded-[9px] flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {gift.image ? (
                            <img src={gift.image} alt={gift.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[#5f5f63] text-[13px] tracking-[-0.26px] text-center">{gift.name}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-[#c2c2c2] text-[13px] tracking-[-0.26px] leading-[1.5] mb-1.5">{gift.description}</p>
                          <p className="text-[#5f5f63] text-[13px] tracking-[-0.26px] leading-[1.5] whitespace-pre-line">
                            {gift.exampleMessage}
                          </p>
                          <p className="text-[#ff7430] text-[14px] font-semibold mt-2">{gift.price.toLocaleString()}P</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'prepare' && (
              <motion.div
                key="prepare"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center text-[#808080] text-[16px] py-20"
              >
                준비하기 기능 준비중입니다.
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* 쪽지 전송 성공 모달 */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-[320px] rounded-[20px] p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            {/* 오렌지 아이콘 */}
            <div className="w-16 h-16 rounded-full bg-[#fff3e0] flex items-center justify-center">
              <img src="/timecapsule-orange.png" alt="orange" className="w-10 h-10" />
            </div>

            <h3 className="text-[20px] font-bold text-[#333] leading-[1.4]">
              전해질 날을 향해
            </h3>
            <p className="text-[15px] text-[#666] leading-[1.5]">
              타임캡슐이 차곡차곡 채워지고 있어요.
            </p>

            {/* 버튼들 */}
            <div className="flex gap-3 w-full mt-2">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="flex-1 py-3 rounded-[12px] border border-[#e0e0e0] text-[15px] font-medium text-[#666] hover:bg-gray-50 transition-colors"
              >
                닫기
              </button>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setActiveTab("status");
                }}
                className="flex-1 py-3 rounded-[12px] bg-[#ff7d3c] text-white text-[15px] font-medium hover:bg-[#ff6b24] transition-colors"
              >
                타임캡슐 현황
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 결제 확인 모달 */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="max-w-[400px] rounded-[20px] p-0 overflow-hidden">
          {selectedGift && (
            <div className="flex flex-col">
              {/* 헤더 */}
              <div className="bg-[#ff7430] px-6 py-4">
                <h3 className="text-[18px] font-bold text-white">선물하기</h3>
              </div>

              {/* 내용 */}
              <div className="p-6">
                {/* 선택한 선물 정보 */}
                <div className="bg-[#fff8ed] rounded-[12px] p-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-[60px] h-[60px] bg-white rounded-[8px] flex items-center justify-center overflow-hidden">
                      {selectedGift.image ? (
                        <img src={selectedGift.image} alt={selectedGift.name} className="w-[40px] h-[40px] object-contain" />
                      ) : (
                        <span className="text-[12px] text-[#5f5f63] text-center">{selectedGift.name}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-[16px] font-semibold text-[#333]">{selectedGift.name}</p>
                      <p className="text-[14px] text-[#ff7430] font-bold">{selectedGift.price.toLocaleString()}P</p>
                    </div>
                  </div>
                </div>

                {/* 메시지 입력 */}
                <div className="mb-6">
                  <label className="text-[14px] font-medium text-[#333] mb-1 block">함께 마음을 전할 메시지를 입력해주세요</label>
                  <p className="text-[12px] text-[#ff7430] mb-2">오렌지하나가 출소후 큰힘이 됩니다.</p>
                  <textarea
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    className="w-full h-[100px] border border-[#e0e0e0] rounded-[12px] p-3 text-[14px] resize-none focus:outline-none focus:border-[#ff7430]"
                    placeholder="메시지를 입력해주세요"
                  />
                </div>

                {/* 결제 정보 */}
                <div className="border-t border-[#eee] pt-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[14px] text-[#666]">보유 포인트</span>
                    <span className="text-[14px] text-[#333]">{userPoints.toLocaleString()}P</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[14px] text-[#666]">차감 포인트</span>
                    <span className="text-[14px] text-[#ff7430] font-semibold">-{selectedGift.price.toLocaleString()}P</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-[#eee]">
                    <span className="text-[15px] font-semibold text-[#333]">결제 후 잔액</span>
                    <span className="text-[16px] font-bold text-[#ff7430]">
                      {(userPoints - selectedGift.price).toLocaleString()}P
                    </span>
                  </div>
                </div>

                {/* 포인트 부족 경고 */}
                {userPoints < selectedGift.price && (
                  <div className="bg-[#fff0f0] border border-[#ffcccc] rounded-[8px] p-3 mb-4">
                    <p className="text-[13px] text-[#ff4444]">
                      포인트가 부족합니다. 포인트를 충전해주세요.
                    </p>
                  </div>
                )}

                {/* 버튼들 */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="flex-1 py-3.5 rounded-[12px] border border-[#e0e0e0] text-[15px] font-medium text-[#666] hover:bg-gray-50 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={userPoints < selectedGift.price}
                    className={`flex-1 py-3.5 rounded-[12px] text-[15px] font-semibold transition-colors ${
                      userPoints >= selectedGift.price
                        ? 'bg-[#ff7430] text-white hover:bg-[#ff6b24]'
                        : 'bg-[#ccc] text-white cursor-not-allowed'
                    }`}
                  >
                    오렌지 보내기
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 결제 성공 모달 */}
      <Dialog open={showPaymentSuccessModal} onOpenChange={setShowPaymentSuccessModal}>
        <DialogContent className="max-w-[320px] rounded-[20px] p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            {/* 체크 아이콘 */}
            <div className="w-16 h-16 rounded-full bg-[#e8f5e9] flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#4caf50"/>
              </svg>
            </div>

            <h3 className="text-[20px] font-bold text-[#333] leading-[1.4]">
              선물 전송 완료!
            </h3>
            <p className="text-[15px] text-[#666] leading-[1.5]">
              {selectedGift?.name} 선물이<br />
              타임캡슐에 담겼습니다.
            </p>

            {/* 버튼들 */}
            <div className="flex gap-3 w-full mt-2">
              <button
                onClick={() => {
                  setShowPaymentSuccessModal(false);
                  setSelectedGift(null);
                }}
                className="flex-1 py-3 rounded-[12px] border border-[#e0e0e0] text-[15px] font-medium text-[#666] hover:bg-gray-50 transition-colors"
              >
                닫기
              </button>
              <button
                onClick={() => {
                  setShowPaymentSuccessModal(false);
                  setSelectedGift(null);
                  setActiveTab("status");
                }}
                className="flex-1 py-3 rounded-[12px] bg-[#ff7d3c] text-white text-[15px] font-medium hover:bg-[#ff6b24] transition-colors"
              >
                타임캡슐 현황
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
