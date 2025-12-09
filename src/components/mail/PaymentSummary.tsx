import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
          <p className="font-medium text-muted-foreground text-sm mb-1">받는 분</p>
          <p className="text-foreground font-semibold">
            {recipientName || "선택되지 않음"} 
            {recipientFacility && <span className="text-muted-foreground font-normal"> ({recipientFacility})</span>}
          </p>
        </div>

        {/* 선택 내역 */}
        <div>
          <h3 className="font-semibold text-foreground mb-4">선택 내역</h3>

          <div className="space-y-0">
            {/* 편지 분량 */}
            <div className="flex items-center justify-between py-4 border-b border-border">
              <div>
                <p className="font-medium text-foreground">편지 분량</p>
                <p className="text-sm text-muted-foreground">
                  {charCount}자 • {pageCount}장 • 25g이하({estimatedWeight}g)
                </p>
              </div>
              <span className="text-foreground font-medium">무료</span>
            </div>

            {/* 편지지 */}
            <div className="flex items-center justify-between py-4 border-b border-border">
              <div>
                <p className="font-medium text-foreground">편지지</p>
                <p className="text-sm text-muted-foreground">{stationeryName || "기본"}</p>
              </div>
              <span className="text-foreground font-medium">무료</span>
            </div>

            {/* 사진 인화 */}
            <div className="flex items-center justify-between py-4 border-b border-border">
              <div>
                <p className="font-medium text-foreground">사진 인화</p>
                {photos.length > 0 && (
                  <p className="text-sm text-muted-foreground">{photos.length}장 x 500원</p>
                )}
              </div>
              <span className={cn(
                "font-medium",
                photos.length > 0 ? "text-primary" : "text-foreground"
              )}>
                {photos.length > 0 ? `${photoPrice.toLocaleString()}원` : "없음"}
              </span>
            </div>

            {/* 동봉 자료 */}
            <div className="flex items-center justify-between py-4 border-b border-border">
              <div>
                <p className="font-medium text-foreground">동봉 자료</p>
                {selectedItemNames.length > 0 && (
                  <p className="text-sm text-muted-foreground">{selectedItemNames.join(", ")}</p>
                )}
              </div>
              <span className="text-foreground font-medium">
                {selectedItemNames.length > 0 ? "무료" : "없음"}
              </span>
            </div>
          </div>
        </div>

        {/* 우편 방법 선택 */}
        <div>
          <h3 className="font-semibold text-foreground mb-4">우편 방법 선택</h3>
          <div className="grid grid-cols-2 gap-3">
            {mailTypeOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => onMailTypeChange(option.id, option.price)}
                className={cn(
                  "relative p-4 rounded-xl border-2 transition-all text-left",
                  mailType === option.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                )}
              >
                {/* 선택 체크 */}
                {mailType === option.id && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}

                <p className="font-semibold text-foreground">{option.label}</p>
                <p className="text-sm text-muted-foreground">{option.deliveryTime}</p>
                <p className="text-primary font-bold mt-2">{option.price.toLocaleString()}원</p>
                {option.hasTracking && (
                  <span className="inline-block mt-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                    추적 가능
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 결제 금액 요약 - 다크 스타일 */}
        <div className="bg-gray-900 rounded-2xl p-6 space-y-3">
          {/* 기본 요금 */}
          <div className="flex items-center justify-between">
            <span className="text-gray-300">기본 요금</span>
            <span className="text-gray-100">{photoPrice.toLocaleString()}원</span>
          </div>

          {/* 우편료 */}
          <div className="flex items-center justify-between">
            <span className="text-gray-300">우편료 ({mailType})</span>
            <span className="text-gray-100">{mailPrice.toLocaleString()}원</span>
          </div>

          {/* 구분선 */}
          <div className="border-t border-gray-700 my-3" />

          {/* 최종 결제 금액 */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">최종 결제 금액</p>
              <p className="text-xs text-primary">* 수익금의 일부는 교정 교화 활동에 기부됩니다</p>
            </div>
            <span className="text-3xl font-bold text-white">{totalPrice.toLocaleString()}원</span>
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
