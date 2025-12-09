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
  price: number;
  isNew?: boolean;
  previewContent?: string;
}

const additionalItems: AdditionalItem[] = [
  {
    id: "meal-plan",
    icon: "🍽️",
    title: "월간 식단표",
    description: "달력형, 2개월치 식단 정보",
    price: 500,
    previewContent: "이달의 식단표와 다음달 예정 식단을 한눈에 볼 수 있는 달력형 정보입니다.",
  },
  {
    id: "movie",
    icon: "🎬",
    title: "보라미 영화",
    description: "TV 시청 편성표",
    price: 500,
    previewContent: "이번 주 TV 영화 편성표와 추천 프로그램 정보입니다.",
  },
  {
    id: "parole-calc",
    icon: "📊",
    title: "가석방+급수 계산기",
    description: "형기/점수 관리 시뮬레이션",
    price: 1000,
    isNew: true,
    previewContent: "가석방 요건과 급수 계산을 위한 시뮬레이션 정보입니다. 현재 상황을 입력하면 예상 결과를 확인할 수 있습니다.",
  },
  {
    id: "fortune",
    icon: "🔮",
    title: "AI 운세/타로",
    description: "오늘의 운세와 타로 점",
    price: 500,
    previewContent: "AI가 분석한 오늘의 운세와 타로 카드 해석 결과입니다.",
  },
  {
    id: "puzzle",
    icon: "🧩",
    title: "스도쿠/퍼즐",
    description: "재미있는 두뇌 게임",
    price: 300,
    previewContent: "난이도별 스도쿠 퍼즐과 다양한 두뇌 게임이 포함되어 있습니다.",
  },
  {
    id: "humor",
    icon: "😂",
    title: "최신 유머",
    description: "웃음을 선물하세요",
    price: 300,
    previewContent: "엄선된 최신 유머와 재미있는 이야기 모음입니다.",
  },
  {
    id: "job-training",
    icon: "📚",
    title: "직업훈련 안내",
    description: "자격증 취득 정보",
    price: 500,
    previewContent: "교정시설 내 직업훈련 프로그램과 자격증 취득 방법 안내입니다.",
  },
  {
    id: "100-questions",
    icon: "💬",
    title: "100가지 질문",
    description: "10가지 테마별 질문",
    price: 500,
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

  const totalPrice = selectedItems.reduce((sum, itemId) => {
    const item = additionalItems.find((i) => i.id === itemId);
    return sum + (item?.price || 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
          <Gift className="w-7 h-7 text-amber-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">편지와 함께 작은 바깥의 하루를 전하세요</h2>
          <p className="text-muted-foreground text-sm">
            안에서는 알기 어려운 소식과 정보, 그들에게 힘이 되는 것들만 골라 전달됩니다.
          </p>
        </div>
      </div>

      {/* 아이템 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {additionalItems.map((item) => {
          const isSelected = selectedItems.includes(item.id);
          
          return (
            <motion.div
              key={item.id}
              whileHover={{ y: -2 }}
              className={cn(
                "relative bg-card rounded-2xl border-2 p-5 transition-all",
                isSelected
                  ? "border-primary shadow-lg"
                  : "border-border hover:border-primary/30"
              )}
            >
              {/* NEW 배지 */}
              {item.isNew && (
                <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full shadow-md">
                  NEW
                </div>
              )}

              {/* 선택 체크 */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-primary-foreground" />
                </motion.div>
              )}

              {/* 아이콘 */}
              <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center text-3xl mb-4">
                {item.icon}
              </div>

              {/* 내용 */}
              <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{item.description}</p>

              {/* 버튼들 */}
              <div className="flex items-center gap-2 pt-3 border-t border-border">
                <button
                  onClick={() => setPreviewItem(item)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm text-primary hover:bg-primary/5 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  미리보기
                </button>
                <button
                  onClick={() => toggleItem(item.id)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-2 text-sm rounded-lg transition-colors",
                    isSelected
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-4 h-4" />
                      선택됨
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
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
          className="bg-primary/5 rounded-2xl p-5"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">선택한 추가 콘텐츠</p>
              <p className="text-sm text-muted-foreground">{selectedItems.length}개 선택됨</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">+{totalPrice.toLocaleString()}원</p>
            </div>
          </div>

          {/* 선택된 아이템 목록 */}
          <div className="flex flex-wrap gap-2 mt-4">
            {selectedItems.map((itemId) => {
              const item = additionalItems.find((i) => i.id === itemId);
              if (!item) return null;
              return (
                <div
                  key={itemId}
                  className="flex items-center gap-2 bg-card px-3 py-1.5 rounded-full text-sm"
                >
                  <span>{item.icon}</span>
                  <span className="font-medium">{item.title}</span>
                  <button
                    onClick={() => toggleItem(itemId)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* 안내 메시지 */}
      <div className="bg-muted/50 rounded-xl p-4 text-center">
        <p className="text-sm text-muted-foreground">
          💡 추가 콘텐츠는 선택하지 않아도 편지 발송이 가능합니다.
        </p>
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
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
              <span className="font-medium">가격</span>
              <span className="text-primary font-bold">{previewItem?.price?.toLocaleString()}원</span>
            </div>
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
