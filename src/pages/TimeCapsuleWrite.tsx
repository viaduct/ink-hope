import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Sparkles, User, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const aiStyles = [
  { id: "warm", emoji: "🌸", label: "더 따뜻하게", description: "감성적이고 부드러운 표현으로" },
  { id: "polish", emoji: "✨", label: "문장 다듬기", description: "맞춤법과 문장을 자연스럽게" },
  { id: "expand", emoji: "📝", label: "내용 보충하기", description: "더 풍부한 내용으로 확장" },
];

export default function TimeCapsuleWrite() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [content, setContent] = useState("");
  const [showAIModal, setShowAIModal] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);

  // 캡슐 정보 (실제로는 API에서 가져옴)
  const capsuleInfo = {
    title: "아버지 출소 축하 편지 모음",
    recipient: "홍길동 (아버지)",
  };

  const charCount = content.length;
  const maxChars = 1000;

  const handleBack = () => {
    if (content.trim()) {
      setShowExitDialog(true);
    } else {
      navigate(`/time-capsule/${id}`);
    }
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 2000);
    setIsSaving(false);
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error("편지 내용을 입력해주세요");
      return;
    }
    
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setShowCompleteDialog(true);
    setIsSaving(false);
  };

  const handleAIStyle = async (styleId: string) => {
    setShowAIModal(false);
    toast.info("AI가 편지를 다듬고 있어요...");
    
    // 실제로는 AI API 호출
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 데모: 약간의 텍스트 추가
    if (styleId === "warm") {
      setContent(prev => prev + "\n\n사랑하고 항상 응원해요. 💕");
    } else if (styleId === "expand") {
      setContent(prev => prev + "\n\n그동안 정말 수고 많으셨어요. 앞으로 좋은 일만 가득할 거예요.");
    }
    
    toast.success("편지가 다듬어졌어요!");
  };

  return (
    <>
      <Helmet>
        <title>편지 작성하기 - Orange Mail</title>
      </Helmet>

      <div className="min-h-screen bg-muted/30 flex flex-col">
        {/* Header */}
        <header className="bg-background border-b border-border/60 sticky top-0 z-50">
          <div className="max-w-lg mx-auto px-6 h-14 flex items-center justify-between">
            <button 
              onClick={handleBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">뒤로</span>
            </button>
            <span className="font-semibold text-foreground">편지 작성</span>
            <button 
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="text-sm text-primary hover:text-primary/80 font-medium disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "임시저장"}
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 max-w-lg mx-auto w-full px-6 py-6 flex flex-col">
          {/* 수신자 정보 */}
          <section className="mb-6">
            <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  To. <span className="font-medium text-foreground">{capsuleInfo.recipient}</span>
                </p>
                <p className="text-xs text-primary">"{capsuleInfo.title}" 참여</p>
              </div>
            </div>
          </section>

          {/* 편지 작성 영역 */}
          <section className="bg-background rounded-3xl border border-border/60 shadow-sm overflow-hidden flex-1 flex flex-col">
            {/* 편지지 헤더 */}
            <div className="px-6 py-4 border-b border-border/60 bg-gradient-to-r from-primary/5 to-amber-50">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">마음을 담아 편지를 작성해주세요</span>
              </div>
            </div>

            {/* 텍스트에어리어 */}
            <div className="flex-1 p-6">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value.slice(0, maxChars))}
                placeholder={`${capsuleInfo.recipient.split(" ")[0]}에게 전하고 싶은 말을 자유롭게 써보세요.\n\n어떤 이야기든 괜찮아요. 일상의 소소한 이야기, 그동안 하지 못했던 말, 응원의 메시지...\n\n진심이 담긴 한 마디가 큰 힘이 됩니다.`}
                className="w-full h-full min-h-[300px] resize-none border-none shadow-none focus-visible:ring-0 text-foreground placeholder:text-muted-foreground/60 leading-relaxed"
              />
            </div>

            {/* 하단 툴바 */}
            <div className="px-6 py-4 border-t border-border/60 bg-muted/30">
              <div className="flex items-center justify-between">
                {/* 글자 수 */}
                <div className="text-sm text-muted-foreground">
                  <span className={charCount > maxChars * 0.9 ? "text-destructive" : ""}>{charCount}</span>/{maxChars}자
                </div>

                {/* AI 도우미 */}
                <Button
                  type="button"
                  onClick={() => setShowAIModal(true)}
                  className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-sm"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI 도우미로 다듬기
                </Button>
              </div>
            </div>
          </section>
        </main>

        {/* 하단 버튼 */}
        <footer className="bg-background border-t border-border/60 p-4 sticky bottom-0">
          <div className="max-w-lg mx-auto flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="flex-1 py-6"
            >
              임시저장
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSaving || !content.trim()}
              className="flex-[2] py-6 bg-primary hover:bg-primary/90 shadow-lg"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              작성 완료
            </Button>
          </div>
        </footer>

        {/* 임시저장 토스트 */}
        <AnimatePresence>
          {showSaveToast && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="fixed bottom-24 left-1/2 -translate-x-1/2"
            >
              <div className="flex items-center gap-2 px-5 py-3 bg-foreground text-background text-sm rounded-full shadow-lg">
                <Check className="w-4 h-4 text-green-400" />
                임시저장 되었어요
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* AI 도우미 모달 */}
      <Dialog open={showAIModal} onOpenChange={setShowAIModal}>
        <DialogContent className="max-w-md rounded-3xl">
          <div className="px-6 py-4 border-b border-border/60 bg-gradient-to-r from-violet-50 to-purple-50 -mx-6 -mt-6 rounded-t-3xl">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-foreground">AI 도우미</span>
            </div>
          </div>
          
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-5">
              AI가 편지를 더 자연스럽고 따뜻하게 다듬어드려요.<br />
              원하는 스타일을 선택해주세요.
            </p>

            <div className="space-y-3">
              {aiStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => handleAIStyle(style.id)}
                  className="w-full flex items-center gap-4 p-4 bg-muted hover:bg-primary/5 rounded-2xl transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-background rounded-xl flex items-center justify-center flex-shrink-0 text-lg">
                    {style.emoji}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{style.label}</p>
                    <p className="text-sm text-muted-foreground">{style.description}</p>
                  </div>
                </button>
              ))}
            </div>

            <p className="text-xs text-muted-foreground text-center mt-5">
              AI가 도와드려도 당신의 진심은 그대로 전해져요
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* 나가기 확인 다이얼로그 */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent className="max-w-sm rounded-3xl">
          <AlertDialogHeader>
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <AlertDialogTitle className="text-center">작성 중인 편지가 있어요</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              저장하지 않고 나가면 내용이 사라져요
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-3">
            <AlertDialogCancel className="flex-1 mt-0">계속 쓰기</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => navigate(`/time-capsule/${id}`)}
              className="flex-1 bg-foreground text-background hover:bg-foreground/90"
            >
              나가기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 완료 다이얼로그 */}
      <AlertDialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <AlertDialogContent className="max-w-sm rounded-3xl">
          <AlertDialogHeader>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-green-500" />
            </div>
            <AlertDialogTitle className="text-center text-xl">편지가 등록되었어요!</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              전달 예정일에 다른 가족들의 편지와 함께<br />
              {capsuleInfo.recipient.split(" ")[0]}에게 전달됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={() => navigate(`/time-capsule/${id}`)}
              className="w-full py-6 bg-primary hover:bg-primary/90 rounded-2xl"
            >
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
