import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Clock, Smile, Heart, ThumbsUp, Coffee, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmojiPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (emoji: string) => void;
}

type Category = "recent" | "smileys" | "love" | "gestures" | "food" | "nature";

const categories = [
  { id: "recent" as Category, icon: <Clock className="w-4 h-4" />, label: "최근" },
  { id: "smileys" as Category, icon: <Smile className="w-4 h-4" />, label: "표정" },
  { id: "love" as Category, icon: <Heart className="w-4 h-4" />, label: "사랑" },
  { id: "gestures" as Category, icon: <ThumbsUp className="w-4 h-4" />, label: "제스처" },
  { id: "food" as Category, icon: <Coffee className="w-4 h-4" />, label: "음식" },
  { id: "nature" as Category, icon: <Sparkles className="w-4 h-4" />, label: "자연" },
];

const emojis: Record<Category, string[]> = {
  recent: ["😊", "❤️", "👍", "🙏", "💕", "😢", "🥰", "😭"],
  smileys: [
    "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂",
    "🙂", "🙃", "😉", "😊", "😇", "🥰", "😍", "🤩",
    "😘", "😗", "😚", "😙", "🥲", "😋", "😛", "😜",
    "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔", "🤐",
    "🤨", "😐", "😑", "😶", "😏", "😒", "🙄", "😬",
    "😮‍💨", "🤥", "😌", "😔", "😪", "🤤", "😴", "😷",
    "🤒", "🤕", "🤢", "🤮", "🤧", "🥵", "🥶", "🥴",
    "😵", "🤯", "🤠", "🥳", "🥸", "😎", "🤓", "🧐",
    "😕", "😟", "🙁", "☹️", "😮", "😯", "😲", "😳",
    "🥺", "😦", "😧", "😨", "😰", "😥", "😢", "😭",
  ],
  love: [
    "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍",
    "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖",
    "💘", "💝", "💟", "♥️", "😍", "🥰", "😘", "💋",
    "🫶", "💑", "💏", "👩‍❤️‍👨", "👨‍❤️‍👨", "👩‍❤️‍👩", "🫀", "💌",
  ],
  gestures: [
    "👋", "🤚", "🖐", "✋", "🖖", "👌", "🤌", "🤏",
    "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆",
    "🖕", "👇", "☝️", "👍", "👎", "✊", "👊", "🤛",
    "🤜", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "✍️",
    "💪", "🦾", "🦿", "🦵", "🦶", "👂", "🦻", "👃",
  ],
  food: [
    "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓",
    "🫐", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝",
    "🍅", "🍆", "🥑", "🥦", "🥬", "🥒", "🌶", "🫑",
    "🌽", "🥕", "🫒", "🧄", "🧅", "🥔", "🍠", "🥐",
    "🍕", "🍔", "🍟", "🌭", "🍿", "🧂", "🥚", "🍳",
    "☕", "🍵", "🧃", "🥤", "🧋", "🍶", "🍺", "🍷",
  ],
  nature: [
    "🌸", "💮", "🏵", "🌹", "🥀", "🌺", "🌻", "🌼",
    "🌷", "🌱", "🪴", "🌲", "🌳", "🌴", "🌵", "🌾",
    "🌿", "☘️", "🍀", "🍁", "🍂", "🍃", "🪻", "🪷",
    "🌍", "🌎", "🌏", "🌙", "⭐", "🌟", "✨", "💫",
    "☀️", "🌤", "⛅", "🌈", "❄️", "💧", "🌊", "🔥",
  ],
};

// 오렌지 감정 캐릭터
const orangeEmoticons = [
  { emoji: "🍊", label: "기본" },
  { emoji: "😊🍊", label: "행복" },
  { emoji: "😢🍊", label: "슬픔" },
  { emoji: "😍🍊", label: "사랑" },
  { emoji: "🤗🍊", label: "응원" },
  { emoji: "😴🍊", label: "졸림" },
  { emoji: "🥳🍊", label: "축하" },
  { emoji: "🙏🍊", label: "감사" },
];

export function EmojiPicker({ isOpen, onClose, onSelect }: EmojiPickerProps) {
  const [activeCategory, setActiveCategory] = useState<Category>("smileys");
  const [searchQuery, setSearchQuery] = useState("");
  const [showOrangeTab, setShowOrangeTab] = useState(false);

  const handleEmojiClick = (emoji: string) => {
    onSelect(emoji);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
          />
          
          {/* 이모지 피커 */}
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full right-0 mb-2 w-80 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden"
          >
            {/* 헤더 */}
            <div className="flex items-center justify-between p-3 border-b border-border">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowOrangeTab(false)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                    !showOrangeTab ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  이모지
                </button>
                <button
                  onClick={() => setShowOrangeTab(true)}
                  className={cn(
                    "flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                    showOrangeTab ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  🍊 오렌지
                </button>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {!showOrangeTab ? (
              <>
                {/* 검색 */}
                <div className="p-2 border-b border-border">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="이모지 검색..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-muted/50 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                {/* 카테고리 탭 */}
                <div className="flex items-center gap-1 p-2 border-b border-border overflow-x-auto">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={cn(
                        "p-2 rounded-lg transition-colors shrink-0",
                        activeCategory === category.id
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted"
                      )}
                      title={category.label}
                    >
                      {category.icon}
                    </button>
                  ))}
                </div>

                {/* 이모지 그리드 */}
                <div className="p-2 h-48 overflow-y-auto">
                  <div className="grid grid-cols-8 gap-1">
                    {emojis[activeCategory].map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => handleEmojiClick(emoji)}
                        className="w-8 h-8 flex items-center justify-center text-xl hover:bg-muted rounded-lg transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* 오렌지 캐릭터 탭 */
              <div className="p-4">
                <p className="text-xs text-muted-foreground mb-3 text-center">
                  🍊 오렌지 레터 전용 캐릭터 (Coming Soon!)
                </p>
                <div className="grid grid-cols-4 gap-3">
                  {orangeEmoticons.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleEmojiClick(item.emoji)}
                      className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-muted transition-colors"
                    >
                      <span className="text-2xl">{item.emoji}</span>
                      <span className="text-xs text-muted-foreground">{item.label}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-primary/5 rounded-xl text-center">
                  <p className="text-xs text-muted-foreground">
                    오렌지 캐릭터 이모티콘이 곧 추가됩니다!
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}