import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Mail, Stamp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AppLayout } from "@/components/layout/AppLayout";
import { toast } from "sonner";

// 플레이스홀더 예시 데이터
const placeholderExamples = [
  {
    text: "처음엔 망설였지만,\n한 줄을 쓰고 나니 마음이 조금 가벼워졌어요.",
    author: "서울 교도소 김O은 엄마"
  },
  {
    text: "누군가에게 마음을 전할 수 있는\n기준이 생긴 느낌이었어요.",
    author: "서울 교도소 홍O훈 형제"
  },
  {
    text: "매주 금요일이 기다려지는 건\n오랜만이에요.",
    author: "대전 교도소 박O수 아내"
  },
  {
    text: "짧은 한 줄이었지만,\n아버지가 울으셨대요.",
    author: "인천 교도소 이O현 딸"
  },
];

export default function ReviewWrite() {
  const navigate = useNavigate();
  const [review, setReview] = useState("");
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 플레이스홀더 롤링 효과
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholderIndex((prev) =>
        (prev + 1) % placeholderExamples.length
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async () => {
    if (!review.trim()) {
      toast.error("후기를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    // 실제로는 API 호출
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success("후기가 등록되었습니다! 무료 우표가 지급되었어요.");
    navigate("/");
    setIsSubmitting(false);
  };

  const handleSkip = () => {
    navigate("/");
  };

  const currentExample = placeholderExamples[currentPlaceholderIndex];

  return (
    <AppLayout>
      <Helmet>
        <title>후기 작성 - Orange Mail</title>
      </Helmet>

      <div className="h-full overflow-auto bg-muted/30">
        {/* Header */}
        <header className="h-14 border-b border-border/40 bg-white/80 backdrop-blur-sm flex items-center px-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">뒤로가기</span>
          </button>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-10">
          <div className="bg-white rounded-2xl border border-border/60 p-8 space-y-8">

            {/* 타이틀 섹션 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-orange-100 flex items-center justify-center">
                <Stamp className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  후기를 작성해주신 분께는
                </h1>
                <p className="text-lg text-primary font-semibold">
                  손편지용 우표를 무료로 제공해드려요.
                </p>
              </div>
            </div>

            {/* 후기 입력 영역 */}
            <div className="space-y-4">
              <div className="relative">
                <Textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="후기 내용을 입력해주세요"
                  className="min-h-[160px] text-base border-border/60 resize-none p-4"
                />
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  (짧은 한 줄도 괜찮아요)
                </p>
              </div>

              {/* 플레이스홀더 예시 롤링 */}
              <div className="bg-orange-50 rounded-xl p-6 min-h-[140px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPlaceholderIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <p className="text-muted-foreground italic whitespace-pre-line leading-relaxed mb-3">
                      "{currentExample.text}"
                    </p>
                    <p className="text-sm text-muted-foreground/70">
                      - {currentExample.author}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* CTA 버튼 영역 */}
            <div className="space-y-3 pt-4">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full h-14 text-base font-semibold bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white rounded-xl"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    처리 중...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    후기 한줄 남기고 무료 우편 받기
                  </span>
                )}
              </Button>

              <button
                onClick={handleSkip}
                className="w-full py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                나중에 할래요
              </button>
            </div>

          </div>
        </main>
      </div>
    </AppLayout>
  );
}
