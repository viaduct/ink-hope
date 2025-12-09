import { motion } from "framer-motion";
import { Eye, FileText, User, Send, Printer, Download, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Stationery {
  id: string;
  name: string;
  bgColor?: string;
  bgGradient?: string;
  pattern?: "lines" | "dots" | "grid" | "none";
}

const stationeryStyles: Record<string, Stationery> = {
  white: { id: "white", name: "순백", bgColor: "bg-white", pattern: "none" },
  cream: { id: "cream", name: "크림", bgColor: "bg-amber-50", pattern: "none" },
  lined: { id: "lined", name: "줄노트", bgColor: "bg-amber-50", pattern: "lines" },
  sky: { id: "sky", name: "하늘색", bgColor: "bg-sky-100" },
  pink: { id: "pink", name: "연분홍", bgColor: "bg-pink-100" },
  mint: { id: "mint", name: "민트", bgColor: "bg-emerald-100" },
  "formal-white": { id: "formal-white", name: "정장 화이트", bgColor: "bg-slate-50", pattern: "none" },
  "formal-cream": { id: "formal-cream", name: "클래식 크림", bgColor: "bg-orange-50", pattern: "none" },
  business: { id: "business", name: "비즈니스", bgColor: "bg-gray-100", pattern: "grid" },
  elegant: { id: "elegant", name: "엘레강스", bgGradient: "bg-gradient-to-br from-rose-50 to-purple-50", pattern: "none" },
  sunset: { id: "sunset", name: "선셋", bgGradient: "bg-gradient-to-br from-orange-200 via-rose-200 to-purple-200" },
  ocean: { id: "ocean", name: "오션", bgGradient: "bg-gradient-to-br from-cyan-200 via-blue-200 to-indigo-200" },
  forest: { id: "forest", name: "포레스트", bgGradient: "bg-gradient-to-br from-emerald-200 via-teal-200 to-cyan-200" },
  blossom: { id: "blossom", name: "블라썸", bgGradient: "bg-gradient-to-br from-pink-200 via-rose-200 to-red-200" },
  "ai-dream": { id: "ai-dream", name: "드림스케이프", bgGradient: "bg-gradient-to-br from-violet-300 via-purple-200 to-pink-200" },
  "ai-aurora": { id: "ai-aurora", name: "오로라", bgGradient: "bg-gradient-to-br from-green-200 via-cyan-200 to-blue-300" },
  "ai-cosmic": { id: "ai-cosmic", name: "코스믹", bgGradient: "bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300" },
};

interface LetterPreviewProps {
  content: string;
  stationeryId: string | null;
  recipientName?: string;
  recipientFacility?: string;
  recipientAddress?: string;
  senderName?: string;
  senderAddress?: string;
}

export function LetterPreview({
  content,
  stationeryId,
  recipientName,
  recipientFacility,
  recipientAddress,
  senderName,
  senderAddress,
}: LetterPreviewProps) {
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  
  const stationery = stationeryId ? stationeryStyles[stationeryId] : stationeryStyles.white;
  
  // 편지 내용을 페이지별로 나누기 (대략 500자 기준)
  const charsPerPage = 500;
  const pages = [];
  for (let i = 0; i < content.length; i += charsPerPage) {
    pages.push(content.slice(i, i + charsPerPage));
  }
  if (pages.length === 0) pages.push("");
  
  const totalPages = pages.length;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground text-lg">편지 미리보기</h2>
        </div>
        
        {/* 컨트롤 */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <button
              onClick={() => setZoom(Math.max(50, zoom - 10))}
              className="p-2 hover:bg-card rounded-md transition-colors"
              disabled={zoom <= 50}
            >
              <ZoomOut className="w-4 h-4 text-muted-foreground" />
            </button>
            <span className="px-2 text-sm font-medium text-foreground min-w-[50px] text-center">
              {zoom}%
            </span>
            <button
              onClick={() => setZoom(Math.min(150, zoom + 10))}
              className="p-2 hover:bg-card rounded-md transition-colors"
              disabled={zoom >= 150}
            >
              <ZoomIn className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* 미리보기 정보 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 받는 사람 */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">받는 사람</span>
          </div>
          {recipientName ? (
            <div>
              <p className="font-semibold text-foreground">{recipientName}</p>
              {recipientFacility && <p className="text-sm text-primary">{recipientFacility}</p>}
              {recipientAddress && <p className="text-sm text-muted-foreground">{recipientAddress}</p>}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">선택된 수신자가 없습니다</p>
          )}
        </div>
        
        {/* 보내는 사람 */}
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <Send className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">보내는 사람</span>
          </div>
          {senderName ? (
            <div>
              <p className="font-semibold text-foreground">{senderName}</p>
              {senderAddress && <p className="text-sm text-muted-foreground">{senderAddress}</p>}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">선택된 발신자가 없습니다</p>
          )}
        </div>
      </div>

      {/* 편지지 정보 */}
      <div className="flex items-center gap-2 bg-primary/5 rounded-lg px-4 py-2">
        <FileText className="w-4 h-4 text-primary" />
        <span className="text-sm text-foreground">
          <span className="font-medium">{stationery?.name || "순백"}</span> 편지지
        </span>
      </div>

      {/* 편지 미리보기 영역 */}
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ transform: `scale(${zoom / 100})` }}
          className="origin-top transition-transform"
        >
          {/* 편지지 */}
          <div 
            className={cn(
              "relative w-[400px] min-h-[560px] rounded-lg shadow-2xl overflow-hidden border border-border/50",
              stationery?.bgGradient || stationery?.bgColor || "bg-white"
            )}
          >
            {/* 패턴 */}
            {stationery?.pattern === "lines" && (
              <div className="absolute inset-0 flex flex-col pt-16 px-8 gap-6">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="h-px bg-amber-200/60" />
                ))}
              </div>
            )}
            {stationery?.pattern === "grid" && (
              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: 'linear-gradient(#ccc 1px, transparent 1px), linear-gradient(90deg, #ccc 1px, transparent 1px)',
                  backgroundSize: '24px 24px'
                }}
              />
            )}
            
            {/* 편지 내용 */}
            <div className="relative z-10 p-8 min-h-[560px] flex flex-col">
              {/* 받는 사람 */}
              {recipientName && (
                <div className="mb-6">
                  <p className="text-lg font-medium text-gray-800">
                    {recipientName}님께
                  </p>
                </div>
              )}
              
              {/* 본문 */}
              <div className="flex-1">
                {pages[currentPage - 1] ? (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words text-[15px]">
                    {pages[currentPage - 1]}
                  </p>
                ) : (
                  <p className="text-gray-400 italic">
                    편지 내용이 없습니다. 편지를 작성해주세요.
                  </p>
                )}
              </div>
              
              {/* 보내는 사람 */}
              {senderName && (
                <div className="mt-8 text-right">
                  <p className="text-gray-600 text-sm mb-1">
                    {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <p className="text-gray-800 font-medium">
                    {senderName} 드림
                  </p>
                </div>
              )}
              
              {/* 페이지 번호 */}
              {totalPages > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-gray-400">
                  {currentPage} / {totalPages}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* 페이지 네비게이션 */}
        {totalPages > 1 && (
          <div className="flex items-center gap-4 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              이전 페이지
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentPage} / {totalPages} 페이지
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              다음 페이지
            </Button>
          </div>
        )}
      </div>

      {/* 안내 메시지 */}
      <div className="bg-muted/50 rounded-xl p-4 text-center">
        <p className="text-sm text-muted-foreground">
          💡 실제 인쇄 시 편지지와 폰트가 약간 다르게 보일 수 있습니다.
        </p>
      </div>
    </div>
  );
}
