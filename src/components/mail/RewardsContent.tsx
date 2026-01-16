import { Clock, Ticket, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface Prize {
  id: string;
  name: string;
  description: string;
  quantity: number;
  usedQuantity: number;
  expiryDate: string;
  type: "coupon" | "point" | "item";
  icon: string;
}

interface RewardsContentProps {
  onClose?: () => void;
}

// 목업 경품 데이터
const mockPrizes: Prize[] = [
  {
    id: "1",
    name: "우편특급 무료이용권",
    description: "편지 발송 시 우편특급 서비스를 무료로 이용할 수 있습니다.",
    quantity: 100,
    usedQuantity: 0,
    expiryDate: "2025-03-31",
    type: "coupon",
    icon: "🎫",
  },
];

export function RewardsContent({ onClose }: RewardsContentProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const getDaysRemaining = (dateStr: string) => {
    const today = new Date();
    const expiry = new Date(dateStr);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <header className="h-14 border-b border-border/40 bg-white/80 backdrop-blur-sm flex items-center px-6">
        <h1 className="text-lg font-semibold text-foreground">내가 받은 경품</h1>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-10 lg:px-6">
        <div className="max-w-4xl mx-auto">
          {/* 타이틀 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-[18px]">
              이벤트에 참여해서 받은 <span className="text-primary underline underline-offset-4">경품</span>이에요
            </h2>
            <div className="mb-6">
              <p className="text-base text-muted-foreground leading-normal">
                투오렌지 이벤트에 당첨되어 받은 경품을 확인하세요.
                <br />
                경품은 편지 발송 시 결제 단계에서 사용하실 수 있습니다.
              </p>
            </div>
          </div>

        {/* 경품 목록 */}
        <div className="space-y-3">
          {mockPrizes.map((prize, index) => {
            const remainingQuantity = prize.quantity - prize.usedQuantity;

            return (
              <motion.div
                key={prize.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl border border-border/60 p-5 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* 아이콘 */}
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl flex-shrink-0">
                    {prize.icon}
                  </div>

                  {/* 내용 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-foreground text-lg">{prize.name}</h4>
                      <Badge className="bg-primary text-white text-xs border-0 px-2">
                        {remainingQuantity}개 보유
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {prize.description}
                    </p>
                  </div>

                  {/* 버튼 */}
                  <Button
                    className="flex-shrink-0 bg-primary hover:bg-primary/90"
                    disabled={remainingQuantity === 0}
                  >
                    사용하기
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 안내 문구 */}
        <div className="mt-8 p-4 bg-muted/50 rounded-xl">
          <h4 className="text-sm font-medium text-foreground mb-2">이용 안내</h4>
          <ul className="text-xs text-muted-foreground space-y-1.5">
            <li>• 경품은 편지 발송 시 결제 단계에서 자동 적용됩니다.</li>
            <li>• 유효기간이 지난 경품은 사용이 불가합니다.</li>
          </ul>
        </div>
        </div>
      </div>
    </div>
  );
}
