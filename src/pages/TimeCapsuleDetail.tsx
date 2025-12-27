import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  ChevronLeft, Settings, Check, Users, Plus,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { AppLayout } from "@/components/layout/AppLayout";
import completedTreeImage from "@/assets/emoticons/completed-tree.png";

// 목업 데이터
const mockCapsuleData: Record<string, {
  id: number;
  title: string;
  recipient: string;
  facility: string;
  targetDate: string;
  daysLeft: number;
  letterCount: number;
  targetLetters: number;
  inviteCode: string;
  myLetter: string | null;
  status?: "collecting" | "delivered";
  deliveredDate?: string;
  contributors: Array<{
    id: number;
    name: string;
    relation: string;
    avatar: string;
    contributed: boolean;
    letterDate: string | null;
    isMe: boolean;
  }>;
}> = {
  "1": {
    id: 1,
    title: "아버지 출소 축하 쪽지 모음",
    recipient: "홍길동 (아버지)",
    facility: "서울구치소",
    targetDate: "2025-06-15",
    daysLeft: 178,
    letterCount: 3,
    targetLetters: 5,
    inviteCode: "ABC123XY",
    myLetter: "아버지, 출소하시는 날만 손꼽아 기다리고 있어요. 그동안 정말 힘드셨죠? 저희도 아버지 없이 지내는 시간이 너무 길게 느껴졌어요. 이제 곧 다시 만날 수 있다는 생각에 벌써부터 마음이 설레요. 건강하게 나오셔서 함께 맛있는 것도 먹고, 그동안 못 했던 이야기들 많이 나누고 싶어요...",
    status: "collecting",
    contributors: [
      { id: 1, name: "어머니", relation: "배우자", avatar: "😊", contributed: true, letterDate: "2025-01-02", isMe: false },
      { id: 2, name: "나", relation: "자녀", avatar: "😄", contributed: true, letterDate: "2025-01-05", isMe: true },
      { id: 3, name: "큰딸", relation: "자녀", avatar: "😀", contributed: true, letterDate: "2025-01-10", isMe: false },
      { id: 4, name: "여동생", relation: "자녀", avatar: "😐", contributed: false, letterDate: null, isMe: false },
      { id: 5, name: "삼촌", relation: "형제", avatar: "😐", contributed: false, letterDate: null, isMe: false },
    ],
  },
  "2": {
    id: 2,
    title: "엄마 면회 때 전할 응원 메시지",
    recipient: "김영희 (어머니)",
    facility: "청주여자교도소",
    targetDate: "2025-01-20",
    daysLeft: 32,
    letterCount: 2,
    targetLetters: 3,
    inviteCode: "XYZ789AB",
    myLetter: null,
    status: "collecting",
    contributors: [
      { id: 1, name: "아버지", relation: "배우자", avatar: "👨", contributed: true, letterDate: "2025-01-10", isMe: false },
      { id: 2, name: "큰딸", relation: "자녀", avatar: "👩", contributed: true, letterDate: "2025-01-12", isMe: false },
      { id: 3, name: "나", relation: "자녀", avatar: "🧑", contributed: false, letterDate: null, isMe: true },
    ],
  },
  "3": {
    id: 3,
    title: "오빠 가석방 축하",
    recipient: "박민수 (오빠)",
    facility: "의정부교도소",
    targetDate: "2025-12-20",
    daysLeft: 0,
    letterCount: 3,
    targetLetters: 3,
    inviteCode: "DEL123AB",
    myLetter: "오빠, 드디어 나오는 날이네! 정말 기다렸어. 그동안 힘들었지? 이제 다 끝났어. 우리 가족 모두 오빠 기다리고 있어. 나오면 맛있는 것 먹으러 가자!",
    status: "delivered",
    deliveredDate: "2025-12-20",
    contributors: [
      { id: 1, name: "나", relation: "동생", avatar: "😊", contributed: true, letterDate: "2025-12-15", isMe: true },
      { id: 2, name: "어머니", relation: "부모", avatar: "👩", contributed: true, letterDate: "2025-12-16", isMe: false },
      { id: 3, name: "아버지", relation: "부모", avatar: "👨", contributed: true, letterDate: "2025-12-18", isMe: false },
    ],
  },
};

export default function TimeCapsuleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteInput, setInviteInput] = useState("");
  const [inviteRelation, setInviteRelation] = useState("");

  const capsule = mockCapsuleData[id || "1"];

  if (!capsule) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">타임캡슐을 찾을 수 없습니다</p>
          <Button onClick={() => navigate("/time-capsule")}>돌아가기</Button>
        </div>
      </div>
    );
  }

  const progressPercent = Math.round((capsule.letterCount / capsule.targetLetters) * 100);

  return (
    <AppLayout>
      <Helmet>
        <title>{capsule.title} - Orange Mail</title>
      </Helmet>

      <div className="h-full overflow-auto bg-muted/30">
        {/* Header */}
        <header className="bg-background border-b border-border/60 sticky top-0 z-50">
          <div className="max-w-lg mx-auto px-6 h-14 flex items-center justify-between">
            <button 
              onClick={() => navigate("/time-capsule")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-semibold text-foreground truncate max-w-[200px]">{capsule.title}</span>
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="max-w-lg mx-auto px-6 py-6 space-y-6">
          {/* 완성된 나무 (전달 완료 시) - 맨 위 */}
          {capsule.status === "delivered" && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-b from-green-50 to-emerald-50 rounded-2xl pt-4 pb-0 border border-green-200/60 shadow-sm overflow-hidden"
            >
              <div className="text-center">
                <h3 className="font-semibold text-foreground mb-1">완성된 오렌지나무</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {capsule.letterCount}통의 쪽지가 모여 아름다운 나무가 되었어요
                </p>
                <img 
                  src={completedTreeImage} 
                  alt="완성된 오렌지나무" 
                  className="w-64 h-64 mx-auto object-contain -mb-2"
                />
              </div>
            </motion.section>
          )}

          {/* 수신자 정보 카드 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: capsule.status === "delivered" ? 0.1 : 0 }}
            className={`rounded-2xl px-5 py-4 shadow-lg ${
              capsule.status === "delivered" 
                ? "bg-gradient-to-br from-green-500 to-emerald-500 text-white" 
                : "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="opacity-70 text-xs">To.</p>
                <h2 className="text-lg font-bold">{capsule.recipient}</h2>
                <p className="opacity-70 text-xs">{capsule.facility}</p>
              </div>
              <div className="text-right">
                {capsule.status === "delivered" ? (
                  <div className="bg-white/20 backdrop-blur rounded-lg px-3 py-2">
                    <p className="text-sm font-bold flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      전달완료
                    </p>
                    <p className="opacity-70 text-xs">{capsule.deliveredDate}</p>
                  </div>
                ) : (
                  <div className="bg-white/20 backdrop-blur rounded-lg px-3 py-2">
                    <p className="text-lg font-bold">D-{capsule.daysLeft}</p>
                    <p className="opacity-70 text-xs">{capsule.targetDate}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.section>

          {/* 편지 모음 현황 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-background rounded-2xl p-5 border border-border/60 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground">쪽지 모음 현황</h3>
              <span className={`text-lg font-bold ${capsule.status === "delivered" ? "text-green-500" : "text-primary"}`}>
                {capsule.letterCount}/{capsule.targetLetters}통
              </span>
            </div>
            <Progress 
              value={progressPercent} 
              className={`h-3 mb-2 ${capsule.status === "delivered" ? "[&>div]:bg-green-500" : ""}`} 
            />
            <p className="text-sm text-muted-foreground">
              {capsule.status === "delivered"
                ? `${capsule.deliveredDate}에 ${capsule.letterCount}통의 쪽지가 전달되었어요 🎉`
                : capsule.letterCount < capsule.targetLetters 
                  ? `목표까지 ${capsule.targetLetters - capsule.letterCount}통 남았어요. 조금만 더 모아볼까요?`
                  : "목표를 달성했어요! 🎉"
              }
            </p>
          </motion.section>

          {/* 참여자 목록 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-background rounded-2xl border border-border/60 shadow-sm overflow-hidden"
          >
            <div className="flex items-center justify-between p-5 border-b border-border/60">
              <h3 className="font-semibold text-foreground">참여자</h3>
              {capsule.status !== "delivered" && (
                <button 
                  onClick={() => setShowInviteModal(true)}
                  className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  초대하기
                </button>
              )}
            </div>

            <div className="divide-y divide-border/40">
              {capsule.contributors.map((contributor) => (
                <div 
                  key={contributor.id}
                  className={`flex items-center gap-4 p-4 transition-colors ${contributor.isMe ? "bg-primary/5" : "hover:bg-muted/50"}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                    contributor.contributed ? "bg-primary/10" : "bg-muted"
                  }`}>
                    {contributor.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{contributor.name}</p>
                      {contributor.isMe && (
                        <span className="px-1.5 py-0.5 bg-primary text-primary-foreground text-xs rounded">본인</span>
                      )}
                      <span className="text-xs text-muted-foreground">{contributor.relation}</span>
                    </div>
                    {contributor.letterDate && (
                      <p className="text-xs text-muted-foreground">{contributor.letterDate} 작성</p>
                    )}
                  </div>
                  {contributor.contributed ? (
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-600 text-xs font-medium rounded-full">
                      <Check className="w-3.5 h-3.5" />
                      작성완료
                    </span>
                  ) : (
                    <button className="flex items-center gap-1 px-3 py-1.5 text-primary hover:bg-primary/5 text-xs font-medium rounded-full transition-colors">
                      리마인더 보내기
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.section>


          {/* 내 편지 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-background rounded-2xl p-5 border border-border/60 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">내 쪽지</h3>
              {capsule.status !== "delivered" && (
                <button 
                  onClick={() => navigate(`/time-capsule/${id}/write`)}
                  className="text-sm text-primary hover:text-primary/80 font-medium"
                >
                  {capsule.myLetter ? "수정하기" : "작성하기"}
                </button>
              )}
            </div>
            {capsule.myLetter ? (
              <div className="relative bg-primary/5 rounded-xl p-4 max-h-32 overflow-hidden">
                <p className="text-foreground text-sm leading-relaxed">
                  {capsule.myLetter}
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-primary/5 to-transparent" />
              </div>
            ) : (
              <div className="bg-muted/50 rounded-xl p-6 text-center">
                <p className="text-muted-foreground text-sm mb-3">
                  {capsule.status === "delivered" ? "쪽지를 작성하지 않았어요" : "아직 쪽지를 작성하지 않았어요"}
                </p>
                {capsule.status !== "delivered" && (
                  <Button 
                    onClick={() => navigate(`/time-capsule/${id}/write`)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    쪽지 쓰기
                  </Button>
                )}
              </div>
            )}
          </motion.section>

        </main>

        {/* 하단 고정 버튼 - 편지 미작성 시 (완료된 캡슐이 아닐 때만) */}
        {!capsule.myLetter && capsule.status !== "delivered" && (
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border/60 p-4">
            <div className="max-w-lg mx-auto">
              <Button 
                onClick={() => navigate(`/time-capsule/${id}/write`)}
                className="w-full py-6 bg-primary hover:bg-primary/90 text-lg font-semibold rounded-2xl shadow-lg"
              >
                내 쪽지 쓰기
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 초대 모달 */}
      <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle>참여자 초대하기</DialogTitle>
          </DialogHeader>

          <div>
            <p className="text-sm font-medium text-foreground mb-3">직접 초대하기</p>
            
            {/* 관계 선택 */}
            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-2">참여자와의 관계</p>
              <div className="flex flex-wrap gap-2">
                {["배우자", "자녀", "부모", "형제/자매", "친구", "지인", "기타"].map((relation) => (
                  <button
                    key={relation}
                    type="button"
                    onClick={() => setInviteRelation(relation)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      inviteRelation === relation
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {relation}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Input 
                type="text" 
                placeholder="전화번호 또는 이메일"
                value={inviteInput}
                onChange={(e) => setInviteInput(e.target.value)}
                className="flex-1"
              />
              <Button 
                className="px-5 bg-primary hover:bg-primary/90"
                disabled={!inviteRelation}
              >
                초대
              </Button>
            </div>
            {!inviteRelation && inviteInput && (
              <p className="text-xs text-destructive mt-2">관계를 먼저 선택해주세요</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
