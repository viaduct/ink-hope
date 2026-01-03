import { useState, useCallback, useRef } from "react";
import { Upload, User, Loader2, Check, AlertCircle, X, FileText, Send, RotateCcw, ZoomIn, ZoomOut, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface HandwrittenUploadContentProps {
  onClose: () => void;
  onComposeWithText?: (text: string, senderName?: string) => void;
  onSaveToInbox?: (data: { senderName: string; originalImage: string; ocrText: string }) => void;
}

export function HandwrittenUploadContent({ onClose, onComposeWithText, onSaveToInbox }: HandwrittenUploadContentProps) {
  const [senderName, setSenderName] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [ocrStatus, setOcrStatus] = useState<"idle" | "processing" | "completed" | "error">("idle");
  const [ocrText, setOcrText] = useState("");
  const [zoom, setZoom] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      processFile(droppedFiles[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    const validExtensions = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    
    if (!validExtensions.includes(file.type)) {
      toast.error("지원하지 않는 파일 형식입니다. (JPG, PNG, PDF만 가능)");
      return;
    }
    
    if (file.size > MAX_FILE_SIZE) {
      toast.error("파일 크기는 10MB 이하여야 합니다.");
      return;
    }

    const preview = await createPreview(file);
    setUploadedImage(preview);
    setFileName(file.name);
    setZoom(1);
    
    // Start OCR processing
    simulateOCR();
  };

  const createPreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  };

  const simulateOCR = async () => {
    setOcrStatus("processing");
    setOcrText("");

    // Simulate OCR delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));

    // Simulate success/error (90% success rate)
    const success = Math.random() > 0.1;
    
    if (success) {
      const sampleTexts = [
        "사랑하는 가족에게,\n\n오늘도 건강하게 지내고 있어요. 날씨가 많이 추워졌는데 감기 조심하세요.\n\n항상 보고싶고 사랑해요.\n\n2024년 12월",
        "안녕하세요,\n\n여기서의 생활도 점점 익숙해지고 있어요. 많이 걱정하지 마세요.\n\n건강 잘 챙기시고요.\n\n곧 좋은 소식 전할게요.",
        "보고싶은 우리 가족들에게,\n\n오랜만에 편지 쓰네요. 그동안 잘 지냈어요?\n\n여기는 모든 게 괜찮으니 걱정 마세요.\n\n다음에 또 쓸게요.",
      ];
      setOcrText(sampleTexts[Math.floor(Math.random() * sampleTexts.length)]);
      setOcrStatus("completed");
    } else {
      setOcrStatus("error");
    }
  };

  const handleRetryOCR = () => {
    simulateOCR();
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setFileName("");
    setOcrStatus("idle");
    setOcrText("");
    setZoom(1);
  };

  const handleSaveToInbox = () => {
    if (!senderName.trim()) {
      toast.error("발신자를 입력해주세요.");
      return;
    }
    if (!uploadedImage) {
      toast.error("손편지 이미지를 업로드해주세요.");
      return;
    }
    if (ocrStatus !== "completed") {
      toast.error("손편지 인식이 완료될 때까지 기다려주세요.");
      return;
    }

    if (onSaveToInbox) {
      onSaveToInbox({
        senderName,
        originalImage: uploadedImage,
        ocrText,
      });
    }
    
    toast.success("손편지가 받은 편지함에 저장되었습니다.");
    onClose();
  };

  const handleReplyLetter = () => {
    if (!senderName.trim()) {
      toast.error("발신자를 입력해주세요.");
      return;
    }
    if (ocrStatus !== "completed" || !ocrText) {
      toast.error("인식된 편지 내용이 없습니다.");
      return;
    }

    if (onComposeWithText) {
      onComposeWithText(ocrText, senderName);
    }
    toast.success("답장 편지 작성 화면으로 이동합니다.");
    onClose();
  };

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
      <div className="flex-1 overflow-auto px-4 py-5 lg:px-6">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* 타이틀 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-[18px]">
              받은 <span className="text-primary underline underline-offset-4">손편지</span>를 담아보세요
            </h2>
            <div className="mb-6">
              <p className="text-base text-muted-foreground leading-normal">
                수기로 작성된 손편지를 사진으로 찍어 업로드하면, AI가 자동으로 글씨를 인식하여 텍스트로 변환해드립니다.
                <br />
                인식된 편지는 받은 편지함에 저장되며, 바로 답장 편지를 작성할 수도 있어요.
              </p>
            </div>
          </div>

          {/* Step 1: Sender Input */}
          <section className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">1</span>
              <h2 className="font-semibold text-foreground">누구로부터 받은 편지인가요?</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
              <Input
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="발신자 이름을 입력하세요"
                className="flex-1 max-w-sm"
              />
            </div>
          </section>

          {/* Step 2: Upload */}
          <section className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">2</span>
              <h2 className="font-semibold text-foreground">손편지 담기</h2>
            </div>
            
            {!uploadedImage ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200",
                  isDragOver 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50 hover:bg-secondary/50"
                )}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,application/pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm font-medium text-foreground mb-1">
                  손편지 이미지를 드래그하거나, 클릭하여 파일을 선택하세요
                </p>
                <p className="text-xs text-muted-foreground">
                  JPG · PNG · PDF 지원 (최대 10MB)
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <img 
                    src={uploadedImage} 
                    alt="업로드된 손편지" 
                    className="w-12 h-12 object-cover rounded border border-border"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground truncate max-w-[200px]">{fileName}</p>
                    <p className="text-xs text-muted-foreground">
                      {ocrStatus === "processing" && "인식 중..."}
                      {ocrStatus === "completed" && "인식 완료"}
                      {ocrStatus === "error" && "인식 실패"}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleRemoveImage}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </section>

          {/* Step 3: Original & Recognized Content */}
          {uploadedImage && (
            <section className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">3</span>
                <h2 className="font-semibold text-foreground">손편지 확인</h2>
              </div>
              
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
                  <div className="aspect-[3/4] bg-secondary/30 rounded-lg border border-border overflow-hidden">
                    <div className="w-full h-full overflow-auto flex items-center justify-center p-2">
                      <img 
                        src={uploadedImage} 
                        alt="손편지 원본" 
                        style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
                        className="max-w-full max-h-full object-contain transition-transform duration-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Recognized Text */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-foreground">인식된 손편지 내용</h3>
                    {ocrStatus === "error" && (
                      <Button variant="ghost" size="sm" onClick={handleRetryOCR} className="text-xs">
                        <RotateCcw className="w-3 h-3 mr-1" />
                        다시 인식
                      </Button>
                    )}
                  </div>
                  <div className="aspect-[3/4] bg-secondary/30 rounded-lg border border-border overflow-hidden relative">
                    {ocrStatus === "processing" && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80">
                        <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
                        <p className="text-sm text-muted-foreground">손글씨를 인식하고 있어요...</p>
                      </div>
                    )}
                    {ocrStatus === "error" && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-destructive mb-3" />
                        <p className="text-sm text-muted-foreground">인식에 실패했습니다.</p>
                        <p className="text-xs text-muted-foreground mt-1">다시 시도해주세요.</p>
                      </div>
                    )}
                    {ocrStatus === "completed" && (
                      <Textarea
                        value={ocrText}
                        onChange={(e) => setOcrText(e.target.value)}
                        className="w-full h-full resize-none border-0 bg-transparent p-4 text-sm leading-relaxed"
                        placeholder="인식된 내용이 여기에 표시됩니다."
                      />
                    )}
                    {ocrStatus === "idle" && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <FileText className="w-8 h-8 text-muted-foreground/50 mb-3" />
                        <p className="text-sm text-muted-foreground">이미지 업로드 후 인식이 시작됩니다.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Reply Button */}
              {ocrStatus === "completed" && (
                <div className="mt-4 pt-4 border-t border-border">
                  <Button 
                    onClick={handleReplyLetter}
                    className="w-full"
                    size="lg"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    답장 편지 작성하기
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    AI가 인식된 편지 내용을 분석하여 답장 작성을 도와드려요
                  </p>
                </div>
              )}
            </section>
          )}

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button 
              onClick={handleSaveToInbox}
              disabled={!senderName.trim() || !uploadedImage || ocrStatus !== "completed"}
            >
              <Check className="w-4 h-4 mr-2" />
              받은 편지함에 저장
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
