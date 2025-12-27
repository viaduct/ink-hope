import { motion } from "framer-motion";
import { Eye, User, Send, ZoomIn, ZoomOut, Sparkles, RotateCcw } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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

// 말투 옵션
const toneOptions = [
  { id: "emotion", label: "감정 강화", icon: "💝", description: "감정을 더 풍부하게" },
  { id: "formal", label: "격식체", icon: "📋", description: "정중하고 격식있게" },
  { id: "friendly", label: "친근하게", icon: "😊", description: "친근하고 편하게" },
  { id: "concise", label: "간결하게", icon: "📝", description: "핵심만 간결하게" },
  { id: "mom", label: "엄마 말투", icon: "👩", description: "따뜻한 엄마처럼" },
  { id: "sibling", label: "형/누나 말투", icon: "👫", description: "친한 형제처럼" },
  { id: "friend", label: "친구 말투", icon: "🤝", description: "편한 친구처럼" },
  { id: "serious", label: "진지하게", icon: "🎯", description: "진지하고 신중하게" },
];

// Static tone transformation templates
const toneTransformations: Record<string, (content: string) => string> = {
  emotion: (content) => {
    // Add emotional expressions
    const additions = ["정말", "너무", "마음이 따뜻해지는", "진심으로"];
    const randomAddition = additions[Math.floor(Math.random() * additions.length)];
    return content.replace(/\./g, "요.").replace(/^/, `${randomAddition} `);
  },
  formal: (content) => {
    // Make more formal
    return content
      .replace(/해요/g, "합니다")
      .replace(/예요/g, "입니다")
      .replace(/요\./g, "습니다.")
      .replace(/\?/g, "습니까?");
  },
  friendly: (content) => {
    // Make friendlier
    return content
      .replace(/합니다/g, "해요")
      .replace(/입니다/g, "예요")
      .replace(/습니다/g, "요");
  },
  concise: (content) => {
    // Keep sentences shorter - just return as is since we can't really shorten without AI
    return content;
  },
  mom: (content) => {
    // Add motherly expressions
    const prefix = "우리 ";
    const suffix = " 엄마가 항상 응원할게.";
    return prefix + content + suffix;
  },
  sibling: (content) => {
    // Add sibling-like expressions
    return content.replace(/요\./g, "어.").replace(/세요/g, "해");
  },
  friend: (content) => {
    // Make casual like friends
    return content.replace(/요\./g, "!").replace(/세요/g, "해").replace(/합니다/g, "해");
  },
  serious: (content) => {
    // Make more serious
    return content.replace(/!/g, ".").replace(/ㅎㅎ/g, "").replace(/~~~/g, "");
  },
};

interface LetterPreviewProps {
  content: string;
  stationeryId: string | null;
  recipientName?: string;
  recipientFacility?: string;
  recipientAddress?: string;
  senderName?: string;
  senderAddress?: string;
  onContentChange?: (content: string) => void;
}

export function LetterPreview({
  content,
  stationeryId,
  recipientName,
  recipientFacility,
  senderName,
  senderAddress,
  onContentChange,
}: LetterPreviewProps) {
  const [zoom, setZoom] = useState(100);
  const [editableContent, setEditableContent] = useState(content);
  const [originalContent] = useState(content);
  const [activeTone, setActiveTone] = useState<string | null>(null);

  const stationery = stationeryId ? stationeryStyles[stationeryId] : stationeryStyles.white;

  const handleContentChange = (newContent: string) => {
    setEditableContent(newContent);
    onContentChange?.(newContent);
  };

  const handleReset = () => {
    setEditableContent(originalContent);
    onContentChange?.(originalContent);
    setActiveTone(null);
    toast.success("원본으로 초기화되었습니다");
  };

  const handleToneConvert = (toneId: string) => {
    if (!editableContent.trim()) {
      toast.error("변환할 내용이 없습니다");
      return;
    }

    setActiveTone(toneId);

    // Apply static transformation
    const transformer = toneTransformations[toneId];
    if (transformer) {
      const transformed = transformer(editableContent);
      setEditableContent(transformed);
      onContentChange?.(transformed);
      toast.success("말투가 변환되었습니다");
    }
  };

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground text-lg">편지 미리보기</h2>
        </div>
      </div>

      {/* 흰색 라운딩 박스 - 메인 컨테이너 */}
      <div className="bg-card rounded-3xl p-6 shadow-lg border border-border/50 space-y-6">
        {/* 줌 컨트롤 */}
        <div className="flex items-center justify-end">
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

        {/* 편지지 미리보기 영역 */}
        <div className="rounded-2xl border border-border overflow-hidden">
          {/* 에디터 영역 */}
          <div
            className={cn(
              "relative min-h-[300px] p-6",
              stationery?.bgGradient || stationery?.bgColor || "bg-white"
            )}
          >
            {/* 패턴 */}
            {stationery?.pattern === "lines" && (
              <div className="absolute inset-0 flex flex-col pt-8 px-6 gap-6 pointer-events-none">
                {[...Array(15)].map((_, i) => (
                  <div key={i} className="h-px bg-amber-200/60" />
                ))}
              </div>
            )}
            {stationery?.pattern === "grid" && (
              <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                  backgroundImage: 'linear-gradient(#ccc 1px, transparent 1px), linear-gradient(90deg, #ccc 1px, transparent 1px)',
                  backgroundSize: '24px 24px'
                }}
              />
            )}

            {/* 텍스트 에디터 */}
            <textarea
              value={editableContent}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="편지 내용을 입력하거나 수정하세요..."
              className={cn(
                "relative z-10 w-full min-h-[280px] bg-transparent border-0 resize-none focus:outline-none text-gray-800 leading-relaxed",
                "placeholder:text-gray-400"
              )}
              style={{ fontSize: "16px" }}
            />
          </div>

          {/* AI 말투 변환 툴바 */}
          <div className="border-t border-border bg-muted/30 p-4">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4" />
                <span>AI로 전체 문장 다듬기</span>
              </div>

              <div className="flex items-center gap-2 flex-wrap flex-1">
                {toneOptions.map((tone) => (
                  <button
                    key={tone.id}
                    onClick={() => handleToneConvert(tone.id)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all border",
                      activeTone === tone.id
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-card border-border hover:border-primary/50 hover:bg-primary/5 text-foreground"
                    )}
                    title={tone.description}
                  >
                    <span>{tone.icon}</span>
                    {tone.label}
                  </button>
                ))}
              </div>

              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                초기화
              </button>
            </div>
          </div>
        </div>

        {/* 받는 사람/보내는 사람 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 받는 사람 */}
          <div className="bg-muted/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">받는 사람</span>
            </div>
            {recipientName ? (
              <div>
                <p className="font-semibold text-foreground">{recipientName}</p>
                {recipientFacility && <p className="text-sm text-primary">{recipientFacility}</p>}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">선택된 수신자가 없습니다</p>
            )}
          </div>

          {/* 보내는 사람 */}
          <div className="bg-muted/30 rounded-xl p-4">
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

        {/* 안내 메시지 */}
        <div className="bg-muted/50 rounded-xl p-4 text-center">
          <p className="text-sm text-muted-foreground">
            미리보기에서 직접 수정하거나, AI 버튼을 눌러 말투를 바꿀 수 있어요.
          </p>
        </div>
      </div>
    </div>
  );
}
