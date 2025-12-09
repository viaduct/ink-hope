import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, ArrowLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AIWritingHelperProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSuggestion: (text: string) => void;
  recipientRelation?: string;
  currentContent?: string;
}

export function AIWritingHelper({ 
  isOpen, 
  onClose, 
  onSelectSuggestion,
  recipientRelation = "가족",
  currentContent = ""
}: AIWritingHelperProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadSuggestions = async () => {
    if (hasLoaded) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-letter-helper', {
        body: { 
          type: 'suggestions',
          context: { relation: recipientRelation }
        }
      });

      if (error) throw error;
      
      if (data.suggestions) {
        setSuggestions(data.suggestions);
        setHasLoaded(true);
      }
    } catch (error) {
      console.error('Error loading suggestions:', error);
      // 기본 제안 사용
      setSuggestions([
        "오랜만에 펜을 들었어요. 잘 지내고 계신가요?",
        "안녕하세요, 요즘 어떻게 지내세요?",
        "보고 싶은 마음에 편지를 씁니다.",
        "이 편지가 닿을 무렵, 좋은 하루 보내고 계시길 바라요."
      ]);
      setHasLoaded(true);
    } finally {
      setIsLoading(false);
    }
  };

  // 열릴 때 제안 로드
  useState(() => {
    if (isOpen && !hasLoaded) {
      loadSuggestions();
    }
  });

  const handleSelectSuggestion = (suggestion: string) => {
    onSelectSuggestion(suggestion);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-x-0 bottom-0 z-50 p-4 md:relative md:inset-auto"
        >
          <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 rounded-2xl shadow-2xl overflow-hidden max-w-lg mx-auto md:max-w-none">
            {/* 헤더 */}
            <div className="flex items-center justify-between p-4 text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span className="font-medium">AI가 도와드릴까요?</span>
              </div>
              <button 
                onClick={onClose}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 뒤로가기 */}
            <div className="px-4 pb-2">
              <button 
                onClick={onClose}
                className="flex items-center gap-1 text-white/70 hover:text-white text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                뒤로
              </button>
            </div>

            {/* 제안 목록 */}
            <div className="px-4 pb-6 space-y-2">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              ) : (
                suggestions.map((suggestion, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSelectSuggestion(suggestion)}
                    className="w-full p-3 bg-white/20 hover:bg-white/30 rounded-xl text-white text-left transition-colors"
                  >
                    {suggestion}
                  </motion.button>
                ))
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}