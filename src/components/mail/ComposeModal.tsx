import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { FamilyMember } from "@/types/mail";
import { toast } from "sonner";

interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  familyMembers: FamilyMember[];
}

interface AITag {
  id: string;
  label: string;
  emoji: string;
}

const aiTags: AITag[] = [
  { id: "greeting", label: "인사말", emoji: "👋" },
  { id: "thanks", label: "감사", emoji: "🙏" },
  { id: "miss", label: "보고싶음", emoji: "💕" },
  { id: "encourage", label: "응원", emoji: "💪" },
  { id: "apology", label: "사과", emoji: "😢" },
  { id: "closing", label: "마무리", emoji: "🌙" },
];

const sectionButtons = [
  { id: "intro", label: "서론", emoji: "👋" },
  { id: "body", label: "본론", emoji: "💬" },
  { id: "conclusion", label: "결론", emoji: "🌟" },
];

export function ComposeModal({
  isOpen,
  onClose,
  familyMembers,
}: ComposeModalProps) {
  const [selectedRecipient, setSelectedRecipient] = useState(familyMembers[0]?.id || "");
  const [letterContent, setLetterContent] = useState("");
  const [showAIHelper, setShowAIHelper] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("intro");
  const [aiHelperPosition, setAiHelperPosition] = useState({ top: 0, left: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleClose = () => {
    setLetterContent("");
    setShowAIHelper(false);
    setAiPrompt("");
    onClose();
  };

  const handleSend = () => {
    if (!letterContent.trim()) {
      toast.error("편지 내용을 입력해주세요.");
      return;
    }
    toast.success("편지가 성공적으로 발송되었습니다! 💌");
    handleClose();
  };

  const handleTextareaClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const clickX = e.clientX - rect.left;
    
    // Position AI helper near cursor
    setAiHelperPosition({
      top: Math.min(clickY + 20, rect.height - 150),
      left: Math.min(clickX, rect.width - 320),
    });
    setShowAIHelper(true);
  };

  const handleTagClick = async (tag: AITag) => {
    setIsGenerating(true);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const recipient = familyMembers.find(m => m.id === selectedRecipient);
    let generatedText = "";
    
    switch (tag.id) {
      case "greeting":
        generatedText = `${recipient?.name}에게\n\n안녕, 잘 지내고 있니? 오랜만에 편지를 쓰게 됐어.\n`;
        break;
      case "thanks":
        generatedText = "항상 나를 생각해줘서 정말 고마워. 네 마음이 큰 힘이 돼.\n";
        break;
      case "miss":
        generatedText = "요즘 네가 너무 보고싶어. 함께했던 시간들이 자꾸 떠올라.\n";
        break;
      case "encourage":
        generatedText = "힘든 시간이겠지만, 넌 분명 잘 해낼 수 있어. 항상 응원하고 있어.\n";
        break;
      case "apology":
        generatedText = "그동안 많이 미안했어. 더 잘하지 못해서 후회가 돼.\n";
        break;
      case "closing":
        generatedText = "\n건강 꼭 챙기고, 다음에 꼭 만나자.\n항상 사랑해.\n\n- 보내는 사람 올림";
        break;
    }
    
    setLetterContent(prev => prev + generatedText);
    setIsGenerating(false);
    setShowAIHelper(false);
    toast.success(`${tag.emoji} ${tag.label} 내용이 추가되었습니다!`);
  };

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  const handleCustomAIGenerate = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Simulate custom AI response based on prompt
    const generatedText = `\n${aiPrompt}에 대한 내용을 담아 작성합니다...\n`;
    setLetterContent(prev => prev + generatedText);
    setAiPrompt("");
    setIsGenerating(false);
    setShowAIHelper(false);
    toast.success("AI가 내용을 작성했습니다!");
  };

  const selectedRecipientData = familyMembers.find((m) => m.id === selectedRecipient);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.ai-helper-popup') && !target.closest('textarea')) {
        setShowAIHelper(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-4 md:inset-8 lg:inset-12 bg-card rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="h-14 border-b border-border flex items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-foreground">📝 편지 작성</h2>
                <select
                  value={selectedRecipient}
                  onChange={(e) => setSelectedRecipient(e.target.value)}
                  className="text-sm bg-secondary border border-border rounded-lg px-3 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {familyMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name} ({member.relation})
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Section Buttons & Toolbar */}
              <div className="px-6 py-4 border-b border-border bg-secondary/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-2">
                    {sectionButtons.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => handleSectionClick(section.id)}
                        className={cn(
                          "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all",
                          activeSection === section.id
                            ? "bg-card text-foreground shadow-sm border border-border"
                            : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                        )}
                      >
                        <span>{section.emoji}</span>
                        <span>{section.label}</span>
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
                      ✓ AI 연결됨
                    </span>
                  </div>
                </div>

                {/* Simple Toolbar */}
                <div className="flex items-center gap-1 text-muted-foreground">
                  <span className="text-xs px-2">Pretendard</span>
                  <span className="text-xs px-2 border-l border-border">16</span>
                  <span className="text-xs text-right ml-auto">{letterContent.length}자</span>
                </div>
              </div>

              {/* Letter Editor Area */}
              <div className="flex-1 p-6 overflow-y-auto scrollbar-thin relative">
                <div className="max-w-3xl mx-auto relative">
                  {/* Recipient Header */}
                  <div className="mb-4 flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">받는 사람:</span>
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                          selectedRecipientData?.color
                        )}
                      >
                        {selectedRecipientData?.avatar}
                      </div>
                      <span className="font-medium text-foreground">
                        {selectedRecipientData?.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        · {selectedRecipientData?.facility}
                      </span>
                    </div>
                  </div>

                  {/* Letter Editor with AI Helper */}
                  <div className="relative">
                    <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
                      <textarea
                        ref={textareaRef}
                        value={letterContent}
                        onChange={(e) => setLetterContent(e.target.value)}
                        onClick={handleTextareaClick}
                        className="w-full min-h-[400px] resize-none border-0 focus:outline-none focus:ring-0 text-foreground leading-relaxed letter-paper text-base bg-transparent p-6"
                        placeholder="편지를 작성하세요. 클릭하면 AI 도우미가 나타납니다..."
                      />
                    </div>

                    {/* AI Helper Popup */}
                    <AnimatePresence>
                      {showAIHelper && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="ai-helper-popup absolute z-10 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl shadow-lg p-3 min-w-[300px]"
                          style={{
                            top: aiHelperPosition.top,
                            left: Math.max(0, aiHelperPosition.left),
                          }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-white">
                              <Sparkles className="w-4 h-4" />
                              <span className="text-sm font-medium">AI가 도와드릴까요?</span>
                            </div>
                            <button
                              onClick={() => setShowAIHelper(false)}
                              className="text-white/70 hover:text-white"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          
                          {/* Quick Tags */}
                          <div className="flex flex-wrap gap-1.5">
                            {aiTags.map((tag) => (
                              <button
                                key={tag.id}
                                onClick={() => handleTagClick(tag)}
                                disabled={isGenerating}
                                className="flex items-center gap-1 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-medium rounded-full transition-all disabled:opacity-50"
                              >
                                <span>{tag.emoji}</span>
                                <span>{tag.label}</span>
                              </button>
                            ))}
                          </div>

                          {isGenerating && (
                            <div className="mt-2 flex items-center gap-2 text-white/80 text-xs">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              <span>AI가 작성 중...</span>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="h-16 border-t border-border bg-card flex items-center justify-between px-6">
                <Button variant="ghost" onClick={handleClose}>
                  취소
                </Button>
                <Button
                  onClick={handleSend}
                  disabled={!letterContent.trim()}
                  className="h-10 px-6 rounded-xl"
                >
                  <Send className="w-4 h-4 mr-2" />
                  발송하기
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
