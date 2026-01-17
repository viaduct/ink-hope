import { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays, ChevronLeft, ChevronRight, ChevronDown, Plus,
  MapPin, Car, Train, Clock, Info,
  Users, Home, Cake, Heart, Scale, GraduationCap, Activity,
  X, Navigation, Hotel, CheckSquare, AlertCircle,
  Edit3, Lightbulb, Camera, Smile, MessageCircle, Gift,
  Pencil, Save, Trash2, Building, Flag, Check,
  Briefcase, FileText, Search, Phone, ExternalLink, Map, ChevronUp, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { specialDays, orangeTrees, familyMembers } from "@/data/mockData";
import { toast } from "sonner";
import ScheduleRegisterPage from "./ScheduleRegisterPage";
import ScheduleDetailPage from "./ScheduleDetailPage";
import ScheduleEditPage from "./ScheduleEditPage";

// 일정 타입 정의
export interface ScheduleEvent {
  id: string;
  type: "special_day" | "letter_send" | "visit" | "custom";
  title: string;
  date: string;
  personName?: string;
  facility?: string;
  facilityAddress?: string;
  description?: string;
  icon: typeof CalendarDays;
  color: string;
  bgColor: string;
}

// 타입별 아이콘 매핑
const typeIcons: Record<string, typeof CalendarDays> = {
  release: Home,
  birthday: Cake,
  anniversary: Heart,
  visit: Users,
  consultation: Briefcase,
  letter: FileText,
  program: GraduationCap,
  trial: Scale,
  health: Activity,
  other: Edit3,
  // 타임캡슐 유형
  release_celebration: Home,
  parole_celebration: Sparkles,
  birthday_celebration: Cake,
  anniversary_celebration: Heart,
};

// 타입별 색상 매핑 (그레이 배경 + 오렌지 아이콘으로 통일)
const typeColors: Record<string, { color: string; bgColor: string }> = {
  release: { color: "text-orange-500", bgColor: "bg-gray-100" },
  birthday: { color: "text-orange-500", bgColor: "bg-gray-100" },
  anniversary: { color: "text-orange-500", bgColor: "bg-gray-100" },
  visit: { color: "text-orange-500", bgColor: "bg-gray-100" },
  consultation: { color: "text-orange-500", bgColor: "bg-gray-100" },
  letter: { color: "text-orange-500", bgColor: "bg-gray-100" },
  program: { color: "text-orange-500", bgColor: "bg-gray-100" },
  trial: { color: "text-orange-500", bgColor: "bg-gray-100" },
  health: { color: "text-orange-500", bgColor: "bg-gray-100" },
  other: { color: "text-orange-500", bgColor: "bg-gray-100" },
  // 타임캡슐 유형
  release_celebration: { color: "text-white", bgColor: "bg-green-500" },
  parole_celebration: { color: "text-white", bgColor: "bg-purple-500" },
  birthday_celebration: { color: "text-white", bgColor: "bg-pink-500" },
  anniversary_celebration: { color: "text-white", bgColor: "bg-red-400" },
};

interface ScheduleContentProps {
  onClose?: () => void;
}

// 자주 찾는 장소 타입
interface FrequentPlace {
  id: string;
  type: "home" | "custom";
  name: string;
  address: string;
  facilityName?: string; // 수신자 시설명
  personName?: string; // 수신자 이름
}

export function ScheduleContent({ onClose }: ScheduleContentProps) {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDateDetail, setShowDateDetail] = useState<Date | null>(null); // 날짜 상세 화면
  const [showEventDetail, setShowEventDetail] = useState<ScheduleEvent | null>(null); // 일정 상세 보기
  const [showAddPage, setShowAddPage] = useState(false); // 일정 등록 페이지
  const [showEventEditPage, setShowEventEditPage] = useState<ScheduleEvent | null>(null); // 일정 수정 페이지
  const [showPlaceModal, setShowPlaceModal] = useState<"home" | "custom" | null>(null);
  const [frequentPlaces, setFrequentPlaces] = useState<FrequentPlace[]>([]);

  const selectedDateSectionRef = useRef<HTMLDivElement>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 모든 일정 데이터 통합
  const allEvents = useMemo(() => {
    const events: ScheduleEvent[] = [];

    // 소중한 날들 (오렌지나무)
    specialDays.forEach((day) => {
      const tree = orangeTrees.find((t) => t.id === day.treeId);
      const member = tree ? familyMembers.find((m) => m.id === tree.personId) : null;
      const colors = typeColors[day.type] || typeColors.other;

      events.push({
        id: day.id,
        type: "special_day",
        title: day.title,
        date: day.date,
        time: day.time,
        personName: tree?.personName,
        facility: member?.facility,
        facilityAddress: member?.facilityAddress,
        description: day.description,
        icon: typeIcons[day.type] || CalendarDays,
        color: colors.color,
        bgColor: colors.bgColor,
      });
    });

    // 1월 예시 일정들 (드롭다운 일정유형과 일치)
    const januaryEvents: ScheduleEvent[] = [
      {
        id: "visit-2026-01-04",
        type: "visit",
        title: "일반접견",
        date: "2026-01-04",
        time: "10:00",
        facility: "서울남부교도소",
        facilityAddress: "서울특별시 금천구 시흥대로 439",
        icon: Users,
        color: "text-white",
        bgColor: "bg-orange-500",
      },
      {
        id: "consultation-2026-01-04",
        type: "consultation",
        title: "공식변호인접견",
        date: "2026-01-04",
        time: "14:00",
        facility: "서울남부교도소",
        icon: Briefcase,
        color: "text-white",
        bgColor: "bg-orange-400",
      },
      {
        id: "visit-2026-01-08",
        type: "visit",
        title: "일반접견",
        date: "2026-01-08",
        time: "09:30",
        facility: "수원구치소",
        icon: Users,
        color: "text-white",
        bgColor: "bg-orange-500",
      },
      {
        id: "special-2026-01-11",
        type: "special_day",
        title: "사건관련일",
        date: "2026-01-11",
        time: "14:00",
        facility: "수원지방법원",
        icon: Scale,
        color: "text-white",
        bgColor: "bg-orange-600",
      },
      {
        id: "visit-2026-01-11",
        type: "visit",
        title: "일반접견",
        date: "2026-01-11",
        time: "10:00",
        facility: "수원구치소",
        icon: Users,
        color: "text-white",
        bgColor: "bg-orange-500",
      },
      {
        id: "visit-2026-01-16",
        type: "visit",
        title: "일반접견",
        date: "2026-01-16",
        time: "10:30",
        facility: "서울구치소",
        icon: Users,
        color: "text-white",
        bgColor: "bg-orange-500",
      },
      {
        id: "consultation-2026-01-19",
        type: "consultation",
        title: "공식변호인접견",
        date: "2026-01-19",
        time: "15:00",
        facility: "수원구치소",
        icon: Briefcase,
        color: "text-white",
        bgColor: "bg-orange-400",
      },
      {
        id: "special-2026-01-23",
        type: "special_day",
        title: "사건관련일",
        date: "2026-01-23",
        time: "10:00",
        facility: "서울중앙지방법원",
        icon: Scale,
        color: "text-white",
        bgColor: "bg-orange-600",
      },
      {
        id: "visit-2026-01-23",
        type: "visit",
        title: "일반접견",
        date: "2026-01-23",
        time: "14:00",
        facility: "서울구치소",
        icon: Users,
        color: "text-white",
        bgColor: "bg-orange-500",
      },
      {
        id: "visit-2026-01-26",
        type: "visit",
        title: "일반접견",
        date: "2026-01-26",
        time: "09:00",
        facility: "인천구치소",
        icon: Users,
        color: "text-white",
        bgColor: "bg-orange-500",
      },
      {
        id: "consultation-2026-01-29",
        type: "consultation",
        title: "공식변호인접견",
        date: "2026-01-29",
        time: "11:00",
        facility: "서울남부교도소",
        icon: Briefcase,
        color: "text-white",
        bgColor: "bg-orange-400",
      },
      {
        id: "special-2026-01-31",
        type: "special_day",
        title: "사건관련일",
        date: "2026-01-31",
        time: "14:00",
        facility: "수원지방법원",
        icon: Scale,
        color: "text-white",
        bgColor: "bg-orange-600",
      },
      // 타임캡슐 일정
      {
        id: "release-2026-01-15",
        type: "custom",
        title: "출소 축하",
        date: "2026-01-15",
        personName: "김철수",
        description: "출소 축하 일정",
        icon: Home,
        color: "text-white",
        bgColor: "bg-green-500",
      },
      {
        id: "birthday-2026-01-20",
        type: "custom",
        title: "생일 축하",
        date: "2026-01-20",
        personName: "김철수",
        description: "생일 축하",
        icon: Cake,
        color: "text-white",
        bgColor: "bg-pink-500",
      },
      {
        id: "anniversary-2026-01-25",
        type: "custom",
        title: "기념일",
        date: "2026-01-25",
        personName: "김철수",
        description: "결혼기념일",
        icon: Heart,
        color: "text-white",
        bgColor: "bg-red-400",
      },
    ];

    events.push(...januaryEvents);

    return events;
  }, [year, month]);

  // 캘린더 날짜 생성
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days: Array<{ date: Date; isCurrentMonth: boolean; events: ScheduleEvent[] }> = [];

    // 이전 달 날짜
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({ date, isCurrentMonth: false, events: [] });
    }

    // 현재 달 날짜
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateStr = date.toISOString().split("T")[0];
      const dayEvents = allEvents.filter((e) => e.date === dateStr);
      days.push({ date, isCurrentMonth: true, events: dayEvents });
    }

    // 다음 달 날짜
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({ date, isCurrentMonth: false, events: [] });
    }

    return days;
  }, [year, month, allEvents]);

  // 선택한 날짜의 일정
  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return [];
    const dateStr = selectedDate.toISOString().split("T")[0];
    return allEvents.filter((e) => e.date === dateStr);
  }, [selectedDate, allEvents]);

  // 상세 화면용 날짜의 일정
  const detailDateEvents = useMemo(() => {
    if (!showDateDetail) return [];
    const dateStr = showDateDetail.toISOString().split("T")[0];
    return allEvents.filter((e) => e.date === dateStr);
  }, [showDateDetail, allEvents]);

  // 다가오는 일정 (7일 이내)
  const upcomingEvents = useMemo(() => {
    const today = new Date();
    const weekLater = new Date();
    weekLater.setDate(today.getDate() + 7);

    return allEvents
      .filter((e) => {
        const eventDate = new Date(e.date);
        return eventDate >= today && eventDate <= weekLater;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [allEvents]);

  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const getDaysUntil = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(dateStr);
    const diff = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  // 아코디언 펼침 상태 관리
  const [expandedEventIds, setExpandedEventIds] = useState<Set<string>>(new Set());

  const toggleEventExpand = (eventId: string) => {
    setExpandedEventIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  // 날짜 상세 화면 (아코디언 카드 리스트)
  if (showDateDetail) {
    return (
      <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b border-border/40 bg-white/80 backdrop-blur-sm flex items-center px-6">
          <button
            onClick={() => {
              setShowDateDetail(null);
              setExpandedEventIds(new Set());
            }}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">캘린더로 돌아가기</span>
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto px-4 py-10 lg:px-6">
          <div className="max-w-4xl mx-auto">
            {/* 날짜 타이틀 - 센터 정렬 */}
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-foreground">
                <span className="text-orange-500">{showDateDetail.getMonth() + 1}월 {showDateDetail.getDate()}일</span> 일정
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {showDateDetail.getFullYear()}년 {weekDays[showDateDetail.getDay()]}요일
              </p>
            </div>

            {/* 일정이 없는 경우 */}
            {detailDateEvents.length === 0 ? (
              <div className="bg-card rounded-2xl border border-border/60 shadow-sm p-8 text-center">
                <CalendarDays className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground">등록된 일정이 없습니다</p>
                <Button
                  className="mt-4 gap-2 bg-orange-500 hover:bg-orange-600"
                  onClick={() => {
                    setShowDateDetail(null);
                    setShowAddPage(true);
                  }}
                >
                  <Plus className="w-4 h-4" />
                  일정 등록하기
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {/* 아코디언 카드 리스트 */}
                {detailDateEvents.map((event) => {
                  const Icon = event.icon;
                  const isExpanded = expandedEventIds.has(event.id);

                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden"
                    >
                      {/* 접힌 상태: 아이콘, 제목, 날짜, 시간 */}
                      <button
                        onClick={() => toggleEventExpand(event.id)}
                        className="w-full text-left p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-orange-500" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-foreground">{event.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {event.date.replace(/-/g, '.')}
                            {event.time && (
                              <span className="ml-2">
                                {parseInt(event.time.split(':')[0]) < 12 ? '오전' : '오후'} {event.time}
                              </span>
                            )}
                          </p>
                        </div>
                        {/* 삭제/수정 아이콘 */}
                        <div className="flex items-center gap-2 mr-2.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm("정말 이 일정을 삭제하시겠습니까?")) {
                                toast.success("일정이 삭제되었습니다.");
                              }
                            }}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5 text-gray-400" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.info("일정 수정 기능은 준비 중입니다.");
                            }}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Pencil className="w-5 h-5 text-gray-400" />
                          </button>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>

                      {/* 펼친 상태: 나머지 상세 내용 */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5 pt-0 border-t border-border/40">
                              {/* 장소 */}
                              {event.facility && (
                                <div className="flex items-start gap-3 py-4 border-b border-border/40">
                                  <MapPin className="w-5 h-5 text-orange-500 mt-0.5" />
                                  <div>
                                    <p className="text-sm text-muted-foreground">장소</p>
                                    <p className="font-medium text-foreground">{event.facility}</p>
                                    {event.facilityAddress && (
                                      <p className="text-sm text-muted-foreground">{event.facilityAddress}</p>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* 접견 안내 섹션 */}
                              {event.title.includes("접견") && (
                                <ConsultationGuideSection facility={event.facility} />
                              )}

                              {/* 면회 안내 섹션 */}
                              {event.title.includes("면회") && (
                                <VisitGuideSection facility={event.facility} />
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 일정 수정 페이지
  if (showEventEditPage) {
    return (
      <ScheduleEditPage
        event={showEventEditPage}
        onClose={() => setShowEventEditPage(null)}
        onSave={(updatedEvent) => {
          toast.success("일정이 수정되었습니다.");
          setShowEventEditPage(null);
        }}
      />
    );
  }

  // 일정 상세 페이지 (읽기 전용)
  if (showEventDetail) {
    return (
      <ScheduleDetailPage
        event={showEventDetail}
        onClose={() => setShowEventDetail(null)}
        onEdit={() => {
          setShowEventEditPage(showEventDetail);
          setShowEventDetail(null);
        }}
        onDelete={() => {
          toast.success("일정이 삭제되었습니다.");
          setShowEventDetail(null);
        }}
        onNavigateToTimeCapsule={() => {
          // 타임캡슐 상세 페이지의 쪽지작성 탭으로 이동
          navigate("/time-capsule/1?tab=write");
        }}
      />
    );
  }

  // 일정 등록 페이지
  if (showAddPage) {
    return (
      <ScheduleRegisterPage
        onClose={() => setShowAddPage(false)}
        initialDate={selectedDate || undefined}
        onSave={(formData) => {
          toast.success("일정이 등록되었습니다.");
          setShowAddPage(false);
        }}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
      {/* Header */}
      <header className="h-14 border-b border-border/40 bg-white/80 backdrop-blur-sm flex items-center px-6">
        <h1 className="text-lg font-semibold text-foreground">스케줄 관리</h1>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto px-4 py-10 lg:px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* 타이틀 */}
          <div className="mb-[18px]">
            <h2 className="text-2xl font-bold text-foreground mb-[18px]">
              모든 <span className="text-primary underline underline-offset-4">일정</span>을 한 곳에서 관리하세요
            </h2>
            <div className="mb-6">
              <p className="text-base text-muted-foreground leading-normal">
                면회일, 접견일, 재판일, 쪽지발송일 등 일정을 등록만 하면
                <br />
                미리 중요한 날에 맞춰 필요한 정보가 함께 정리됩니다.
              </p>
            </div>
            <Button
              className="gap-2 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 shadow-[0_4px_14px_rgba(251,146,60,0.3)]"
              onClick={() => setShowAddPage(true)}
            >
              <Plus className="w-4 h-4" />
              일정 등록
            </Button>
          </div>

          {/* 캘린더 섹션 */}
          <div>
            {/* 다가오는 일정 */}
            {upcomingEvents.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="flex items-center gap-3 mt-1"
              >
                <span className="text-sm text-muted-foreground whitespace-nowrap">곧 다가오고 있어요</span>
                <div className="flex items-center gap-2 flex-wrap">
                  {upcomingEvents.slice(0, 3).map((event) => {
                    const daysUntil = getDaysUntil(event.date);
                    return (
                      <button
                        key={event.id}
                        onClick={() => setShowEventDetail(event)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                          daysUntil === 0 ? "bg-red-100 text-red-600 hover:bg-red-200" :
                          daysUntil <= 3 ? "bg-orange-100 text-orange-600 hover:bg-orange-200" :
                          "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                      >
                        {event.title.length > 6 ? event.title.slice(0, 6) + "..." : event.title} {daysUntil === 0 ? "오늘" : `D-${daysUntil}`}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* 캘린더 */}
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden mt-6"
            >
            {/* 캘린더 헤더 */}
            <div className="flex items-center justify-between p-4 border-b border-border/40">
              <button
                onClick={goToPrevMonth}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-foreground">
                  {year}년 {month + 1}월
                </h2>
                <button
                  onClick={goToToday}
                  className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
                >
                  오늘
                </button>
              </div>
              <button
                onClick={goToNextMonth}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* 요일 헤더 */}
            <div className="grid grid-cols-7 border-b border-border/40">
              {weekDays.map((day, index) => (
                <div
                  key={day}
                  className={cn(
                    "py-2 text-center text-sm font-medium",
                    index === 0 ? "text-red-500" : "text-muted-foreground"
                  )}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* 날짜 그리드 */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, index) => {
                const isSelected = selectedDate &&
                  day.date.getDate() === selectedDate.getDate() &&
                  day.date.getMonth() === selectedDate.getMonth() &&
                  day.date.getFullYear() === selectedDate.getFullYear();

                return (
                  <div
                    key={index}
                    className={cn(
                      "relative min-h-[100px] p-1 pt-0.5 border-b border-r border-border/20 transition-colors",
                      !day.isCurrentMonth && "bg-muted/30",
                      day.isCurrentMonth && "hover:bg-muted/50",
                      isSelected && "bg-primary/10 ring-1 ring-primary",
                      isToday(day.date) && "bg-orange-50"
                    )}
                  >
                    {/* 날짜 숫자 - 클릭 시 일정 없으면 등록 페이지로 */}
                    <button
                      onClick={() => {
                        setSelectedDate(day.date);
                        if (day.events.length === 0) {
                          setShowAddPage(true);
                        }
                      }}
                      className="w-full"
                    >
                      <span
                        className={cn(
                          "block text-sm font-medium",
                          !day.isCurrentMonth && "text-muted-foreground/50",
                          day.date.getDay() === 0 && "text-red-500",
                          isToday(day.date) && "w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center mx-auto"
                        )}
                      >
                        {day.date.getDate()}
                      </span>
                    </button>
                    {/* 일정 표시 (최대 3개) - 각 일정 클릭 시 바로 상세로 이동 */}
                    <div className="space-y-0.5 mt-0.5">
                      {day.events.slice(0, 3).map((event) => (
                        <button
                          key={event.id}
                          onClick={() => setShowEventDetail(event)}
                          className={cn(
                            "w-full text-left text-[10px] px-1 py-0.5 rounded truncate hover:opacity-80 transition-opacity",
                            event.bgColor,
                            event.color
                          )}
                        >
                          {event.title}
                        </button>
                      ))}
                      {day.events.length > 3 && (
                        <button
                          onClick={() => setShowDateDetail(day.date)}
                          className="w-full text-[10px] text-muted-foreground text-center hover:text-foreground"
                        >
                          +{day.events.length - 3}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            </motion.section>
          </div>


        </div>
      </div>

      {/* 장소 등록 모달 */}
      <AnimatePresence>
        {showPlaceModal && (
          <PlaceRegistrationModal
            type={showPlaceModal}
            onClose={() => setShowPlaceModal(null)}
            onSave={(place) => {
              setFrequentPlaces(prev => [...prev.filter(p => p.type !== place.type), place]);
              setShowPlaceModal(null);
              toast.success("장소가 등록되었습니다.");
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// 숙박 카드 데이터
const nearbyAccommodations = [
  { id: 1, name: "비즈니스호텔 서울", distance: "2.3", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=120&fit=crop" },
  { id: 2, name: "역세권 모텔", distance: "1.8", image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=200&h=120&fit=crop" },
  { id: 3, name: "편안한 게스트하우스", distance: "3.1", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=200&h=120&fit=crop" },
];

// 면회 준비물 체크리스트 (공통)
const VISIT_CHECKLIST = [
  { id: 1, text: "신분증 (주민등록증, 운전면허증)", checked: false },
  { id: 2, text: "면회 신청서 (사전 작성)", checked: false },
  { id: 3, text: "영치금 (필요시)", checked: false },
  { id: 4, text: "편한 복장 착용", checked: false },
  { id: 5, text: "휴대폰/전자기기 보관 준비", checked: false },
];

// 주변 숙박업소 데이터 (공통)
const NEARBY_HOTELS = [
  { name: "○○ 호텔", distance: "500m", price: "65,000원~", rating: 4.2 },
  { name: "△△ 모텔", distance: "800m", price: "45,000원~", rating: 3.8 },
  { name: "□□ 게스트하우스", distance: "1.2km", price: "35,000원~", rating: 4.0 },
];

// 교통편 정보 (공통)
const TRANSPORT_INFO = {
  publicTransport: "지하철 2호선 ○○역 3번 출구에서 도보 15분, 또는 버스 123번 이용",
  car: "네비게이션 '○○교도소' 검색, 주차장 이용 가능 (무료)",
  estimatedTime: "서울역 기준 약 1시간 30분 소요",
};

// 숙박 정보 카드 섹션 (공통 컴포넌트)
function AccommodationCardsSection({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <h4 className="font-bold text-foreground">{title}</h4>
      <p className="text-xs text-muted-foreground mt-1 mb-4">{description}</p>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {nearbyAccommodations.map((acc) => (
          <div key={acc.id} className="flex-shrink-0 w-40 bg-white rounded-lg overflow-hidden border border-border/40">
            <div className="h-20 bg-gray-200">
              <img src={acc.image} alt={acc.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-2">
              <p className="text-sm font-medium truncate">{acc.name}</p>
              <p className="text-xs text-muted-foreground">교정시설 기준 약 {acc.distance}km</p>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-3 flex items-center justify-center gap-2 text-sm text-gray-600 font-medium py-2 border border-border/60 rounded-lg hover:bg-gray-100">
        <Map className="w-4 h-4" />
        지도에서 위치 확인
      </button>

      <p className="text-xs text-muted-foreground mt-3 text-center">
        숙박 정보는 교정시설 위치 기준이며, 실제 이용 조건은 숙소별로 다를 수 있습니다.
      </p>
    </div>
  );
}

// 접견 안내 섹션 컴포넌트
function ConsultationGuideSection({ facility }: { facility?: string }) {
  const [isGuideExpanded, setIsGuideExpanded] = useState(false);
  const [isProcessExpanded, setIsProcessExpanded] = useState(false);

  return (
    <div className="mt-6 pt-4 border-t border-border/40 space-y-4">
      {/* 섹션 1: 핵심 안내 */}
      <div className="bg-orange-50 rounded-xl p-4">
        <button
          onClick={() => setIsGuideExpanded(!isGuideExpanded)}
          className="w-full flex items-center justify-between"
        >
          <div>
            <h4 className="font-bold text-foreground text-left">접견 전에 꼭 알아두세요</h4>
            <p className="text-sm text-muted-foreground text-left mt-1">처음 접견이라면 특히 아래 준비사항을 확인하세요.</p>
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isGuideExpanded ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isGuideExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-3">
                <div className="bg-white rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">변호사 신분증</p>
                      <p className="text-xs text-muted-foreground">대한변호사협회 발급 변호사증</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">사건 기본 정보</p>
                      <p className="text-xs text-muted-foreground">재소자 이름, 수용번호(또는 생년월일), 수용기관명</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 섹션 2: 진행 방식 */}
      <div className="bg-gray-50 rounded-xl p-4">
        <button
          onClick={() => setIsProcessExpanded(!isProcessExpanded)}
          className="w-full flex items-center justify-between"
        >
          <h4 className="font-bold text-foreground">교도소에 도착하면 이렇게 진행돼요</h4>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isProcessExpanded ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isProcessExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-3">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-orange-600">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">민원실 / 접견 접수 창구 방문</p>
                    <p className="text-xs text-muted-foreground">"변호사 접견 신청하러 왔습니다"라고 말씀하세요</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-orange-600">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">접견 신청서 작성</p>
                    <p className="text-xs text-muted-foreground">변호사 정보, 접견 대상자 정보 기입</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-orange-600">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">신분 확인 후 대기</p>
                    <p className="text-xs text-muted-foreground">변호사증 제시 → 전산 확인 → 접견 대기</p>
                  </div>
                </div>
              </div>

              {facility && (
                <div className="mt-4 pt-3 border-t border-border/40">
                  <button className="w-full flex items-center justify-center gap-2 text-sm text-orange-600 font-medium hover:text-orange-700">
                    <ExternalLink className="w-4 h-4" />
                    {facility} 공식 안내 확인하기
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 섹션 3: 숙박 정보 */}
      <AccommodationCardsSection
        title="접견 일정으로 숙박이 필요한 경우"
        description="접견은 대기 시간이나 연속 일정으로 당일 이동이 어려울 수 있습니다."
      />
    </div>
  );
}

// 면회 안내 섹션 컴포넌트
function VisitGuideSection({ facility }: { facility?: string }) {
  const [isGuideExpanded, setIsGuideExpanded] = useState(false);

  return (
    <div className="mt-6 pt-4 border-t border-border/40 space-y-4">
      {/* 섹션 1: 핵심 안내 */}
      <div className="bg-orange-50 rounded-xl p-4">
        <button
          onClick={() => setIsGuideExpanded(!isGuideExpanded)}
          className="w-full flex items-center justify-between"
        >
          <h4 className="font-bold text-foreground text-left">면회 전에 꼭 확인하세요</h4>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isGuideExpanded ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isGuideExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <p className="text-sm text-muted-foreground mt-3 mb-4">
                면회는 항상 가능한 것이 아니며,<br />
                교정시설별 규정과 재소자 상태에 따라 제한될 수 있습니다.<br />
                방문 전 면회 가능 여부와 신분증 지참 여부를 꼭 확인하세요.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 섹션 2: 숙박 정보 */}
      <AccommodationCardsSection
        title="이 장소 근처에서 머물러야 한다면"
        description="면회 일정은 이동 거리와 시간에 따라 하루 일정이 크게 달라질 수 있습니다."
      />
    </div>
  );
}

// 일정 상세 보기 페이지 (읽기 전용)
function EventViewPage({ event, onClose, onEdit, onDelete }: {
  event: ScheduleEvent;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const Icon = event.icon;

  const handleDelete = () => {
    if (confirm("정말 이 일정을 삭제하시겠습니까?")) {
      onDelete();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
      {/* Header */}
      <header className="h-14 border-b border-border/40 bg-white/80 backdrop-blur-sm flex items-center px-6">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">캘린더로 돌아가기</span>
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto px-4 py-6 lg:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-6 lg:p-8 space-y-6">
            {/* 일정 제목 */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center">
                <Icon className="w-7 h-7 text-orange-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{event.title}</h2>
                {event.personName && (
                  <p className="text-muted-foreground">{event.personName}</p>
                )}
              </div>
            </div>

            {/* 날짜 및 시간 */}
            <div className="flex items-start gap-4 py-4 border-t border-border/40">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">날짜 및 시간</p>
                <p className="font-medium text-foreground">
                  {event.date.replace(/-/g, '.')}
                  {event.time && (
                    <span className="ml-2">
                      {parseInt(event.time.split(':')[0]) < 12 ? '오전' : '오후'} {event.time}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* 장소 */}
            {event.facility && (
              <div className="flex items-start gap-4 py-4 border-t border-border/40">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">장소</p>
                  <p className="font-medium text-foreground">{event.facility}</p>
                  {event.facilityAddress && (
                    <p className="text-sm text-muted-foreground">{event.facilityAddress}</p>
                  )}
                </div>
              </div>
            )}

            {/* 하단 버튼: 삭제, 수정 */}
            <div className="flex gap-3 pt-4 border-t border-border/40">
              <Button
                variant="outline"
                className="flex-1 h-12 text-red-500 border-red-200 hover:bg-red-50"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                삭제
              </Button>
              <Button
                className="flex-1 h-12 bg-orange-500 hover:bg-orange-600 text-white font-bold"
                onClick={onEdit}
              >
                <Pencil className="w-4 h-4 mr-2" />
                수정
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 일정 수정 페이지 (인풋 화면)
// 지역 및 교도소 데이터 (공통)
const regionsData = ["서울", "경기", "인천", "대전", "대구", "부산", "광주", "울산", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];

const prisonsByRegionData: Record<string, string[]> = {
  "서울": ["서울구치소", "서울남부구치소"],
  "경기": ["안양교도소", "수원구치소", "의정부교도소", "화성직업훈련교도소"],
  "인천": ["인천구치소"],
  "대전": ["대전교도소"],
  "대구": ["대구교도소", "경북북부교도소"],
  "부산": ["부산구치소", "부산교도소"],
  "광주": ["광주교도소"],
  "울산": ["울산구치소"],
  "강원": ["춘천교도소", "원주교도소"],
  "충북": ["청주교도소", "충주구치소"],
  "충남": ["천안교도소", "홍성교도소"],
  "전북": ["전주교도소", "군산교도소"],
  "전남": ["목포교도소", "순천교도소", "해남교도소"],
  "경북": ["포항교도소", "안동교도소", "경주교도소"],
  "경남": ["창원교도소", "진주교도소", "밀양구치소"],
  "제주": ["제주교도소"]
};


// PC용 오른쪽 패널 컴포넌트
function EventDetailPanel({ event, onSave, onDelete }: {
  event: ScheduleEvent;
  onSave?: (updatedEvent: ScheduleEvent) => void;
  onDelete?: (eventId: string) => void;
}) {
  const Icon = event.icon;
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // 수정용 상태
  const [editTitle, setEditTitle] = useState(event.title);
  const [editDate, setEditDate] = useState(event.date);

  // event가 변경되면 편집 상태 초기화
  useMemo(() => {
    setEditTitle(event.title);
    setEditDate(event.date);
    setIsEditing(false);
  }, [event.id]);

  const daysUntil = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(isEditing ? editDate : event.date);
    return Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }, [event.date, editDate, isEditing]);

  const handleSave = () => {
    if (!editTitle.trim()) {
      toast.error("제목을 입력해주세요.");
      return;
    }
    if (!editDate) {
      toast.error("날짜를 선택해주세요.");
      return;
    }

    const updatedEvent: ScheduleEvent = {
      ...event,
      title: editTitle,
      date: editDate,
    };

    onSave?.(updatedEvent);
    toast.success("일정이 수정되었습니다.");
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm("정말 이 일정을 삭제하시겠습니까?")) {
      onDelete?.(event.id);
      toast.success("일정이 삭제되었습니다.");
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(event.title);
    setEditDate(event.date);
    setIsEditing(false);
  };

  const isVisitEvent = event.type === "special_day" && event.facility;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 헤더 */}
      <div className="px-5 py-4 bg-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
            <Icon className="w-5 h-5 text-orange-500" />
          </div>
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="h-8 font-bold bg-white border-orange-200 focus:border-orange-400"
                placeholder="일정 제목"
              />
            ) : (
              <h2 className="font-bold text-foreground truncate">{event.title}</h2>
            )}
            {event.personName && (
              <p className="text-sm text-muted-foreground">{event.personName}</p>
            )}
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors flex-shrink-0"
            >
              <Pencil className="w-4 h-4 text-orange-500" />
            </button>
          )}
          <span className={cn(
            "px-3 py-1 rounded-full text-xs font-bold flex-shrink-0",
            daysUntil === 0 ? "bg-red-500 text-white" :
            daysUntil < 0 ? "bg-gray-300 text-gray-600" :
            "bg-orange-500 text-white"
          )}>
            {daysUntil === 0 ? "D-Day" : daysUntil > 0 ? `D-${daysUntil}` : `D+${Math.abs(daysUntil)}`}
          </span>
        </div>
      </div>

      {/* 내용 */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* 날짜 정보 */}
        <div className="bg-muted/50 rounded-xl p-3">
          <p className="text-xs text-muted-foreground mb-1">날짜</p>
          {isEditing ? (
            <Input
              type="date"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              className="h-9 bg-white border-orange-200 focus:border-orange-400"
            />
          ) : (
            <p className="font-semibold text-foreground">{event.date}</p>
          )}
        </div>

        {/* 수정 모드일 때 하단 버튼 */}
        {isEditing && (
          <div className="flex gap-2 pt-2 border-t border-border/40">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-red-500 border-red-200 hover:bg-red-50"
              onClick={handleDelete}
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              삭제
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleCancelEdit}
            >
              취소
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white"
              onClick={handleSave}
            >
              <Save className="w-3.5 h-3.5 mr-1" />
              저장
            </Button>
          </div>
        )}

        {/* 면회 관련 정보 (수정 모드가 아닐 때만 표시) */}
        {isVisitEvent && !isEditing && (
          <>
            {/* 시설 정보 */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                면회 장소
              </h4>
              <div className="bg-muted/50 rounded-xl p-3">
                <p className="font-medium text-foreground text-sm">{event.facility}</p>
                <p className="text-xs text-muted-foreground mt-1">{event.facilityAddress}</p>
              </div>
            </div>

            {/* 서비스 연동 안내 */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-3 border border-orange-100">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground text-xs">투오렌지 서비스 연동</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    편지쓰기 서비스에서 교통편, 숙박, 준비물 정보를 안내받을 수 있어요.
                  </p>
                </div>
              </div>
            </div>

            {/* 면회 준비 안내 */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-foreground">면회 준비 안내</h4>

              {/* 교통편 */}
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setExpandedSection(expandedSection === "transport" ? null : "transport")}
                  className="w-full flex items-center gap-2.5 p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Navigation className="w-4 h-4 text-orange-500" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-foreground text-xs">가는 길 안내</p>
                  </div>
                  <ChevronRight className={cn("w-4 h-4 text-muted-foreground transition-transform", expandedSection === "transport" && "rotate-90")} />
                </button>
                {expandedSection === "transport" && (
                  <div className="p-3 bg-white border-t border-gray-200 space-y-2">
                    <div className="flex items-start gap-2">
                      <Train className="w-3.5 h-3.5 text-orange-500 mt-0.5" />
                      <div>
                        <p className="text-[11px] font-medium text-foreground">대중교통</p>
                        <p className="text-[11px] text-muted-foreground">{TRANSPORT_INFO.publicTransport}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Car className="w-3.5 h-3.5 text-orange-500 mt-0.5" />
                      <div>
                        <p className="text-[11px] font-medium text-foreground">자가용</p>
                        <p className="text-[11px] text-muted-foreground">{TRANSPORT_INFO.car}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 숙박 */}
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setExpandedSection(expandedSection === "hotel" ? null : "hotel")}
                  className="w-full flex items-center gap-2.5 p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Hotel className="w-4 h-4 text-orange-500" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-foreground text-xs">주변 숙박업소</p>
                  </div>
                  <ChevronRight className={cn("w-4 h-4 text-muted-foreground transition-transform", expandedSection === "hotel" && "rotate-90")} />
                </button>
                {expandedSection === "hotel" && (
                  <div className="p-3 bg-white border-t border-gray-200 space-y-1.5">
                    {NEARBY_HOTELS.map((hotel, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-xs font-medium text-foreground">{hotel.name}</p>
                          <p className="text-[10px] text-muted-foreground">{hotel.distance}</p>
                        </div>
                        <p className="text-xs font-semibold text-orange-500">{hotel.price}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 준비물 */}
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setExpandedSection(expandedSection === "checklist" ? null : "checklist")}
                  className="w-full flex items-center gap-2.5 p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                    <CheckSquare className="w-4 h-4 text-orange-500" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-foreground text-xs">준비물 체크리스트</p>
                  </div>
                  <ChevronRight className={cn("w-4 h-4 text-muted-foreground transition-transform", expandedSection === "checklist" && "rotate-90")} />
                </button>
                {expandedSection === "checklist" && (
                  <div className="p-3 bg-white border-t border-gray-200 space-y-1">
                    {VISIT_CHECKLIST.map((item) => (
                      <label key={item.id} className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded cursor-pointer">
                        <input type="checkbox" className="w-3.5 h-3.5 rounded border-orange-300 text-orange-500 focus:ring-orange-500" />
                        <span className="text-xs text-foreground">{item.text}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </>
        )}
      </div>
    </div>
  );
}

// 캘린더 아래에 표시되는 일정 상세 섹션 (넓은 레이아웃)
function EventDetailSection({ event, onClose, onSave, onDelete }: {
  event: ScheduleEvent;
  onClose: () => void;
  onSave?: (updatedEvent: ScheduleEvent) => void;
  onDelete?: (eventId: string) => void;
}) {
  const Icon = event.icon;
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // 수정용 상태
  const [editTitle, setEditTitle] = useState(event.title);
  const [editDate, setEditDate] = useState(event.date);

  // event가 변경되면 편집 상태 초기화
  useMemo(() => {
    setEditTitle(event.title);
    setEditDate(event.date);
    setIsEditing(false);
  }, [event.id]);

  const daysUntil = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(isEditing ? editDate : event.date);
    return Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }, [event.date, editDate, isEditing]);

  const handleSave = () => {
    if (!editTitle.trim()) {
      toast.error("제목을 입력해주세요.");
      return;
    }
    if (!editDate) {
      toast.error("날짜를 선택해주세요.");
      return;
    }

    const updatedEvent: ScheduleEvent = {
      ...event,
      title: editTitle,
      date: editDate,
    };

    onSave?.(updatedEvent);
    toast.success("일정이 수정되었습니다.");
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm("정말 이 일정을 삭제하시겠습니까?")) {
      onDelete?.(event.id);
      toast.success("일정이 삭제되었습니다.");
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(event.title);
    setEditDate(event.date);
    setIsEditing(false);
  };

  const isVisitEvent = event.type === "special_day" && event.facility;

  return (
    <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden">
      {/* 헤더 */}
      <div className="px-5 lg:px-6 py-4 lg:py-5 bg-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3 lg:gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-white flex items-center justify-center flex-shrink-0">
            <Icon className="w-6 h-6 lg:w-7 lg:h-7 text-orange-500" />
          </div>
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="h-10 text-lg font-bold bg-white border-orange-200 focus:border-orange-400"
                placeholder="일정 제목"
              />
            ) : (
              <h2 className="text-lg lg:text-xl font-bold text-foreground truncate">{event.title}</h2>
            )}
            {event.personName && (
              <p className="text-sm text-muted-foreground">{event.personName}</p>
            )}
          </div>
          <span className={cn(
            "px-4 py-1.5 rounded-full text-sm font-bold flex-shrink-0",
            daysUntil === 0 ? "bg-red-500 text-white" :
            daysUntil < 0 ? "bg-gray-300 text-gray-600" :
            "bg-orange-500 text-white"
          )}>
            {daysUntil === 0 ? "D-Day" : daysUntil > 0 ? `D-${daysUntil}` : `D+${Math.abs(daysUntil)}`}
          </span>
        </div>
        <div className="flex items-center gap-2 ml-4">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <Pencil className="w-4 h-4 text-orange-500" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* 내용 - 2열 레이아웃 */}
      <div className="p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* 왼쪽: 기본 정보 */}
          <div className="space-y-4">
            {/* 날짜 & D-Day */}
            <div className="bg-muted/50 rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">날짜</p>
              {isEditing ? (
                <Input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="h-10 bg-white border-orange-200 focus:border-orange-400"
                />
              ) : (
                <p className="text-lg font-semibold text-foreground">{event.date}</p>
              )}
            </div>

            {/* 수정 모드일 때 버튼 */}
            {isEditing && (
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-red-500 border-red-200 hover:bg-red-50"
                  onClick={handleDelete}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  삭제
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={handleCancelEdit}
                >
                  취소
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white"
                  onClick={handleSave}
                >
                  <Save className="w-4 h-4 mr-1" />
                  저장
                </Button>
              </div>
            )}

            {/* 면회 장소 정보 (수정 모드가 아닐 때만) */}
            {isVisitEvent && !isEditing && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  면회 장소
                </h4>
                <div className="bg-muted/50 rounded-xl p-4">
                  <p className="font-semibold text-foreground">{event.facility}</p>
                  <p className="text-sm text-muted-foreground mt-1">{event.facilityAddress}</p>
                </div>
              </div>
            )}
          </div>

          {/* 오른쪽: 면회 관련 정보 (수정 모드가 아닐 때만) */}
          {isVisitEvent && !isEditing && (
            <div className="space-y-4">
              {/* 서비스 연동 안내 */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground text-sm">투오렌지 서비스 연동</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      편지쓰기 서비스에서 교통편, 숙박, 준비물 정보를 안내받을 수 있어요.
                    </p>
                  </div>
                </div>
              </div>

              {/* 면회 준비 안내 */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">면회 준비 안내</h4>

                {/* 교통편 */}
                <div className="rounded-xl border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => setExpandedSection(expandedSection === "transport" ? null : "transport")}
                    className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                      <Navigation className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-foreground text-sm">가는 길 안내</p>
                      <p className="text-xs text-muted-foreground">대중교통/자가용 경로</p>
                    </div>
                    <ChevronRight className={cn("w-4 h-4 text-muted-foreground transition-transform", expandedSection === "transport" && "rotate-90")} />
                  </button>
                  {expandedSection === "transport" && (
                    <div className="p-4 bg-white border-t border-gray-200 space-y-3">
                      <div className="flex items-start gap-2">
                        <Train className="w-4 h-4 text-orange-500 mt-0.5" />
                        <div>
                          <p className="text-xs font-medium text-foreground">대중교통</p>
                          <p className="text-xs text-muted-foreground">{TRANSPORT_INFO.publicTransport}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Car className="w-4 h-4 text-orange-500 mt-0.5" />
                        <div>
                          <p className="text-xs font-medium text-foreground">자가용</p>
                          <p className="text-xs text-muted-foreground">{TRANSPORT_INFO.car}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <p className="text-xs text-muted-foreground">{TRANSPORT_INFO.estimatedTime}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 숙박 */}
                <div className="rounded-xl border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => setExpandedSection(expandedSection === "hotel" ? null : "hotel")}
                    className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                      <Hotel className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-foreground text-sm">주변 숙박업소</p>
                      <p className="text-xs text-muted-foreground">{NEARBY_HOTELS.length}개 업소 추천</p>
                    </div>
                    <ChevronRight className={cn("w-4 h-4 text-muted-foreground transition-transform", expandedSection === "hotel" && "rotate-90")} />
                  </button>
                  {expandedSection === "hotel" && (
                    <div className="p-4 bg-white border-t border-gray-200 space-y-2">
                      {NEARBY_HOTELS.map((hotel, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-foreground">{hotel.name}</p>
                            <p className="text-xs text-muted-foreground">{hotel.distance} · ⭐ {hotel.rating}</p>
                          </div>
                          <p className="text-sm font-semibold text-orange-500">{hotel.price}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 준비물 */}
                <div className="rounded-xl border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => setExpandedSection(expandedSection === "checklist" ? null : "checklist")}
                    className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                      <CheckSquare className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-foreground text-sm">준비물 체크리스트</p>
                      <p className="text-xs text-muted-foreground">{VISIT_CHECKLIST.length}개 항목</p>
                    </div>
                    <ChevronRight className={cn("w-4 h-4 text-muted-foreground transition-transform", expandedSection === "checklist" && "rotate-90")} />
                  </button>
                  {expandedSection === "checklist" && (
                    <div className="p-4 bg-white border-t border-gray-200 space-y-2">
                      {VISIT_CHECKLIST.map((item) => (
                        <label key={item.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 rounded border-orange-300 text-orange-500 focus:ring-orange-500" />
                          <span className="text-sm text-foreground">{item.text}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* 면회가 아닌 일반 일정일 때 오른쪽 영역 비움 */}
          {(!isVisitEvent || isEditing) && !isVisitEvent && (
            <div className="hidden lg:flex items-center justify-center text-center text-muted-foreground">
              <div>
                <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">일정 정보가 표시됩니다</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 일정 등록 페이지 컴포넌트
function AddSchedulePage({ onClose, frequentPlaces, onOpenPlaceModal }: { onClose: () => void; frequentPlaces: FrequentPlace[]; onOpenPlaceModal: (type: "home" | "custom") => void }) {
  const [selectedType, setSelectedType] = useState("visit");
  const [customTitle, setCustomTitle] = useState("면회");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("9:00");
  const [startAmPm, setStartAmPm] = useState<"AM" | "PM">("AM");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("9:00");
  const [endAmPm, setEndAmPm] = useState<"AM" | "PM">("AM");
  const [memo, setMemo] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const [locationMode, setLocationMode] = useState<"search" | "prison" | "recipient" | null>(null);
  const [searchAddress, setSearchAddress] = useState("");
  const [selectedPrison, setSelectedPrison] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [addressType, setAddressType] = useState<"road" | "jibun">("road");
  const [addressSearchQuery, setAddressSearchQuery] = useState("");
  const [addressSearchResults, setAddressSearchResults] = useState<Array<{
    roadAddress: string;
    jibunAddress: string;
    buildingName: string;
    zipCode: string;
  }>>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const scheduleTypes = [
    { id: "visit", label: "면회", icon: Users },
    { id: "consultation", label: "변호사접견", icon: Briefcase },
    { id: "trial", label: "재판일", icon: Scale },
    { id: "letter", label: "쪽지발송", icon: FileText },
    { id: "release", label: "출소", icon: Home },
    { id: "birthday", label: "생일", icon: Cake },
    { id: "anniversary", label: "기념일", icon: Heart },
    { id: "program", label: "교육", icon: GraduationCap },
    { id: "health", label: "건강", icon: Activity },
    { id: "other", label: "기타", icon: Edit3 },
  ];

  const prisons = selectedRegion ? (prisonsByRegionData[selectedRegion] || []) : [];

  const handleTypeClick = (typeId: string, label: string) => {
    setSelectedType(typeId);
    setCustomTitle(label);
    setLocationMode(null);
    setSelectedPlace(null);
    setSelectedRegion("");
  };

  const handleAddressSearch = () => {
    if (!addressSearchQuery.trim()) return;
    setHasSearched(true);
    // 예시 검색 결과 (실제로는 API 연동 필요)
    setAddressSearchResults([
      {
        roadAddress: "서울특별시 종로구 세종대로 209 정부서울청사(행정자치부, 여성가족부 등)",
        jibunAddress: "서울특별시 종로구 세종로 77-6",
        buildingName: "정부서울청사",
        zipCode: "03171"
      }
    ]);
  };

  const handleSelectAddress = (result: { roadAddress: string; jibunAddress: string; zipCode: string }) => {
    const address = addressType === "road" ? result.roadAddress : result.jibunAddress;
    setSearchAddress(address);
    setShowAddressPopup(false);
    setAddressSearchQuery("");
    setAddressSearchResults([]);
    setHasSearched(false);
  };

  const showLocationSection = selectedType === "visit" || selectedType === "consultation" || selectedType === "trial" || selectedType === "letter" || selectedType === "release";

  const isFormValid = (selectedType === "other" ? customTitle.trim() : selectedType) && startDate;

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
      {/* Header */}
      <header className="h-14 border-b border-border/40 bg-white/80 backdrop-blur-sm flex items-center px-6">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">캘린더로 돌아가기</span>
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto px-4 py-6 lg:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-6 lg:p-8 space-y-6">
          {/* 타이틀 */}
          <h2 className="text-xl font-bold text-foreground">일정을 등록하세요.</h2>

          {/* 일정 유형 선택 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">일정 유형</label>
            {/* 아이콘+라벨 칩 */}
            <div className="flex flex-wrap gap-2">
              {scheduleTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => handleTypeClick(type.id, type.id === "other" ? "" : type.label)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-full border-2 transition-all text-sm",
                      isSelected
                        ? "border-orange-400 bg-orange-50"
                        : "border-border/60 hover:border-orange-200 bg-white"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", isSelected ? "text-orange-500" : "text-gray-500")} />
                    <span className={cn("font-medium", isSelected ? "text-orange-600" : "text-gray-600")}>
                      {type.id === "other" ? "직접입력" : type.label}
                    </span>
                  </button>
                );
              })}
            </div>
            {/* 기타(직접입력) 선택 시 인풋 표시 */}
            {selectedType === "other" && (
              <input
                type="text"
                placeholder="일정 제목을 입력하세요"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full h-12 px-3 text-sm border border-border/60 rounded-xl focus:border-orange-400 focus:outline-none"
                autoFocus
              />
            )}
          </div>

          {/* 날짜 및 시간 선택 */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <CalendarDays className="w-4 h-4 text-orange-500" />
              날짜 및 시간
            </label>

            {/* 시작 날짜/시간 */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <select
                  value={startDate ? startDate.split("-")[0] : ""}
                  onChange={(e) => {
                    const year = e.target.value;
                    const month = startDate ? startDate.split("-")[1] : "01";
                    const day = startDate ? startDate.split("-")[2] : "01";
                    const newDate = `${year}-${month}-${day}`;
                    setStartDate(newDate);
                    if (!endDate) setEndDate(newDate);
                  }}
                  className="w-full h-12 px-3 pr-8 text-sm border border-border/60 rounded-xl bg-white appearance-none"
                >
                  <option value="">연도</option>
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                    <option key={year} value={year}>{year}년</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative flex-1">
                <select
                  value={startDate ? startDate.split("-")[1] : ""}
                  onChange={(e) => {
                    const year = startDate ? startDate.split("-")[0] : new Date().getFullYear().toString();
                    const month = e.target.value;
                    const day = startDate ? startDate.split("-")[2] : "01";
                    const newDate = `${year}-${month}-${day}`;
                    setStartDate(newDate);
                    if (!endDate) setEndDate(newDate);
                  }}
                  className="w-full h-12 px-3 pr-8 text-sm border border-border/60 rounded-xl bg-white appearance-none"
                >
                  <option value="">월</option>
                  {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")).map((month) => (
                    <option key={month} value={month}>{parseInt(month)}월</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative flex-1">
                <select
                  value={startDate ? startDate.split("-")[2] : ""}
                  onChange={(e) => {
                    const year = startDate ? startDate.split("-")[0] : new Date().getFullYear().toString();
                    const month = startDate ? startDate.split("-")[1] : "01";
                    const day = e.target.value;
                    const newDate = `${year}-${month}-${day}`;
                    setStartDate(newDate);
                    if (!endDate) setEndDate(newDate);
                  }}
                  className="w-full h-12 px-3 pr-8 text-sm border border-border/60 rounded-xl bg-white appearance-none"
                >
                  <option value="">일</option>
                  {Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0")).map((day) => (
                    <option key={day} value={day}>{parseInt(day)}일</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative w-[130px]">
                <select
                  value={`${startAmPm} ${startTime}`}
                  onChange={(e) => {
                    const [ampm, time] = e.target.value.split(" ");
                    setStartAmPm(ampm as "AM" | "PM");
                    setStartTime(time);
                  }}
                  className="w-full h-12 px-3 pr-8 text-sm border border-border/60 rounded-xl bg-white appearance-none"
                >
                  {["AM", "PM"].map((ampm) =>
                    Array.from({ length: 12 }, (_, h) => h + 1).map((hour) =>
                      ["00", "15", "30", "45"].map((min) => (
                        <option key={`start-${ampm}-${hour}-${min}`} value={`${ampm} ${hour}:${min}`}>
                          {ampm === "AM" ? "오전" : "오후"} {hour}:{min}
                        </option>
                      ))
                    )
                  )}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* 변호사접견 팁 */}
            {selectedType === "consultation" && (
              <p className="text-sm text-orange-500">
                <span className="font-medium">[오렌지Tip]</span> 접견이 시작되기전 최소 30분안에 도착해주시는게 좋아요!
              </p>
            )}
          </div>

          {/* 출소 일정 팁 */}
          {selectedType === "release" && (
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-start gap-2">
                <span className="text-orange-500 font-semibold text-sm">Tip</span>
                <div>
                  <p className="text-sm font-semibold text-foreground flex items-center gap-1">
                    <Home className="w-4 h-4 text-orange-500" />
                    출소 일정을 선택한 경우
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  출소는 끝이 아니라, <span className="text-foreground font-medium">새로운 시작의 날</span>입니다.<br />
                  그날을 위해 타임캡슐과 함께 준비해보세요.
                </p>

                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-white rounded-full text-sm border border-orange-200">
                    <span>👔</span> 출소복 선물하기
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-white rounded-full text-sm border border-orange-200">
                    <span>📚</span> 도서 선물하기
                  </span>
                </div>

                <p>
                  출소 이후의 생활을 바로 시작할 수 있도록,<br />
                  실질적으로 도움이 되는 선물을 담을 수 있어요.
                </p>
              </div>

              <button className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors">
                같이 준비하기
              </button>
            </div>
          )}

          {/* 생일/기념일 팁 */}
          {(selectedType === "birthday" || selectedType === "anniversary") && (
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 space-y-4">
              <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p className="text-foreground font-medium">
                  작은 선물을 함께 전할 수 있어요.
                </p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-orange-500">☕</span>
                    <span>커피 한 잔처럼 가볍게</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-orange-500">🍺</span>
                    <span>"맥주 한잔하자" 같은 약속으로</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-orange-500">🎁</span>
                    <span>그날을 기억하게 하는 작은 선택으로</span>
                  </div>
                </div>

                <p>
                  마음만 전하는 날도 좋지만,<br />
                  상황에 따라 작은 선물이 더 오래 남기도 합니다.
                </p>
              </div>

              <button className="w-full py-3 border-2 border-orange-400 text-orange-600 hover:bg-orange-100 rounded-xl font-medium transition-colors flex items-center justify-center gap-1">
                선물 옵션 보러가기
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* 장소 섹션 - 조건부 표시 */}
          {showLocationSection && (
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <MapPin className="w-4 h-4 text-orange-500" />
                {selectedType === "trial" ? "재판장소" : "위치"}
              </label>

              {/* 장소 입력 방식 선택 */}
              <div className="flex gap-2">
                {(selectedType === "visit" || selectedType === "letter" || selectedType === "consultation" || selectedType === "release") && (
                  <button
                    onClick={() => setLocationMode("prison")}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all text-sm",
                      locationMode === "prison"
                        ? "border-orange-400 bg-orange-50 text-orange-700"
                        : "border-border/60 hover:border-orange-200 text-foreground"
                    )}
                  >
                    <Building className="w-4 h-4" />
                    <span>교도소 선택</span>
                  </button>
                )}
                {(selectedType === "visit" || selectedType === "letter" || selectedType === "release") && (
                  <button
                    onClick={() => setLocationMode("recipient")}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all text-sm",
                      locationMode === "recipient"
                        ? "border-orange-400 bg-orange-50 text-orange-700"
                        : "border-border/60 hover:border-orange-200 text-foreground"
                    )}
                  >
                    <Users className="w-4 h-4" />
                    <span>수신자 불러오기</span>
                  </button>
                )}
                {selectedType === "trial" && (
                  <button
                    onClick={() => setLocationMode("court")}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all text-sm",
                      locationMode === "court"
                        ? "border-orange-400 bg-orange-50 text-orange-700"
                        : "border-border/60 hover:border-orange-200 text-foreground"
                    )}
                  >
                    <Scale className="w-4 h-4" />
                    <span>재판장소 선택</span>
                  </button>
                )}
              </div>

              {/* 교도소 선택 */}
              {locationMode === "prison" && (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <select
                      value={selectedRegion}
                      onChange={(e) => {
                        setSelectedRegion(e.target.value);
                        setSelectedPrison("");
                      }}
                      className="w-full h-12 px-3 pr-8 text-sm border border-border/60 rounded-xl bg-white appearance-none"
                    >
                      <option value="">지역 선택</option>
                      {regionsData.map((region) => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                  <div className="relative flex-1">
                    <select
                      value={selectedPrison}
                      onChange={(e) => setSelectedPrison(e.target.value)}
                      className="w-full h-12 px-3 pr-8 text-sm border border-border/60 rounded-xl bg-white appearance-none"
                      disabled={!selectedRegion}
                    >
                      <option value="">교도소/구치소 선택</option>
                      {prisons.map((prison) => (
                        <option key={prison} value={prison}>{prison}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              )}

              {/* 수신자 불러오기 */}
              {locationMode === "recipient" && (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {familyMembers.map((member) => (
                      <button
                        key={member.id}
                        onClick={() => setSelectedRecipient(selectedRecipient === member.id ? null : member.id)}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-xl border transition-all text-sm",
                          selectedRecipient === member.id
                            ? "border-orange-400 bg-orange-50 text-orange-700"
                            : "border-border/60 hover:border-orange-200 text-foreground"
                        )}
                      >
                        <span className="font-medium">{member.name}</span>
                        <span className="text-xs text-muted-foreground">({member.facility})</span>
                        {selectedRecipient === member.id && (
                          <Check className="w-4 h-4 text-orange-500" />
                        )}
                      </button>
                    ))}
                  </div>
                  {selectedRecipient && (
                    <p className="text-xs text-muted-foreground pl-1">
                      선택됨: {familyMembers.find(m => m.id === selectedRecipient)?.facilityAddress}
                    </p>
                  )}
                </div>
              )}

              {/* 재판장소 선택 */}
              {locationMode === "court" && (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <select
                      value={selectedRegion}
                      onChange={(e) => {
                        setSelectedRegion(e.target.value);
                        setSelectedPrison("");
                      }}
                      className="w-full h-12 px-3 pr-8 text-sm border border-border/60 rounded-xl bg-white appearance-none"
                    >
                      <option value="">지역 선택</option>
                      {regionsData.map((region) => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="재판장소 입력 (예: 서울중앙지방법원)"
                      className="w-full h-12 px-3 text-sm border border-border/60 rounded-xl bg-white"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 일정 추가 버튼 */}
          <Button
            className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-bold text-base"
            disabled={!isFormValid}
          >
            + 일정 추가
          </Button>
          </div>
        </div>
      </div>

      {/* 주소 검색 팝업 */}
      <AnimatePresence>
        {showAddressPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center"
          >
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => {
                setShowAddressPopup(false);
                setAddressSearchQuery("");
                setAddressSearchResults([]);
                setHasSearched(false);
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* 탭 헤더 */}
              <div className="flex border-b-2 border-gray-200">
                <button
                  onClick={() => setAddressType("road")}
                  className={cn(
                    "flex-1 py-4 text-center font-medium transition-colors",
                    addressType === "road"
                      ? "text-red-500 border-b-2 border-red-500 -mb-[2px]"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  도로명주소
                </button>
                <button
                  onClick={() => setAddressType("jibun")}
                  className={cn(
                    "flex-1 py-4 text-center font-medium transition-colors",
                    addressType === "jibun"
                      ? "text-red-500 border-b-2 border-red-500 -mb-[2px]"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  지번주소
                </button>
              </div>

              {/* 검색 안내 */}
              <div className="px-6 py-4 border-b border-gray-100">
                <p className="text-center text-gray-700">
                  도로명과 건물번호를 입력해 주세요. (예: 영동대로 502)
                </p>
                <p className="text-center text-sm text-gray-500 mt-1">
                  · 도로명주소 확인하기: <a href="https://www.juso.go.kr" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">www.juso.go.kr</a>
                </p>
              </div>

              {/* 검색 입력 */}
              <div className="px-6 py-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="세종대로 209"
                    value={addressSearchQuery}
                    onChange={(e) => setAddressSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddressSearch()}
                    className="flex-1 h-12 px-4 text-base border border-gray-300 rounded-lg focus:border-gray-500 focus:outline-none"
                  />
                  <button
                    onClick={handleAddressSearch}
                    className="px-6 h-12 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                  >
                    검색
                  </button>
                </div>
              </div>

              {/* 검색 결과 */}
              <div className="border-t border-gray-200 max-h-[300px] overflow-y-auto">
                {hasSearched && (
                  <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                    <p className="text-sm">
                      '<span className="text-red-500">{addressSearchQuery}</span>' 검색결과는 <span className="text-red-500 font-medium">{addressSearchResults.length}건</span>입니다.
                    </p>
                  </div>
                )}
                {addressSearchResults.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectAddress(result)}
                    className="w-full px-6 py-4 text-left hover:bg-orange-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start gap-3">
                        <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded shrink-0">도로명</span>
                        <div className="flex-1">
                          <p className="text-sm text-gray-800">{result.roadAddress}</p>
                        </div>
                        <span className="text-sm text-gray-500 shrink-0">{result.zipCode}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded shrink-0">지 번</span>
                        <p className="text-sm text-gray-600">{result.jibunAddress}</p>
                      </div>
                    </div>
                  </button>
                ))}
                {hasSearched && addressSearchResults.length === 0 && (
                  <div className="px-6 py-8 text-center text-gray-500">
                    검색 결과가 없습니다.
                  </div>
                )}
              </div>

              {/* 닫기 버튼 */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowAddressPopup(false);
                    setAddressSearchQuery("");
                    setAddressSearchResults([]);
                    setHasSearched(false);
                  }}
                  className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  닫기
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 장소 등록 모달 컴포넌트
function PlaceRegistrationModal({
  type,
  onClose,
  onSave
}: {
  type: "home" | "custom";
  onClose: () => void;
  onSave: (place: FrequentPlace) => void;
}) {
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);
  const [customName, setCustomName] = useState(type === "home" ? "집" : "");
  const [customAddress, setCustomAddress] = useState("");
  // 집 등록은 직접 입력만, 자주 가는곳은 수신자 선택 또는 직접 입력
  const [mode, setMode] = useState<"select" | "custom">(type === "home" ? "custom" : "select");

  const handleSelectRecipient = (memberId: string) => {
    setSelectedRecipient(memberId);
    setMode("select");
  };

  const handleSave = () => {
    if (mode === "select" && selectedRecipient) {
      const member = familyMembers.find(m => m.id === selectedRecipient);
      if (member) {
        onSave({
          id: `place-${Date.now()}`,
          type,
          name: type === "home" ? "집" : member.facility,
          address: member.facilityAddress,
          facilityName: member.facility,
          personName: member.name,
        });
      }
    } else if (mode === "custom" && customName.trim() && customAddress.trim()) {
      onSave({
        id: `place-${Date.now()}`,
        type,
        name: customName.trim(),
        address: customAddress.trim(),
      });
    }
  };

  const isValid = mode === "select"
    ? selectedRecipient !== null
    : customName.trim() !== "" && customAddress.trim() !== "";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="relative z-10 w-full max-w-md mx-4 bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] overflow-y-auto"
      >
        {/* 헤더 */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-border/40 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            {type === "home" ? "집 주소 등록" : "자주 가는 곳 등록"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="p-6 space-y-6">
          {/* 모드 선택 탭 - 자주 가는곳 등록시에만 표시 */}
          {type === "custom" && (
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setMode("select")}
                className={cn(
                  "flex-1 py-2.5 text-sm font-medium rounded-lg transition-all",
                  mode === "select"
                    ? "bg-white text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                수신자 장소 선택
              </button>
              <button
                onClick={() => setMode("custom")}
                className={cn(
                  "flex-1 py-2.5 text-sm font-medium rounded-lg transition-all",
                  mode === "custom"
                    ? "bg-white text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                직접 입력
              </button>
            </div>
          )}

          {mode === "select" && type === "custom" ? (
            <>
              <p className="text-sm text-muted-foreground">
                수신자가 있는 시설을 선택하세요
              </p>
              <div className="space-y-2">
                {familyMembers.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => handleSelectRecipient(member.id)}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 text-left transition-all",
                      selectedRecipient === member.id
                        ? "border-orange-400 bg-orange-50"
                        : "border-border hover:border-orange-200 hover:bg-orange-50/50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-white font-medium">
                        {member.avatar || member.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground">
                          {member.name} <span className="text-muted-foreground text-sm">({member.relation})</span>
                        </p>
                        <p className="text-sm text-orange-600 font-medium">{member.facility}</p>
                        <p className="text-xs text-muted-foreground truncate">{member.facilityAddress}</p>
                      </div>
                      {selectedRecipient === member.id && (
                        <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                {type === "home" ? "집 주소를 입력해주세요" : "새로운 장소 정보를 직접 입력하세요"}
              </p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    장소 이름 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="예: 우리집, 회사, 본가"
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    주소 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={customAddress}
                    onChange={(e) => setCustomAddress(e.target.value)}
                    placeholder="예: 서울특별시 강남구 테헤란로 123"
                    className="h-12"
                  />
                  <p className="text-xs text-muted-foreground">
                    정확한 주소를 입력해주세요
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="sticky bottom-0 bg-white border-t border-border/40 px-6 py-4 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            취소
          </Button>
          <Button
            className="flex-1 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white"
            disabled={!isValid}
            onClick={handleSave}
          >
            <Check className="w-4 h-4 mr-2" />
            등록하기
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
