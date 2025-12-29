import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Check, X, Coins } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";

interface PhotoFile {
  id: string;
  file: File;
  preview: string;
  rotation: number;
}

interface MailTypeOption {
  id: string;
  label: string;
  deliveryTime: string;
  price: number;
  hasTracking: boolean;
}

const mailTypeOptions: MailTypeOption[] = [
  { id: "준등기우편", label: "준등기", deliveryTime: "3~5일", price: 1800, hasTracking: true },
  { id: "등기우편", label: "일반등기", deliveryTime: "3~5일", price: 2830, hasTracking: true },
  { id: "일반우편", label: "일반우편", deliveryTime: "3~5일", price: 430, hasTracking: false },
  { id: "익일특급", label: "익일특급", deliveryTime: "3~5일", price: 3530, hasTracking: false },
];

interface PaymentSummaryProps {
  recipientName?: string;
  recipientFacility?: string;
  letterContent: string;
  stationeryName?: string;
  photos: PhotoFile[];
  selectedAdditionalItems: string[];
  mailType: string;
  mailPrice: number;
  onMailTypeChange: (mailType: string, price: number) => void;
  onPayment: () => void;
  userPoints?: number; // 사용자 보유 포인트
}

// 추가 옵션 아이템 정보
const additionalItemsInfo: Record<string, { icon: string; title: string }> = {
  "meal-plan": { icon: "🍽️", title: "월간 식단표" },
  "movie": { icon: "🎬", title: "보라미 영화" },
  "parole-calc": { icon: "📊", title: "가석방+급수 계산기" },
  "fortune": { icon: "🔮", title: "AI 운세/타로" },
  "puzzle": { icon: "🧩", title: "스도쿠/퍼즐" },
  "humor": { icon: "😂", title: "최신 유머" },
  "job-training": { icon: "📚", title: "직업훈련 안내" },
  "100-questions": { icon: "💬", title: "100가지 질문" },
};

export function PaymentSummary({
  recipientName,
  recipientFacility,
  letterContent,
  stationeryName,
  photos,
  selectedAdditionalItems,
  mailType,
  mailPrice,
  onMailTypeChange,
  onPayment,
  userPoints = 10000, // 기본값: 10,000 포인트
}: PaymentSummaryProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // 편지 분량 계산
  const charCount = letterContent.length;
  const pageCount = Math.ceil(charCount / 500) || 1;
  const estimatedWeight = 20; // 기본 무게 (g)

  // 사진 비용 계산
  const photoPrice = photos.length * 500;

  // 총 비용 계산
  const totalPrice = mailPrice + photoPrice;

  // 포인트 충분 여부
  const hasEnoughPoints = userPoints >= totalPrice;

  // 차감 후 포인트
  const remainingPoints = userPoints - totalPrice;

  // 선택된 추가 옵션 목록
  const selectedItemNames = selectedAdditionalItems
    .map((id) => additionalItemsInfo[id]?.title)
    .filter(Boolean);

  const handlePaymentClick = () => {
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = () => {
    if (!hasEnoughPoints) {
      toast.error("포인트가 부족합니다. 충전 후 다시 시도해주세요.");
      return;
    }
    setShowPaymentModal(false);
    onPayment();
    toast.success("결제가 완료되었습니다!");
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-2">
        <CreditCard className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
        <div>
          <h2 className="text-sm lg:text-base font-semibold text-foreground">결제 요금서</h2>
          <p className="text-muted-foreground text-[11px] lg:text-xs">선택하신 내용을 확인하고 결제를 진행해주세요</p>
        </div>
      </div>

      {/* 흰색 라운딩 박스 - 메인 컨테이너 */}
      <div className="bg-card rounded-xl lg:rounded-3xl p-4 lg:p-6 shadow-md lg:shadow-lg border border-border/50 space-y-4 lg:space-y-6">
        {/* 받는 분 */}
        <div className="bg-muted/30 rounded-xl lg:rounded-2xl p-3 lg:p-4">
          <p className="font-medium text-muted-foreground text-xs lg:text-sm mb-0.5 lg:mb-1">받는 분</p>
          <p className="text-foreground font-semibold text-sm lg:text-base">
            {recipientName || "선택되지 않음"}
            {recipientFacility && <span className="text-muted-foreground font-normal text-xs lg:text-sm"> ({recipientFacility})</span>}
          </p>
        </div>

        {/* 선택 내역 */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 lg:mb-4 text-sm lg:text-base">선택 내역</h3>

          <div className="space-y-0">
            {/* 편지 분량 */}
            <div className="flex items-center justify-between py-3 lg:py-4 border-b border-border">
              <div>
                <p className="font-medium text-foreground text-xs lg:text-sm">편지 분량</p>
                <p className="text-[11px] lg:text-sm text-muted-foreground">
                  {charCount}자 • {pageCount}장 • 25g이하({estimatedWeight}g)
                </p>
              </div>
              <span className="text-foreground font-medium text-xs lg:text-sm">무료</span>
            </div>

            {/* 편지지 */}
            <div className="flex items-center justify-between py-3 lg:py-4 border-b border-border">
              <div>
                <p className="font-medium text-foreground text-xs lg:text-sm">편지지</p>
                <p className="text-[11px] lg:text-sm text-muted-foreground">{stationeryName || "기본"}</p>
              </div>
              <span className="text-foreground font-medium text-xs lg:text-sm">무료</span>
            </div>

            {/* 사진 인화 */}
            <div className="flex items-center justify-between py-3 lg:py-4 border-b border-border">
              <div>
                <p className="font-medium text-foreground text-xs lg:text-sm">사진 인화</p>
                {photos.length > 0 && (
                  <p className="text-[11px] lg:text-sm text-muted-foreground">{photos.length}장 x 500원</p>
                )}
              </div>
              <span className={cn(
                "font-medium text-xs lg:text-sm",
                photos.length > 0 ? "text-primary" : "text-foreground"
              )}>
                {photos.length > 0 ? `${photoPrice.toLocaleString()}원` : "없음"}
              </span>
            </div>

            {/* 동봉 자료 */}
            <div className="flex items-center justify-between py-3 lg:py-4 border-b border-border">
              <div>
                <p className="font-medium text-foreground text-xs lg:text-sm">동봉 자료</p>
                {selectedItemNames.length > 0 && (
                  <p className="text-[11px] lg:text-sm text-muted-foreground">{selectedItemNames.join(", ")}</p>
                )}
              </div>
              <span className="text-foreground font-medium text-xs lg:text-sm">
                {selectedItemNames.length > 0 ? "무료" : "없음"}
              </span>
            </div>
          </div>
        </div>

        {/* 우편 방법 선택 */}
        <div className="bg-muted/30 rounded-xl lg:rounded-2xl p-3 lg:p-4">
          <div>
            <h3 className="font-semibold text-foreground mb-1 lg:mb-2 text-sm lg:text-base">우편 종류</h3>
            <p className="text-[11px] lg:text-sm text-muted-foreground mb-3 lg:mb-4">교정시설 우편은 내부 검수 절차로 인해 모든 방식의 실제 전달 속도는 비슷합니다.</p>
          </div>
          <div className="bg-card rounded-lg lg:rounded-xl p-2 lg:p-3 border border-border/50">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3">
              {mailTypeOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => onMailTypeChange(option.id, option.price)}
                  className={cn(
                    "relative p-3 lg:p-4 rounded-lg lg:rounded-xl transition-all text-left bg-muted/20",
                    mailType === option.id
                      ? "border-2 border-primary bg-primary/5"
                      : "border border-border hover:border-primary/50"
                  )}
                >
                  {/* 라디오 버튼 스타일 */}
                  <div className="flex items-center gap-2.5 lg:gap-3">
                    <div className={cn(
                      "w-4 h-4 lg:w-5 lg:h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                      mailType === option.id
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/50"
                    )}>
                      {mailType === option.id && (
                        <Check className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-primary-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 lg:gap-2">
                        <p className="font-semibold text-foreground text-xs lg:text-sm">{option.label}</p>
                        {option.hasTracking && (
                          <span className="text-[10px] lg:text-xs text-muted-foreground">(등기추적)</span>
                        )}
                        {option.id === "준등기우편" && (
                          <span className="text-[10px] lg:text-xs bg-primary text-primary-foreground px-1 lg:px-1.5 py-0.5 rounded">추천</span>
                        )}
                        {option.id === "등기우편" && (
                          <span className="text-[10px] lg:text-xs bg-blue-500 text-white px-1 lg:px-1.5 py-0.5 rounded">안심</span>
                        )}
                      </div>
                      <p className="text-[10px] lg:text-xs text-muted-foreground">발송 후 {option.deliveryTime}</p>
                    </div>
                    <p className="text-primary font-bold text-xs lg:text-sm whitespace-nowrap">{option.price.toLocaleString()}원</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 결제 금액 요약 - 오렌지 스타일 */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl lg:rounded-2xl p-4 lg:p-6 space-y-2 lg:space-y-3 border border-orange-200/50 dark:border-orange-700/30">
          {/* 기본 요금 */}
          <div className="flex items-center justify-between">
            <span className="text-orange-700 dark:text-orange-300 text-xs lg:text-sm">기본 요금</span>
            <span className="text-orange-900 dark:text-orange-100 text-xs lg:text-sm">{photoPrice.toLocaleString()}원</span>
          </div>

          {/* 우편료 */}
          <div className="flex items-center justify-between">
            <span className="text-orange-700 dark:text-orange-300 text-xs lg:text-sm">우편료 ({mailType})</span>
            <span className="text-orange-900 dark:text-orange-100 text-xs lg:text-sm">{mailPrice.toLocaleString()}원</span>
          </div>

          {/* 구분선 */}
          <div className="border-t border-orange-200 dark:border-orange-700/50 my-2 lg:my-3" />

          {/* 최종 결제 금액 */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-900 dark:text-orange-100 font-medium text-xs lg:text-sm">최종 결제 금액</p>
              <p className="text-[10px] lg:text-xs text-orange-600 dark:text-orange-400">* 수익금 일부는 교정 교화 활동에 기부됩니다</p>
            </div>
            <span className="text-xl lg:text-3xl font-bold text-orange-600 dark:text-orange-400">{totalPrice.toLocaleString()}원</span>
          </div>
        </div>

        {/* 결제 버튼 */}
        <Button
          onClick={handlePaymentClick}
          className="w-full py-4 lg:py-6 text-sm lg:text-lg font-semibold rounded-xl lg:rounded-2xl bg-primary hover:bg-primary/90"
        >
          <CreditCard className="w-4 h-4 lg:w-5 lg:h-5 mr-1.5 lg:mr-2" />
          {totalPrice.toLocaleString()}원 결제하기
        </Button>

        {/* 안내 메시지 */}
        <div className="bg-muted/50 rounded-lg lg:rounded-xl p-3 lg:p-4 text-center">
          <p className="text-xs lg:text-sm text-muted-foreground">
            💡 결제 완료 후 편지가 발송됩니다. 취소는 발송 전까지 가능합니다.
          </p>
        </div>
      </div>

      {/* 포인트 차감 확인 모달 */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden max-w-[calc(100vw-2rem)] mx-auto">
          <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
            {/* 헤더 */}
            <div className="text-center">
              <div className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-3 lg:mb-4 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 flex items-center justify-center">
                <Coins className="w-6 h-6 lg:w-8 lg:h-8 text-orange-500" />
              </div>
              <h2 className="text-base lg:text-xl font-semibold text-foreground">포인트 차감 안내</h2>
              <p className="text-xs lg:text-sm text-muted-foreground mt-0.5 lg:mt-1">결제 금액만큼 포인트가 차감됩니다</p>
            </div>

            {/* 포인트 계산 */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl lg:rounded-2xl p-4 lg:p-5 space-y-3 lg:space-y-4 border border-orange-200/50 dark:border-orange-700/30">
              {/* 현재 보유 포인트 */}
              <div className="flex items-center justify-between">
                <span className="text-orange-700 dark:text-orange-300 text-xs lg:text-sm">현재 보유 포인트</span>
                <span className="text-base lg:text-xl font-bold text-orange-900 dark:text-orange-100">{userPoints.toLocaleString()}P</span>
              </div>

              {/* 차감 포인트 */}
              <div className="flex items-center justify-between">
                <span className="text-orange-700 dark:text-orange-300 text-xs lg:text-sm">차감 포인트</span>
                <span className="text-base lg:text-xl font-bold text-red-500">-{totalPrice.toLocaleString()}P</span>
              </div>

              {/* 구분선 */}
              <div className="border-t border-orange-200 dark:border-orange-700/50" />

              {/* 결제 후 잔여 포인트 */}
              <div className="flex items-center justify-between">
                <span className="text-orange-900 dark:text-orange-100 font-medium text-xs lg:text-sm">결제 후 잔여 포인트</span>
                <span className={cn(
                  "text-lg lg:text-2xl font-bold",
                  hasEnoughPoints ? "text-orange-600 dark:text-orange-400" : "text-red-500"
                )}>
                  {remainingPoints.toLocaleString()}P
                </span>
              </div>
            </div>

            {/* 포인트 부족 경고 */}
            {!hasEnoughPoints && (
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-lg lg:rounded-xl p-3 lg:p-4 text-center">
                <p className="text-red-600 dark:text-red-400 font-medium text-xs lg:text-sm">
                  포인트가 부족합니다. 충전 후 다시 시도해주세요.
                </p>
              </div>
            )}

            {/* 버튼 */}
            <div className="flex gap-2 lg:gap-3">
              <Button
                variant="outline"
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 py-3 lg:py-5 rounded-lg lg:rounded-xl text-sm lg:text-base"
              >
                취소
              </Button>
              <Button
                onClick={handleConfirmPayment}
                disabled={!hasEnoughPoints}
                className="flex-1 py-3 lg:py-5 rounded-lg lg:rounded-xl bg-primary hover:bg-primary/90 text-sm lg:text-base"
              >
                결제 확인
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
