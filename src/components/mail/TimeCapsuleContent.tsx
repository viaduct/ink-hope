import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, Plus, ChevronRight, Heart, ChevronDown, HelpCircle,
  Home, Sparkles, Cake, Calendar, Users, Gift
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";


interface TimeCapsuleContentProps {
  onClose: () => void;
}

// 목업 데이터
const mockInvitations = [
  {
    id: 1,
    title: "아버지 출소 축하 편지 모음",
    invitedBy: "어머니",
    daysLeft: 178,
    letterCount: 3,
    targetLetters: 5,
    myLetterWritten: false,
    isNew: true,
  }
];

const mockMyCapsules = [
  {
    id: 2,
    title: "엄마 면회 때 전할 응원 메시지",
    recipient: "어머니 (김영희)",
    facility: "청주여자교도소",
    daysLeft: 32,
    letterCount: 2,
    targetLetters: 3,
    status: "collecting",
    contributors: ["😊", "😄", "😀"],
    icon: Heart,
    iconBg: "bg-pink-100",
    iconColor: "text-pink-500",
  },
  {
    id: 3,
    title: "오빠 가석방 축하",
    recipient: "오빠 (박민수)",
    facility: "의정부교도소",
    deliveredDate: "2024-12-20",
    letterCount: 3,
    status: "delivered",
    icon: Sparkles,
    iconBg: "bg-gray-100",
    iconColor: "text-gray-400",
  },
];

export function TimeCapsuleContent({ onClose }: TimeCapsuleContentProps) {
  const navigate = useNavigate();
  const [isExplanationOpen, setIsExplanationOpen] = useState(true);
  const [inviteCode, setInviteCode] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "collecting" | "completed">("all");

  const filteredCapsules = mockMyCapsules.filter(capsule => {
    if (activeTab === "all") return true;
    if (activeTab === "collecting") return capsule.status === "collecting";
    if (activeTab === "completed") return capsule.status === "delivered";
    return true;
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-muted/30">
      {/* Header */}
      <header className="h-14 border-b border-border/40 bg-background/80 backdrop-blur-sm flex items-center justify-between px-6">
        <span className="text-lg font-bold text-primary">To.orange</span>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <span className="font-semibold text-foreground">타임캡슐</span>
        </div>
        <button onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          편지함으로
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-lg mx-auto space-y-6">
          {/* 상단 타이틀 + CTA */}
          <section className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">타임캡슐</h1>
              <p className="text-muted-foreground">여러 사람의 마음을 모아, 특별한 날에 전해요</p>
            </div>
            <Button 
              onClick={() => navigate("/time-capsule/create")}
              className="bg-primary hover:bg-primary/90 shadow-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              새 타임캡슐
            </Button>
          </section>

          {/* 타임캡슐이란? */}
          <section className="bg-gradient-to-br from-primary/10 to-amber-100/50 rounded-3xl p-6 border border-primary/20">
            <button 
              onClick={() => setIsExplanationOpen(!isExplanationOpen)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-background rounded-xl flex items-center justify-center shadow-sm">
                  <HelpCircle className="w-5 h-5 text-primary" />
                </div>
                <span className="font-semibold text-foreground">타임캡슐이란?</span>
              </div>
              <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${isExplanationOpen ? "" : "-rotate-180"}`} />
            </button>

            <AnimatePresence>
              {isExplanationOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-5 mt-5 border-t border-primary/20">
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      가족과 지인이 <span className="text-primary font-medium">함께 편지를 모아</span><br />
                      출소일, 생일, 기념일 등 소중한 날에 한꺼번에 전달합니다.<br />
                      흩어진 응원이 하나의 선물이 됩니다.
                    </p>

                    {/* 3단계 플로우 */}
                    <div className="flex items-start justify-between gap-2">
                      {/* Step 1 */}
                      <div className="flex-1 text-center">
                        <div className="w-12 h-12 bg-background rounded-2xl flex items-center justify-center shadow-sm mx-auto mb-3">
                          <Plus className="w-6 h-6 text-primary" />
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">STEP 1</p>
                        <p className="text-sm font-medium text-foreground">캡슐 만들기</p>
                        <p className="text-xs text-muted-foreground mt-1">전달할 날짜와<br />참여자를 정해요</p>
                      </div>

                      <ChevronRight className="w-4 h-4 text-primary/40 mt-6" />

                      {/* Step 2 */}
                      <div className="flex-1 text-center">
                        <div className="w-12 h-12 bg-background rounded-2xl flex items-center justify-center shadow-sm mx-auto mb-3">
                          <Users className="w-6 h-6 text-primary" />
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">STEP 2</p>
                        <p className="text-sm font-medium text-foreground">함께 편지 쓰기</p>
                        <p className="text-xs text-muted-foreground mt-1">초대받은 사람들이<br />각자 마음을 담아요</p>
                      </div>

                      <ChevronRight className="w-4 h-4 text-primary/40 mt-6" />

                      {/* Step 3 */}
                      <div className="flex-1 text-center">
                        <div className="w-12 h-12 bg-background rounded-2xl flex items-center justify-center shadow-sm mx-auto mb-3">
                          <Gift className="w-6 h-6 text-primary" />
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">STEP 3</p>
                        <p className="text-sm font-medium text-foreground">특별한 날 전달</p>
                        <p className="text-xs text-muted-foreground mt-1">모인 편지가<br />한꺼번에 전달돼요</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* 참여 요청 */}
          {mockInvitations.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="font-semibold text-foreground">참여 요청</h2>
                <span className="animate-pulse px-2 py-0.5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full">
                  {mockInvitations.length}
                </span>
              </div>

              {mockInvitations.map((invitation) => (
                <motion.div
                  key={invitation.id}
                  whileHover={{ y: -2 }}
                  onClick={() => navigate(`/time-capsule/${invitation.id}`)}
                  className="bg-background rounded-2xl p-5 border-2 border-primary/30 shadow-sm cursor-pointer hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Home className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {invitation.isNew && (
                          <span className="px-2 py-0.5 bg-destructive/10 text-destructive text-xs font-bold rounded">NEW</span>
                        )}
                        <span className="text-sm font-bold text-primary">D-{invitation.daysLeft}</span>
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{invitation.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{invitation.invitedBy}가 초대함</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Progress value={(invitation.letterCount / invitation.targetLetters) * 100} className="h-1.5 w-24" />
                          <span className="text-xs text-muted-foreground">{invitation.letterCount}/{invitation.targetLetters}통</span>
                          {!invitation.myLetterWritten && (
                            <span className="text-xs text-primary font-medium">(내 편지 미작성)</span>
                          )}
                        </div>
                        <span className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg">편지 쓰기</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </section>
          )}

          {/* 내 타임캡슐 */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">내 타임캡슐</h2>
            </div>

            {/* 탭 */}
            <div className="flex gap-1 mb-4 bg-muted rounded-xl p-1">
              {[
                { id: "all", label: "전체" },
                { id: "collecting", label: "진행중" },
                { id: "completed", label: "완료" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id 
                      ? "bg-background text-primary shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredCapsules.map((capsule) => {
                const IconComponent = capsule.icon;
                return (
                  <motion.div
                    key={capsule.id}
                    whileHover={{ y: -2 }}
                    onClick={() => navigate(`/time-capsule/${capsule.id}`)}
                    className={`bg-background rounded-2xl p-5 border border-border/60 shadow-sm cursor-pointer hover:shadow-md transition-all ${
                      capsule.status === "delivered" ? "opacity-80" : ""
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 ${capsule.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <IconComponent className={`w-5 h-5 ${capsule.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-foreground">{capsule.title}</h3>
                          {capsule.status === "collecting" ? (
                            <span className="text-sm font-bold text-primary">D-{capsule.daysLeft}</span>
                          ) : (
                            <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs font-medium rounded">전달완료</span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {capsule.status === "collecting" 
                            ? `To. ${capsule.recipient} · ${capsule.facility}`
                            : `${capsule.deliveredDate} 전달 · ${capsule.letterCount}통의 편지`
                          }
                        </p>
                        {capsule.status === "collecting" && (
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Progress value={(capsule.letterCount / capsule.targetLetters!) * 100} className="h-1.5 w-20" />
                              <span className="text-xs text-muted-foreground">{capsule.letterCount}/{capsule.targetLetters}통</span>
                            </div>
                            <div className="flex -space-x-2">
                              {capsule.contributors?.map((emoji, idx) => (
                                <div key={idx} className="w-6 h-6 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-xs">
                                  {emoji}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground/50 flex-shrink-0" />
                    </div>
                  </motion.div>
                );
              })}

              {/* 새 타임캡슐 만들기 카드 */}
              <motion.div
                whileHover={{ y: -2 }}
                onClick={() => navigate("/time-capsule/create")}
                className="bg-muted/50 hover:bg-primary/5 rounded-2xl p-5 border-2 border-dashed border-muted-foreground/30 hover:border-primary/40 transition-colors cursor-pointer"
              >
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="w-12 h-12 bg-background rounded-xl flex items-center justify-center shadow-sm mb-3">
                    <Plus className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-medium text-foreground">새 타임캡슐 만들기</p>
                  <p className="text-sm text-muted-foreground mt-1">특별한 날을 위해 편지를 모아보세요</p>
                </div>
              </motion.div>
            </div>
          </section>

          {/* 초대 코드 입력 */}
          <section className="bg-background rounded-2xl p-6 border border-border/60 shadow-sm">
            <h3 className="font-semibold text-foreground mb-4">초대 코드로 참여</h3>
            <div className="flex gap-3">
              <Input 
                type="text" 
                placeholder="초대 코드 입력"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="flex-1"
              />
              <Button variant="secondary" className="px-6 bg-foreground text-background hover:bg-foreground/90">
                참여하기
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
