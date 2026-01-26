import { useState, useCallback, useRef, useEffect } from "react";
import { User, UserPlus, Loader2, Check, AlertCircle, Send, RotateCcw, ZoomIn, ZoomOut, PenLine, ChevronLeft, ChevronRight, ChevronDown, Archive, Plus, Trash2, ArrowUpDown, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  order: number;
}

// 받는 사람 (주소록) 인터페이스
interface Recipient {
  id: string;
  name: string;
  facilityType: string;
  region: string;
  facility: string;
  prisonerNumber: string;
  birthDate?: string;
}

interface HandwrittenUploadContentProps {
  onClose: () => void;
  onComposeWithText?: (text: string, senderName?: string) => void;
  onSaveToArchive?: () => void;
  onOpenArchive?: () => void;
}

// 시설 데이터
const facilityTypes = ["교도소", "구치소"];

const regions = ["서울/경기/인천", "강원", "충청", "전라", "경상", "제주"];

const facilitiesByRegion: Record<string, string[]> = {
  "서울/경기/인천": ["서울남부구치소", "서울동부구치소", "서울구치소", "인천구치소", "수원구치소", "의정부구치소", "안양교도소", "화성직업훈련교도소"],
  "강원": ["춘천교도소", "강릉교도소", "원주교도소", "영월교도소"],
  "충청": ["대전교도소", "천안교도소", "청주교도소", "공주교도소", "홍성교도소"],
  "전라": ["광주교도소", "전주교도소", "목포교도소", "순천교도소", "해남교도소", "장흥교도소"],
  "경상": ["대구교도소", "부산교도소", "울산구치소", "포항교도소", "안동교도소", "경주교도소", "김천교도소", "창원교도소", "진주교도소", "밀양구치소"],
  "제주": ["제주교도소"],
};

export function HandwrittenUploadContent({ onClose, onComposeWithText, onSaveToArchive, onOpenArchive }: HandwrittenUploadContentProps) {
  // 주소록 (받는 사람 목록) - 실제로는 서버에서 가져옴
  const [recipientAddressBook, setRecipientAddressBook] = useState<Recipient[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);
  const [addressDropdownOpen, setAddressDropdownOpen] = useState(false);

  // 받는 사람 추가 모달
  const [addRecipientModalOpen, setAddRecipientModalOpen] = useState(false);
  const [newFacilityType, setNewFacilityType] = useState("");
  const [newRegion, setNewRegion] = useState("");
  const [newFacility, setNewFacility] = useState("");
  const [newName, setNewName] = useState("");
  const [newPrisonerNumber, setNewPrisonerNumber] = useState("");
  const [newBirthYear, setNewBirthYear] = useState("");
  const [newBirthMonth, setNewBirthMonth] = useState("");
  const [newBirthDay, setNewBirthDay] = useState("");

  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);

  // 순서 바꾸기 모드
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [originalOrderImages, setOriginalOrderImages] = useState<UploadedImage[]>([]);
  const [reorderExitConfirmOpen, setReorderExitConfirmOpen] = useState(false);

  // 도움말 토글
  const [showUploadHelp, setShowUploadHelp] = useState(false);

  const [ocrStatus, setOcrStatus] = useState<"idle" | "processing" | "completed" | "error">("idle");
  const [ocrTexts, setOcrTexts] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLElement>(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const MAX_IMAGES = 10; // 최대 10장

  // 생년월일 옵션
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAddressDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 지역 변경 시 시설 초기화
  useEffect(() => {
    setNewFacility("");
  }, [newRegion]);

  // 받는 사람 추가
  const handleAddRecipient = () => {
    if (!newFacilityType) {
      toast.error("시설 유형을 선택해주세요.");
      return;
    }
    if (!newRegion) {
      toast.error("지역을 선택해주세요.");
      return;
    }
    if (!newFacility) {
      toast.error("시설을 선택해주세요.");
      return;
    }
    if (!newName.trim()) {
      toast.error("이름을 입력해주세요.");
      return;
    }
    if (!newPrisonerNumber.trim()) {
      toast.error("수용자번호를 입력해주세요.");
      return;
    }

    const birthDate = newBirthYear && newBirthMonth && newBirthDay
      ? `${newBirthYear}-${newBirthMonth.padStart(2, '0')}-${newBirthDay.padStart(2, '0')}`
      : undefined;

    const newRecipient: Recipient = {
      id: `recipient-${Date.now()}`,
      name: newName.trim(),
      facilityType: newFacilityType,
      region: newRegion,
      facility: newFacility,
      prisonerNumber: newPrisonerNumber.trim(),
      birthDate,
    };

    setRecipientAddressBook(prev => [...prev, newRecipient]);
    setSelectedRecipient(newRecipient);
    setAddRecipientModalOpen(false);
    setAddressDropdownOpen(false);

    // 폼 초기화
    setNewFacilityType("");
    setNewRegion("");
    setNewFacility("");
    setNewName("");
    setNewPrisonerNumber("");
    setNewBirthYear("");
    setNewBirthMonth("");
    setNewBirthDay("");

    toast.success("받는 사람이 추가되었습니다.");
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      processFiles(droppedFiles);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  const processFiles = async (files: File[]) => {
    const validExtensions = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    const validFiles: File[] = [];

    // 최대 개수 체크
    const remainingSlots = MAX_IMAGES - uploadedImages.length;
    if (remainingSlots <= 0) {
      toast.error(`최대 ${MAX_IMAGES}장까지만 업로드할 수 있습니다.`);
      return;
    }

    for (const file of files) {
      if (validFiles.length >= remainingSlots) {
        toast.error(`최대 ${MAX_IMAGES}장까지만 업로드할 수 있습니다.`);
        break;
      }
      if (!validExtensions.includes(file.type)) {
        toast.error(`${file.name}: 지원하지 않는 파일 형식입니다.`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name}: 파일 크기는 10MB 이하여야 합니다.`);
        continue;
      }
      validFiles.push(file);
    }

    const newImages: UploadedImage[] = [];
    const startOrder = uploadedImages.length;

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      const preview = await createPreview(file);
      newImages.push({
        id: `${Date.now()}-${i}`,
        file,
        preview,
        order: startOrder + i + 1,
      });
    }

    setUploadedImages(prev => [...prev, ...newImages]);
    toast.success(`${newImages.length}장의 이미지가 추가되었습니다.`);
  };

  const createPreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  };

  const handleStartOCR = async () => {
    if (uploadedImages.length === 0) {
      toast.error("먼저 손편지 이미지를 업로드해주세요.");
      return;
    }

    setOcrStatus("processing");
    setOcrTexts([]);
    setCurrentImageIndex(0);

    // Step 3로 스크롤
    setTimeout(() => {
      step3Ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);

    // Sort images by order
    const sortedImages = [...uploadedImages].sort((a, b) => a.order - b.order);

    // Simulate OCR for each image
    const results: string[] = [];
    for (let i = 0; i < sortedImages.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

      const sampleTexts = [
        "사랑하는 가족에게,\n\n오늘도 건강하게 지내고 있어요. 날씨가 많이 추워졌는데 감기 조심하세요.\n\n항상 보고싶고 사랑해요.\n\n2024년 12월",
        "안녕하세요,\n\n여기서의 생활도 점점 익숙해지고 있어요. 많이 걱정하지 마세요.\n\n건강 잘 챙기시고요.\n\n곧 좋은 소식 전할게요.",
        "보고싶은 우리 가족들에게,\n\n오랜만에 편지 쓰네요. 그동안 잘 지냈어요?\n\n여기는 모든 게 괜찮으니 걱정 마세요.\n\n다음에 또 쓸게요.",
      ];
      results.push(sampleTexts[i % sampleTexts.length]);
    }

    setOcrTexts(results);
    setOcrStatus("completed");
    toast.success("손편지 인식이 완료되었습니다.");
  };

  // 삭제 확인 팝업 열기
  const openDeleteConfirm = (id: string) => {
    setImageToDelete(id);
    setDeleteConfirmOpen(true);
  };

  // 이미지 삭제 실행
  const handleConfirmDelete = () => {
    if (!imageToDelete) return;

    setUploadedImages(prev => {
      const filtered = prev.filter(img => img.id !== imageToDelete);
      return filtered.map((img, idx) => ({ ...img, order: idx + 1 }));
    });

    setDeleteConfirmOpen(false);
    setImageToDelete(null);
    toast.success("사진이 삭제되었습니다.");
  };

  // 순서 바꾸기 모드 시작
  const startReorderMode = () => {
    setOriginalOrderImages([...uploadedImages]);
    setIsReorderMode(true);
  };

  // 순서 바꾸기 완료
  const finishReorderMode = () => {
    setIsReorderMode(false);
    setOriginalOrderImages([]);
    toast.success("사진 순서가 정리되었어요", {
      description: "이 순서대로 편지가 전달됩니다."
    });
  };

  // 순서 바꾸기 취소 (원래 순서로 복원)
  const cancelReorderMode = () => {
    setUploadedImages(originalOrderImages);
    setIsReorderMode(false);
    setOriginalOrderImages([]);
    setReorderExitConfirmOpen(false);
  };

  // 순서 바꾸기 중 나가기 시도
  const handleReorderModeExit = () => {
    setReorderExitConfirmOpen(true);
  };

  const handleImageDragStart = (id: string) => {
    setDraggedItem(id);
  };

  const handleImageDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetId) return;

    setUploadedImages(prev => {
      const items = [...prev];
      const draggedIndex = items.findIndex(img => img.id === draggedItem);
      const targetIndex = items.findIndex(img => img.id === targetId);

      if (draggedIndex === -1 || targetIndex === -1) return prev;

      const [draggedImage] = items.splice(draggedIndex, 1);
      items.splice(targetIndex, 0, draggedImage);

      return items.map((img, idx) => ({ ...img, order: idx + 1 }));
    });
  };

  const handleImageDragEnd = () => {
    setDraggedItem(null);
  };

  const handleSaveToArchive = () => {
    if (!selectedRecipient) {
      toast.error("받는 사람을 선택해주세요.");
      return;
    }
    if (uploadedImages.length === 0) {
      toast.error("손편지 이미지를 업로드해주세요.");
      return;
    }
    if (ocrStatus !== "completed") {
      toast.error("손편지 인식을 먼저 시작해주세요.");
      return;
    }

    // 손편지보관함에 저장하고 보관함으로 이동
    if (onSaveToArchive) {
      onSaveToArchive();
    }
  };

  const handleReplyLetter = () => {
    if (!selectedRecipient) {
      toast.error("받는 사람을 선택해주세요.");
      return;
    }
    if (ocrStatus !== "completed" || ocrTexts.length === 0) {
      toast.error("인식된 편지 내용이 없습니다.");
      return;
    }

    if (onComposeWithText) {
      onComposeWithText(ocrTexts.join("\n\n"), selectedRecipient.name);
    }
    toast.success("답장 편지 작성 화면으로 이동합니다.");
    onClose();
  };

  const sortedImages = [...uploadedImages].sort((a, b) => a.order - b.order);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
      {/* Header */}
      <header className="h-14 border-b border-border/40 bg-white/80 backdrop-blur-sm flex items-center px-6">
        <div className="flex items-center gap-2">
          <PenLine className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-semibold text-foreground">손편지 담기</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto px-4 py-10 lg:px-6">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* 타이틀 영역 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              받은 <span className="text-primary">손편지</span>를 담아보세요
            </h2>
            <div className="text-base text-muted-foreground leading-relaxed mb-6">
              <p>
                종이에 적어 받은 손편지를 휴대폰으로 사진 찍어 올리면,<br />
                AI가 원본이미지 글씨를 인식해 글자로 옮겨드립니다.
              </p>
            </div>
          </div>

          {/* Step 1: 누구로부터 받은 편지인가요? */}
          <section>
            <div className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">1</span>
                <h2 className="font-semibold text-foreground">누구로부터 받은 편지인가요?</h2>
              </div>

              <div className="flex items-center gap-4">
                {/* 유저 아이콘 */}
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-gray-400" />
                </div>

                {/* 주소록 드롭다운 */}
                <div className="relative flex-1" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setAddressDropdownOpen(!addressDropdownOpen)}
                    className={cn(
                      "w-full h-12 px-4 flex items-center justify-between rounded-lg border bg-white text-left transition-colors",
                      addressDropdownOpen ? "border-primary" : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <span className={selectedRecipient ? "text-base text-foreground" : "text-sm text-muted-foreground"}>
                      {selectedRecipient ? `${selectedRecipient.name} (${selectedRecipient.facility})` : "주소록에서 선택하세요"}
                    </span>
                    <ChevronDown className={cn(
                      "w-5 h-5 text-muted-foreground transition-transform",
                      addressDropdownOpen && "rotate-180"
                    )} />
                  </button>

                  {/* 드롭다운 메뉴 */}
                  {addressDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                      {recipientAddressBook.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-muted-foreground">
                          등록된 리스트가 없습니다.
                        </div>
                      ) : (
                        <div className="max-h-48 overflow-y-auto">
                          {recipientAddressBook.map((recipient) => (
                            <button
                              key={recipient.id}
                              type="button"
                              onClick={() => {
                                setSelectedRecipient(recipient);
                                setAddressDropdownOpen(false);
                              }}
                              className={cn(
                                "w-full px-4 py-3 text-left text-sm hover:bg-gray-50 flex items-center gap-2",
                                selectedRecipient?.id === recipient.id && "bg-primary/5"
                              )}
                            >
                              <span className="font-medium">{recipient.name}</span>
                              <span className="text-muted-foreground">({recipient.facility})</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* 주소록에 추가 버튼 */}
                      <button
                        type="button"
                        onClick={() => {
                          setAddRecipientModalOpen(true);
                          setAddressDropdownOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left text-sm text-primary hover:bg-primary/5 flex items-center gap-2 border-t border-gray-100"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>주소록에 추가</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Step 2: 손편지 담기 */}
          <section>
            <div className="bg-card rounded-xl border border-border p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">2</span>
                  <h2 className="font-semibold text-foreground">손편지 담기 ({uploadedImages.length}/{MAX_IMAGES})</h2>
                </div>
                <div className="flex items-center gap-2">
                  {/* 순서 바꾸기 / 순서 맞추기 끝 버튼 */}
                  {uploadedImages.length > 1 && !isReorderMode && (
                    <Button
                      variant="outline"
                      onClick={startReorderMode}
                      className="gap-2"
                    >
                      <ArrowUpDown className="w-4 h-4" />
                      순서 바꾸기
                    </Button>
                  )}
                  {isReorderMode && (
                    <Button
                      onClick={finishReorderMode}
                      className="gap-2 bg-orange-500 hover:bg-orange-600"
                    >
                      <Check className="w-4 h-4" />
                      순서 맞추기 끝
                    </Button>
                  )}
                  {/* 인식 시작 버튼 (순서 바꾸기 모드가 아닐 때만) */}
                  {uploadedImages.length > 0 && !isReorderMode && (
                    <Button
                      onClick={handleStartOCR}
                      disabled={ocrStatus === "processing"}
                      className="gap-2"
                    >
                      {ocrStatus === "processing" ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          인식 중...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          인식 시작
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {/* 순서 바꾸기 모드 안내 */}
              {isReorderMode && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-orange-800">
                    사진을 꾹 눌러서 좌우 혹은 위아래로 옮겨주세요
                  </p>
                  <p className="text-sm text-orange-600 mt-1">
                    순서만 바뀌고, 사진은 지워지지 않습니다.
                  </p>
                </div>
              )}

              {/* 파일 input (숨김) */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,application/pdf"
                onChange={handleFileSelect}
                multiple
                className="hidden"
              />

              {/* 이미지가 없을 때: 최초 업로드 영역 */}
              {uploadedImages.length === 0 && (
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200",
                    isDragOver
                      ? "border-primary bg-orange-200"
                      : "border-border bg-orange-100 hover:border-primary/50 hover:bg-orange-200/70"
                  )}
                >
                  <img
                    src="/letter-scan.png"
                    alt="편지 스캔 예시"
                    className="w-16 h-16 mx-auto mb-3 object-contain"
                  />
                  <p className="text-base font-medium text-foreground mb-2">
                    손편지 사진을 여기에 올려주세요
                  </p>
                  <p className="text-sm text-muted-foreground mb-3">
                    (최대 10장까지 가능해요)
                  </p>
                  <p className="text-sm text-orange-600">
                    휴대폰으로 찍은 사진도 괜찮아요
                  </p>
                </div>
              )}

              {/* 도움말 토글 */}
              {uploadedImages.length === 0 && (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => setShowUploadHelp(!showUploadHelp)}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>사진 올리는 방법이 어려우신가요?</span>
                    <ChevronDown className={cn(
                      "w-4 h-4 transition-transform",
                      showUploadHelp && "rotate-180"
                    )} />
                  </button>

                  {showUploadHelp && (
                    <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="space-y-3 text-sm text-muted-foreground">
                        <p className="font-medium text-foreground mb-2">휴대폰 사진을 PC로 옮기는 방법</p>
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                          <p>휴대폰 카카오톡에서 <span className="font-medium text-foreground">"나에게 보내기"</span>로 손편지 사진을 전송하세요</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                          <p>PC 카카오톡에서 사진을 <span className="font-medium text-foreground">다운로드</span>하세요</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                          <p>위 주황색 네모 칸을 클릭해서 다운로드한 사진을 선택하세요</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 이미지가 있을 때: 카드 그리드 */}
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {sortedImages.map((img) => (
                    <div
                      key={img.id}
                      draggable
                      onDragStart={() => handleImageDragStart(img.id)}
                      onDragOver={(e) => handleImageDragOver(e, img.id)}
                      onDragEnd={handleImageDragEnd}
                      className={cn(
                        "relative group aspect-[3/4] rounded-2xl border-[3px] overflow-hidden cursor-move transition-all",
                        draggedItem === img.id ? "opacity-50 border-orange-500" : "border-orange-400"
                      )}
                    >
                      <img
                        src={img.preview}
                        alt={`손편지 ${img.order}`}
                        className="w-full h-full object-cover"
                      />
                      {/* 순서 표시 (항상 표시) */}
                      <div className="absolute top-3 left-3 w-10 h-10 rounded-full bg-orange-500 text-white text-lg flex items-center justify-center font-bold shadow-lg">
                        {img.order}
                      </div>
                      {/* 삭제 버튼 (하단 왼쪽) - 순서 바꾸기 모드가 아닐 때만 */}
                      {!isReorderMode && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteConfirm(img.id);
                          }}
                          className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          이 사진 지우기
                        </button>
                      )}
                    </div>
                  ))}

                  {/* 추가 카드 (+) - 맨 뒤에도 배치, 순서 바꾸기 모드가 아닐 때만 */}
                  {uploadedImages.length < MAX_IMAGES && !isReorderMode && (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                      onDragLeave={() => setIsDragOver(false)}
                      onDrop={handleDrop}
                      className={cn(
                        "aspect-[3/4] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all",
                        isDragOver
                          ? "border-primary bg-primary/5"
                          : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                      )}
                    >
                      <Plus className="w-12 h-12 text-gray-400 mb-2" />
                      <span className="text-lg text-gray-500 font-medium">추가</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Step 3: 손편지 확인 */}
          {ocrStatus !== "idle" && (
            <section ref={step3Ref}>
              <div className="bg-card rounded-xl border border-border p-5">
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">3</span>
                      <h2 className="font-semibold text-foreground">
                        {ocrStatus === "completed" && sortedImages.length > 0
                          ? `${currentImageIndex + 1}페이지 확인`
                          : "손편지 확인"}
                      </h2>
                    </div>
                    {ocrStatus === "completed" && sortedImages.length > 1 && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setCurrentImageIndex(i => Math.max(0, i - 1))}
                          disabled={currentImageIndex === 0}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <span className="text-sm font-medium text-muted-foreground">
                          {currentImageIndex + 1} / {sortedImages.length}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setCurrentImageIndex(i => Math.min(sortedImages.length - 1, i + 1))}
                          disabled={currentImageIndex === sortedImages.length - 1}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground ml-8 mt-2">
                    원본을 글자로 옮겨드렸어요. 내용이 맞는지 확인해보세요.
                  </p>
                </div>
                {ocrStatus === "processing" && (
                  <div className="py-16 flex flex-col items-center justify-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                    <p className="text-lg font-medium text-foreground mb-1">손글씨를 인식하고 있어요...</p>
                    <p className="text-sm text-muted-foreground">잠시만 기다려주세요</p>
                  </div>
                )}

                {ocrStatus === "completed" && sortedImages.length > 0 && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Original Image */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-foreground">손편지 원본</h3>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}
                            >
                              <ZoomOut className="w-4 h-4" />
                            </Button>
                            <span className="text-xs text-muted-foreground w-10 text-center">
                              {Math.round(zoom * 100)}%
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => setZoom(z => Math.min(2, z + 0.25))}
                            >
                              <ZoomIn className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="aspect-[3/4] bg-secondary/30 rounded-lg border border-border overflow-hidden relative">
                          <div className="w-full h-full overflow-auto flex items-center justify-center p-2">
                            <img
                              src={sortedImages[currentImageIndex]?.preview}
                              alt="손편지 원본"
                              style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
                              className="max-w-full max-h-full object-contain transition-transform duration-200"
                            />
                          </div>

                          {/* 좌우 네비게이션 */}
                          {sortedImages.length > 1 && (
                            <>
                              <Button
                                variant="secondary"
                                size="icon"
                                className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full shadow-md"
                                onClick={() => setCurrentImageIndex(i => Math.max(0, i - 1))}
                                disabled={currentImageIndex === 0}
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="secondary"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full shadow-md"
                                onClick={() => setCurrentImageIndex(i => Math.min(sortedImages.length - 1, i + 1))}
                                disabled={currentImageIndex === sortedImages.length - 1}
                              >
                                <ChevronRight className="w-4 h-4" />
                              </Button>
                              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                                {currentImageIndex + 1} / {sortedImages.length}
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Recognized Text */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-foreground">인식된 손편지 내용</h3>
                          <Button variant="ghost" size="icon" onClick={handleStartOCR} className="h-7 w-7">
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="aspect-[3/4] bg-secondary/30 rounded-lg border border-border overflow-hidden">
                          <Textarea
                            value={ocrTexts[currentImageIndex] || ""}
                            onChange={(e) => {
                              const newTexts = [...ocrTexts];
                              newTexts[currentImageIndex] = e.target.value;
                              setOcrTexts(newTexts);
                            }}
                            className="w-full h-full resize-none border-0 bg-transparent p-4 text-sm leading-relaxed"
                            placeholder="인식된 내용이 여기에 표시됩니다."
                          />
                        </div>
                      </div>
                    </div>

                    {/* 하단 버튼 */}
                    <div className="mt-6 pt-4 border-t border-border flex flex-col sm:flex-row gap-3">
                      <Button
                        variant="outline"
                        onClick={handleSaveToArchive}
                        className="w-full sm:flex-1"
                        size="lg"
                      >
                        <Archive className="w-4 h-4 mr-2" />
                        손편지 보관함에 저장
                      </Button>
                      <Button
                        onClick={handleReplyLetter}
                        className="w-full sm:flex-1"
                        size="lg"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        답장 편지 작성하기
                      </Button>
                    </div>
                  </>
                )}

                {ocrStatus === "error" && (
                  <div className="py-16 flex flex-col items-center justify-center">
                    <AlertCircle className="w-12 h-12 text-destructive mb-4" />
                    <p className="text-lg font-medium text-foreground mb-1">인식에 실패했습니다</p>
                    <p className="text-sm text-muted-foreground mb-4">다시 시도해주세요</p>
                    <Button onClick={handleStartOCR}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      다시 인식
                    </Button>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* 하단 안내 메시지 */}
          <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 text-center">
            <p className="text-sm text-orange-800 leading-relaxed">
              손편지는 시간이 지나면 잃어버리거나 훼손되기 쉽습니다.<br />
              <span className="font-medium">지금 담아두면, 소중한 마음을 오래오래 간직할 수 있어요.</span>
            </p>
          </div>

          {/* 하단 취소 버튼 */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={isReorderMode ? handleReorderModeExit : onClose}
            >
              취소
            </Button>
          </div>
        </div>
      </div>

      {/* 받는 사람 추가 모달 */}
      <Dialog open={addRecipientModalOpen} onOpenChange={setAddRecipientModalOpen}>
        <DialogContent className="sm:max-w-lg p-6">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-lg font-semibold">받는 사람 추가</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* 시설 유형 선택 */}
            <Select value={newFacilityType} onValueChange={setNewFacilityType}>
              <SelectTrigger className="h-12 text-base border-gray-200">
                <SelectValue placeholder="시설 유형 선택" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                {facilityTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 지역 + 시설 선택 */}
            <div className="flex gap-3">
              <Select value={newRegion} onValueChange={setNewRegion}>
                <SelectTrigger className="flex-1 h-12 text-base border-gray-200">
                  <SelectValue placeholder="지역 선택" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={newFacility} onValueChange={setNewFacility} disabled={!newRegion}>
                <SelectTrigger className="flex-1 h-12 text-base border-gray-200">
                  <SelectValue placeholder="시설 선택" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  {newRegion && facilitiesByRegion[newRegion]?.map((facility) => (
                    <SelectItem key={facility} value={facility}>
                      {facility}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 이름 입력 */}
            <div>
              <Input
                placeholder="이름 입력 *"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="h-12 text-base border-gray-200"
              />
            </div>

            {/* 수용자번호 */}
            <div>
              <Input
                placeholder="수용자번호 * (예: 2024-12345)"
                value={newPrisonerNumber}
                onChange={(e) => setNewPrisonerNumber(e.target.value)}
                className="h-12 text-base border-gray-200"
              />
            </div>

            {/* 생년월일 (선택) */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">생년월일 (선택)</p>
              <div className="flex gap-2">
                <Select value={newBirthYear} onValueChange={setNewBirthYear}>
                  <SelectTrigger className="flex-1 h-12 text-base border-gray-200">
                    <SelectValue placeholder="년도" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50 max-h-48">
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}년
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={newBirthMonth} onValueChange={setNewBirthMonth}>
                  <SelectTrigger className="w-24 h-12 text-base border-gray-200">
                    <SelectValue placeholder="월" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    {months.map((month) => (
                      <SelectItem key={month} value={month.toString()}>
                        {month}월
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={newBirthDay} onValueChange={setNewBirthDay}>
                  <SelectTrigger className="w-24 h-12 text-base border-gray-200">
                    <SelectValue placeholder="일" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    {days.map((day) => (
                      <SelectItem key={day} value={day.toString()}>
                        {day}일
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setAddRecipientModalOpen(false)}
              className="px-6 border-gray-300"
            >
              취소
            </Button>
            <Button
              onClick={handleAddRecipient}
              className="px-6 bg-orange-500 hover:bg-orange-600"
            >
              <Check className="w-4 h-4 mr-2" />
              확인
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 사진 삭제 확인 모달 */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-sm p-6">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg font-semibold">이 사진을 지울까요?</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground leading-relaxed">
            지워도 다른 사진에는 영향이 없습니다.
            <br />
            필요하면 다시 올릴 수 있어요.
          </p>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteConfirmOpen(false);
                setImageToDelete(null);
              }}
              className="px-6 border-gray-300"
            >
              취소
            </Button>
            <Button
              onClick={handleConfirmDelete}
              className="px-6 bg-gray-500 hover:bg-gray-600 text-white"
            >
              지우기
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 순서 바꾸기 나가기 확인 모달 */}
      <Dialog open={reorderExitConfirmOpen} onOpenChange={setReorderExitConfirmOpen}>
        <DialogContent className="sm:max-w-sm p-6">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg font-semibold">사진 순서를 바꾸는 중입니다</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground leading-relaxed">
            지금 나가면, 바꾼 순서는 저장되지 않습니다.
          </p>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setReorderExitConfirmOpen(false)}
              className="px-6 border-gray-300"
            >
              계속 순서 바꾸기
            </Button>
            <Button
              onClick={cancelReorderMode}
              className="px-6 bg-gray-500 hover:bg-gray-600 text-white"
            >
              그만두기
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
