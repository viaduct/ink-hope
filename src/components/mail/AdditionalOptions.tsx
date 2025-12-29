import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Eye, Plus, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AdditionalItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  isNew?: boolean;
  previewContent?: string;
}

const additionalItems: AdditionalItem[] = [
  {
    id: "meal-plan",
    icon: "🍽️",
    title: "월간 식단표",
    description: "달력형, 2개월치 식단 정보",
    previewContent: "이달의 식단표와 다음달 예정 식단을 한눈에 볼 수 있는 달력형 정보입니다.",
  },
  {
    id: "movie",
    icon: "🎬",
    title: "보라미 영화",
    description: "TV 시청 편성표",
    previewContent: "이번 주 TV 영화 편성표와 추천 프로그램 정보입니다.",
  },
  {
    id: "parole-calc",
    icon: "📊",
    title: "가석방+급수 계산기",
    description: "형기/점수 관리 시뮬레이션",
    isNew: true,
    previewContent: "가석방 요건과 급수 계산을 위한 시뮬레이션 정보입니다. 현재 상황을 입력하면 예상 결과를 확인할 수 있습니다.",
  },
  {
    id: "fortune",
    icon: "🔮",
    title: "AI 운세/타로",
    description: "오늘의 운세와 타로 점",
    previewContent: "AI가 분석한 오늘의 운세와 타로 카드 해석 결과입니다.",
  },
  {
    id: "puzzle",
    icon: "🧩",
    title: "스도쿠/퍼즐",
    description: "재미있는 두뇌 게임",
    previewContent: "난이도별 스도쿠 퍼즐과 다양한 두뇌 게임이 포함되어 있습니다.",
  },
  {
    id: "humor",
    icon: "😂",
    title: "최신 유머",
    description: "웃음을 선물하세요",
    previewContent: "엄선된 최신 유머와 재미있는 이야기 모음입니다.",
  },
  {
    id: "job-training",
    icon: "📚",
    title: "직업훈련 안내",
    description: "자격증 취득 정보",
    previewContent: "교정시설 내 직업훈련 프로그램과 자격증 취득 방법 안내입니다.",
  },
  {
    id: "100-questions",
    icon: "💬",
    title: "100가지 질문",
    description: "10가지 테마별 질문",
    previewContent: "서로를 더 깊이 알아갈 수 있는 100가지 질문 카드입니다. 가족, 추억, 미래 등 다양한 테마로 구성되어 있습니다.",
  },
];

interface AdditionalOptionsProps {
  selectedItems: string[];
  onSelectedItemsChange: (items: string[]) => void;
}

export function AdditionalOptions({ selectedItems, onSelectedItemsChange }: AdditionalOptionsProps) {
  const [previewItem, setPreviewItem] = useState<AdditionalItem | null>(null);

  const toggleItem = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      onSelectedItemsChange(selectedItems.filter((id) => id !== itemId));
    } else {
      onSelectedItemsChange([...selectedItems, itemId]);
    }
  };


  return (
    <div className="space-y-4 lg:space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-2">
        <Gift className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
        <div>
          <h2 className="text-sm lg:text-base font-semibold text-foreground">편지와 함께 작은 바깥의 하루를 전하세요</h2>
          <p className="text-muted-foreground text-[11px] lg:text-xs">
            안에서는 알기 어려운 소식과 정보를 전달합니다.
          </p>
        </div>
      </div>

      {/* 흰색 라운딩 박스 - 메인 컨테이너 */}
      <div className="bg-card rounded-xl lg:rounded-3xl p-4 lg:p-6 shadow-md lg:shadow-lg border border-border/50 space-y-4 lg:space-y-6">
        {/* 아이템 그리드 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4">
          {additionalItems.map((item) => {
            const isSelected = selectedItems.includes(item.id);
            
            return (
              <motion.div
                key={item.id}
                whileHover={{ y: -2 }}
                className={cn(
                  "relative bg-muted/30 rounded-xl lg:rounded-2xl border-2 p-3 lg:p-5 transition-all",
                  isSelected
                    ? "border-primary shadow-lg bg-primary/5"
                    : "border-transparent hover:border-primary/30"
                )}
              >
                {/* NEW 배지 */}
                {item.isNew && (
                  <div className="absolute -top-1.5 -right-1.5 lg:-top-2 lg:-right-2 px-1.5 lg:px-2 py-0.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] lg:text-xs font-bold rounded-full shadow-md">
                    NEW
                  </div>
                )}

                {/* 선택 체크 */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 lg:top-3 lg:right-3 w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-primary flex items-center justify-center"
                  >
                    <Check className="w-3 h-3 lg:w-4 lg:h-4 text-primary-foreground" />
                  </motion.div>
                )}

                {/* 아이콘 */}
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-card flex items-center justify-center text-2xl lg:text-3xl mb-2 lg:mb-4">
                  {item.icon}
                </div>

                {/* 내용 */}
                <h3 className="font-semibold text-foreground mb-0.5 lg:mb-1 text-xs lg:text-base">{item.title}</h3>
                <p className="text-[10px] lg:text-sm text-muted-foreground mb-2 lg:mb-4 line-clamp-2">{item.description}</p>

                {/* 버튼들 */}
                <div className="flex items-center gap-1 lg:gap-2 pt-2 lg:pt-3 border-t border-border/50">
                  <button
                    onClick={() => setPreviewItem(item)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 lg:py-2 text-[10px] lg:text-sm text-primary hover:bg-primary/5 rounded-lg transition-colors"
                  >
                    <Eye className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span className="hidden sm:inline">미리보기</span>
                    <span className="sm:hidden">보기</span>
                  </button>
                  <button
                    onClick={() => toggleItem(item.id)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1 py-1.5 lg:py-2 text-[10px] lg:text-sm rounded-lg transition-colors",
                      isSelected
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3 h-3 lg:w-4 lg:h-4" />
                        <span className="hidden sm:inline">선택됨</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3 lg:w-4 lg:h-4" />
                        선택
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 선택 요약 */}
        {selectedItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-orange-200/50 dark:border-orange-800/30"
          >
            <div className="flex items-center gap-2 mb-2 lg:mb-3">
              <span className="font-medium text-foreground text-sm lg:text-base">선택됨:</span>
            </div>

            {/* 선택된 아이템 목록 */}
            <div className="flex flex-wrap gap-1.5 lg:gap-2">
              {selectedItems.map((itemId) => {
                const item = additionalItems.find((i) => i.id === itemId);
                if (!item) return null;
                return (
                  <div
                    key={itemId}
                    className="flex items-center gap-1.5 lg:gap-2 bg-white dark:bg-card px-2 lg:px-3 py-1 lg:py-1.5 rounded-full text-xs lg:text-sm border border-orange-200 dark:border-orange-800/50"
                  >
                    <span className="text-sm lg:text-base">{item.icon}</span>
                    <span className="font-medium text-orange-600 dark:text-orange-400">{item.title}</span>
                    <button
                      onClick={() => toggleItem(itemId)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* 안내 메시지 */}
        <div className="bg-muted/50 rounded-lg lg:rounded-xl p-3 lg:p-4 text-center">
          <p className="text-xs lg:text-sm text-muted-foreground">
            💡 추가 콘텐츠는 선택하지 않아도 편지 발송이 가능합니다.
          </p>
        </div>
      </div>

      {/* 미리보기 모달 */}
      <Dialog open={!!previewItem} onOpenChange={() => setPreviewItem(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span className="text-2xl">{previewItem?.icon}</span>
              {previewItem?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">{previewItem?.previewContent}</p>
            <button
              onClick={() => {
                if (previewItem) {
                  toggleItem(previewItem.id);
                  setPreviewItem(null);
                }
              }}
              className={cn(
                "w-full py-3 rounded-xl font-medium transition-colors",
                previewItem && selectedItems.includes(previewItem.id)
                  ? "bg-muted text-muted-foreground hover:bg-muted/80"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              {previewItem && selectedItems.includes(previewItem.id)
                ? "선택 취소"
                : "선택하기"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
