import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PenLine, Calendar, X, ChevronLeft, ChevronRight,
  Download, Trash2, List, Grid3X3, ArrowLeft, Send, FileText, User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HandwrittenArchiveContentProps {
  onClose?: () => void;
  onReply?: (text: string, senderName: string) => void;
}

interface ArchivedLetter {
  id: string;
  senderName: string;
  date: string;
  images: string[]; // 원본 이미지들
  ocrTexts: string[]; // 각 이미지별 OCR 텍스트
}

// 목업 데이터 - 서은우님의 손편지
const mockLetters: ArchivedLetter[] = [
  {
    id: "1",
    senderName: "서은우",
    date: "2024-12-15",
    images: [
      "/handwritten-letter.jpg", // public 폴더에 이미지 업로드 필요
    ],
    ocrTexts: [
      "사랑하는 당신에게,\n\n오늘도 건강하게 지내고 있어요? 날씨가 많이 추워졌는데 감기 조심하세요.\n\n요즘 새벽마다 당신 생각이 나서 잠이 안 와요. 빨리 만날 날만 기다리고 있어요.\n\n항상 응원하고 사랑해요.",
    ],
  },
];

export function HandwrittenArchiveContent({ onClose, onReply }: HandwrittenArchiveContentProps) {
  const [letters] = useState<ArchivedLetter[]>(mockLetters);
  const [selectedLetter, setSelectedLetter] = useState<ArchivedLetter | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"thumbnail" | "list">("thumbnail");

  const handleReply = () => {
    if (!selectedLetter || !onReply) return;
    const fullText = selectedLetter.ocrTexts.join("\n\n");
    onReply(fullText, selectedLetter.senderName);
  };

  // 상세 화면
  if (selectedLetter) {
    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
        {/* Header */}
        <header className="h-14 border-b border-border/40 bg-white/80 backdrop-blur-sm flex items-center px-6 gap-3">
          <button
            onClick={() => {
              setSelectedLetter(null);
              setCurrentImageIndex(0);
            }}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <PenLine className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-semibold text-foreground">
              {selectedLetter.senderName}님의 손편지
            </h1>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-auto px-4 py-6 lg:px-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* 날짜 정보 */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                {new Date(selectedLetter.date).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="text-sm text-muted-foreground/60">받은 편지</span>
            </div>

            {/* 메인 컨텐츠 영역 */}
            <div className="grid grid-cols-2 gap-6">
              {/* 왼쪽: 원본 이미지 */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">손편지 원본</h3>
                <div className="aspect-[3/4] bg-secondary/30 rounded-xl border border-border overflow-hidden relative">
                  <img
                    src={selectedLetter.images[currentImageIndex]}
                    alt={`손편지 ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* 좌우 네비게이션 */}
                  {selectedLetter.images.length > 1 && (
                    <>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full shadow-lg"
                        onClick={() => setCurrentImageIndex(i => Math.max(0, i - 1))}
                        disabled={currentImageIndex === 0}
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full shadow-lg"
                        onClick={() => setCurrentImageIndex(i => Math.min(selectedLetter.images.length - 1, i + 1))}
                        disabled={currentImageIndex === selectedLetter.images.length - 1}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-4 py-1.5 rounded-full">
                        {currentImageIndex + 1} / {selectedLetter.images.length}
                      </div>
                    </>
                  )}
                </div>

                {/* 하단 썸네일 (여러장일 때) */}
                {selectedLetter.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {selectedLetter.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={cn(
                          "flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-all",
                          currentImageIndex === idx
                            ? "border-primary ring-2 ring-primary/30"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <img
                          src={img}
                          alt={`썸네일 ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 오른쪽: OCR 텍스트 */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">인식된 텍스트</h3>
                <div className="aspect-[3/4] bg-secondary/30 rounded-xl border border-border overflow-hidden">
                  <div className="w-full h-full overflow-auto p-5">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                      {selectedLetter.ocrTexts[currentImageIndex] || "텍스트 없음"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 하단 버튼 */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                다운로드
              </Button>
              <Button variant="outline" className="gap-2 text-destructive hover:text-destructive">
                <Trash2 className="w-4 h-4" />
                삭제
              </Button>
              <div className="flex-1" />
              <Button onClick={handleReply} className="gap-2">
                <Send className="w-4 h-4" />
                답장 편지 작성하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 목록 화면
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
      {/* Header */}
      <header className="h-14 border-b border-border/40 bg-white/80 backdrop-blur-sm flex items-center px-6 gap-3">
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        )}
        <div className="flex items-center gap-2">
          <PenLine className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-semibold text-foreground">손편지 보관함</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto px-4 py-10 lg:px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* 타이틀 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              받은 <span className="text-primary">손편지</span>를 보관합니다
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              소중한 손편지를 원본 이미지와 인식된 텍스트로 함께 보관합니다.
              <br />
              언제든 다시 꺼내보고, 답장을 작성할 수 있어요.
            </p>
          </div>

          {/* 뷰 모드 토글 */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              총 {letters.length}개의 손편지
            </p>
            <div className="flex items-center bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "flex items-center justify-center w-9 h-9 rounded-full transition-all",
                  viewMode === "list"
                    ? "bg-white shadow-sm text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("thumbnail")}
                className={cn(
                  "flex items-center justify-center w-9 h-9 rounded-full transition-all",
                  viewMode === "thumbnail"
                    ? "bg-white shadow-sm text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 편지 목록 */}
          {letters.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-20 h-20 rounded-full bg-muted/60 flex items-center justify-center mb-4">
                <FileText className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                보관된 손편지가 없어요
              </h3>
              <p className="text-sm text-muted-foreground text-center max-w-[280px]">
                손편지 담기에서 편지를 인식하면
                <br />
                이곳에 자동으로 보관됩니다.
              </p>
            </div>
          ) : viewMode === "list" ? (
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {letters.map((letter, index) => (
                  <motion.div
                    key={letter.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedLetter(letter)}
                    className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-secondary/30 cursor-pointer transition-all"
                  >
                    {/* 썸네일 */}
                    <div className="relative w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-border">
                      <img
                        src={letter.images[0]}
                        alt="손편지"
                        className="w-full h-full object-cover"
                      />
                      {letter.images.length > 1 && (
                        <div className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                          +{letter.images.length - 1}
                        </div>
                      )}
                    </div>

                    {/* 정보 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4 text-primary" />
                        <p className="font-semibold text-foreground">{letter.senderName}</p>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                        <Calendar className="w-3 h-3" />
                        {new Date(letter.date).toLocaleDateString("ko-KR")}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {letter.ocrTexts[0]}
                      </p>
                    </div>

                    <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {letters.map((letter, index) => (
                  <motion.div
                    key={letter.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedLetter(letter)}
                    className="group relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer border-2 border-border hover:border-primary/50 transition-all"
                  >
                    <img
                      src={letter.images[0]}
                      alt="손편지"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* 오버레이 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* 여러장 표시 */}
                    {letter.images.length > 1 && (
                      <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                        {letter.images.length}장
                      </div>
                    )}

                    {/* 정보 */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4 text-white" />
                        <p className="text-white font-semibold">{letter.senderName}</p>
                      </div>
                      <p className="text-white/70 text-xs flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(letter.date).toLocaleDateString("ko-KR")}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
