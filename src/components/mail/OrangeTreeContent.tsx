import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Leaf, Calendar, ChevronRight, Plus,
  Home, Scale, Users, GraduationCap,
  Heart, PenLine, ChevronDown, Cake,
  Briefcase, Stethoscope, TreeDeciduous,
  Loader2, HelpCircle
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

// SVG 일러스트 컴포넌트들
const SeedSvgIcon = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <ellipse cx="24" cy="26" rx="14" ry="16" fill="#C4956A"/>
    <ellipse cx="24" cy="24" rx="12" ry="14" fill="#D4A574"/>
    <ellipse cx="19" cy="21" rx="4" ry="5" fill="#E8C4A0" opacity="0.5"/>
  </svg>
);

const SproutSvgIcon = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <ellipse cx="24" cy="42" rx="8" ry="4" fill="#8B7355" opacity="0.3"/>
    <path d="M24 40 L24 28" stroke="#7CB342" strokeWidth="4" strokeLinecap="round"/>
    <ellipse cx="24" cy="20" rx="8" ry="10" fill="#8BC34A"/>
    <ellipse cx="21" cy="17" rx="3" ry="4" fill="#AED581" opacity="0.6"/>
    <path d="M32 22 Q36 18 34 14" stroke="#7CB342" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <ellipse cx="35" cy="13" rx="3" ry="4" fill="#8BC34A" transform="rotate(-30 35 13)"/>
  </svg>
);

const YoungTreeSvgIcon = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <ellipse cx="24" cy="44" rx="10" ry="4" fill="#8B7355" opacity="0.3"/>
    <path d="M24 43 L24 24" stroke="#6B8E23" strokeWidth="4" strokeLinecap="round"/>
    <ellipse cx="14" cy="18" rx="6" ry="9" fill="#8BC34A"/>
    <ellipse cx="24" cy="12" rx="8" ry="10" fill="#7CB342"/>
    <ellipse cx="34" cy="18" rx="6" ry="9" fill="#8BC34A"/>
    <ellipse cx="21" cy="10" rx="3" ry="4" fill="#AED581" opacity="0.5"/>
    <ellipse cx="12" cy="15" rx="2" ry="3" fill="#AED581" opacity="0.5"/>
  </svg>
);

const FullTreeSvgIcon = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <ellipse cx="24" cy="45" rx="12" ry="4" fill="#8B7355" opacity="0.3"/>
    <path d="M24 44 L24 26" stroke="#5D4037" strokeWidth="5" strokeLinecap="round"/>
    <path d="M24 36 L16 30" stroke="#5D4037" strokeWidth="3" strokeLinecap="round"/>
    <path d="M24 32 L32 26" stroke="#5D4037" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="24" cy="18" r="14" fill="#4CAF50"/>
    <circle cx="24" cy="16" r="11" fill="#66BB6A"/>
    <circle cx="19" cy="13" r="4" fill="#81C784" opacity="0.6"/>
  </svg>
);

const FruitTreeSvgIcon = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <ellipse cx="24" cy="45" rx="12" ry="4" fill="#8B7355" opacity="0.3"/>
    <path d="M24 44 L24 26" stroke="#5D4037" strokeWidth="5" strokeLinecap="round"/>
    <path d="M24 36 L16 30" stroke="#5D4037" strokeWidth="3" strokeLinecap="round"/>
    <path d="M24 32 L32 26" stroke="#5D4037" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="24" cy="18" r="14" fill="#4CAF50"/>
    <circle cx="24" cy="16" r="11" fill="#66BB6A"/>
    <circle cx="12" cy="20" r="5" fill="#FF6B35"/>
    <circle cx="12" cy="19" r="4" fill="#FF8A50"/>
    <ellipse cx="12" cy="16" rx="1.5" ry="1" fill="#7CB342"/>
    <circle cx="32" cy="12" r="5" fill="#FF6B35"/>
    <circle cx="32" cy="11" r="4" fill="#FF8A50"/>
    <ellipse cx="32" cy="8" rx="1.5" ry="1" fill="#7CB342"/>
    <circle cx="22" cy="6" r="4" fill="#FF6B35"/>
    <circle cx="22" cy="5" r="3" fill="#FF8A50"/>
    <ellipse cx="22" cy="2" rx="1" ry="0.8" fill="#7CB342"/>
  </svg>
);

// 레벨에 따른 SVG 아이콘 반환
const getSvgIconByLevel = (level: number) => {
  switch (level) {
    case 1: return SeedSvgIcon;
    case 2: return SproutSvgIcon;
    case 3: return YoungTreeSvgIcon;
    case 4: return FullTreeSvgIcon;
    case 5: return FruitTreeSvgIcon;
    default: return SeedSvgIcon;
  }
};

interface OrangeTreeContentProps {
  onClose: () => void;
  onCompose?: () => void;
}

// 소중한 날들 타입별 아이콘 및 색상 매핑 - 통일된 그레이 배경 + 오렌지 라인 아이콘
const specialDayStyles: Record<SpecialDay["type"], { 
  icon: React.ReactNode; 
  bg: string; 
  iconColor: string;
  label: string;
}> = {
  release: { 
    icon: <Home className="w-4 h-4" strokeWidth={1.5} />, 
    bg: "bg-gray-100", 
    iconColor: "text-primary",
    label: "출소"
  },
  parole: { 
    icon: <Home className="w-4 h-4" strokeWidth={1.5} />, 
    bg: "bg-gray-100", 
    iconColor: "text-primary",
    label: "가석방"
  },
  birthday: { 
    icon: <Cake className="w-4 h-4" strokeWidth={1.5} />, 
    bg: "bg-gray-100", 
    iconColor: "text-primary",
    label: "생일"
  },
  anniversary: { 
    icon: <Heart className="w-4 h-4" strokeWidth={1.5} />, 
    bg: "bg-gray-100", 
    iconColor: "text-primary",
    label: "기념일"
  },
  visit: { 
    icon: <Users className="w-4 h-4" strokeWidth={1.5} />, 
    bg: "bg-gray-100", 
    iconColor: "text-primary",
    label: "면회"
  },
  trial: { 
    icon: <Scale className="w-4 h-4" strokeWidth={1.5} />, 
    bg: "bg-gray-100", 
    iconColor: "text-primary",
    label: "재판"
  },
  education: { 
    icon: <GraduationCap className="w-4 h-4" strokeWidth={1.5} />, 
    bg: "bg-gray-100", 
    iconColor: "text-primary",
    label: "교육"
  },
  other: { 
    icon: <Calendar className="w-4 h-4" strokeWidth={1.5} />, 
    bg: "bg-gray-100", 
    iconColor: "text-primary",
    label: "기타"
  },
};

// 소중한 날들 아이콘 컴포넌트
const SpecialDayIcon = ({ type }: { type: SpecialDay["type"] }) => {
  const style = specialDayStyles[type] || specialDayStyles.other;
  return (
    <div className={`w-9 h-9 rounded-xl ${style.bg} flex items-center justify-center`}>
      <span className={style.iconColor}>{style.icon}</span>
    </div>
  );
};

// 잎사귀 아이콘 컴포넌트 - 그레이 배경 + 오렌지 라인
const LeafIcon = () => (
  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
    <Leaf className="w-4 h-4 text-primary" strokeWidth={1.5} />
  </div>
);

// 열매(오렌지) 아이콘 컴포넌트 - 그레이 배경 + 오렌지 라인
const OrangeIcon = ({ size = "md" }: { size?: "sm" | "md" }) => {
  const sizeClasses = size === "sm" ? "w-6 h-6" : "w-8 h-8";
  const iconSize = size === "sm" ? "w-3 h-3" : "w-4 h-4";
  return (
    <div className={`${sizeClasses} rounded-lg bg-gray-100 flex items-center justify-center`}>
      <svg viewBox="0 0 24 24" className={iconSize} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="13" r="7" className="text-primary" />
        <path d="M12 6V4" className="text-primary" />
        <path d="M12 4c1 0 2-1 2-2" className="text-green-500" />
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
  const navigate = useNavigate();

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
      <header className="h-14 border-b border-border/40 bg-white flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <TreeDeciduous className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-bold text-foreground">오렌지 나무</h1>
        </div>

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

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/about/orange-tree")}
            className="text-primary hover:text-primary/80 hover:bg-primary/10 gap-1"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="text-sm">소개</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-muted-foreground">
            편지함
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-3 md:p-4">
        <div className="space-y-3">
          
          {/* 편지 발송 유도 배너 - 강조 */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400 p-4 shadow-lg"
          >
            {/* 배경 패턴 */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="relative flex items-center gap-4">
              <motion.div
                className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center"
                animate={{ rotate: [0, -5, 5, -5, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
              >
                <PenLine className="w-6 h-6 text-white" strokeWidth={2} />
              </motion.div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-white">
                  이번 주 아직 편지를 보내지 않았어요
                </p>
                <p className="text-sm text-white/80 mt-1">
                  바쁜 일상 속 편지 한 통이 {selectedTree.personName}에게 큰 의지가 됩니다
                </p>
              </div>
              <Button
                size="lg"
                onClick={onCompose}
                className="bg-white hover:bg-white/90 text-orange-600 font-semibold flex-shrink-0 shadow-md px-6"
              >
                <PenLine className="w-4 h-4 mr-2" />
                편지 쓰기
              </Button>
            </div>
          </motion.div>

          {/* 메인 나무 카드 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden"
          >
            {/* 상단 정보 */}
            <div className="p-4 pb-0">
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
            <div className="flex flex-col items-center py-4">
              {(() => {
                const SvgIcon = getSvgIconByLevel(currentStage.level);
                return (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    <SvgIcon className="w-40 h-40" />
                  </motion.div>
                );
              })()}

              {/* 레벨 뱃지 */}
              <span className="mt-3 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                Lv.{currentStage.level}
              </span>

              {/* 나무 이름 */}
              <h3 className="mt-1.5 text-xl font-bold text-foreground">{currentStage.name}</h3>

              {/* 상태 메시지 */}
              <p className="mt-1 text-sm text-muted-foreground text-center px-8 leading-relaxed">
                {currentStage.message}
              </p>

              {/* 진행 바 */}
              {nextStageInfo.nextStage && (
                <div className="w-full max-w-xs mt-4 px-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                    <span>Lv.{currentStage.level} {currentStage.name}</span>
                    <span>Lv.{nextStageInfo.nextStage.level} {nextStageInfo.nextStage.name}</span>
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                  <p className="text-center text-sm text-primary font-medium mt-2">
                    {nextStageInfo.nextStage.name}까지 {nextStageInfo.lettersRemaining}통 남음
                  </p>
                </div>
              )}

              {/* 편지 쓰기 버튼 */}
              <Button
                onClick={onCompose}
                className="mt-4 bg-primary hover:bg-primary/90 text-white px-8"
              >
                <PenLine className="w-4 h-4 mr-2" />
                편지 쓰기
              </Button>
            </div>

            {/* 하단 통계 (잎사귀 + 열매) */}
            <div className="grid grid-cols-2 border-t border-border/40 bg-gradient-to-b from-white to-gray-50/50">
              <div className="p-3 text-center border-r border-border/40">
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
              <div className="p-3 text-center">
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
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
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
                        <p className={`text-sm font-semibold ${daysRemaining <= 0 ? 'text-green-500' : daysRemaining <= 7 ? 'text-primary' : 'text-foreground'}`}>
                          {daysRemaining === 0 ? 'D-Day' : daysRemaining > 0 ? `D-${daysRemaining}` : `D+${Math.abs(daysRemaining)}`}
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
            <div className="px-4 py-3 flex items-center justify-between">
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