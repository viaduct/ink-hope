import { useState, useRef } from "react";
import { 
  Edit3, 
  Sparkles,
  Minus, 
  Plus, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  ImageIcon,
  CornerDownLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QuickEmojiBar } from "./QuickEmojiBar";
import { AIWritingHelper } from "./AIWritingHelper";
import { AIWriterModal } from "./AIWriterModal";

type TextAlign = "left" | "center" | "right";

interface LetterEditorProps {
  content: string;
  onContentChange: (content: string) => void;
}

const fonts = [
  { id: "pretendard", name: "Pretendard" },
  { id: "nanum-gothic", name: "나눔고딕" },
  { id: "nanum-myeongjo", name: "나눔명조" },
  { id: "gowun-dodum", name: "고운돋움" },
];

export function LetterEditor({ content, onContentChange }: LetterEditorProps) {
  const [font, setFont] = useState("pretendard");
  const [fontSize, setFontSize] = useState(16);
  const [isBold, setIsBold] = useState(false);
  const [textAlign, setTextAlign] = useState<TextAlign>("left");
  const [isAIHelperOpen, setIsAIHelperOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<"intro" | "middle" | "conclusion" | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const charCount = content.length;

  const handleFontSizeChange = (delta: number) => {
    setFontSize(prev => Math.min(24, Math.max(12, prev + delta)));
  };

  const insertEmoji = (emoji: string) => {
    insertAtCursor(emoji);
  };

  const insertAtCursor = (text: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + text + content.substring(end);
      onContentChange(newContent);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + text.length;
        textarea.focus();
      }, 0);
    } else {
      onContentChange(content + text);
    }
  };

  const insertLineBreak = () => {
    insertAtCursor("\n\n");
  };

  const handleInsertContent = (text: string, position: "start" | "end" | "cursor") => {
    if (position === "start") {
      onContentChange(text + "\n\n" + content);
    } else if (position === "end") {
      onContentChange(content + (content ? "\n\n" : "") + text);
    } else {
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const newContent = content.substring(0, start) + text + content.substring(start);
        onContentChange(newContent);
      } else {
        onContentChange(content + text);
      }
    }
  };

  return (
    <div className="space-y-4 lg:space-y-7">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Edit3 className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
          <h2 className="font-semibold text-foreground text-sm lg:text-base tracking-tight">편지 작성</h2>
        </div>
        <button
          onClick={() => setIsAIHelperOpen(true)}
          className="flex items-center gap-1.5 px-3 lg:px-3.5 py-1.5 lg:py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-full text-[11px] lg:text-xs font-medium hover:from-violet-600 hover:to-purple-600 transition-all shadow-sm"
        >
          <Sparkles className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
          AI 도우미
        </button>
      </div>

      {/* 흰색 라운딩 박스 - 메인 에디터 컨테이너 */}
      <div className="bg-card rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-md border border-black/[0.05] dark:border-white/[0.05]">
        {/* 템플릿 버튼 - 모바일에서 더 작게 */}
        <div className="flex items-center gap-2 lg:gap-3 mb-4 lg:mb-6">
          <button
            onClick={() => setActiveModal("intro")}
            className="h-8 lg:h-10 flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-2 bg-orange-50 dark:bg-orange-950/30 border border-orange-200/50 dark:border-orange-800/30 rounded-full text-[11px] lg:text-sm font-medium text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-950/50 hover:border-orange-300/50 transition-all"
          >
            <span className="text-sm lg:text-base">👋</span>
            처음
          </button>
          <button
            onClick={() => setActiveModal("middle")}
            className="h-8 lg:h-10 flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-2 bg-orange-50 dark:bg-orange-950/30 border border-orange-200/50 dark:border-orange-800/30 rounded-full text-[11px] lg:text-sm font-medium text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-950/50 hover:border-orange-300/50 transition-all"
          >
            <span className="text-sm lg:text-base">💬</span>
            중간
          </button>
          <button
            onClick={() => setActiveModal("conclusion")}
            className="h-8 lg:h-10 flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-2 bg-orange-50 dark:bg-orange-950/30 border border-orange-200/50 dark:border-orange-800/30 rounded-full text-[11px] lg:text-sm font-medium text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-950/50 hover:border-orange-300/50 transition-all"
          >
            <span className="text-sm lg:text-base">🌟</span>
            마무리
          </button>
        </div>

        {/* 툴바 - 모바일에서 스크롤 가능 */}
        <div className="flex items-center gap-1 lg:gap-1.5 p-2 lg:p-2.5 bg-muted/40 rounded-lg lg:rounded-xl mb-3 lg:mb-4 border border-border/30 overflow-x-auto">
          {/* 폰트 선택 - 모바일에서 숨김 */}
          <Select value={font} onValueChange={setFont}>
            <SelectTrigger className="hidden lg:flex w-[100px] h-8 bg-card border-border/50 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fonts.map(f => (
                <SelectItem key={f.id} value={f.id} className="text-xs">
                  {f.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="hidden lg:block w-px h-5 bg-border/50 mx-0.5" />

          {/* 폰트 크기 */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => handleFontSizeChange(-2)}
              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-5 lg:w-6 text-center text-[10px] lg:text-xs font-medium text-foreground tabular-nums">
              {fontSize}
            </span>
            <button
              onClick={() => handleFontSizeChange(2)}
              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="w-px h-5 bg-border/50 mx-0.5" />

          {/* 굵기 */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setIsBold(false)}
              className={cn(
                "w-7 h-7 flex items-center justify-center rounded-md transition-colors text-[11px] lg:text-sm",
                !isBold ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
              )}
            >
              가
            </button>
            <button
              onClick={() => setIsBold(true)}
              className={cn(
                "w-7 h-7 flex items-center justify-center rounded-md transition-colors text-[11px] lg:text-sm font-bold",
                isBold ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
              )}
            >
              가
            </button>
          </div>

          <div className="w-px h-5 bg-border/50 mx-0.5" />

          {/* 정렬 */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setTextAlign("left")}
              className={cn(
                "w-7 h-7 flex items-center justify-center rounded-md transition-colors",
                textAlign === "left" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
              )}
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTextAlign("center")}
              className={cn(
                "w-7 h-7 flex items-center justify-center rounded-md transition-colors",
                textAlign === "center" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
              )}
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTextAlign("right")}
              className={cn(
                "w-7 h-7 flex items-center justify-center rounded-md transition-colors",
                textAlign === "right" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
              )}
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="hidden lg:block w-px h-5 bg-border/50 mx-0.5" />

          {/* 줄바꿈 - 데스크탑만 */}
          <button
            onClick={insertLineBreak}
            className="hidden lg:flex w-7 h-7 items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground"
            title="줄바꿈"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>

          {/* 이미지 - 데스크탑만 */}
          <button className="hidden lg:flex w-7 h-7 items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground">
            <ImageIcon className="w-3.5 h-3.5" />
          </button>

          {/* 글자 수 */}
          <div className="ml-auto text-[10px] lg:text-xs text-muted-foreground tabular-nums whitespace-nowrap">
            {charCount}자
          </div>
        </div>

        {/* 빠른 이모지 바 - 상단 툴바와 16px 간격 */}
        <div className="mt-4 mb-4">
          <QuickEmojiBar onSelect={insertEmoji} />
        </div>

        {/* 에디터 - 명도/테두리 조정 */}
        <div className="relative rounded-xl overflow-hidden border border-black/[0.05] dark:border-white/[0.05]">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder="여기에 마음을 담아 편지를 써보세요.
막막하다면 위의 '처음/중간/마무리' 버튼을 눌러보세요."
            className={cn(
              "w-full min-h-[320px] p-6 bg-muted/10 border-0 resize-none focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all",
              "placeholder:text-[#C6C6C6] dark:placeholder:text-muted-foreground/40",
              isBold && "font-bold"
            )}
            style={{
              fontSize: `${fontSize}px`,
              textAlign: textAlign,
              fontFamily: font === "pretendard" ? "Pretendard, sans-serif" : 
                         font === "nanum-gothic" ? "'Nanum Gothic', sans-serif" :
                         font === "nanum-myeongjo" ? "'Nanum Myeongjo', serif" :
                         "'Gowun Dodum', sans-serif",
              lineHeight: 1.7
            }}
          />
        </div>
      </div>

      {/* AI 도우미 */}
      <AIWritingHelper
        isOpen={isAIHelperOpen}
        onClose={() => setIsAIHelperOpen(false)}
        onSelectSuggestion={(text) => {
          onContentChange(content + text + "\n\n");
        }}
        currentContent={content}
      />

      {/* AI 작성 모달들 */}
      <AIWriterModal
        type="intro"
        isOpen={activeModal === "intro"}
        onClose={() => setActiveModal(null)}
        onInsert={(text) => handleInsertContent(text, "start")}
        currentContent={content}
      />
      <AIWriterModal
        type="middle"
        isOpen={activeModal === "middle"}
        onClose={() => setActiveModal(null)}
        onInsert={(text) => handleInsertContent(text, "cursor")}
        currentContent={content}
      />
      <AIWriterModal
        type="conclusion"
        isOpen={activeModal === "conclusion"}
        onClose={() => setActiveModal(null)}
        onInsert={(text) => handleInsertContent(text, "end")}
        currentContent={content}
      />
    </div>
  );
}
