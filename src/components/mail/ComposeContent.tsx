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
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AddRecipientModal } from "./AddRecipientModal";
import { AddSenderModal } from "./AddSenderModal";
import { AddressBookModal } from "./AddressBookModal";
import { StationerySelector } from "./StationerySelector";
import { LetterEditor } from "./LetterEditor";
import { LetterPreview } from "./LetterPreview";
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
  { id: "준등기우편", label: "준등기", deliveryTime: "3~5일", price: 1800, hasTracking: true },
  { id: "등기우편", label: "일반등기", deliveryTime: "3~5일", price: 2830, hasTracking: true },
  { id: "일반우편", label: "일반우편", deliveryTime: "3~5일", price: 430, hasTracking: false },
  { id: "익일특급", label: "익일특급", deliveryTime: "3~5일", price: 3530, hasTracking: false },
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

// 샘플 보내는 사람 데이터
const sampleSenders = [
  {
    id: "1",
    name: "Bang Kyung Chang",
    phone: "010-1234-5678",
    address: "서울시 강남구 테헤란로 123",
  },
  {
    id: "2",
    name: "Bang Kyung Chang",
    phone: "010-1234-5678",
    address: "경기도 성남시 분당구 판교로 256",
  },
  {
    id: "3",
    name: "방경창",
    phone: "010-9876-5432",
    address: "서울시 마포구 홍대입구역 12",
  },
];

export function ComposeContent({ familyMembers, onClose }: ComposeContentProps) {
  const [currentStep, setCurrentStep] = useState<StepId>(1);
  
  // familyMembers를 recipients 형태로 변환
  const recipientsFromFamily = familyMembers.map(member => ({
    id: member.id,
    name: member.name,
    relation: member.relation,
    facility: member.facility,
    address: member.facilityAddress,
    prisonerNumber: member.prisonerNumber,
    color: member.color.includes('orange') ? 'bg-orange-500' : 
           member.color.includes('blue') ? 'bg-blue-500' : 
           member.color.includes('purple') ? 'bg-purple-500' : 'bg-primary',
  }));
  
  // 받는 사람 선택 상태
  const [selectedRecipientId, setSelectedRecipientId] = useState<string | null>(familyMembers[0]?.id || null);
  const [selectedMailType, setSelectedMailType] = useState<MailType>("준등기우편");
  
  // 보내는 사람 선택 상태
  const [selectedSenderId, setSelectedSenderId] = useState<string | null>("1");
  
  // 편지지 선택 상태
  const [selectedStationeryId, setSelectedStationeryId] = useState<string | null>("white");
  
  // 편지 내용 상태
  const [letterContent, setLetterContent] = useState("");
  
  // 모달 상태
  const [isAddRecipientModalOpen, setIsAddRecipientModalOpen] = useState(false);
  const [isAddSenderModalOpen, setIsAddSenderModalOpen] = useState(false);
  const [isAddressBookModalOpen, setIsAddressBookModalOpen] = useState(false);
  
  // 동적 데이터
  const [recipients, setRecipients] = useState(recipientsFromFamily);
  const [senders, setSenders] = useState(sampleSenders);
  
  // 선택된 보내는 사람 정보
  const selectedSender = senders.find(s => s.id === selectedSenderId);

  // 단계 완료 여부 확인
  const isStep1Complete = () => {
    return selectedRecipientId !== null && selectedMailType !== null;
  };

  const isStep2Complete = () => {
    return selectedSenderId !== null;
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
      <header className="h-auto bg-card px-6 py-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Mail className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">편지 쓰기</h1>
            <p className="text-sm text-muted-foreground">소중한 마음을 담아 편지를 써보세요</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-4" />

        {/* Step Progress - Chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-1.5">
              <button
                onClick={() => currentStep > step.id && setCurrentStep(step.id)}
                disabled={currentStep < step.id}
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
                  transition-all duration-200 whitespace-nowrap border
                  ${currentStep === step.id 
                    ? "bg-primary text-primary-foreground border-primary shadow-md" 
                    : currentStep > step.id 
                      ? "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 cursor-pointer" 
                      : "bg-muted text-muted-foreground border-border cursor-not-allowed"
                  }
                `}
              >
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold">
                  {currentStep > step.id ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    step.id
                  )}
                </span>
                {step.label}
              </button>
              {/* 화살표 (마지막 스텝 제외) */}
              {index < steps.length - 1 && (
                <ChevronRight className="w-4 h-4 text-muted-foreground/50 shrink-0" />
              )}
            </div>
          ))}
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 lg:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* 받는 사람 선택 섹션 */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      <h2 className="font-semibold text-foreground text-lg">받는 사람 선택</h2>
                    </div>
                    <button 
                      onClick={() => setIsAddressBookModalOpen(true)}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      주소록관리
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {recipients.map((recipient) => (
                      <div
                        key={recipient.id}
                        onClick={() => setSelectedRecipientId(selectedRecipientId === recipient.id ? null : recipient.id)}
                        className={`
                          relative bg-card rounded-xl border-2 p-4 cursor-pointer transition-all
                          ${selectedRecipientId === recipient.id 
                            ? "border-primary shadow-md" 
                            : "border-border hover:border-primary/30"
                          }
                        `}
                      >
                        {/* 선택 체크 표시 */}
                        <div className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center ${
                          selectedRecipientId === recipient.id 
                            ? "bg-primary" 
                            : "bg-card border-2 border-border"
                        }`}>
                          {selectedRecipientId === recipient.id && (
                            <Check className="w-4 h-4 text-primary-foreground" />
                          )}
                        </div>
                        
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
                            <div className="mb-5">
                              <p className="text-sm font-medium text-foreground mb-1">우편 종류</p>
                              <p className="text-xs text-muted-foreground">
                                <span className="font-semibold text-foreground">교정시설 우편은 내부 검수 절차로 인해</span> 모든 방식의 실제 전달 속도는 비슷합니다. 안전성과 가격을 기준으로 선택해 주세요.
                              </p>
                            </div>
                            <div className="space-y-3">
                              {mailTypeOptions.map((option, index) => (
                                <button
                                  key={option.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedMailType(option.id);
                                  }}
                                  className={`
                                    w-full p-4 rounded-xl border-2 transition-all text-left
                                    ${selectedMailType === option.id 
                                      ? "border-primary bg-primary/5" 
                                      : "border-border hover:border-primary/30 bg-card"
                                    }
                                    ${index === 0 ? "ring-2 ring-orange-200 ring-offset-1" : ""}
                                  `}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                        selectedMailType === option.id ? "border-primary bg-primary" : "border-muted-foreground"
                                      }`}>
                                        {selectedMailType === option.id && (
                                          <Check className="w-3 h-3 text-primary-foreground" />
                                        )}
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <span className="font-semibold text-foreground">{option.label}</span>
                                          {option.hasTracking && (
                                            <span className="text-xs text-primary">
                                              {index === 0 ? "분실 위험 적음" : "추적 가능 + 전달 확인"}
                                            </span>
                                          )}
                                          {!option.hasTracking && index === 2 && (
                                            <span className="text-xs text-muted-foreground">기본 전송</span>
                                          )}
                                          {!option.hasTracking && index === 3 && (
                                            <span className="text-xs text-muted-foreground">일반우편과 동일한 처리 시간</span>
                                          )}
                                        </div>
                                        <span className="text-sm text-muted-foreground">{option.deliveryTime}</span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {index === 0 && (
                                        <span className="px-2 py-0.5 bg-orange-500 text-white text-xs font-semibold rounded">
                                          추천
                                        </span>
                                      )}
                                      {index === 1 && (
                                        <span className="px-2 py-0.5 bg-blue-500 text-white text-xs font-semibold rounded">
                                          안심
                                        </span>
                                      )}
                                      <p className="text-lg font-bold text-primary">{option.price.toLocaleString()}원</p>
                                    </div>
                                  </div>
                                  
                                  {/* 가장 많이 선택하는 방식 노트 */}
                                  {index === 0 && (
                                    <div className="mt-2 flex items-center gap-1 text-orange-600 text-xs font-medium">
                                      <span className="w-3 h-3 bg-orange-500 rounded-sm flex items-center justify-center text-white text-[8px]">🔥</span>
                                      가장 많이 선택하는 방식
                                    </div>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* 새 수신자 추가 버튼 */}
                    <button 
                      onClick={() => setIsAddRecipientModalOpen(true)}
                      className="w-full p-4 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors flex items-center justify-center gap-2"
                    >
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
                    <button 
                      onClick={() => setIsAddressBookModalOpen(true)}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      주소록관리
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {senders.map((sender) => (
                      <div
                        key={sender.id}
                        onClick={() => setSelectedSenderId(sender.id)}
                        className={`
                          relative bg-card rounded-xl border-2 p-4 cursor-pointer transition-all
                          ${selectedSenderId === sender.id 
                            ? "border-primary shadow-md" 
                            : "border-border hover:border-primary/30"
                          }
                        `}
                      >
                        {/* 선택 체크 표시 */}
                        <div className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center ${
                          selectedSenderId === sender.id 
                            ? "bg-primary" 
                            : "bg-card border-2 border-border"
                        }`}>
                          {selectedSenderId === sender.id && (
                            <Check className="w-4 h-4 text-primary-foreground" />
                          )}
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            <User className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0 pr-8">
                            <p className="font-medium text-foreground">{sender.name}</p>
                            <p className="text-sm text-muted-foreground">{sender.address}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* 새 주소 추가 버튼 */}
                    {/* 새 주소 추가 버튼 */}
                    <button 
                      onClick={() => setIsAddSenderModalOpen(true)}
                      className="w-full p-4 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      <span>새 주소 추가</span>
                    </button>
                  </div>
                </section>
              </div>
            )}

            {currentStep === 2 && (
              <StationerySelector
                selectedId={selectedStationeryId}
                onSelect={setSelectedStationeryId}
              />
            )}

            {currentStep === 3 && (
              <LetterEditor
                content={letterContent}
                onContentChange={setLetterContent}
              />
            )}

            {currentStep === 4 && (
              <LetterPreview
                content={letterContent}
                stationeryId={selectedStationeryId}
                recipientName={recipients.find(r => r.id === selectedRecipientId)?.name}
                recipientFacility={recipients.find(r => r.id === selectedRecipientId)?.facility}
                recipientAddress={recipients.find(r => r.id === selectedRecipientId)?.address}
                senderName={senders.find(s => s.id === selectedSenderId)?.name}
                senderAddress={senders.find(s => s.id === selectedSenderId)?.address}
                onContentChange={setLetterContent}
              />
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

      {/* 모달들 */}
      <AddRecipientModal
        open={isAddRecipientModalOpen}
        onOpenChange={setIsAddRecipientModalOpen}
        onAdd={(newRecipient) => {
          const id = String(recipients.length + 1);
          const colors = ["bg-primary", "bg-blue-500", "bg-blue-400", "bg-green-500", "bg-purple-500"];
          setRecipients([...recipients, {
            ...newRecipient,
            id,
            color: colors[recipients.length % colors.length],
          }]);
          setSelectedRecipientId(id);
        }}
      />

      <AddSenderModal
        open={isAddSenderModalOpen}
        onOpenChange={setIsAddSenderModalOpen}
        onAdd={(newSender) => {
          const id = String(senders.length + 1);
          setSenders([...senders, { ...newSender, id }]);
          setSelectedSenderId(id);
        }}
      />

      <AddressBookModal
        isOpen={isAddressBookModalOpen}
        onClose={() => setIsAddressBookModalOpen(false)}
        familyMembers={familyMembers}
        onUpdateMembers={() => {}}
      />
    </div>
  );
}
