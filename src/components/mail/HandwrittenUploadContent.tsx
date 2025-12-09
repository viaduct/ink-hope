import { useState, useCallback, useRef } from "react";
import { Upload, RotateCcw, RotateCw, ZoomIn, ZoomOut, Trash2, RefreshCw, ChevronLeft, ChevronRight, HelpCircle, FileQuestion, Check, Loader2, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  fileName: string;
  pages: number;
  status: "waiting" | "processing" | "completed" | "error";
  recognizedAt?: Date;
  ocrText?: string;
}

interface HandwrittenUploadContentProps {
  onClose: () => void;
  onComposeWithText?: (text: string) => void;
}

export function HandwrittenUploadContent({ onClose, onComposeWithText }: HandwrittenUploadContentProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [selectedFileIds, setSelectedFileIds] = useState<Set<string>>(new Set());
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [editedText, setEditedText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILES = 30;
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const activeFile = files.find(f => f.id === activeFileId);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  }, [files]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(Array.from(e.target.files));
    }
  };

  const processFiles = async (newFiles: File[]) => {
    const validExtensions = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    
    // Check total count
    if (files.length + newFiles.length > MAX_FILES) {
      toast.error(`최대 ${MAX_FILES}장까지만 등록할 수 있어요.`);
      return;
    }

    const validFiles = newFiles.filter(file => {
      if (!validExtensions.includes(file.type)) {
        toast.error(`${file.name}: 지원하지 않는 파일 형식입니다.`);
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name}: 파일 크기는 10MB 이하여야 합니다.`);
        return false;
      }
      return true;
    });

    const uploadedFiles: UploadedFile[] = await Promise.all(
      validFiles.map(async (file) => {
        const preview = await createPreview(file);
        return {
          id: crypto.randomUUID(),
          file,
          preview,
          fileName: file.name,
          pages: 1,
          status: "waiting" as const,
        };
      })
    );

    setFiles(prev => [...prev, ...uploadedFiles]);

    // Start OCR processing for each file
    uploadedFiles.forEach(file => {
      simulateOCR(file.id);
    });
  };

  const createPreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  };

  const simulateOCR = async (fileId: string) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, status: "processing" as const } : f
    ));

    // Simulate OCR delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));

    // Simulate success/error (90% success rate)
    const success = Math.random() > 0.1;
    
    setFiles(prev => prev.map(f => {
      if (f.id !== fileId) return f;
      
      if (success) {
        const sampleTexts = [
          "사랑하는 가족에게,\n\n오늘도 건강하게 지내고 있어요. 날씨가 많이 추워졌는데 감기 조심하세요.\n\n항상 보고싶고 사랑해요.\n\n2024년 12월",
          "안녕하세요,\n\n여기서의 생활도 점점 익숙해지고 있어요. 많이 걱정하지 마세요.\n\n건강 잘 챙기시고요.\n\n곧 좋은 소식 전할게요.",
          "보고싶은 우리 가족들에게,\n\n오랜만에 편지 쓰네요. 그동안 잘 지냈어요?\n\n여기는 모든 게 괜찮으니 걱정 마세요.\n\n다음에 또 쓸게요.",
        ];
        return {
          ...f,
          status: "completed" as const,
          recognizedAt: new Date(),
          ocrText: sampleTexts[Math.floor(Math.random() * sampleTexts.length)],
        };
      } else {
        return {
          ...f,
          status: "error" as const,
        };
      }
    }));
  };

  const handleSelectAll = () => {
    if (selectedFileIds.size === files.length) {
      setSelectedFileIds(new Set());
    } else {
      setSelectedFileIds(new Set(files.map(f => f.id)));
    }
  };

  const handleToggleSelect = (id: string) => {
    const newSet = new Set(selectedFileIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedFileIds(newSet);
  };

  const handleDeleteSelected = () => {
    setFiles(prev => prev.filter(f => !selectedFileIds.has(f.id)));
    setSelectedFileIds(new Set());
    if (activeFileId && selectedFileIds.has(activeFileId)) {
      setActiveFileId(null);
    }
    toast.success("선택한 파일이 삭제되었습니다.");
  };

  const handleRetryOCR = (fileId: string) => {
    simulateOCR(fileId);
  };

  const handleRetrySelected = () => {
    selectedFileIds.forEach(id => {
      const file = files.find(f => f.id === id);
      if (file && (file.status === "error" || file.status === "completed")) {
        simulateOCR(id);
      }
    });
    toast.info("선택한 파일들을 다시 인식합니다.");
  };

  const handleSelectFile = (file: UploadedFile) => {
    setActiveFileId(file.id);
    setEditedText(file.ocrText || "");
    setZoom(1);
    setRotation(0);
  };

  const handleSaveOnly = () => {
    toast.success("손편지가 등록되었습니다.");
    onClose();
  };

  const handleComposeWithSelected = () => {
    const selectedTexts = files
      .filter(f => selectedFileIds.has(f.id) && f.ocrText)
      .map(f => f.ocrText)
      .join("\n\n---\n\n");
    
    if (onComposeWithText) {
      onComposeWithText(selectedTexts || editedText);
    }
    toast.success("편지 작성 화면으로 이동합니다.");
    onClose();
  };

  const selectedCount = selectedFileIds.size;
  const completedCount = files.filter(f => f.status === "completed").length;

  const getStatusBadge = (status: UploadedFile["status"]) => {
    switch (status) {
      case "waiting":
        return <Badge variant="secondary" className="text-xs">대기중</Badge>;
      case "processing":
        return <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 border-blue-200"><Loader2 className="w-3 h-3 mr-1 animate-spin" />인식 중</Badge>;
      case "completed":
        return <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-200"><Check className="w-3 h-3 mr-1" />인식 완료</Badge>;
      case "error":
        return <Badge variant="destructive" className="text-xs"><AlertCircle className="w-3 h-3 mr-1" />오류</Badge>;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gradient-to-b from-orange-50/30 to-background overflow-hidden">
      {/* Header */}
      <header className="px-6 py-4 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onClose} className="mr-1">
                <X className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-bold text-foreground">손편지 자동등록</h1>
            </div>
            <p className="text-sm text-muted-foreground mt-1 ml-12">
              여러 장의 손편지를 올리면, 원본은 보관되고 내용은 자동으로 추출되어 편지 작성에 바로 사용할 수 있어요.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <HelpCircle className="w-4 h-4 mr-1" />
              이용 가이드
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <FileQuestion className="w-4 h-4 mr-1" />
              자주 묻는 질문
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column - Upload & File List */}
        <div className="w-1/2 flex flex-col p-4 gap-4 overflow-hidden border-r border-border">
          {/* Upload Section */}
          <section className="flex-shrink-0">
            <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">1</span>
              손편지 업로드
            </h2>
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200",
                isDragOver 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-primary/50 hover:bg-secondary/50"
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/jpg,image/png,application/pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm font-medium text-foreground mb-1">
                손편지 이미지를 드래그하거나, 파일을 선택해 업로드하세요.
              </p>
              <p className="text-xs text-muted-foreground">
                최대 30장, JPG · PNG · PDF 지원
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              ※ 이미지를 올리면 바로 OCR 인식을 시작합니다.
            </p>
          </section>

          {/* File List Section */}
          <section className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-foreground">업로드한 손편지 목록</h2>
              {files.length > 0 && (
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleDeleteSelected}
                    disabled={selectedCount === 0}
                    className="text-xs text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    선택 삭제
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleRetrySelected}
                    disabled={selectedCount === 0}
                    className="text-xs"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    다시 인식
                  </Button>
                </div>
              )}
            </div>

            {files.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-secondary/30 rounded-xl">
                <Upload className="w-12 h-12 text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground font-medium">아직 등록된 손편지가 없어요.</p>
                <p className="text-xs text-muted-foreground mt-1">
                  위의 영역에 이미지를 올리면 자동으로 목록이 만들어집니다.
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-auto rounded-xl border border-border bg-card">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/50 sticky top-0">
                    <tr className="text-left">
                      <th className="p-3 w-10">
                        <Checkbox 
                          checked={selectedFileIds.size === files.length && files.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </th>
                      <th className="p-3 w-12"></th>
                      <th className="p-3">파일명</th>
                      <th className="p-3 w-16 text-center">페이지</th>
                      <th className="p-3 w-24 text-center">상태</th>
                      <th className="p-3 w-32">인식일시</th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((file) => (
                      <tr 
                        key={file.id}
                        onClick={() => handleSelectFile(file)}
                        className={cn(
                          "border-t border-border cursor-pointer transition-colors",
                          activeFileId === file.id ? "bg-primary/5" : "hover:bg-secondary/30"
                        )}
                      >
                        <td className="p-3" onClick={(e) => e.stopPropagation()}>
                          <Checkbox 
                            checked={selectedFileIds.has(file.id)}
                            onCheckedChange={() => handleToggleSelect(file.id)}
                          />
                        </td>
                        <td className="p-3">
                          <img 
                            src={file.preview} 
                            alt={file.fileName}
                            className="w-10 h-10 object-cover rounded border border-border"
                          />
                        </td>
                        <td className="p-3 truncate max-w-[150px]">{file.fileName}</td>
                        <td className="p-3 text-center text-muted-foreground">{file.pages}</td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {getStatusBadge(file.status)}
                            {file.status === "error" && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleRetryOCR(file.id); }}
                                className="text-xs text-primary hover:underline ml-1"
                              >
                                다시 인식
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="p-3 text-xs text-muted-foreground">
                          {file.recognizedAt?.toLocaleString('ko-KR', { 
                            month: 'short', 
                            day: 'numeric', 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        {/* Right Column - Preview & OCR Text */}
        <div className="w-1/2 flex flex-col p-4 gap-4 overflow-hidden">
          {/* Preview Section */}
          <section className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-foreground">선택한 손편지 원본</h2>
              {activeFile && (
                <div className="flex items-center gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}>
                          <ZoomOut className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>축소</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(z => Math.min(2, z + 0.25))}>
                          <ZoomIn className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>확대</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setRotation(r => r - 90)}>
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>왼쪽 회전</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setRotation(r => r + 90)}>
                          <RotateCw className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>오른쪽 회전</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>
            
            <div className="flex-1 bg-secondary/30 rounded-xl border border-border overflow-hidden flex items-center justify-center">
              {activeFile ? (
                <div className="w-full h-full overflow-auto flex items-center justify-center p-4">
                  <img 
                    src={activeFile.preview}
                    alt={activeFile.fileName}
                    className="max-w-full max-h-full object-contain transition-transform duration-200"
                    style={{ 
                      transform: `scale(${zoom}) rotate(${rotation}deg)`,
                    }}
                  />
                </div>
              ) : (
                <div className="text-center p-8">
                  <Upload className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    왼쪽 목록에서 손편지를 선택하면<br />원본 이미지가 여기에 표시됩니다.
                  </p>
                </div>
              )}
            </div>

            {/* Page navigation (for multi-page files) */}
            {activeFile && activeFile.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-2">
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-xs text-muted-foreground">1 / {activeFile.pages}</span>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </section>

          {/* OCR Text Section */}
          <section className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-foreground">인식된 손편지 내용</h2>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[200px]">
                      <p className="text-xs">자동으로 인식된 내용입니다. 필요한 부분은 여기서 바로 수정할 수 있어요.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              {/* Future: tabs for 원본 그대로 / 맞춤법 보정 */}
            </div>
            
            <div className="flex-1 flex flex-col min-h-0">
              {activeFile ? (
                <>
                  {activeFile.status === "processing" ? (
                    <div className="flex-1 bg-secondary/30 rounded-xl border border-border flex flex-col items-center justify-center">
                      <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
                      <p className="text-sm text-muted-foreground">손편지 내용을 인식하고 있어요...</p>
                    </div>
                  ) : activeFile.status === "error" ? (
                    <div className="flex-1 bg-destructive/5 rounded-xl border border-destructive/20 flex flex-col items-center justify-center">
                      <AlertCircle className="w-8 h-8 text-destructive mb-3" />
                      <p className="text-sm text-destructive font-medium">인식에 실패했어요</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3"
                        onClick={() => handleRetryOCR(activeFile.id)}
                      >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        다시 인식하기
                      </Button>
                    </div>
                  ) : activeFile.status === "completed" ? (
                    <div className="flex-1 flex flex-col min-h-0">
                      <Textarea
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        placeholder="인식된 내용이 여기에 표시됩니다."
                        className="flex-1 resize-none bg-card rounded-xl border-border min-h-0"
                      />
                      <div className="text-right mt-2">
                        <span className="text-xs text-muted-foreground">
                          현재 {editedText.length.toLocaleString()}자
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 bg-secondary/30 rounded-xl border border-border flex flex-col items-center justify-center">
                      <p className="text-sm text-muted-foreground">인식 대기 중...</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex-1 bg-secondary/30 rounded-xl border border-border flex flex-col items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    손편지를 선택하면 인식된 내용이 표시됩니다.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <footer className="px-6 py-4 border-t border-border bg-card/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            선택한 손편지: <strong className="text-foreground">{selectedCount}장</strong>
            {completedCount > 0 && (
              <span className="ml-2 text-green-600">({completedCount}장 인식 완료)</span>
            )}
          </span>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={handleSaveOnly}
              disabled={files.length === 0}
            >
              등록만 하기
            </Button>
            <Button 
              onClick={handleComposeWithSelected}
              disabled={selectedCount === 0 || !files.some(f => selectedFileIds.has(f.id) && f.status === "completed")}
              className="bg-primary hover:bg-primary/90"
            >
              선택한 손편지로 편지 쓰기
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
