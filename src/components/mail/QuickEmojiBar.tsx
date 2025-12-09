import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickEmojiBarProps {
  onSelect: (emoji: string) => void;
}

// 빠른 접근 이모지 (자주 사용되는 것들)
const quickEmojis = ["😊", "🥰", "😢", "😭", "🤗", "😌", "🙏", "❤️", "💕", "🧡", "💛", "🌸", "🌷", "☀️", "🌙", "⭐"];

// 전체 카테고리
const emojiCategories = {
  감정: ["😊", "🥹", "🥰", "🥺", "😭", "😤", "🤗", "😌", "🙏"],
  하트: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "💕", "💗", "💝"],
  자연: ["🌸", "🌺", "🌷", "🌻", "🍀", "🌿", "🌙", "⭐"],
  날씨: ["☀️", "🌤️", "☁️", "❄️", "🌈", "💧", "🔥", "⚡"],
  기타: ["✨", "💪", "👍", "👐", "💐", "🎁", "📮", "✉️", "💌"],
};

export function QuickEmojiBar({ onSelect }: QuickEmojiBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleEmojiClick = (emoji: string) => {
    onSelect(emoji);
  };

  return (
    <div className="space-y-2">
      {/* 빠른 이모지 바 - 항상 보임 */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {quickEmojis.map((emoji, index) => (
          <button
            key={index}
            onClick={() => handleEmojiClick(emoji)}
            className="w-9 h-9 flex items-center justify-center text-xl hover:bg-muted hover:scale-110 rounded-lg transition-all duration-150"
          >
            {emoji}
          </button>
        ))}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "ml-auto flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
            isExpanded 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted/60 text-muted-foreground hover:bg-muted"
          )}
        >
          {isExpanded ? (
            <>
              접기 <ChevronUp className="w-3 h-3" />
            </>
          ) : (
            <>
              더보기 <ChevronDown className="w-3 h-3" />
            </>
          )}
        </button>
      </div>

      {/* 확장된 이모지 패널 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-muted/30 rounded-2xl p-4 space-y-4">
              {Object.entries(emojiCategories).map(([category, emojis]) => (
                <div key={category}>
                  <p className="text-xs font-medium text-muted-foreground mb-2">{category}</p>
                  <div className="flex flex-wrap gap-1">
                    {emojis.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => handleEmojiClick(emoji)}
                        className="w-9 h-9 flex items-center justify-center text-xl hover:bg-card hover:scale-110 rounded-lg transition-all duration-150"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
