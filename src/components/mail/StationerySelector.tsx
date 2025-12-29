import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Gem, Palette, Sparkles, Check, Cloud, Flower2, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

type StationeryCategory = "basic" | "premium" | "designer" | "ai";

interface Stationery {
  id: string;
  name: string;
  category: StationeryCategory;
  bgColor?: string;
  bgGradient?: string;
  icon?: React.ReactNode;
  pattern?: "lines" | "dots" | "grid" | "none";
  isNew?: boolean;
  isPremium?: boolean;
}

const categories = [
  { id: "basic" as StationeryCategory, label: "기본", icon: <FileText className="w-4 h-4" /> },
  { id: "premium" as StationeryCategory, label: "상용", icon: <Gem className="w-4 h-4" /> },
  { id: "designer" as StationeryCategory, label: "디자이너", icon: <Palette className="w-4 h-4" /> },
  { id: "ai" as StationeryCategory, label: "AI", icon: <Sparkles className="w-4 h-4" /> },
];

const stationeryItems: Stationery[] = [
  // 기본
  { id: "white", name: "순백", category: "basic", bgColor: "bg-white", pattern: "none" },
  { id: "cream", name: "크림", category: "basic", bgColor: "bg-amber-50", pattern: "none" },
  { id: "lined", name: "줄노트", category: "basic", bgColor: "bg-amber-50", pattern: "lines" },
  { id: "sky", name: "하늘색", category: "basic", bgColor: "bg-sky-100", icon: <Cloud className="w-6 h-6 text-white/80" /> },
  { id: "pink", name: "연분홍", category: "basic", bgColor: "bg-pink-100", icon: <Flower2 className="w-6 h-6 text-pink-300" /> },
  { id: "mint", name: "민트", category: "basic", bgColor: "bg-emerald-100", icon: <Leaf className="w-6 h-6 text-emerald-400" /> },
  
  // 상용
  { id: "formal-white", name: "정장 화이트", category: "premium", bgColor: "bg-slate-50", pattern: "none", isPremium: true },
  { id: "formal-cream", name: "클래식 크림", category: "premium", bgColor: "bg-orange-50", pattern: "none", isPremium: true },
  { id: "business", name: "비즈니스", category: "premium", bgColor: "bg-gray-100", pattern: "grid", isPremium: true },
  { id: "elegant", name: "엘레강스", category: "premium", bgGradient: "bg-gradient-to-br from-rose-50 to-purple-50", pattern: "none", isPremium: true },
  
  // 디자이너
  { id: "sunset", name: "선셋", category: "designer", bgGradient: "bg-gradient-to-br from-orange-200 via-rose-200 to-purple-200", isNew: true },
  { id: "ocean", name: "오션", category: "designer", bgGradient: "bg-gradient-to-br from-cyan-200 via-blue-200 to-indigo-200", isNew: true },
  { id: "forest", name: "포레스트", category: "designer", bgGradient: "bg-gradient-to-br from-emerald-200 via-teal-200 to-cyan-200" },
  { id: "blossom", name: "블라썸", category: "designer", bgGradient: "bg-gradient-to-br from-pink-200 via-rose-200 to-red-200" },
  
  // AI
  { id: "ai-dream", name: "드림스케이프", category: "ai", bgGradient: "bg-gradient-to-br from-violet-300 via-purple-200 to-pink-200", isNew: true },
  { id: "ai-aurora", name: "오로라", category: "ai", bgGradient: "bg-gradient-to-br from-green-200 via-cyan-200 to-blue-300", isNew: true },
  { id: "ai-cosmic", name: "코스믹", category: "ai", bgGradient: "bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300" },
];

interface StationerySelectorProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function StationerySelector({ selectedId, onSelect }: StationerySelectorProps) {
  const [activeCategory, setActiveCategory] = useState<StationeryCategory>("basic");

  const filteredItems = stationeryItems.filter(item => item.category === activeCategory);

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-2">
        <FileText className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
        <h2 className="font-semibold text-foreground text-sm lg:text-base">편지지 선택</h2>
      </div>

      {/* 카테고리 탭 */}
      <div className="bg-muted/50 p-1 lg:p-1.5 rounded-xl lg:rounded-2xl">
        <div className="flex gap-0.5 lg:gap-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1 lg:gap-2 py-2 lg:py-3 px-2 lg:px-4 rounded-lg lg:rounded-xl text-[11px] lg:text-sm font-medium transition-all duration-200",
                activeCategory === category.id
                  ? "bg-card text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="hidden sm:block">{category.icon}</span>
              <span>{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 편지지 그리드 */}
      <motion.div
        key={activeCategory}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-4"
      >
        {filteredItems.map((item) => {
          const isSelected = selectedId === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onSelect(item.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "relative aspect-[3/4] rounded-2xl border-2 transition-all duration-200 overflow-hidden group",
                isSelected
                  ? "border-primary shadow-lg ring-2 ring-primary/20"
                  : "border-border hover:border-primary/40 hover:shadow-md"
              )}
            >
              {/* 배경 */}
              <div className={cn(
                "absolute inset-0",
                item.bgGradient || item.bgColor
              )}>
                {/* 패턴 */}
                {item.pattern === "lines" && (
                  <div className="absolute inset-0 flex flex-col justify-center px-4 gap-3">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="h-px bg-amber-200/60" />
                    ))}
                  </div>
                )}
                {item.pattern === "grid" && (
                  <div 
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage: 'linear-gradient(#ccc 1px, transparent 1px), linear-gradient(90deg, #ccc 1px, transparent 1px)',
                      backgroundSize: '20px 20px'
                    }}
                  />
                )}
                {item.pattern === "dots" && (
                  <div 
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: 'radial-gradient(#666 1px, transparent 1px)',
                      backgroundSize: '10px 10px'
                    }}
                  />
                )}
                
                {/* 아이콘 */}
                {item.icon && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {item.icon}
                  </div>
                )}
              </div>

              {/* 선택 체크 */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 lg:top-3 lg:right-3 w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-primary flex items-center justify-center shadow-md"
                >
                  <Check className="w-3 h-3 lg:w-4 lg:h-4 text-primary-foreground" />
                </motion.div>
              )}

              {/* 배지 */}
              {item.isNew && (
                <div className="absolute top-2 left-2 lg:top-3 lg:left-3 px-1.5 lg:px-2 py-0.5 bg-primary text-primary-foreground text-[9px] lg:text-xs font-semibold rounded-full">
                  NEW
                </div>
              )}
              {item.isPremium && !item.isNew && (
                <div className="absolute top-2 left-2 lg:top-3 lg:left-3 px-1.5 lg:px-2 py-0.5 bg-amber-500 text-white text-[9px] lg:text-xs font-semibold rounded-full">
                  PRO
                </div>
              )}

              {/* 호버 오버레이 */}
              <div className={cn(
                "absolute inset-0 bg-primary/5 opacity-0 transition-opacity",
                !isSelected && "group-hover:opacity-100"
              )} />
            </motion.button>
          );
        })}
      </motion.div>

      {/* 선택된 편지지 이름 */}
      <div className="flex items-center justify-center">
        {selectedId && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-1.5 lg:py-2 bg-primary/10 text-primary rounded-full text-[11px] lg:text-sm font-medium"
          >
            <Check className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
            <span>
              {stationeryItems.find(s => s.id === selectedId)?.name} 선택됨
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
}