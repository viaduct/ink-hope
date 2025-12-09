import { motion } from "framer-motion";
import { CreditCard, Check, Mail, FileText, Image, Gift, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PhotoFile {
  id: string;
  file: File;
  preview: string;
  rotation: number;
}

interface PaymentSummaryProps {
  recipientName?: string;
  recipientFacility?: string;
  letterContent: string;
  stationeryName?: string;
  photos: PhotoFile[];
  selectedAdditionalItems: string[];
  mailType: string;
  mailPrice: number;
  onPayment: () => void;
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
  onPayment,
}: PaymentSummaryProps) {
  // 편지 분량 계산
  const charCount = letterContent.length;
  const pageCount = Math.ceil(charCount / 500) || 1;
  const estimatedWeight = 20; // 기본 무게 (g)

  // 사진 비용 계산
  const photoPrice = photos.length * 500;

  // 총 비용 계산
  const totalPrice = mailPrice + photoPrice;

  // 선택된 추가 옵션 목록
  const selectedItemNames = selectedAdditionalItems
    .map((id) => additionalItemsInfo[id]?.title)
    .filter(Boolean);

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center">
          <CreditCard className="w-7 h-7 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">결제 요금서</h2>
          <p className="text-muted-foreground text-sm">선택하신 내용을 확인하고 결제를 진행해주세요</p>
        </div>
      </div>

      {/* 흰색 라운딩 박스 - 메인 컨테이너 */}
      <div className="bg-card rounded-3xl p-6 shadow-lg border border-border/50 space-y-6">
        {/* 받는 분 */}
        <div className="bg-muted/30 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="w-4 h-4 text-primary" />
            <span className="font-medium text-foreground">받는 분</span>
          </div>
          <p className="text-foreground font-semibold">
            {recipientName || "선택되지 않음"} 
            {recipientFacility && <span className="text-muted-foreground font-normal"> ({recipientFacility})</span>}
          </p>
        </div>

        {/* 선택 내역 */}
        <div>
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            선택 내역
          </h3>

          <div className="space-y-3">
            {/* 편지 분량 */}
            <div className="flex items-center justify-between py-3 border-b border-border/50">
              <div>
                <p className="font-medium text-foreground">편지 분량</p>
                <p className="text-sm text-muted-foreground">
                  {charCount}자 • {pageCount}장 • 25g이하({estimatedWeight}g)
                </p>
              </div>
              <span className="text-foreground font-medium">무료</span>
            </div>

            {/* 편지지 */}
            <div className="flex items-center justify-between py-3 border-b border-border/50">
              <div>
                <p className="font-medium text-foreground">편지지</p>
                <p className="text-sm text-muted-foreground">{stationeryName || "기본"}</p>
              </div>
              <span className="text-foreground font-medium">무료</span>
            </div>

            {/* 사진 인화 */}
            <div className="flex items-center justify-between py-3 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Image className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">사진 인화</p>
                  {photos.length > 0 && (
                    <p className="text-sm text-muted-foreground">{photos.length}장 x 500원</p>
                  )}
                </div>
              </div>
              <span className={cn(
                "font-medium",
                photos.length > 0 ? "text-primary" : "text-foreground"
              )}>
                {photos.length > 0 ? `${photoPrice.toLocaleString()}원` : "없음"}
              </span>
            </div>

            {/* 동봉 자료 */}
            <div className="flex items-center justify-between py-3 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">동봉 자료</p>
                  {selectedItemNames.length > 0 && (
                    <p className="text-sm text-muted-foreground">{selectedItemNames.join(", ")}</p>
                  )}
                </div>
              </div>
              <span className="text-foreground font-medium">
                {selectedItemNames.length > 0 ? "무료" : "없음"}
              </span>
            </div>

            {/* 우편 방법 */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">우편 방법</p>
                  <p className="text-sm text-muted-foreground">{mailType}</p>
                </div>
              </div>
              <span className="text-primary font-medium">{mailPrice.toLocaleString()}원</span>
            </div>
          </div>
        </div>

        {/* 기본 요금 소계 */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-2xl p-5 border border-orange-200/50 dark:border-orange-800/30">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-foreground text-lg">총 결제 금액</span>
            <span className="text-2xl font-bold text-primary">{totalPrice.toLocaleString()}원</span>
          </div>
        </div>

        {/* 결제 버튼 */}
        <Button
          onClick={onPayment}
          className="w-full py-6 text-lg font-semibold rounded-2xl bg-primary hover:bg-primary/90"
        >
          <CreditCard className="w-5 h-5 mr-2" />
          {totalPrice.toLocaleString()}원 결제하기
        </Button>

        {/* 안내 메시지 */}
        <div className="bg-muted/50 rounded-xl p-4 text-center">
          <p className="text-sm text-muted-foreground">
            💡 결제 완료 후 편지가 발송됩니다. 취소는 발송 전까지 가능합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
