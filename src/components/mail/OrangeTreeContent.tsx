import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Leaf, Calendar, ChevronRight, Plus,
  Home, Scale, Users, GraduationCap,
  Heart, PenLine, ChevronDown, Cake,
  Briefcase, Stethoscope, TreeDeciduous,
  Loader2, HelpCircle, Droplets, Sun, Sparkles
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

// 나무 잎 하나 컴포넌트 - 더 둥근 잎 형태
const TreeLeaf = ({
  x, y, rotation, delay, scale = 1, color = "#6BAF7C"
}: {
  x: number; y: number; rotation: number; delay: number; scale?: number; color?: string
}) => (
  <motion.g
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay, duration: 0.3, type: "spring", stiffness: 300 }}
  >
    {/* 메인 잎 */}
    <ellipse
      cx={x}
      cy={y}
      rx={10 * scale}
      ry={12 * scale}
      fill={color}
      transform={`rotate(${rotation} ${x} ${y})`}
    />
    {/* 하이라이트 */}
    <ellipse
      cx={x - 2 * scale}
      cy={y - 2 * scale}
      rx={6 * scale}
      ry={7 * scale}
      fill={color === "#6BAF7C" ? "#8BC99B" : "#7FC48F"}
      transform={`rotate(${rotation} ${x} ${y})`}
      opacity={0.6}
    />
  </motion.g>
);

// 오렌지 열매 컴포넌트 - 더 크고 예쁘게
const OrangeFruit = ({ x, y, delay, size = 1 }: { x: number; y: number; delay: number; size?: number }) => (
  <motion.g
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay, duration: 0.4, type: "spring", stiffness: 200 }}
  >
    {/* 그림자 */}
    <ellipse cx={x + 2} cy={y + 2} rx={10 * size} ry={9 * size} fill="#00000015"/>
    {/* 오렌지 본체 */}
    <circle cx={x} cy={y} r={10 * size} fill="#FF8C42"/>
    {/* 하이라이트 */}
    <circle cx={x - 3 * size} cy={y - 3 * size} r={6 * size} fill="#FFA559" opacity={0.8}/>
    <circle cx={x - 4 * size} cy={y - 4 * size} r={3 * size} fill="#FFD59E" opacity={0.5}/>
    {/* 꼭지 */}
    <ellipse cx={x} cy={y - 9 * size} rx={3 * size} ry={2 * size} fill="#5B9A6F"/>
    <rect x={x - 1} y={y - 12 * size} width={2} height={4} fill="#8B6914" rx={1}/>
  </motion.g>
);

// 성장하는 나무 일러스트 (레퍼런스 기반 - 뿌리 + 가지 + 잎)
const GrowingTreeSvg = ({
  letterCount,
  className = "w-64 h-64"
}: {
  letterCount: number;
  className?: string
}) => {
  // 성장 단계 계산
  const growthProgress = Math.min(1, letterCount / 30); // 0~1 (30통 기준)
  const trunkHeight = 60 + growthProgress * 50; // 줄기 높이
  const branchScale = Math.min(1, letterCount / 8); // 8통 이상이면 가지 완전 표시

  // 잎 개수 계산 (편지당 2개, 최대 50개)
  const leafCount = Math.min(50, Math.floor(letterCount * 2));

  // 오렌지 개수 (15통 이상부터, 최대 7개)
  const orangeCount = letterCount >= 15 ? Math.min(7, Math.floor((letterCount - 15) / 2) + 1) : 0;

  // 잎 위치를 고정된 시드로 생성 (리렌더링 시 위치 유지)
  const generateLeaves = () => {
    const leaves: Array<{ x: number; y: number; rotation: number; delay: number; scale: number; color: string }> = [];
    const colors = ["#5B9A6F", "#6BAF7C", "#7FC48F", "#5AAD6A"];

    // 중앙 상단 영역 (나무 수관 중앙)
    const centerLeaves = Math.min(15, leafCount);
    for (let i = 0; i < centerLeaves; i++) {
      const angle = (i / centerLeaves) * Math.PI * 2;
      const radius = 15 + (i % 3) * 12;
      leaves.push({
        x: 150 + Math.cos(angle) * radius,
        y: 75 + Math.sin(angle) * radius * 0.6,
        rotation: angle * (180 / Math.PI) + 90,
        delay: 0.4 + i * 0.03,
        scale: 0.9 + (i % 3) * 0.15,
        color: colors[i % colors.length]
      });
    }

    // 왼쪽 가지 영역
    const leftLeaves = Math.min(12, Math.max(0, leafCount - 15));
    for (let i = 0; i < leftLeaves; i++) {
      const angle = Math.PI * 0.7 + (i / leftLeaves) * Math.PI * 0.5;
      const radius = 20 + (i % 4) * 10;
      leaves.push({
        x: 100 + Math.cos(angle) * radius,
        y: 100 + Math.sin(angle) * radius * 0.5,
        rotation: -30 + (i % 3) * 15,
        delay: 0.6 + i * 0.04,
        scale: 0.7 + (i % 3) * 0.2,
        color: colors[i % colors.length]
      });
    }

    // 오른쪽 가지 영역
    const rightLeaves = Math.min(12, Math.max(0, leafCount - 27));
    for (let i = 0; i < rightLeaves; i++) {
      const angle = -Math.PI * 0.2 + (i / rightLeaves) * Math.PI * 0.5;
      const radius = 20 + (i % 4) * 10;
      leaves.push({
        x: 200 + Math.cos(angle) * radius,
        y: 100 + Math.sin(angle) * radius * 0.5,
        rotation: 30 - (i % 3) * 15,
        delay: 0.8 + i * 0.04,
        scale: 0.7 + (i % 3) * 0.2,
        color: colors[i % colors.length]
      });
    }

    // 추가 잎들 (더 풍성하게)
    const extraLeaves = Math.max(0, leafCount - 39);
    for (let i = 0; i < extraLeaves; i++) {
      const section = i % 3;
      let baseX = 150, baseY = 80;
      if (section === 1) { baseX = 90; baseY = 95; }
      if (section === 2) { baseX = 210; baseY = 95; }

      leaves.push({
        x: baseX + ((i * 7) % 40) - 20,
        y: baseY + ((i * 11) % 30) - 15,
        rotation: (i * 37) % 360,
        delay: 1.0 + i * 0.02,
        scale: 0.6 + (i % 4) * 0.15,
        color: colors[i % colors.length]
      });
    }

    return leaves;
  };

  // 오렌지 위치 (잎 사이에 배치)
  const orangePositions = [
    { x: 145, y: 82, size: 0.9 },
    { x: 168, y: 70, size: 1.0 },
    { x: 105, y: 100, size: 0.85 },
    { x: 195, y: 95, size: 0.9 },
    { x: 130, y: 65, size: 0.8 },
    { x: 175, y: 90, size: 0.85 },
    { x: 155, y: 55, size: 0.95 },
  ];

  const leaves = generateLeaves();

  return (
    <svg viewBox="0 0 300 280" className={className}>
      {/* 배경 그라데이션 원 (은은한 글로우) */}
      <defs>
        <radialGradient id="treeGlow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFE4B5" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#FFE4B5" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="150" cy="120" r="100" fill="url(#treeGlow)" />

      {/* 뿌리 */}
      <g opacity={Math.min(1, letterCount / 3)}>
        {/* 중앙 뿌리들 */}
        <motion.path
          d="M150 210 Q145 230 138 250 Q132 268 120 280"
          stroke="#A67C52"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        />
        <motion.path
          d="M150 210 Q155 235 162 255 Q168 270 180 280"
          stroke="#A67C52"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        />
        {/* 좌측 뿌리 */}
        <motion.path
          d="M145 215 Q125 235 105 260 Q95 272 80 280"
          stroke="#B8916B"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
        {/* 우측 뿌리 */}
        <motion.path
          d="M155 215 Q175 235 195 260 Q205 272 220 280"
          stroke="#B8916B"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
        {/* 세부 뿌리 */}
        <motion.path
          d="M138 240 Q125 255 110 265"
          stroke="#C4A070"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        />
        <motion.path
          d="M162 240 Q175 255 190 265"
          stroke="#C4A070"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        />
      </g>

      {/* 줄기/몸통 */}
      <motion.path
        d={`M150 210 Q148 180 150 140 Q152 120 150 ${210 - trunkHeight}`}
        stroke="#A67C52"
        strokeWidth="14"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: Math.min(1, letterCount / 5) }}
        transition={{ duration: 0.8, delay: 0 }}
      />
      {/* 줄기 하이라이트 */}
      <motion.path
        d={`M146 205 Q144 175 146 145 Q148 125 146 ${215 - trunkHeight}`}
        stroke="#B8916B"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: Math.min(1, letterCount / 5) }}
        transition={{ duration: 0.8, delay: 0.1 }}
      />

      {/* 가지들 */}
      <g opacity={branchScale}>
        {/* 왼쪽 큰 가지 */}
        <motion.path
          d="M148 135 Q125 125 95 115 Q75 108 60 100"
          stroke="#A67C52"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        />
        {/* 왼쪽 작은 가지 */}
        <motion.path
          d="M100 117 Q85 125 70 120"
          stroke="#B8916B"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        />

        {/* 오른쪽 큰 가지 */}
        <motion.path
          d="M152 135 Q175 125 205 115 Q225 108 240 100"
          stroke="#A67C52"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        />
        {/* 오른쪽 작은 가지 */}
        <motion.path
          d="M200 117 Q215 125 230 120"
          stroke="#B8916B"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        />

        {/* 상단 가지 */}
        <motion.path
          d="M150 110 Q150 90 150 70"
          stroke="#A67C52"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        />
        {/* 상단 분기 */}
        <motion.path
          d="M150 85 Q140 75 130 70"
          stroke="#B8916B"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 0.55 }}
        />
        <motion.path
          d="M150 85 Q160 75 170 70"
          stroke="#B8916B"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 0.55 }}
        />
      </g>

      {/* 잎들 */}
      {leaves.map((leaf, i) => (
        <TreeLeaf key={i} {...leaf} />
      ))}

      {/* 오렌지 열매 */}
      {orangePositions.slice(0, orangeCount).map((pos, i) => (
        <OrangeFruit key={`orange-${i}`} x={pos.x} y={pos.y} delay={1.2 + i * 0.12} size={pos.size} />
      ))}
    </svg>
  );
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

      <div className="flex-1 overflow-y-auto px-4 py-5 lg:px-6">
        <div className="max-w-4xl mx-auto space-y-3">
          
          {/* 편지 발송 유도 배너 - 긍정적 메시지 */}
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
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-white">
                  이틀 후면 편지 보내는 날이에요!
                </p>
              </div>
              <Button
                size="lg"
                onClick={onCompose}
                className="bg-white hover:bg-white/90 text-orange-600 font-semibold flex-shrink-0 shadow-md px-6"
              >
                <PenLine className="w-4 h-4 mr-2" />
                미리 작성하기
              </Button>
            </div>
          </motion.div>

          {/* 메인 나무 영역 - 레퍼런스 기반 새 디자인 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-lg border border-border/40 overflow-hidden"
          >
            {/* 나무 일러스트 영역 */}
            <div className="relative bg-gradient-to-b from-amber-50/80 to-orange-50/50 py-8 px-4">
              {/* 나무 일러스트 - 새 일러스트로 교체 예정 */}
              <div className="flex flex-col items-center justify-center h-72">
                {/* 일러스트 자리 */}
              </div>
            </div>

            {/* 하단 정보 영역 */}
            <div className="p-5 space-y-4">
              {/* 이름 & 레벨 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-md">
                    <TreeDeciduous className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{selectedTree.relation}의 나무</h3>
                    <p className="text-sm text-muted-foreground">Lv.{currentStage.level} {currentStage.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-orange-500">{selectedTree.totalLetters}</p>
                  <p className="text-xs text-muted-foreground">총 편지 수</p>
                </div>
              </div>

              {/* 진행 바 */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">다음 레벨까지</span>
                  <span className="font-medium text-orange-500">{nextStageInfo.lettersNeeded}통 남음</span>
                </div>
                <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-orange-400 to-amber-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>

            </div>
          </motion.div>

          {/* 소중한 날들 - 간소화 */}
          {treeSpecialDays.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden"
            >
              <div className="px-4 py-2.5 flex items-center justify-between border-b border-border/40">
                <h3 className="text-sm font-medium text-foreground">D-DAY</h3>
                <button
                  onClick={() => setShowAddDayModal(true)}
                  className="text-xs text-primary font-medium flex items-center gap-0.5 hover:bg-primary/5 px-2 py-1 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  추가
                </button>
              </div>

              <div className="p-3 flex gap-2 overflow-x-auto">
                {treeSpecialDays.slice(0, 3).map((day) => {
                  const daysRemaining = getDaysRemaining(day.date);

                  return (
                    <button
                      key={day.id}
                      onClick={() => handleDayClick(day)}
                      className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                      <span className={`text-sm font-bold ${
                        daysRemaining === 0 ? 'text-green-500' :
                        daysRemaining <= 7 ? 'text-primary' : 'text-foreground'
                      }`}>
                        {daysRemaining === 0 ? 'D-Day' : daysRemaining > 0 ? `D-${daysRemaining}` : `D+${Math.abs(daysRemaining)}`}
                      </span>
                      <span className="text-sm text-muted-foreground">{day.title}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

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