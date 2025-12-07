import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Send, Loader2, ChevronRight, FileText, Plane } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { FamilyMember } from "@/types/mail";
import { toast } from "sonner";
import { RecipientInfoStep } from "./RecipientInfoStep";
import { SenderInfoStep } from "./SenderInfoStep";
import { facilities, type FacilityType, type Region, type RelationType } from "@/data/facilities";

interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  familyMembers: FamilyMember[];
}

type SectionType = "intro" | "body" | "closing";

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
    ],
  },
  {
    id: "body",
    label: "중간 작성",
    emoji: "💬",
    subtitle: "전하고 싶은 본문 내용을 작성해요",
    placeholder: "일상 이야기, 가족 소식 전하기",
    quickTags: [
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
    ],
  },
];

type Step = "confirm" | "editor";

interface SenderInfo {
  name: string;
  phone: string;
  address: string;
}

export function ComposeModal({
  isOpen,
  onClose,
  familyMembers,
}: ComposeModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>("confirm");
  const [letterContent, setLetterContent] = useState("");
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionType>("intro");
  const [aiPrompt, setAiPrompt] = useState("");
  const [selectedQuickTags, setSelectedQuickTags] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // 받는 사람 정보
  const [selectedFacilityType, setSelectedFacilityType] = useState<FacilityType | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null);
  const [recipientName, setRecipientName] = useState("");
  const [prisonerNumber, setPrisonerNumber] = useState("");
  const [selectedRelation, setSelectedRelation] = useState<RelationType | null>(null);
  const [customAddress, setCustomAddress] = useState("");
  
  // 보내는 사람 정보
  const [senderInfo, setSenderInfo] = useState<SenderInfo>({
    name: "Bang Kyung",
    phone: "010-1234-5678",
    address: "서울시 강남구 테헤란로 123",
  });

  // 아코디언 섹션 상태
  const [recipientExpanded, setRecipientExpanded] = useState(true);
  const [senderExpanded, setSenderExpanded] = useState(false);

  const isGeneralAddress = selectedFacilityType === "일반 주소";
  
  // 받는 사람 정보 완료 여부
  const isRecipientComplete = 
    selectedFacilityType !== null &&
    (isGeneralAddress ? customAddress.trim() !== "" : selectedFacilityId !== null) &&
    recipientName.trim() !== "" &&
    (isGeneralAddress || prisonerNumber.trim() !== "") &&
    selectedRelation !== null;

  // 보내는 사람 정보 완료 여부
  const isSenderComplete = 
    senderInfo.name.trim() !== "" &&
    senderInfo.phone.trim() !== "" &&
    senderInfo.address.trim() !== "";

  const canProceed = isRecipientComplete && isSenderComplete;

  const selectedFacility = facilities.find(f => f.id === selectedFacilityId);

  const handleClose = () => {
    setLetterContent("");
    setShowSectionModal(false);
    setAiPrompt("");
    setSelectedQuickTags([]);
    setCurrentStep("confirm");
    // Reset recipient info
    setSelectedFacilityType(null);
    setSelectedRegion(null);
    setSelectedFacilityId(null);
    setRecipientName("");
    setPrisonerNumber("");
    setSelectedRelation(null);
    setCustomAddress("");
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
    const promptText = aiPrompt || selectedQuickTags.join(", ");
    
    let generatedText = "";
    
    if (activeSection === "intro") {
      generatedText = `${recipientName}에게\n\n`;
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
      generatedText += "\n";
    } else if (activeSection === "body") {
      if (promptText.includes("일상")) {
        generatedText += "요즘 집에서는 별일 없이 지내고 있어. ";
      }
      if (promptText.includes("가족") || promptText.includes("소식")) {
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
      generatedText += "\n그럼, 또 연락할게.\n\n- " + senderInfo.name + " 올림";
    }

    setLetterContent(prev => prev + generatedText);
    setIsGenerating(false);
    setShowSectionModal(false);
    setAiPrompt("");
    setSelectedQuickTags([]);
    toast.success(`${config?.emoji} ${config?.label} 완료!`);
  };

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
                <h2 className="text-lg font-semibold text-foreground">
                  {currentStep === "confirm" ? "📋 발송 정보 확인" : "📝 편지 작성"}
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step Indicator */}
            <div className="px-6 py-3 border-b border-border bg-secondary/30">
              <div className="flex items-center gap-2 text-sm">
                <span className={cn(
                  "flex items-center gap-1.5 px-3 py-1 rounded-full",
                  currentStep === "confirm" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  1. 정보 확인
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                <span className={cn(
                  "flex items-center gap-1.5 px-3 py-1 rounded-full",
                  currentStep === "editor" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  2. 편지 작성
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <AnimatePresence mode="wait">
                {currentStep === "confirm" ? (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex-1 p-6 overflow-y-auto"
                  >
                    <div className="max-w-2xl mx-auto space-y-4">
                      {/* 1. 받는 사람 정보 */}
                      <div className="border border-border rounded-2xl overflow-hidden">
                        <button
                          onClick={() => {
                            setRecipientExpanded(!recipientExpanded);
                            if (!recipientExpanded) setSenderExpanded(false);
                          }}
                          className="w-full flex items-center justify-between p-4 bg-background hover:bg-secondary/30 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-primary" />
                            <span className="font-semibold text-foreground">1. 받는 사람 정보</span>
                          </div>
                          <ChevronRight className={cn(
                            "w-5 h-5 text-muted-foreground transition-transform",
                            recipientExpanded && "rotate-90"
                          )} />
                        </button>
                        <AnimatePresence>
                          {recipientExpanded && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: "auto" }}
                              exit={{ height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="p-4 pt-0 border-t border-border">
                                <RecipientInfoStep
                                  selectedFacilityType={selectedFacilityType}
                                  setSelectedFacilityType={setSelectedFacilityType}
                                  selectedRegion={selectedRegion}
                                  setSelectedRegion={setSelectedRegion}
                                  selectedFacilityId={selectedFacilityId}
                                  setSelectedFacilityId={setSelectedFacilityId}
                                  recipientName={recipientName}
                                  setRecipientName={setRecipientName}
                                  prisonerNumber={prisonerNumber}
                                  setPrisonerNumber={setPrisonerNumber}
                                  selectedRelation={selectedRelation}
                                  setSelectedRelation={setSelectedRelation}
                                  customAddress={customAddress}
                                  setCustomAddress={setCustomAddress}
                                  familyMembers={familyMembers}
                                  onSelectFromAddressBook={(member) => {
                                    setRecipientName(member.name);
                                    setPrisonerNumber(member.prisonerNumber || "");
                                    // Find the facility
                                    const facility = facilities.find(f => f.name === member.facility);
                                    if (facility) {
                                      setSelectedFacilityType(facility.type);
                                      setSelectedRegion(facility.region);
                                      setSelectedFacilityId(facility.id);
                                    }
                                    // Find the relation
                                    const relation = member.relation as typeof selectedRelation;
                                    setSelectedRelation(relation);
                                  }}
                                />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* 2. 보내는 분 정보 */}
                      <div className="border border-border rounded-2xl overflow-hidden">
                        <button
                          onClick={() => {
                            setSenderExpanded(!senderExpanded);
                            if (!senderExpanded) setRecipientExpanded(false);
                          }}
                          className="w-full flex items-center justify-between p-4 bg-background hover:bg-secondary/30 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Plane className="w-5 h-5 text-primary" />
                            <span className="font-semibold text-foreground">2. 보내는 분 정보</span>
                          </div>
                          <ChevronRight className={cn(
                            "w-5 h-5 text-muted-foreground transition-transform",
                            senderExpanded && "rotate-90"
                          )} />
                        </button>
                        <AnimatePresence>
                          {senderExpanded && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: "auto" }}
                              exit={{ height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="p-4 pt-0 border-t border-border">
                                <SenderInfoStep
                                  senderInfo={senderInfo}
                                  setSenderInfo={setSenderInfo}
                                  isRecipientComplete={isRecipientComplete}
                                />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Confirm Footer */}
                    <div className="flex justify-between pt-6 max-w-2xl mx-auto">
                      <Button variant="ghost" onClick={handleClose}>
                        취소
                      </Button>
                      <Button 
                        onClick={() => setCurrentStep("editor")} 
                        className="h-12 px-8 rounded-xl text-base"
                        disabled={!canProceed}
                      >
                        다음
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="editor"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex-1 flex flex-col overflow-hidden"
                  >
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
                              <span>{section.id === "intro" ? "시작" : section.id === "body" ? "중간" : "마무리"}</span>
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
                            <span className="font-medium text-foreground">
                              {recipientName}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              · {selectedFacility?.name || customAddress}
                            </span>
                            {selectedRelation && (
                              <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                                {selectedRelation}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Letter Editor */}
                        <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
                          <textarea
                            ref={textareaRef}
                            value={letterContent}
                            onChange={(e) => setLetterContent(e.target.value)}
                            className="w-full min-h-[400px] resize-none border-0 focus:outline-none focus:ring-0 text-foreground leading-relaxed letter-paper text-base bg-transparent p-6"
                            placeholder="위의 시작/중간/마무리 버튼을 클릭하여 AI의 도움을 받아 편지를 작성해보세요..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="h-16 border-t border-border bg-card flex items-center justify-between px-6">
                      <Button variant="ghost" onClick={() => setCurrentStep("confirm")}>
                        이전
                      </Button>
                      <div className="flex items-center gap-3">
                        <Button variant="outline" className="h-10 rounded-xl">
                          임시저장
                        </Button>
                        <Button
                          onClick={handleSend}
                          className="h-10 px-6 rounded-xl"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          발송하기
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Section Generation Modal */}
          <AnimatePresence>
            {showSectionModal && currentSectionConfig && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center p-4"
              >
                <div
                  className="absolute inset-0 bg-foreground/40"
                  onClick={() => setShowSectionModal(false)}
                />
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="relative bg-card rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
                >
                  {/* Modal Header */}
                  <div className="p-6 border-b border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{currentSectionConfig.emoji}</span>
                        <div>
                          <h3 className="font-semibold text-foreground text-lg">
                            {currentSectionConfig.label}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {currentSectionConfig.subtitle}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowSectionModal(false)}
                        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Modal Content */}
                  <div className="p-6 space-y-4">
                    {/* Quick Tags */}
                    <div>
                      <p className="text-sm text-muted-foreground mb-3">빠른 선택</p>
                      <div className="flex flex-wrap gap-2">
                        {currentSectionConfig.quickTags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => toggleQuickTag(tag)}
                            className={cn(
                              "px-3 py-1.5 rounded-full text-sm transition-all",
                              selectedQuickTags.includes(tag)
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-foreground hover:bg-secondary/80"
                            )}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* AI Prompt */}
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        또는 직접 입력해주세요
                      </p>
                      <textarea
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder={currentSectionConfig.placeholder}
                        className="w-full h-24 px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      />
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="p-6 border-t border-border bg-secondary/30">
                    <Button
                      onClick={handleGenerateSection}
                      disabled={isGenerating || (!aiPrompt.trim() && selectedQuickTags.length === 0)}
                      className="w-full h-12 rounded-xl"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          생성 중...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          AI로 {currentSectionConfig.label}
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
}
