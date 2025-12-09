import { useState, useRef } from "react";
import { 
  Edit3, 
  Sparkles,
  Minus, 
  Plus, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  ImageIcon
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
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + emoji + content.substring(end);
      onContentChange(newContent);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
        textarea.focus();
      }, 0);
    } else {
      onContentChange(content + emoji);
    }
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
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Edit3 className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground text-lg">편지 작성</h2>
        </div>
        <button 
          onClick={() => setIsAIHelperOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-full text-sm font-medium hover:from-violet-600 hover:to-purple-600 transition-all shadow-md"
        >
          <Sparkles className="w-4 h-4" />
          AI 도우미
        </button>
      </div>

      {/* 흰색 라운딩 박스 - 메인 에디터 컨테이너 */}
      <div className="bg-card rounded-3xl p-6 shadow-lg border border-border/50">
        {/* 템플릿 버튼 */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setActiveModal("intro")}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border border-orange-200/50 dark:border-orange-800/30 rounded-full text-sm font-medium text-orange-700 dark:text-orange-300 hover:from-orange-100 hover:to-amber-100 dark:hover:from-orange-950/50 dark:hover:to-amber-950/50 transition-all shadow-sm"
          >
            <span>👋</span>
            처음
          </button>
          <button
            onClick={() => setActiveModal("middle")}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border border-amber-200/50 dark:border-amber-800/30 rounded-full text-sm font-medium text-amber-700 dark:text-amber-300 hover:from-amber-100 hover:to-yellow-100 dark:hover:from-amber-950/50 dark:hover:to-yellow-950/50 transition-all shadow-sm"
          >
            <span>💬</span>
            중간
          </button>
          <button
            onClick={() => setActiveModal("conclusion")}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border border-violet-200/50 dark:border-violet-800/30 rounded-full text-sm font-medium text-violet-700 dark:text-violet-300 hover:from-violet-100 hover:to-purple-100 dark:hover:from-violet-950/50 dark:hover:to-purple-950/50 transition-all shadow-sm"
          >
            <span>🌟</span>
            마무리
          </button>
        </div>

        {/* 툴바 */}
        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-xl flex-wrap mb-4">
          {/* 폰트 선택 */}
          <Select value={font} onValueChange={setFont}>
            <SelectTrigger className="w-[140px] h-9 bg-card border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fonts.map(f => (
                <SelectItem key={f.id} value={f.id}>
                  {f.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="w-px h-6 bg-border mx-1" />

          {/* 폰트 크기 */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleFontSizeChange(-2)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center text-sm font-medium text-foreground">
              {fontSize}
            </span>
            <button
              onClick={() => handleFontSizeChange(2)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-border mx-1" />

          {/* 굵기 */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsBold(false)}
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded-lg transition-colors text-lg",
                !isBold ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
              )}
            >
              가
            </button>
            <button
              onClick={() => setIsBold(true)}
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded-lg transition-colors text-lg font-bold",
                isBold ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
              )}
            >
              가
            </button>
          </div>

          <div className="w-px h-6 bg-border mx-1" />

          {/* 텍스트 스타일 */}
          <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground">
            <span className="text-lg underline">가</span>
          </button>

          {/* 정렬 */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setTextAlign("left")}
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded-lg transition-colors",
                textAlign === "left" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
              )}
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTextAlign("center")}
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded-lg transition-colors",
                textAlign === "center" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
              )}
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTextAlign("right")}
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded-lg transition-colors",
                textAlign === "right" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
              )}
            >
              <AlignRight className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-border mx-1" />

          {/* 이미지 */}
          <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground">
            <ImageIcon className="w-4 h-4" />
          </button>

          {/* 글자 수 */}
          <div className="ml-auto text-sm text-muted-foreground">
            {charCount}자
          </div>
        </div>

        {/* 빠른 이모지 바 */}
        <div className="mb-4">
          <QuickEmojiBar onSelect={insertEmoji} />
        </div>

        {/* 에디터 */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder={`여기에 마음을 담아 편지를 써보세요...

뭐라고 써야 할지 모르겠으면
위의 '처음/중간/마무리' 버튼을 눌러보세요! 😊`}
            className={cn(
              "w-full min-h-[350px] p-6 bg-muted/30 border-0 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all",
              "placeholder:text-muted-foreground/60",
              isBold && "font-bold"
            )}
            style={{
              fontSize: `${fontSize}px`,
              textAlign: textAlign,
              fontFamily: font === "pretendard" ? "Pretendard, sans-serif" : 
                         font === "nanum-gothic" ? "'Nanum Gothic', sans-serif" :
                         font === "nanum-myeongjo" ? "'Nanum Myeongjo', serif" :
                         "'Gowun Dodum', sans-serif"
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
