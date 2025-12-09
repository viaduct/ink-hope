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
import { PhotoUpload } from "./PhotoUpload";
import { AdditionalOptions } from "./AdditionalOptions";
import { PaymentSummary } from "./PaymentSummary";
import type { FamilyMember } from "@/types/mail";
import { type FacilityType, type Region, type RelationType } from "@/data/facilities";
import orangeRipe from "@/assets/emoticons/orange-ripe.png";
import orangeSeed from "@/assets/emoticons/orange-seed.png";
import orangeSprout from "@/assets/emoticons/orange-sprout.png";
import orangeYoungTree from "@/assets/emoticons/orange-young-tree.png";
import orangeFullTree from "@/assets/emoticons/orange-full-tree.png";

const orangeEmoticons = [orangeRipe, orangeSeed, orangeSprout, orangeYoungTree, orangeFullTree];

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
  
  // 사진 상태
  const [photos, setPhotos] = useState<Array<{ id: string; file: File; preview: string; rotation: number }>>([]);
  
  // 추가 옵션 상태
  const [selectedAdditionalItems, setSelectedAdditionalItems] = useState<string[]>([]);
  
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
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-muted/20">
      {/* Header */}
      <header className="h-auto bg-card px-6 py-4 border-b border-border/60">
        <div className="mb-3">
          <h1 className="text-lg font-semibold text-foreground tracking-tight">편지 쓰기</h1>
          <p className="text-xs text-muted-foreground mt-0.5">소중한 마음을 담아 편지를 써보세요</p>
        </div>

        {/* Divider */}
        <div className="border-t border-border/40 my-3" />

        {/* Step Progress - Chips */}
        <div className="flex items-center gap-1 flex-wrap">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-1">
              <button
                onClick={() => currentStep > step.id && setCurrentStep(step.id)}
                disabled={currentStep < step.id}
                className={`
                  flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium
                  transition-all duration-200 whitespace-nowrap border
                  ${currentStep === step.id 
                    ? "bg-primary text-primary-foreground border-primary" 
                    : currentStep > step.id 
                      ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 cursor-pointer" 
                      : "bg-muted/60 text-muted-foreground border-transparent cursor-not-allowed"
                  }
                `}
              >
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-semibold">
                  {currentStep > step.id ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    step.id
                  )}
                </span>
                {step.label}
              </button>
              {/* 화살표 (마지막 스텝 제외) */}
              {index < steps.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
              )}
            </div>
          ))}
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-5 lg:px-6">
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
              <div className="space-y-5">
                {/* 받는 사람 선택 섹션 */}
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      <h2 className="font-semibold text-foreground text-sm">받는 사람 선택</h2>
                    </div>
                    <button 
                      onClick={() => setIsAddressBookModalOpen(true)}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      주소록관리
                    </button>
                  </div>
                  
                  <div className="space-y-2.5">
                    {recipients.map((recipient) => (
                      <div
                        key={recipient.id}
                        onClick={() => setSelectedRecipientId(selectedRecipientId === recipient.id ? null : recipient.id)}
                        className={`
                          relative bg-card rounded-xl border p-3.5 cursor-pointer transition-all
                          ${selectedRecipientId === recipient.id 
                            ? "border-primary/40 shadow-sm" 
                            : "border-border/60 hover:border-border"
                          }
                        `}
                      >
                        {/* 선택 체크 표시 */}
                        <div className={`absolute top-3.5 right-3.5 w-5 h-5 rounded-full flex items-center justify-center ${
                          selectedRecipientId === recipient.id 
                            ? "bg-primary" 
                            : "bg-card border border-border"
                        }`}>
                          {selectedRecipientId === recipient.id && (
                            <Check className="w-3 h-3 text-primary-foreground" />
                          )}
                        </div>
                        
                        <div className="flex gap-3">
                          {/* 아바타 */}
                          <div className="w-10 h-10 rounded-full bg-orange-50 ring-1 ring-orange-200/50 flex items-center justify-center shrink-0">
                            <img src={orangeEmoticons[recipients.indexOf(recipient) % orangeEmoticons.length]} alt="프로필" className="w-7 h-7 object-contain" />
                          </div>
                          
                          {/* 정보 */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="font-semibold text-foreground text-sm">{recipient.name}</span>
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{recipient.relation}</Badge>
                            </div>
                            <p className="text-primary text-xs font-medium">{recipient.facility}</p>
                            <p className="text-muted-foreground text-xs">{recipient.address}</p>
                            {recipient.prisonerNumber && (
                              <p className="text-muted-foreground text-xs">수용번호: {recipient.prisonerNumber}</p>
                            )}
                          </div>
                        </div>

                        {/* 우편 종류 - 선택된 수신자만 표시 */}
                        {selectedRecipientId === recipient.id && (
                          <div className="mt-3 pt-3 border-t border-border/50">
                            <div className="mb-4">
                              <p className="text-xs font-medium text-foreground mb-0.5">우편 종류</p>
                              <p className="text-[11px] text-muted-foreground leading-relaxed">
                                <span className="font-medium text-foreground">교정시설 우편은 내부 검수 절차로 인해</span> 모든 방식의 실제 전달 속도는 비슷합니다.
                              </p>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {mailTypeOptions.map((option, index) => (
                                <button
                                  key={option.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedMailType(option.id);
                                  }}
                                  className={`
                                    w-full p-2.5 rounded-lg transition-all text-left
                                    ${selectedMailType === option.id 
                                      ? "border border-primary bg-primary/5" 
                                      : "border border-border/40 hover:border-primary/30 bg-card"
                                    }
                                    ${index === 0 ? "ring-1 ring-orange-200/60" : ""}
                                  `}
                                >
                                  <div className="flex items-start justify-between gap-1">
                                    <div className="flex items-start gap-1.5">
                                      <div className={`w-3.5 h-3.5 mt-0.5 rounded-full border flex items-center justify-center shrink-0 ${
                                        selectedMailType === option.id ? "border-primary bg-primary" : "border-muted-foreground/50"
                                      }`}>
                                        {selectedMailType === option.id && (
                                          <Check className="w-2 h-2 text-primary-foreground" />
                                        )}
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-1 flex-wrap">
                                          <span className="text-xs font-semibold text-foreground">{option.label}</span>
                                          {index === 0 && (
                                            <span className="px-1 py-0.5 bg-primary text-primary-foreground text-[8px] font-semibold rounded">추천</span>
                                          )}
                                          {index === 1 && (
                                            <span className="px-1 py-0.5 bg-blue-500 text-white text-[8px] font-semibold rounded">안심</span>
                                          )}
                                        </div>
                                        <span className="text-[10px] text-muted-foreground">{option.deliveryTime}</span>
                                      </div>
                                    </div>
                                    <p className="text-xs font-bold text-primary">{option.price.toLocaleString()}원</p>
                                  </div>
                                  
                                  {/* 가장 많이 선택하는 방식 노트 */}
                                  {index === 0 && (
                                    <div className="mt-1 flex items-center gap-1 text-primary text-[9px] font-medium">
                                      <span>🔥</span>
                                      가장 많이 선택
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
                      className="w-full p-3 border border-dashed border-border/60 rounded-xl text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors flex items-center justify-center gap-1.5 text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>새 수신자 추가</span>
                    </button>
                  </div>
                </section>

                {/* 보내는 사람 섹션 */}
                <section className="border-t border-border/40 pt-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Send className="w-4 h-4 text-primary" />
                      <h2 className="font-semibold text-foreground text-sm">보내는 사람</h2>
                    </div>
                    <button 
                      onClick={() => setIsAddressBookModalOpen(true)}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      주소록관리
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {senders.map((sender) => (
                      <div
                        key={sender.id}
                        onClick={() => setSelectedSenderId(sender.id)}
                        className={`
                          relative bg-card rounded-xl border p-3 cursor-pointer transition-all
                          ${selectedSenderId === sender.id 
                            ? "border-primary/40 bg-primary/5" 
                            : "border-border/60 hover:border-border"
                          }
                        `}
                      >
                        {/* 선택 체크 표시 */}
                        <div className={`absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center ${
                          selectedSenderId === sender.id 
                            ? "bg-primary" 
                            : "bg-card border border-border"
                        }`}>
                          {selectedSenderId === sender.id && (
                            <Check className="w-3 h-3 text-primary-foreground" />
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-orange-50 ring-1 ring-orange-200/50 flex items-center justify-center">
                            <img src={orangeEmoticons[(senders.indexOf(sender) + 2) % orangeEmoticons.length]} alt="프로필" className="w-5 h-5 object-contain" />
                          </div>
                          <div className="flex-1 min-w-0 pr-6">
                            <p className="font-medium text-foreground text-sm">{sender.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{sender.address}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* 새 주소 추가 버튼 */}
                    <button 
                      onClick={() => setIsAddSenderModalOpen(true)}
                      className="w-full p-3 border border-dashed border-border/60 rounded-xl text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors flex items-center justify-center gap-1.5 text-sm"
                    >
                      <Plus className="w-4 h-4" />
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
              <PhotoUpload
                photos={photos}
                onPhotosChange={setPhotos}
                maxPhotos={10}
              />
            )}

            {currentStep === 6 && (
              <AdditionalOptions
                selectedItems={selectedAdditionalItems}
                onSelectedItemsChange={setSelectedAdditionalItems}
              />
            )}

            {currentStep === 7 && (
              <PaymentSummary
                recipientName={recipients.find(r => r.id === selectedRecipientId)?.name}
                recipientFacility={recipients.find(r => r.id === selectedRecipientId)?.facility}
                letterContent={letterContent}
                stationeryName={selectedStationeryId === "cream" ? "크림" : 
                               selectedStationeryId === "lined" ? "줄노트" : 
                               selectedStationeryId === "sky" ? "하늘색" : 
                               selectedStationeryId === "pink" ? "연분홍" : 
                               selectedStationeryId === "mint" ? "민트" : "기본"}
                photos={photos}
                selectedAdditionalItems={selectedAdditionalItems}
                mailType={selectedMailType}
                mailPrice={mailTypeOptions.find(m => m.id === selectedMailType)?.price || 0}
                onMailTypeChange={(newMailType, price) => {
                  setSelectedMailType(newMailType as MailType);
                }}
                onPayment={() => {
                  // TODO: 결제 처리
                  console.log("결제 진행");
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div className="border-t border-border/50 bg-card px-6 py-3 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrev}
          className="h-9 px-4 text-sm"
        >
          <ChevronLeft className="w-3.5 h-3.5 mr-1" />
          이전
        </Button>
        
        {currentStep !== 7 && (
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="h-9 px-5 text-sm bg-primary hover:bg-primary/90"
          >
            다음
            <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        )}
        {currentStep === 7 && (
          <div className="w-20" />
        )}
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
