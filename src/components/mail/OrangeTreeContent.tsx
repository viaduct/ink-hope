import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Leaf, Calendar, ChevronRight, Plus, 
  Home, Scale, Users, GraduationCap,
  Heart, PenLine, ChevronDown, Cake, 
  Briefcase, Stethoscope, TreeDeciduous,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddSpecialDayModal } from "./AddSpecialDayModal";
import { SpecialDayDetailModal } from "./SpecialDayDetailModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useOrangeTrees, OrangeTreeDB } from "@/hooks/useOrangeTrees";
import { useSpecialDays, SpecialDayDB } from "@/hooks/useSpecialDays";
import { 
  orangeTrees as mockOrangeTrees, 
  specialDays as mockSpecialDays, 
  recentActivities, 
  growthStages, 
  getGrowthStage, 
  getLettersToNextStage 
} from "@/data/mockData";
import type { SpecialDay, OrangeTree } from "@/types/mail";

interface OrangeTreeContentProps {
  onClose: () => void;
  onCompose?: () => void;
}

// 소중한 날들 타입별 아이콘 및 색상 매핑
const specialDayStyles: Record<SpecialDay["type"], { 
  icon: React.ReactNode; 
  bg: string; 
  iconColor: string;
  label: string;
}> = {
  release: { 
    icon: <Home className="w-4 h-4" />, 
    bg: "bg-gradient-to-br from-orange-100 to-amber-100", 
    iconColor: "text-orange-600",
    label: "출소"
  },
  parole: { 
    icon: <Home className="w-4 h-4" />, 
    bg: "bg-gradient-to-br from-orange-100 to-amber-100", 
    iconColor: "text-orange-600",
    label: "가석방"
  },
  birthday: { 
    icon: <Cake className="w-4 h-4" />, 
    bg: "bg-gradient-to-br from-pink-100 to-rose-100", 
    iconColor: "text-pink-600",
    label: "생일"
  },
  anniversary: { 
    icon: <Heart className="w-4 h-4" />, 
    bg: "bg-gradient-to-br from-red-100 to-pink-100", 
    iconColor: "text-red-500",
    label: "기념일"
  },
  visit: { 
    icon: <Users className="w-4 h-4" />, 
    bg: "bg-gradient-to-br from-blue-100 to-sky-100", 
    iconColor: "text-blue-600",
    label: "면회"
  },
  trial: { 
    icon: <Scale className="w-4 h-4" />, 
    bg: "bg-gradient-to-br from-slate-100 to-gray-100", 
    iconColor: "text-slate-600",
    label: "재판"
  },
  education: { 
    icon: <GraduationCap className="w-4 h-4" />, 
    bg: "bg-gradient-to-br from-purple-100 to-violet-100", 
    iconColor: "text-purple-600",
    label: "교육"
  },
  other: { 
    icon: <Calendar className="w-4 h-4" />, 
    bg: "bg-gradient-to-br from-gray-100 to-slate-100", 
    iconColor: "text-gray-600",
    label: "기타"
  },
};

// 소중한 날들 아이콘 컴포넌트
const SpecialDayIcon = ({ type }: { type: SpecialDay["type"] }) => {
  const style = specialDayStyles[type] || specialDayStyles.other;
  return (
    <div className={`w-9 h-9 rounded-xl ${style.bg} flex items-center justify-center shadow-sm`}>
      <span className={style.iconColor}>{style.icon}</span>
    </div>
  );
};

// 잎사귀 아이콘 컴포넌트
const LeafIcon = () => (
  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-sm">
    <Leaf className="w-4 h-4 text-white" />
  </div>
);

// 열매(오렌지) 아이콘 컴포넌트
const OrangeIcon = ({ size = "md" }: { size?: "sm" | "md" }) => {
  const sizeClasses = size === "sm" ? "w-6 h-6" : "w-8 h-8";
  const iconSize = size === "sm" ? "w-3 h-3" : "w-4 h-4";
  return (
    <div className={`${sizeClasses} rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-sm relative`}>
      <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1.5 bg-green-500 rounded-full" />
      <svg viewBox="0 0 24 24" fill="none" className={iconSize}>
        <circle cx="12" cy="12" r="8" fill="white" fillOpacity="0.3" />
      </svg>
    </div>
  );
};

// 나무 아이콘 컴포넌트 (헤더용)
const TreeIcon = () => (
  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center shadow-sm">
    <TreeDeciduous className="w-4 h-4 text-white" />
  </div>
);

// D-Day 계산
const getDaysRemaining = (dateStr: string): number => {
  const targetDate = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);
  return Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

export function OrangeTreeContent({ onClose, onCompose }: OrangeTreeContentProps) {
  // DB에서 나무 데이터 가져오기
  const { orangeTrees: dbTrees, isLoading: treesLoading } = useOrangeTrees();
  
  // DB 데이터가 있으면 사용, 없으면 mock 데이터 사용
  const orangeTrees: OrangeTree[] = useMemo(() => {
    if (dbTrees.length > 0) {
      return dbTrees.map((tree: OrangeTreeDB) => ({
        id: tree.id,
        personId: tree.family_member_id,
        personName: tree.person_name,
        relation: tree.relation,
        sentLetters: tree.sent_letters,
        receivedLetters: tree.received_letters,
        totalLetters: tree.total_letters || (tree.sent_letters + tree.received_letters),
        createdAt: tree.created_at,
        isArchived: tree.is_archived,
        facility: "",
        prisonerNumber: "",
      }));
    }
    return mockOrangeTrees;
  }, [dbTrees]);

  const [selectedTreeId, setSelectedTreeId] = useState("");
  const [showAddDayModal, setShowAddDayModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<SpecialDay | null>(null);

  // DB에서 소중한 날들 가져오기
  const { specialDays: dbSpecialDays, isLoading: daysLoading } = useSpecialDays(selectedTreeId || undefined);
  
  // 선택된 트리 ID 초기화
  useMemo(() => {
    if (orangeTrees.length > 0 && !selectedTreeId) {
      setSelectedTreeId(orangeTrees[0].id);
    }
  }, [orangeTrees, selectedTreeId]);

  // 소중한 날들 데이터
  const specialDays: SpecialDay[] = useMemo(() => {
    if (dbSpecialDays.length > 0) {
      return dbSpecialDays.map((day: SpecialDayDB) => ({
        id: day.id,
        treeId: day.tree_id,
        type: day.type as SpecialDay["type"],
        title: day.title,
        date: day.date,
        description: day.description || undefined,
        isGolden: day.is_golden,
      }));
    }
    return mockSpecialDays.filter(d => d.treeId === selectedTreeId);
  }, [dbSpecialDays, selectedTreeId]);

  // 선택된 나무
  const selectedTree = useMemo(() => 
    orangeTrees.find(t => t.id === selectedTreeId) || orangeTrees[0],
    [selectedTreeId, orangeTrees]
  );

  // 현재 성장 단계
  const currentStage = useMemo(() => 
    getGrowthStage(selectedTree?.totalLetters || 0),
    [selectedTree?.totalLetters]
  );

  // 다음 단계 정보
  const nextStageInfo = useMemo(() => 
    getLettersToNextStage(selectedTree?.totalLetters || 0),
    [selectedTree?.totalLetters]
  );

  // 선택된 나무의 소중한 날들 (가까운 순 3개)
  const treeSpecialDays = useMemo(() => {
    const days = specialDays
      .filter(d => d.treeId === selectedTreeId)
      .sort((a, b) => getDaysRemaining(a.date) - getDaysRemaining(b.date))
      .slice(0, 3);
    return days;
  }, [selectedTreeId, specialDays]);

  // 모든 소중한 날들
  const allTreeSpecialDays = useMemo(() => 
    specialDays.filter(d => d.treeId === selectedTreeId),
    [selectedTreeId, specialDays]
  );

  const handleDayClick = (day: SpecialDay) => {
    setSelectedDay(day);
    setShowDetailModal(true);
  };

  const handleWriteLetterFromDetail = () => {
    setShowDetailModal(false);
    onCompose?.();
  };

  // 진행률 계산
  const progressPercent = useMemo(() => {
    if (!nextStageInfo.nextStage || !selectedTree) return 100;
    const currentMin = currentStage.minLetters;
    const nextMin = nextStageInfo.nextStage.minLetters;
    const progress = ((selectedTree.totalLetters - currentMin) / (nextMin - currentMin)) * 100;
    return Math.min(100, Math.max(0, progress));
  }, [selectedTree?.totalLetters, currentStage, nextStageInfo]);

  // 로딩 상태
  if (treesLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!selectedTree || orangeTrees.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-background gap-4">
        <TreeDeciduous className="w-16 h-16 text-muted-foreground/50" />
        <p className="text-muted-foreground">소중한 사람을 추가하면 오렌지나무가 함께 생겨요</p>
        <Button onClick={onClose} variant="outline">
          편지함으로 돌아가기
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50">
      {/* Header */}
      <header className="h-14 border-b border-border/40 bg-white flex items-center justify-between px-6">
        <span className="text-lg font-bold text-primary">To.orange</span>
        
        {/* 나무 선택 드롭다운 (중앙) */}
        <Select value={selectedTreeId} onValueChange={setSelectedTreeId}>
          <SelectTrigger className="w-auto h-9 gap-2 border border-border bg-white font-medium px-4 rounded-full shadow-sm hover:shadow transition-shadow [&>svg:last-child]:hidden">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center">
              <TreeDeciduous className="w-3 h-3 text-white" />
            </div>
            <SelectValue />
            <ChevronDown className="w-4 h-4 text-muted-foreground ml-1" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {orangeTrees.map((tree) => (
              <SelectItem key={tree.id} value={tree.id}>
                {tree.relation}와의 나무
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="ghost" size="sm" onClick={onClose} className="text-muted-foreground">
          편지함으로
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-lg mx-auto space-y-4">
          
          {/* 편지 발송 유도 배너 */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200/60 p-4"
          >
            <motion.div 
              className="flex-shrink-0"
              animate={{ rotate: [0, -5, 5, -5, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
            >
              <OrangeIcon size="md" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">
                이번 주 아직 편지를 보내지 않았어요
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                바쁜 일상 속 편지 한 통이 {selectedTree.personName}에게 큰 의지가 됩니다
              </p>
            </div>
            <Button 
              size="sm" 
              onClick={onCompose}
              className="bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-white flex-shrink-0 shadow-sm"
            >
              <PenLine className="w-4 h-4 mr-1" />
              편지 쓰기
            </Button>
          </motion.div>

          {/* 메인 나무 카드 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden"
          >
            {/* 상단 정보 */}
            <div className="p-5 pb-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{selectedTree.relation}와의 오렌지나무</p>
                  <h2 className="text-xl font-bold text-foreground">{selectedTree.personName}</h2>
                  <p className="text-sm text-muted-foreground">{selectedTree.facility}</p>
                </div>
                {selectedTree.daysRemaining && (
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary/10 to-orange-100 flex items-center justify-center">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="font-bold text-primary">D-{selectedTree.daysRemaining}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">출소 예정일</p>
                  </div>
                )}
              </div>
            </div>

            {/* 나무 일러스트 중앙 배치 */}
            <div className="flex flex-col items-center py-8">
              <motion.img 
                src={currentStage.icon} 
                alt={currentStage.name}
                className="w-36 h-36 object-contain"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              />
              
              {/* 레벨 뱃지 */}
              <span className="mt-4 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                Lv.{currentStage.level}
              </span>
              
              {/* 나무 이름 */}
              <h3 className="mt-2 text-xl font-bold text-foreground">{currentStage.name}</h3>
              
              {/* 상태 메시지 */}
              <p className="mt-1 text-sm text-muted-foreground text-center px-8 leading-relaxed">
                {currentStage.message}
              </p>

              {/* 진행 바 */}
              {nextStageInfo.nextStage && (
                <div className="w-full max-w-xs mt-6 px-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-2">
                    <span>Lv.{currentStage.level} {currentStage.name}</span>
                    <span>Lv.{nextStageInfo.nextStage.level} {nextStageInfo.nextStage.name}</span>
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                  <p className="text-center text-sm text-primary font-medium mt-3">
                    {nextStageInfo.nextStage.name}까지 {nextStageInfo.lettersRemaining}통 남음
                  </p>
                </div>
              )}

              {/* 편지 쓰기 버튼 */}
              <Button 
                onClick={onCompose}
                className="mt-6 bg-primary hover:bg-primary/90 text-white px-8"
              >
                <PenLine className="w-4 h-4 mr-2" />
                편지 쓰기
              </Button>
            </div>

            {/* 하단 통계 (잎사귀 + 열매) */}
            <div className="grid grid-cols-2 border-t border-border/40 bg-gradient-to-b from-white to-gray-50/50">
              <div className="p-4 text-center border-r border-border/40">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <LeafIcon />
                  <span className="text-2xl font-bold text-foreground">{selectedTree.totalLetters}</span>
                  <span className="text-sm text-muted-foreground">장</span>
                </div>
                <p className="text-xs text-muted-foreground">잎사귀</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  보낸 {selectedTree.sentLetters} · 받은 {selectedTree.receivedLetters}
                </p>
              </div>
              <div className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <OrangeIcon size="md" />
                  <span className="text-2xl font-bold text-foreground">{allTreeSpecialDays.length}</span>
                  <span className="text-sm text-muted-foreground">개</span>
                </div>
                <p className="text-xs text-muted-foreground">열매</p>
                <p className="text-xs text-muted-foreground mt-0.5">소중한 날들</p>
              </div>
            </div>
          </motion.div>

          {/* 소중한 날들 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden"
          >
            <div className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <OrangeIcon size="sm" />
                <h3 className="font-semibold text-foreground">소중한 날들</h3>
              </div>
              <button 
                onClick={() => setShowAddDayModal(true)}
                className="text-sm text-primary font-medium flex items-center gap-1 hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                새 날짜 추가
              </button>
            </div>
            
            <div className="divide-y divide-border/40">
              {treeSpecialDays.length > 0 ? (
                treeSpecialDays.map((day) => {
                  const daysRemaining = getDaysRemaining(day.date);
                  
                  return (
                    <div
                      key={day.id}
                      className="px-5 py-3 flex items-center gap-3 hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => handleDayClick(day)}
                    >
                      <SpecialDayIcon type={day.type} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm">{day.title}</p>
                        <p className="text-xs text-muted-foreground">{day.date}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={`text-sm font-semibold ${daysRemaining <= 7 ? 'text-primary' : 'text-foreground'}`}>
                          D-{daysRemaining}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(specialDayStyles[day.type] || specialDayStyles.other).label}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center">
                  <p className="text-sm text-muted-foreground">등록된 소중한 날이 없어요</p>
                </div>
              )}
            </div>
            
            {allTreeSpecialDays.length > 3 && (
              <div className="py-3 text-center border-t border-border/40">
                <button className="text-sm text-muted-foreground hover:text-foreground">
                  {allTreeSpecialDays.length - 3}개 더보기
                </button>
              </div>
            )}
          </motion.div>

          {/* 최근 활동 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden"
          >
            <div className="px-5 py-4 flex items-center justify-between">
              <h3 className="font-semibold text-foreground">최근 활동</h3>
              <button className="text-sm text-muted-foreground hover:text-foreground">
                모두 보기
              </button>
            </div>
            
            <div className="divide-y divide-border/40">
              {recentActivities.slice(0, 2).map((activity) => (
                <div key={activity.id} className="px-5 py-3 flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    activity.type === "sent" 
                      ? "bg-gradient-to-br from-orange-100 to-amber-100" 
                      : "bg-gradient-to-br from-green-100 to-emerald-100"
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === "sent" ? "bg-orange-500" : "bg-green-500"
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm">
                      <span className="font-medium text-foreground">
                        {activity.type === "sent" ? "편지 발송" : "편지 수신"}
                      </span>
                      <span className="text-muted-foreground ml-1">
                        {activity.type === "sent" ? `${activity.personName}에게` : `${activity.personName}로부터`}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      activity.type === "sent" 
                        ? "bg-orange-100 text-orange-600" 
                        : "bg-green-100 text-green-600"
                    }`}>
                      {activity.status}
                    </span>
                    <span className="text-xs text-muted-foreground">{activity.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>

      {/* 모달들 */}
      <AddSpecialDayModal
        isOpen={showAddDayModal}
        onClose={() => setShowAddDayModal(false)}
        onAdd={(newDay) => {
          console.log("New special day added:", newDay);
          setShowAddDayModal(false);
        }}
      />

      {selectedDay && (
        <SpecialDayDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          specialDay={{
            id: parseInt(selectedDay.id.replace(/\D/g, '') || '0'),
            type: selectedDay.type,
            title: selectedDay.title,
            date: selectedDay.date,
            description: selectedDay.description || ""
          }}
          onWriteLetter={handleWriteLetterFromDetail}
        />
      )}
    </div>
  );
}