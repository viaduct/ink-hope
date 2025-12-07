import { useState, useRef } from "react";
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

type SectionType = "intro" | "closing";

interface SectionConfig {
  id: SectionType;
  label: string;
  emoji: string;
  subtitle: string;
  placeholder: string;
  quickTags: string[];
}

const sectionConfigs: SectionConfig[] = [
  {
    id: "intro",
    label: "시작 작성",
    emoji: "👋",
    subtitle: "인사와 전하고 싶은 이야기를 담아요",
    placeholder: "따뜻한 인사로 시작하기, 안부 묻기",
    quickTags: [
      "따뜻한 인사로 시작하기",
      "안부 묻기",
      "편지 쓰게 된 계기",
      "보고싶다는 말",
      "날씨/계절 이야기",
      "건강 걱정",
      "일상 이야기",
      "가족 소식 전하기",
      "응원의 말",
      "추억 이야기",
      "감사한 마음",
      "사과하고 싶은 말",
    ],
  },
  {
    id: "closing",
    label: "마무리 작성",
    emoji: "🌟",
    subtitle: "마무리 인사를 전해요",
    placeholder: "건강 챙기라는 말, 사랑한다는 말",
    quickTags: [
      "건강 챙기라는 말",
      "사랑한다는 말",
      "다음 만남 기약",
      "힘내라는 응원",
      "곧 보자는 약속",
      "항상 생각한다는 말",
      "기다리겠다는 말",
      "잊지 않겠다는 다짐",
      "미래에 대한 희망",
      "약속하기",
    ],
  },
];

export function ComposeModal({
  isOpen,
  onClose,
  familyMembers,
}: ComposeModalProps) {
  const [selectedRecipient, setSelectedRecipient] = useState(familyMembers[0]?.id || "");
  const [letterContent, setLetterContent] = useState("");
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionType>("intro");
  const [aiPrompt, setAiPrompt] = useState("");
  const [selectedQuickTags, setSelectedQuickTags] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleClose = () => {
    setLetterContent("");
    setShowSectionModal(false);
    setAiPrompt("");
    setSelectedQuickTags([]);
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

  const handleSectionClick = (sectionId: SectionType) => {
    setActiveSection(sectionId);
    setShowSectionModal(true);
    setAiPrompt("");
    setSelectedQuickTags([]);
  };

  const toggleQuickTag = (tag: string) => {
    setSelectedQuickTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    // Also update the prompt
    setAiPrompt(prev => {
      const tags = prev ? prev.split(", ") : [];
      if (tags.includes(tag)) {
        return tags.filter(t => t !== tag).join(", ");
      } else {
        return [...tags.filter(t => t), tag].join(", ");
      }
    });
  };

  const handleGenerateSection = async () => {
    if (!aiPrompt.trim() && selectedQuickTags.length === 0) {
      toast.error("내용을 입력하거나 빠른 선택에서 선택해주세요.");
      return;
    }

    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const config = sectionConfigs.find(c => c.id === activeSection);
    const recipient = familyMembers.find(m => m.id === selectedRecipient);
    const promptText = aiPrompt || selectedQuickTags.join(", ");
    
    let generatedText = "";
    
    if (activeSection === "intro") {
      generatedText = `${recipient?.name}에게\n\n`;
      if (promptText.includes("따뜻한 인사") || promptText.includes("인사")) {
        generatedText += "안녕, 잘 지내고 있니?\n";
      }
      if (promptText.includes("안부")) {
        generatedText += "요즘 어떻게 지내? 건강은 괜찮아?\n";
      }
      if (promptText.includes("보고싶")) {
        generatedText += "네가 너무 보고싶어서 이렇게 편지를 쓰게 됐어.\n";
      }
      if (promptText.includes("날씨") || promptText.includes("계절")) {
        generatedText += "요즘 날씨가 많이 추워졌어. 거기는 어때?\n";
      }
      if (promptText.includes("건강")) {
        generatedText += "건강은 괜찮은 거지? 많이 걱정돼.\n";
      }
      if (promptText.includes("일상")) {
        generatedText += "요즘 집에서는 별일 없이 지내고 있어. ";
      }
      if (promptText.includes("가족") || promptText.includes("근황")) {
        generatedText += "가족들 모두 건강하게 잘 지내고 있으니 걱정하지 마. ";
      }
      if (promptText.includes("응원")) {
        generatedText += "힘든 시간이겠지만, 넌 분명 잘 해낼 수 있어. 항상 응원하고 있어. ";
      }
      if (promptText.includes("추억") || promptText.includes("기억")) {
        generatedText += "예전에 함께 했던 좋은 기억들이 자꾸 떠올라. ";
      }
      if (promptText.includes("감사")) {
        generatedText += "그동안 고마웠어. 네 덕분에 많이 배웠어. ";
      }
      if (promptText.includes("사과")) {
        generatedText += "그동안 미안했어. 더 잘하지 못해서 후회가 돼. ";
      }
      generatedText += "\n\n";
    } else if (activeSection === "closing") {
      if (promptText.includes("건강")) {
        generatedText += "\n건강 꼭 챙기고, 밥 잘 먹어야 해.\n";
      }
      if (promptText.includes("사랑")) {
        generatedText += "항상 사랑해. 잊지 마.\n";
      }
      if (promptText.includes("만남") || promptText.includes("보자")) {
        generatedText += "다음에 꼭 만나자. 기다릴게.\n";
      }
      if (promptText.includes("응원") || promptText.includes("힘내")) {
        generatedText += "힘내! 넌 할 수 있어.\n";
      }
      if (promptText.includes("생각") || promptText.includes("잊지")) {
        generatedText += "항상 네 생각하고 있어. 절대 잊지 않을게.\n";
      }
      if (promptText.includes("기다리")) {
        generatedText += "여기서 기다리고 있을게.\n";
      }
      if (promptText.includes("희망") || promptText.includes("미래")) {
        generatedText += "곧 좋은 날이 올 거야. 희망을 잃지 마. ";
      }
      if (promptText.includes("약속")) {
        generatedText += "다음에 만나면 꼭 함께 하고 싶은 것들이 많아. ";
      }
      generatedText += "\n그럼, 또 연락할게.\n\n- 보내는 사람 올림";
    }

    setLetterContent(prev => prev + generatedText);
    setIsGenerating(false);
    setShowSectionModal(false);
    setAiPrompt("");
    setSelectedQuickTags([]);
    toast.success(`${config?.emoji} ${config?.label} 완료!`);
  };

  const selectedRecipientData = familyMembers.find((m) => m.id === selectedRecipient);
  const currentSectionConfig = sectionConfigs.find(c => c.id === activeSection);

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

          {/* Main Modal */}
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
                  className="text-sm bg-secondary border border-border rounded-lg px-4 pr-8 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.75rem_center]"
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
                    {sectionConfigs.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => handleSectionClick(section.id)}
                        className={cn(
                          "flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-medium transition-all border",
                          "bg-card text-foreground hover:bg-primary hover:text-primary-foreground border-border hover:border-primary"
                        )}
                      >
                        <span>{section.emoji}</span>
                        <span>{section.id === "intro" ? "시작" : "마무리"}</span>
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
                      ✓ AI 연결됨
                    </span>
                  </div>
                </div>

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

                  {/* Letter Editor */}
                  <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
                    <textarea
                      ref={textareaRef}
                      value={letterContent}
                      onChange={(e) => setLetterContent(e.target.value)}
                      className="w-full min-h-[400px] resize-none border-0 focus:outline-none focus:ring-0 text-foreground leading-relaxed letter-paper text-base bg-transparent p-6"
                      placeholder="위의 서론/본론/결론 버튼을 클릭하여 AI의 도움을 받아 편지를 작성해보세요..."
                    />
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

          {/* Section AI Modal */}
          <AnimatePresence>
            {showSectionModal && currentSectionConfig && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-foreground/30 z-10"
                  onClick={() => setShowSectionModal(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg bg-card rounded-2xl shadow-2xl z-20 overflow-hidden"
                >
                  {/* Modal Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                          <span className="text-2xl">{currentSectionConfig.emoji}</span>
                          {currentSectionConfig.label}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {currentSectionConfig.subtitle}
                        </p>
                      </div>
                      <button
                        onClick={() => setShowSectionModal(false)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Modal Content */}
                  <div className="px-6 pb-6 space-y-4">
                    {/* Current Letter Preview */}
                    <div className="bg-secondary/50 rounded-xl p-4">
                      <p className="text-xs text-muted-foreground mb-2">현재 편지 내용</p>
                      <p className="text-sm text-foreground line-clamp-2">
                        {letterContent || "아직 작성된 내용이 없습니다."}
                      </p>
                    </div>

                    {/* Prompt Input */}
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">
                        어떤 {currentSectionConfig.id === "intro" ? "인사/이야기" : "마무리 인사"}를 전하고 싶으세요?
                      </p>
                      <textarea
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder={currentSectionConfig.placeholder}
                        className="w-full h-24 p-4 bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    {/* Quick Tags */}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">빠른 선택</p>
                      <div className="flex flex-wrap gap-2">
                        {currentSectionConfig.quickTags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => toggleQuickTag(tag)}
                            className={cn(
                              "px-3 py-1.5 text-sm rounded-full border transition-all",
                              selectedQuickTags.includes(tag)
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-card text-foreground border-border hover:border-primary"
                            )}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* AI Info */}
                    <div className="bg-amber-50 text-amber-800 rounded-xl p-3 flex items-center gap-2 text-sm">
                      <span>💡</span>
                      <span>AI가 {currentSectionConfig.id === "intro" ? "시작 부분" : "마무리 부분"}을 작성해 편지에 추가해요!</span>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="px-6 pb-6 flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowSectionModal(false)}
                      className="flex-1 h-12 rounded-xl"
                    >
                      취소
                    </Button>
                    <Button
                      onClick={handleGenerateSection}
                      disabled={isGenerating || (!aiPrompt.trim() && selectedQuickTags.length === 0)}
                      className="flex-1 h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          작성 중...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          {currentSectionConfig.id === "intro" ? "시작" : "마무리"} 작성
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
}
