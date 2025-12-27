import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Bell, TrendingUp, Heart } from "lucide-react";
import { motion } from "framer-motion";

// SVG 일러스트 컴포넌트들
const SeedIcon = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <ellipse cx="24" cy="26" rx="14" ry="16" fill="#C4956A"/>
    <ellipse cx="24" cy="24" rx="12" ry="14" fill="#D4A574"/>
    <ellipse cx="19" cy="21" rx="4" ry="5" fill="#E8C4A0" opacity="0.5"/>
  </svg>
);

const SproutIcon = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <ellipse cx="24" cy="42" rx="8" ry="4" fill="#8B7355" opacity="0.3"/>
    <path d="M24 40 L24 28" stroke="#7CB342" strokeWidth="4" strokeLinecap="round"/>
    <ellipse cx="24" cy="20" rx="8" ry="10" fill="#8BC34A"/>
    <ellipse cx="21" cy="17" rx="3" ry="4" fill="#AED581" opacity="0.6"/>
    <path d="M32 22 Q36 18 34 14" stroke="#7CB342" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <ellipse cx="35" cy="13" rx="3" ry="4" fill="#8BC34A" transform="rotate(-30 35 13)"/>
  </svg>
);

const YoungTreeIcon = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <ellipse cx="24" cy="44" rx="10" ry="4" fill="#8B7355" opacity="0.3"/>
    <path d="M24 43 L24 24" stroke="#6B8E23" strokeWidth="4" strokeLinecap="round"/>
    <ellipse cx="14" cy="18" rx="6" ry="9" fill="#8BC34A"/>
    <ellipse cx="24" cy="12" rx="8" ry="10" fill="#7CB342"/>
    <ellipse cx="34" cy="18" rx="6" ry="9" fill="#8BC34A"/>
    <ellipse cx="21" cy="10" rx="3" ry="4" fill="#AED581" opacity="0.5"/>
    <ellipse cx="12" cy="15" rx="2" ry="3" fill="#AED581" opacity="0.5"/>
  </svg>
);

const TreeIcon = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <ellipse cx="24" cy="45" rx="12" ry="4" fill="#8B7355" opacity="0.3"/>
    <path d="M24 44 L24 26" stroke="#5D4037" strokeWidth="5" strokeLinecap="round"/>
    <path d="M24 36 L16 30" stroke="#5D4037" strokeWidth="3" strokeLinecap="round"/>
    <path d="M24 32 L32 26" stroke="#5D4037" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="24" cy="18" r="14" fill="#4CAF50"/>
    <circle cx="24" cy="16" r="11" fill="#66BB6A"/>
    <circle cx="19" cy="13" r="4" fill="#81C784" opacity="0.6"/>
  </svg>
);

const FruitTreeIcon = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <ellipse cx="24" cy="45" rx="12" ry="4" fill="#8B7355" opacity="0.3"/>
    <path d="M24 44 L24 26" stroke="#5D4037" strokeWidth="5" strokeLinecap="round"/>
    <path d="M24 36 L16 30" stroke="#5D4037" strokeWidth="3" strokeLinecap="round"/>
    <path d="M24 32 L32 26" stroke="#5D4037" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="24" cy="18" r="14" fill="#4CAF50"/>
    <circle cx="24" cy="16" r="11" fill="#66BB6A"/>
    {/* 오렌지 열매들 */}
    <circle cx="12" cy="20" r="5" fill="#FF6B35"/>
    <circle cx="12" cy="19" r="4" fill="#FF8A50"/>
    <ellipse cx="12" cy="16" rx="1.5" ry="1" fill="#7CB342"/>
    <circle cx="32" cy="12" r="5" fill="#FF6B35"/>
    <circle cx="32" cy="11" r="4" fill="#FF8A50"/>
    <ellipse cx="32" cy="8" rx="1.5" ry="1" fill="#7CB342"/>
    <circle cx="22" cy="6" r="4" fill="#FF6B35"/>
    <circle cx="22" cy="5" r="3" fill="#FF8A50"/>
    <ellipse cx="22" cy="2" rx="1" ry="0.8" fill="#7CB342"/>
  </svg>
);

// 프로그레스 바용 작은 아이콘들
const SmallSeedIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
    <ellipse cx="20" cy="22" rx="12" ry="14" fill="#C4956A"/>
    <ellipse cx="20" cy="20" rx="10" ry="12" fill="#D4A574"/>
    <ellipse cx="16" cy="18" rx="3" ry="4" fill="#E8C4A0" opacity="0.5"/>
  </svg>
);

const SmallSproutIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
    <ellipse cx="20" cy="34" rx="6" ry="3" fill="#8B7355" opacity="0.3"/>
    <path d="M20 32 L20 22" stroke="#7CB342" strokeWidth="3" strokeLinecap="round"/>
    <ellipse cx="20" cy="16" rx="6" ry="8" fill="#8BC34A"/>
    <ellipse cx="18" cy="14" rx="2" ry="3" fill="#AED581" opacity="0.6"/>
  </svg>
);

const SmallYoungTreeIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
    <ellipse cx="20" cy="36" rx="8" ry="3" fill="#8B7355" opacity="0.3"/>
    <path d="M20 35 L20 18" stroke="#6B8E23" strokeWidth="3" strokeLinecap="round"/>
    <ellipse cx="12" cy="14" rx="5" ry="7" fill="#8BC34A"/>
    <ellipse cx="20" cy="10" rx="6" ry="8" fill="#7CB342"/>
    <ellipse cx="28" cy="14" rx="5" ry="7" fill="#8BC34A"/>
    <ellipse cx="18" cy="8" rx="2" ry="3" fill="#AED581" opacity="0.5"/>
  </svg>
);

const SmallTreeIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
    <ellipse cx="20" cy="37" rx="10" ry="3" fill="#8B7355" opacity="0.3"/>
    <path d="M20 36 L20 20" stroke="#5D4037" strokeWidth="4" strokeLinecap="round"/>
    <path d="M20 28 L14 24" stroke="#5D4037" strokeWidth="2" strokeLinecap="round"/>
    <path d="M20 26 L26 22" stroke="#5D4037" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="20" cy="14" r="12" fill="#4CAF50"/>
    <circle cx="20" cy="12" r="9" fill="#66BB6A"/>
    <circle cx="16" cy="10" r="3" fill="#81C784" opacity="0.6"/>
  </svg>
);

const SmallFruitTreeIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
    <ellipse cx="20" cy="37" rx="10" ry="3" fill="#8B7355" opacity="0.3"/>
    <path d="M20 36 L20 20" stroke="#5D4037" strokeWidth="4" strokeLinecap="round"/>
    <path d="M20 28 L14 24" stroke="#5D4037" strokeWidth="2" strokeLinecap="round"/>
    <path d="M20 26 L26 22" stroke="#5D4037" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="20" cy="14" r="12" fill="#4CAF50"/>
    <circle cx="20" cy="12" r="9" fill="#66BB6A"/>
    <circle cx="10" cy="16" r="4" fill="#FF6B35"/>
    <circle cx="10" cy="16" r="3" fill="#FF8A50"/>
    <circle cx="26" cy="10" r="4" fill="#FF6B35"/>
    <circle cx="26" cy="10" r="3" fill="#FF8A50"/>
    <circle cx="18" cy="6" r="3" fill="#FF6B35"/>
    <circle cx="18" cy="6" r="2" fill="#FF8A50"/>
  </svg>
);

export default function AboutOrangeTree() {
  const navigate = useNavigate();

  const growthStages = [
    { icon: SeedIcon, smallIcon: SmallSeedIcon, name: "씨앗", letters: "0통", description: "모든 시작은 작은 씨앗부터예요. 첫 편지를 보내면 씨앗이 심어집니다." },
    { icon: SproutIcon, smallIcon: SmallSproutIcon, name: "새싹", letters: "5통", description: "답장이 오가기 시작했어요. 작은 새싹이 고개를 내밀었습니다." },
    { icon: YoungTreeIcon, smallIcon: SmallYoungTreeIcon, name: "어린나무", letters: "15통", description: "꾸준한 마음이 나무가 되어가고 있어요. 이제 뿌리가 단단해지고 있습니다." },
    { icon: TreeIcon, smallIcon: SmallTreeIcon, name: "나무", letters: "30통", description: "어느새 나무가 되었어요. 그동안의 시간이 모두 이 안에 담겨있어요." },
    { icon: FruitTreeIcon, smallIcon: SmallFruitTreeIcon, name: "열매나무", letters: "50통+", description: "드디어 열매가 열렸어요! 당신의 마음이 이렇게 자랐습니다." },
  ];

  return (
    <AppLayout>
      <Helmet>
        <title>오렌지 나무 - 떨어져 있어도 함께 자라는 나무</title>
        <meta
          name="description"
          content="편지를 주고받으며 함께 키우는 우리만의 나무. 마음을 전하고 싶은데 어떻게 시작해야 할지 막막하셨나요?"
        />
        <link rel="canonical" href={`${window.location.origin}/about/orange-tree`} />
      </Helmet>

      <div className="h-full overflow-auto bg-gradient-to-b from-orange-50/50 to-white">
        <div className="max-w-3xl mx-auto px-4 py-8">

          {/* Section 1: Hero + What */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-24 h-24 mx-auto mb-6"
            >
              <FruitTreeIcon className="w-full h-full" />
            </motion.div>

            <h1 className="text-xl md:text-2xl font-medium text-foreground leading-relaxed mb-3">
              마음을 전하고 싶은데<br />
              어떻게 시작해야 할지 막막하셨나요?
            </h1>

            <p className="text-base text-orange-600 font-medium mb-8">
              "괜찮아요. 작은 한 마디부터 시작하면 돼요."
            </p>

            {/* 왜 나무일까요? */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-border/40 text-center">
              <h2 className="text-base font-semibold text-foreground mb-4">왜 나무일까요?</h2>
              <p className="text-foreground leading-relaxed mb-3">
                나무는 하루아침에 자라지 않아요.<br />
                관계도 마찬가지예요.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                매일 조금씩, 꾸준히.<br />
                그렇게 쌓인 시간이<br />
                언젠가 열매가 됩니다.
              </p>
            </div>
          </motion.section>

          {/* Section 2: 기능 소개 */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-border/40 text-center">
                <TrendingUp className="w-5 h-5 text-orange-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">성장 기록</p>
                <p className="text-xs text-muted-foreground mt-1">편지가 쌓여가는 걸 눈으로</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-border/40 text-center">
                <Bell className="w-5 h-5 text-orange-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">기념일 알림</p>
                <p className="text-xs text-muted-foreground mt-1">중요한 날을 미리 알려줘요</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-border/40 text-center">
                <Heart className="w-5 h-5 text-orange-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">특별한 순간</p>
                <p className="text-xs text-muted-foreground mt-1">열매가 열리면 함께 축하해요</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-border/40 text-center">
                <svg className="w-5 h-5 text-orange-500 mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <p className="text-sm font-medium text-foreground">우리만의 공간</p>
                <p className="text-xs text-muted-foreground mt-1">오직 둘만 볼 수 있어요</p>
              </div>
            </div>
          </motion.section>

          {/* Section 3: 나무의 성장 이야기 */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10 bg-white rounded-2xl p-5 shadow-sm border border-border/40"
          >
            <h2 className="text-lg font-semibold text-foreground text-center mb-2">나무의 성장 이야기</h2>
            <p className="text-sm text-muted-foreground text-center mb-6">
              편지를 주고받을 때마다 나무가 조금씩 자라요
            </p>

            {/* 프로그레스 바 + 아이콘들 */}
            <div className="relative mb-8">
              {/* 프로그레스 바 배경 - 연한 그레이 */}
              <div className="absolute top-4 left-0 right-0 h-[3px] bg-gray-200 rounded-full" />

              {/* 성장 단계 아이콘들 */}
              <div className="relative flex items-end justify-between">
                {growthStages.map((stage, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <stage.smallIcon />
                    <p className="text-xs text-muted-foreground mt-1">{stage.letters}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 각 단계별 설명 카드 */}
            <div className="space-y-3">
              {growthStages.map((stage, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-orange-50/50 rounded-xl p-4 flex items-start gap-4 hover:bg-gradient-to-br hover:from-orange-50 hover:to-amber-50 transition-colors"
                >
                  <div className="flex-shrink-0 transition-transform hover:scale-110">
                    <stage.icon className="w-12 h-12" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{stage.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">{stage.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Section 4: Trust + CTA */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center pb-8"
          >
            {/* 간단한 신뢰 지표 */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-lg">🌳</span>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-orange-600">1,247그루</span>가 함께 자라고 있어요
              </p>
            </div>

            {/* 후기 (1개만) */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-border/40 mb-6">
              <p className="text-sm text-foreground italic">
                "처음엔 뭐라고 써야 할지 몰랐는데,<br />
                나무가 자라는 걸 보니까 계속 쓰게 되더라고요."
              </p>
              <p className="text-xs text-muted-foreground mt-2">- 김OO님</p>
            </div>

            {/* CTA */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="mb-4"
            >
              <SeedIcon className="w-14 h-14 mx-auto" />
            </motion.div>

            <p className="text-lg font-medium text-foreground mb-4">
              첫 번째 씨앗을 심어볼까요?
            </p>

            <Button
              size="lg"
              className="w-full max-w-xs bg-orange-500 hover:bg-orange-600 text-white py-5 text-base font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              onClick={() => navigate("/", { state: { viewMode: "orangetree" } })}
            >
              🍊 내 오렌지나무 시작하기
            </Button>

            <button
              onClick={() => navigate("/")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors mt-3 block mx-auto"
            >
              나중에 할게요 →
            </button>
          </motion.section>
        </div>
      </div>
    </AppLayout>
  );
}
