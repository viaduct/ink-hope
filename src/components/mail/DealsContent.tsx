import { Tag, X, Clock, ChevronRight, Percent, Zap, Gift, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface DealsContentProps {
  onClose?: () => void;
}

interface Deal {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountPrice: number;
  discountRate: number;
  expiryDate: string;
  type: "time-limited" | "quantity-limited" | "first-come";
  remainingQuantity?: number;
  icon: string;
  tags: string[];
}

// 목업 특가 데이터
const mockDeals: Deal[] = [
  {
    id: "1",
    title: "우편특급 50% 할인",
    description: "빠른 배송이 필요할 때! 우편특급 서비스를 반값에 이용하세요.",
    originalPrice: 3000,
    discountPrice: 1500,
    discountRate: 50,
    expiryDate: "2025-01-31",
    type: "time-limited",
    icon: "⚡",
    tags: ["인기", "마감임박"],
  },
  {
    id: "2",
    title: "편지지 세트 30% 할인",
    description: "감성 가득한 프리미엄 편지지 세트를 특별 가격에 만나보세요.",
    originalPrice: 5000,
    discountPrice: 3500,
    discountRate: 30,
    expiryDate: "2025-02-28",
    type: "quantity-limited",
    remainingQuantity: 23,
    icon: "📝",
    tags: ["신규"],
  },
  {
    id: "3",
    title: "첫 편지 무료 발송",
    description: "처음 이용하시는 분께 첫 편지 발송을 무료로 드립니다.",
    originalPrice: 2000,
    discountPrice: 0,
    discountRate: 100,
    expiryDate: "2025-12-31",
    type: "first-come",
    icon: "🎁",
    tags: ["신규회원"],
  },
  {
    id: "4",
    title: "타임캡슐 생성 20% 할인",
    description: "소중한 사람에게 보내는 타임캡슐, 지금 만들면 20% 할인!",
    originalPrice: 10000,
    discountPrice: 8000,
    discountRate: 20,
    expiryDate: "2025-02-15",
    type: "time-limited",
    icon: "⏰",
    tags: ["추천"],
  },
];

export function DealsContent({ onClose }: DealsContentProps) {
  const formatPrice = (price: number) => {
    return price.toLocaleString("ko-KR") + "원";
  };

  const getDaysRemaining = (dateStr: string) => {
    const today = new Date();
    const expiry = new Date(dateStr);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTypeBadge = (type: Deal["type"]) => {
    switch (type) {
      case "time-limited":
        return <Badge className="bg-orange-100 text-orange-600 text-xs border-0"><Clock className="w-3 h-3 mr-1" />기간 한정</Badge>;
      case "quantity-limited":
        return <Badge className="bg-orange-100 text-orange-600 text-xs border-0"><Zap className="w-3 h-3 mr-1" />수량 한정</Badge>;
      case "first-come":
        return <Badge className="bg-orange-100 text-orange-600 text-xs border-0"><Gift className="w-3 h-3 mr-1" />선착순</Badge>;
    }
  };

  const handleApply = (deal: Deal) => {
    toast.success(`"${deal.title}" 쿠폰이 적용되었습니다.`);
  };

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-orange-50/50 to-amber-50/30 overflow-hidden">
      {/* Header */}
      <header className="h-14 border-b border-border/40 bg-white/80 backdrop-blur-sm flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Tag className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-semibold text-foreground">특가 할인</h1>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          편지함으로 돌아가기
        </Button>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* 설명 배너 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-5 mb-6 border border-orange-200/40"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <Percent className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">특가 할인이란?</h2>
              <p className="text-xs text-muted-foreground">편지 발송 시 사용할 수 있는 할인 혜택</p>
            </div>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed">
            우편특급, 편지지, 타임캡슐 등 다양한 서비스를 <span className="font-semibold text-orange-600">최대 50% 할인</span>된 가격에 이용하세요. 
            아래에서 원하는 특가를 선택하고 <span className="font-medium">"적용하기"</span>를 누르면 결제 시 자동으로 할인이 적용됩니다.
          </p>
        </motion.div>

        {/* 통계 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-card rounded-xl p-4 border border-border/60 text-center">
            <p className="text-2xl font-bold text-primary">{mockDeals.length}</p>
            <p className="text-xs text-muted-foreground mt-1">진행중 특가</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border/60 text-center">
            <p className="text-2xl font-bold text-red-500">50%</p>
            <p className="text-xs text-muted-foreground mt-1">최대 할인율</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border/60 text-center">
            <p className="text-2xl font-bold text-amber-500">
              {mockDeals.filter(d => getDaysRemaining(d.expiryDate) <= 7).length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">마감 임박</p>
          </div>
        </div>

        {/* 특가 목록 */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Percent className="w-4 h-4 text-primary" />
            현재 진행중인 특가
          </h3>

          {mockDeals.map((deal, index) => {
            const daysRemaining = getDaysRemaining(deal.expiryDate);
            const isExpiringSoon = daysRemaining <= 7;

            return (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl border border-border/60 overflow-hidden hover:border-primary/30 transition-colors"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl flex-shrink-0">
                          {deal.icon}
                        </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          {getTypeBadge(deal.type)}
                          {deal.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <h4 className="font-semibold text-foreground">{deal.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {deal.description}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-lg font-bold text-red-500">
                            {formatPrice(deal.discountPrice)}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(deal.originalPrice)}
                          </span>
                          <Badge className="bg-orange-100 text-orange-600 text-xs border-0">
                            {deal.discountRate}% OFF
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                          <span className={isExpiringSoon ? "text-red-500 font-medium" : ""}>
                            <Clock className="w-3 h-3 inline mr-1" />
                            {daysRemaining}일 남음
                          </span>
                          {deal.remainingQuantity && (
                            <span className="text-orange-500 font-medium">
                              <Zap className="w-3 h-3 inline mr-1" />
                              {deal.remainingQuantity}개 남음
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-shrink-0"
                      onClick={() => handleApply(deal)}
                    >
                      적용하기
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 안내 문구 */}
        <div className="mt-6 p-4 bg-muted/50 rounded-xl">
          <h4 className="text-sm font-medium text-foreground mb-2">이용 안내</h4>
          <ul className="text-xs text-muted-foreground space-y-1.5">
            <li>• 할인 쿠폰은 결제 시 자동 적용됩니다.</li>
            <li>• 일부 특가는 중복 적용이 불가할 수 있습니다.</li>
            <li>• 수량 한정 상품은 조기 마감될 수 있습니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
