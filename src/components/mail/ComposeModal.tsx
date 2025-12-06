import { useState } from "react";
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

type SectionType = "처음" | "중간" | "마무리";

interface AITag {
  id: string;
  label: string;
  section: SectionType;
}

const aiTags: AITag[] = [
  // 처음 (Opening)
  { id: "greeting", label: "인사", section: "처음" },
  { id: "miss", label: "보고싶음", section: "처음" },
  { id: "worry", label: "걱정", section: "처음" },
  { id: "weather", label: "날씨/계절", section: "처음" },
  // 중간 (Body)
  { id: "daily", label: "일상 이야기", section: "중간" },
  { id: "family", label: "가족 소식", section: "중간" },
  { id: "encourage", label: "응원", section: "중간" },
  { id: "memory", label: "추억", section: "중간" },
  { id: "hope", label: "희망", section: "중간" },
  { id: "apology", label: "사과", section: "중간" },
  // 마무리 (Closing)
  { id: "health", label: "건강 챙김", section: "마무리" },
  { id: "promise", label: "약속", section: "마무리" },
  { id: "love", label: "사랑 표현", section: "마무리" },
  { id: "goodbye", label: "마무리 인사", section: "마무리" },
];

const sectionColors: Record<SectionType, string> = {
  "처음": "bg-blue-100 text-blue-700 border-blue-200",
  "중간": "bg-orange-100 text-orange-700 border-orange-200",
  "마무리": "bg-green-100 text-green-700 border-green-200",
};

const sectionLabels: Record<SectionType, string> = {
  "처음": "편지의 시작",
  "중간": "본문 내용",
  "마무리": "편지의 끝",
};

export function ComposeModal({
  isOpen,
  onClose,
  familyMembers,
}: ComposeModalProps) {
  const [selectedRecipient, setSelectedRecipient] = useState(familyMembers[0]?.id || "");
  const [letterContent, setLetterContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionType>("처음");

  const handleClose = () => {
    setLetterContent("");
    setSelectedTags([]);
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

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleAIGenerate = async () => {
    if (selectedTags.length === 0) {
      toast.error("AI 글쓰기를 위해 태그를 선택해주세요.");
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const selectedTagLabels = selectedTags
      .map(id => aiTags.find(t => t.id === id)?.label)
      .filter(Boolean);
    
    const recipient = familyMembers.find(m => m.id === selectedRecipient);
    
    // Generate sample content based on selected tags
    let generatedContent = "";
    
    const openingTags = selectedTags.filter(id => 
      aiTags.find(t => t.id === id)?.section === "처음"
    );
    const bodyTags = selectedTags.filter(id => 
      aiTags.find(t => t.id === id)?.section === "중간"
    );
    const closingTags = selectedTags.filter(id => 
      aiTags.find(t => t.id === id)?.section === "마무리"
    );

    if (openingTags.length > 0) {
      generatedContent += `${recipient?.name}에게\n\n`;
      if (openingTags.includes("greeting")) {
        generatedContent += "안녕, 잘 지내고 있니?\n";
      }
      if (openingTags.includes("miss")) {
        generatedContent += "네가 너무 보고싶어서 편지를 쓰게 됐어.\n";
      }
      if (openingTags.includes("weather")) {
        generatedContent += "요즘 날씨가 많이 추워졌어. 거기도 그렇겠지?\n";
      }
      generatedContent += "\n";
    }

    if (bodyTags.length > 0) {
      if (bodyTags.includes("daily")) {
        generatedContent += "요즘 집에서는 별일 없이 지내고 있어. ";
      }
      if (bodyTags.includes("family")) {
        generatedContent += "가족들 모두 건강하게 잘 지내고 있으니 걱정하지 마. ";
      }
      if (bodyTags.includes("encourage")) {
        generatedContent += "힘든 시간이겠지만, 항상 응원하고 있어. 넌 분명 잘 해낼 수 있어. ";
      }
      if (bodyTags.includes("memory")) {
        generatedContent += "예전에 함께 했던 좋은 기억들을 떠올리며 힘을 내. ";
      }
      if (bodyTags.includes("hope")) {
        generatedContent += "곧 좋은 날이 올 거야. 희망을 잃지 마. ";
      }
      generatedContent += "\n\n";
    }

    if (closingTags.length > 0) {
      if (closingTags.includes("health")) {
        generatedContent += "건강 꼭 챙기고, 밥 잘 먹어야 해.\n";
      }
      if (closingTags.includes("promise")) {
        generatedContent += "다음에 꼭 만나자. 기다릴게.\n";
      }
      if (closingTags.includes("love")) {
        generatedContent += "항상 사랑해. 잊지마.\n";
      }
      if (closingTags.includes("goodbye")) {
        generatedContent += "\n그럼, 또 연락할게.";
      }
    }

    setLetterContent(prev => prev + generatedContent);
    setIsGenerating(false);
    toast.success("AI가 편지 내용을 작성했습니다!");
  };

  const selectedRecipientData = familyMembers.find((m) => m.id === selectedRecipient);
  const sections: SectionType[] = ["처음", "중간", "마무리"];

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
                <h2 className="text-lg font-semibold text-foreground">새 편지 쓰기</h2>
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
            <div className="flex-1 flex overflow-hidden">
              {/* Left: AI Tags Panel */}
              <div className="w-72 border-r border-border bg-secondary/30 p-4 overflow-y-auto scrollbar-thin">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">AI 글쓰기</h3>
                </div>

                {/* Section Tabs */}
                <div className="flex gap-1 mb-4 p-1 bg-muted rounded-lg">
                  {sections.map((section) => (
                    <button
                      key={section}
                      onClick={() => setActiveSection(section)}
                      className={cn(
                        "flex-1 py-1.5 text-xs font-medium rounded-md transition-all",
                        activeSection === section
                          ? "bg-card text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {section}
                    </button>
                  ))}
                </div>

                {/* Tags for active section */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground mb-2">
                    {sectionLabels[activeSection]}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {aiTags
                      .filter((tag) => tag.section === activeSection)
                      .map((tag) => (
                        <button
                          key={tag.id}
                          onClick={() => toggleTag(tag.id)}
                          className={cn(
                            "px-3 py-1.5 text-xs font-medium rounded-full border transition-all",
                            selectedTags.includes(tag.id)
                              ? sectionColors[tag.section]
                              : "bg-card text-muted-foreground border-border hover:border-primary/50"
                          )}
                        >
                          {tag.label}
                        </button>
                      ))}
                  </div>
                </div>

                {/* Selected Tags Summary */}
                {selectedTags.length > 0 && (
                  <div className="mt-6 p-3 bg-card rounded-xl border border-border">
                    <p className="text-xs text-muted-foreground mb-2">선택된 태그</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedTags.map((tagId) => {
                        const tag = aiTags.find((t) => t.id === tagId);
                        if (!tag) return null;
                        return (
                          <span
                            key={tagId}
                            className={cn(
                              "px-2 py-0.5 text-xs rounded-full",
                              sectionColors[tag.section]
                            )}
                          >
                            {tag.label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Generate Button */}
                <Button
                  onClick={handleAIGenerate}
                  disabled={selectedTags.length === 0 || isGenerating}
                  className="w-full mt-4 h-10 rounded-xl"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      생성 중...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      AI로 작성하기
                    </>
                  )}
                </Button>
              </div>

              {/* Right: Letter Editor */}
              <div className="flex-1 flex flex-col">
                <div className="flex-1 p-6 overflow-y-auto scrollbar-thin">
                  <div className="max-w-2xl mx-auto">
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
                        value={letterContent}
                        onChange={(e) => setLetterContent(e.target.value)}
                        className="w-full min-h-[450px] resize-none border-0 focus:outline-none focus:ring-0 text-foreground leading-relaxed letter-paper text-base bg-transparent p-6"
                        placeholder="마음을 담아 편지를 써보세요...

왼쪽의 AI 글쓰기 태그를 선택하면 
편지의 처음, 중간, 마무리 부분을 
자동으로 작성해드립니다."
                      />
                    </div>

                    {/* Character Count */}
                    <div className="mt-2 text-right">
                      <span className="text-xs text-muted-foreground">
                        {letterContent.length}자
                      </span>
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
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
