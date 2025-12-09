import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  FileText, 
  Edit3, 
  Eye, 
  Image, 
  Settings, 
  CreditCard,
  ChevronRight,
  ChevronLeft,
  Check,
  Plus,
  User,
  Send,
  Pencil
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { FamilyMember } from "@/types/mail";
import { type FacilityType, type Region, type RelationType } from "@/data/facilities";

type StepId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

type MailType = "일반우편" | "준등기우편" | "등기우편" | "익일특급";

interface MailTypeOption {
  id: MailType;
  label: string;
  deliveryTime: string;
  price: number;
  hasTracking: boolean;
}

const mailTypeOptions: MailTypeOption[] = [
  { id: "일반우편", label: "일반우편", deliveryTime: "발송 후 3~5일", price: 430, hasTracking: false },
  { id: "준등기우편", label: "준등기우편", deliveryTime: "발송 후 3~4일", price: 1800, hasTracking: true },
  { id: "등기우편", label: "등기우편", deliveryTime: "발송 후 2~3일", price: 2830, hasTracking: true },
  { id: "익일특급", label: "익일특급", deliveryTime: "발송 후 1~2일", price: 3530, hasTracking: true },
];

interface Step {
  id: StepId;
  label: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  { id: 1, label: "받는 사람", icon: <Mail className="w-4 h-4" /> },
  { id: 2, label: "편지지", icon: <FileText className="w-4 h-4" /> },
  { id: 3, label: "편지 작성", icon: <Edit3 className="w-4 h-4" /> },
  { id: 4, label: "미리보기", icon: <Eye className="w-4 h-4" /> },
  { id: 5, label: "사진 추가", icon: <Image className="w-4 h-4" /> },
  { id: 6, label: "추가 옵션", icon: <Settings className="w-4 h-4" /> },
  { id: 7, label: "결제", icon: <CreditCard className="w-4 h-4" /> },
];

interface ComposeContentProps {
  familyMembers: FamilyMember[];
  onClose: () => void;
}

// 샘플 주소록 데이터
const sampleRecipients = [
  {
    id: "1",
    name: "이재원",
    relation: "아들",
    facility: "서울남부교도소",
    address: "서울특별시 금천구 시흥대로 439",
    prisonerNumber: "2024-1234",
    color: "bg-primary",
  },
  {
    id: "2", 
    name: "서은우",
    relation: "남편",
    facility: "수원구치소",
    address: "경기도 수원시 팔달구 동수원로 399",
    prisonerNumber: "2024-5678",
    color: "bg-blue-500",
  },
  {
    id: "3",
    name: "임성훈",
    relation: "동생",
    facility: "대전교도소",
    address: "대전광역시 중구 보문로 285",
    prisonerNumber: "",
    color: "bg-blue-400",
  },
];

export function ComposeContent({ familyMembers, onClose }: ComposeContentProps) {
  const [currentStep, setCurrentStep] = useState<StepId>(1);
  
  // 받는 사람 선택 상태
  const [selectedRecipientId, setSelectedRecipientId] = useState<string | null>("1");
  const [selectedMailType, setSelectedMailType] = useState<MailType>("일반우편");
  
  // 보내는 분 정보 상태
  const [senderInfo, setSenderInfo] = useState({
    name: "Bang Kyung Chang",
    phone: "010-1234-5678",
    address: "서울시 강남구 테헤란로 123",
  });

  // 단계 완료 여부 확인
  const isStep1Complete = () => {
    return selectedRecipientId !== null && selectedMailType !== null;
  };

  const isStep2Complete = () => {
    return senderInfo.name.trim() !== "" && senderInfo.phone.trim() !== "" && senderInfo.address.trim() !== "";
  };

  const canProceed = () => {
    if (currentStep === 1) return isStep1Complete() && isStep2Complete();
    return true;
  };

  const handleNext = () => {
    if (currentStep < 7 && canProceed()) {
      setCurrentStep((prev) => (prev + 1) as StepId);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as StepId);
    } else {
      onClose();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-muted/30">
      {/* Header */}
      <header className="h-auto border-b border-border bg-card px-6 py-4">
        <div className="flex items-center gap-3 mb-4">
          <Mail className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-xl font-semibold text-foreground">편지 쓰기</h1>
            <p className="text-sm text-muted-foreground">소중한 마음을 담아 편지를 써보세요</p>
          </div>
        </div>

        {/* Step Progress - Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => currentStep > step.id && setCurrentStep(step.id)}
              disabled={currentStep < step.id}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
                transition-all duration-200 whitespace-nowrap
                ${currentStep === step.id 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : currentStep > step.id 
                    ? "bg-primary/15 text-primary hover:bg-primary/25 cursor-pointer" 
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }
              `}
            >
              {currentStep > step.id ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <span className="w-5 h-5 rounded-full bg-current/20 flex items-center justify-center text-xs">
                  {step.id}
                </span>
              )}
              {step.label}
            </button>
          ))}
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* 받는 사람 선택 섹션 */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-5 h-5 text-primary" />
                    <h2 className="font-semibold text-foreground text-lg">받는 사람 선택</h2>
                  </div>
                  
                  <div className="space-y-3">
                    {sampleRecipients.map((recipient) => (
                      <div
                        key={recipient.id}
                        onClick={() => setSelectedRecipientId(recipient.id)}
                        className={`
                          relative bg-card rounded-xl border-2 p-4 cursor-pointer transition-all
                          ${selectedRecipientId === recipient.id 
                            ? "border-primary shadow-md" 
                            : "border-border hover:border-primary/30"
                          }
                        `}
                      >
                        {/* 선택 체크 표시 */}
                        {selectedRecipientId === recipient.id && (
                          <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-4 h-4 text-primary-foreground" />
                          </div>
                        )}
                        
                        <div className="flex gap-4">
                          {/* 아바타 */}
                          <div className={`w-12 h-12 rounded-full ${recipient.color} flex items-center justify-center text-white font-semibold text-lg shrink-0`}>
                            {recipient.name.charAt(0)}
                          </div>
                          
                          {/* 정보 */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-foreground">{recipient.name}</span>
                              <Badge variant="secondary" className="text-xs">{recipient.relation}</Badge>
                            </div>
                            <p className="text-primary text-sm font-medium">{recipient.facility}</p>
                            <p className="text-muted-foreground text-sm">{recipient.address}</p>
                            {recipient.prisonerNumber && (
                              <p className="text-muted-foreground text-sm">수용번호: {recipient.prisonerNumber}</p>
                            )}
                          </div>
                        </div>

                        {/* 우편 종류 - 선택된 수신자만 표시 */}
                        {selectedRecipientId === recipient.id && (
                          <div className="mt-4 pt-4 border-t border-border">
                            <p className="text-sm text-muted-foreground mb-3">우편 종류</p>
                            <div className="grid grid-cols-2 gap-2">
                              {mailTypeOptions.map((option) => (
                                <button
                                  key={option.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedMailType(option.id);
                                  }}
                                  className={`
                                    flex items-center justify-between p-3 rounded-lg border-2 transition-all text-left
                                    ${selectedMailType === option.id 
                                      ? "border-primary bg-primary/5" 
                                      : "border-border hover:border-primary/30"
                                    }
                                  `}
                                >
                                  <div className="flex items-center gap-2">
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                      selectedMailType === option.id ? "border-primary" : "border-muted-foreground"
                                    }`}>
                                      {selectedMailType === option.id && (
                                        <div className="w-2 h-2 rounded-full bg-primary" />
                                      )}
                                    </div>
                                    <span className="font-medium text-sm">{option.label}</span>
                                    {option.hasTracking && (
                                      <Badge variant="outline" className="text-xs text-primary border-primary">등기추적</Badge>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <p className="text-xs text-muted-foreground">{option.deliveryTime}</p>
                                    <p className="text-sm font-semibold text-primary">{option.price.toLocaleString()}원</p>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* 새 수신자 추가 버튼 */}
                    <button className="w-full p-4 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors flex items-center justify-center gap-2">
                      <Plus className="w-5 h-5" />
                      <span>새 수신자 추가</span>
                    </button>
                  </div>
                </section>

                {/* 보내는 사람 섹션 */}
                <section className="border-t border-border pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Send className="w-5 h-5 text-primary" />
                      <h2 className="font-semibold text-foreground text-lg">보내는 사람</h2>
                    </div>
                    <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <Pencil className="w-4 h-4" />
                      수정
                    </button>
                  </div>
                  
                  <div className="bg-card rounded-xl border border-border p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <User className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{senderInfo.name}</p>
                        <p className="text-sm text-muted-foreground">{senderInfo.address}</p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {currentStep === 2 && (
              <div className="bg-card rounded-xl border border-border p-8 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-foreground mb-2">편지지 선택</h2>
                <p className="text-muted-foreground">편지지 선택 기능이 곧 추가됩니다</p>
              </div>
            )}

            {currentStep === 3 && (
              <div className="bg-card rounded-xl border border-border p-8 text-center">
                <Edit3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-foreground mb-2">편지 작성</h2>
                <p className="text-muted-foreground">편지 작성 기능이 곧 추가됩니다</p>
              </div>
            )}

            {currentStep === 4 && (
              <div className="bg-card rounded-xl border border-border p-8 text-center">
                <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-foreground mb-2">미리보기</h2>
                <p className="text-muted-foreground">미리보기 기능이 곧 추가됩니다</p>
              </div>
            )}

            {currentStep === 5 && (
              <div className="bg-card rounded-xl border border-border p-8 text-center">
                <Image className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-foreground mb-2">사진 추가</h2>
                <p className="text-muted-foreground">사진 추가 기능이 곧 추가됩니다</p>
              </div>
            )}

            {currentStep === 6 && (
              <div className="bg-card rounded-xl border border-border p-8 text-center">
                <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-foreground mb-2">추가 옵션</h2>
                <p className="text-muted-foreground">추가 옵션 기능이 곧 추가됩니다</p>
              </div>
            )}

            {currentStep === 7 && (
              <div className="bg-card rounded-xl border border-border p-8 text-center">
                <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-foreground mb-2">결제</h2>
                <p className="text-muted-foreground">결제 기능이 곧 추가됩니다</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div className="border-t border-border bg-card px-6 py-4 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrev}
          className="h-10 px-6"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          이전
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className="h-10 px-6 bg-primary hover:bg-primary/90"
        >
          다음
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
