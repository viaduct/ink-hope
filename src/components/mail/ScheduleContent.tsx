import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays, ChevronLeft, ChevronRight, Plus,
  MapPin, Car, Train, Clock, Info,
  Users, Home, Cake, Heart, Scale, GraduationCap, Activity,
  Mail, X, Navigation, Hotel, CheckSquare, AlertCircle,
  Edit3, Lightbulb, Camera, Smile, MessageCircle, Gift,
  Pencil, Save, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { specialDays, orangeTrees, familyMembers } from "@/data/mockData";
import { toast } from "sonner";

// 일정 타입 정의
interface ScheduleEvent {
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
  program: GraduationCap,
  trial: Scale,
  health: Activity,
  letter_send: Mail,
  other: Edit3,
};

// 타입별 색상 매핑 (그레이 배경 + 오렌지 아이콘으로 통일)
const typeColors: Record<string, { color: string; bgColor: string }> = {
  release: { color: "text-orange-500", bgColor: "bg-gray-100" },
  birthday: { color: "text-orange-500", bgColor: "bg-gray-100" },
  anniversary: { color: "text-orange-500", bgColor: "bg-gray-100" },
  visit: { color: "text-orange-500", bgColor: "bg-gray-100" },
  program: { color: "text-orange-500", bgColor: "bg-gray-100" },
  trial: { color: "text-orange-500", bgColor: "bg-gray-100" },
  health: { color: "text-orange-500", bgColor: "bg-gray-100" },
  letter_send: { color: "text-orange-500", bgColor: "bg-gray-100" },
  other: { color: "text-orange-500", bgColor: "bg-gray-100" },
};

// 매주 금요일 쪽지 발송일 생성
const generateFridayLetterDays = (year: number, month: number): ScheduleEvent[] => {
  const fridays: ScheduleEvent[] = [];
  const date = new Date(year, month, 1);

  while (date.getMonth() === month) {
    if (date.getDay() === 5) { // 금요일
      fridays.push({
        id: `letter-${date.toISOString()}`,
        type: "letter_send",
        title: "쪽지 발송일",
        date: date.toISOString().split("T")[0],
        icon: Mail,
        color: "text-orange-500",
        bgColor: "bg-gray-100",
        description: "매주 금요일 정기 발송",
      });
    }
    date.setDate(date.getDate() + 1);
  }

  return fridays;
};

export function ScheduleContent() {
  const [currentDate, setCurrentDate] = useState(new Date());
  // PC에서 1월 21일 예시 일정을 기본 선택
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2025, 0, 21));
  const [showEventDetail, setShowEventDetail] = useState<ScheduleEvent | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // PC에서 선택된 일정 (오른쪽 패널용)
  const [selectedEventForPanel, setSelectedEventForPanel] = useState<ScheduleEvent | null>(null);

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
        personName: tree?.personName,
        facility: member?.facility,
        facilityAddress: member?.facilityAddress,
        description: day.description,
        icon: typeIcons[day.type] || CalendarDays,
        color: colors.color,
        bgColor: colors.bgColor,
      });
    });

    // 매주 금요일 쪽지 발송일
    const fridayEvents = generateFridayLetterDays(year, month);
    events.push(...fridayEvents);

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

  // PC에서 오른쪽 패널에 표시할 일정 계산
  const panelEvent = useMemo(() => {
    if (selectedEventForPanel) return selectedEventForPanel;
    // 선택된 날짜의 첫 번째 일정 또는 1월 21일 일정
    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split("T")[0];
      const events = allEvents.filter((e) => e.date === dateStr);
      if (events.length > 0) return events[0];
    }
    // 기본값: 1월 21일 일정
    const jan21Event = allEvents.find(e => e.date === "2025-01-21");
    return jan21Event || null;
  }, [selectedEventForPanel, selectedDate, allEvents]);

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      {/* 헤더 */}
      <div className="p-4 border-b border-border/40">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" />
            스케줄 관리
          </h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="gap-1"
          >
            <Plus className="w-4 h-4" />
            일정 추가
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          면회일, 소중한 날, 쪽지 발송일을 한눈에 관리하세요
        </p>
      </div>

      {/* PC: 2:1 레이아웃, 모바일: 세로 스택 */}
      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        {/* 왼쪽 영역: 캘린더 및 알림 (2/3) */}
        <div className="flex-1 lg:w-2/3 overflow-auto p-4 space-y-4">
        {/* 다가오는 일정 */}
        {upcomingEvents.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-4 border border-orange-100"
          >
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-500" />
              다가오는 일정
            </h3>
            <div className="space-y-2">
              {upcomingEvents.slice(0, 3).map((event) => {
                const daysUntil = getDaysUntil(event.date);
                const Icon = event.icon;
                return (
                  <button
                    key={event.id}
                    onClick={() => {
                      // PC에서는 오른쪽 패널에 표시, 모바일에서는 모달
                      setSelectedEventForPanel(event);
                      setShowEventDetail(event);
                    }}
                    className="w-full flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-all text-left"
                  >
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", event.bgColor)}>
                      <Icon className={cn("w-5 h-5", event.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {event.personName && `${event.personName} · `}
                        {event.date}
                      </p>
                    </div>
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-semibold",
                      daysUntil === 0 ? "bg-red-100 text-red-600" :
                      daysUntil <= 3 ? "bg-orange-100 text-orange-600" :
                      "bg-gray-100 text-gray-600"
                    )}>
                      {daysUntil === 0 ? "오늘" : `D-${daysUntil}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* 캘린더 */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden"
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
                <button
                  key={index}
                  onClick={() => {
                    setSelectedDate(day.date);
                    // 해당 날짜의 첫 번째 일정을 패널에 바로 표시
                    if (day.events.length > 0) {
                      setSelectedEventForPanel(day.events[0]);
                    } else {
                      setSelectedEventForPanel(null);
                    }
                  }}
                  className={cn(
                    "relative min-h-[60px] p-1 border-b border-r border-border/20 transition-colors",
                    !day.isCurrentMonth && "bg-muted/30",
                    day.isCurrentMonth && "hover:bg-muted/50",
                    isSelected && "bg-primary/10 ring-1 ring-primary",
                    isToday(day.date) && "bg-orange-50"
                  )}
                >
                  <span
                    className={cn(
                      "block text-sm font-medium mb-1",
                      !day.isCurrentMonth && "text-muted-foreground/50",
                      day.date.getDay() === 0 && "text-red-500",
                      isToday(day.date) && "w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center mx-auto"
                    )}
                  >
                    {day.date.getDate()}
                  </span>
                  {/* 일정 표시 (최대 2개) */}
                  <div className="space-y-0.5">
                    {day.events.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className={cn(
                          "text-[10px] px-1 py-0.5 rounded truncate",
                          event.bgColor,
                          event.color
                        )}
                      >
                        {event.title}
                      </div>
                    ))}
                    {day.events.length > 2 && (
                      <div className="text-[10px] text-muted-foreground text-center">
                        +{day.events.length - 2}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </motion.section>

        {/* 선택된 날짜 일정 목록 */}
        {selectedDate && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl border border-border/60 shadow-sm p-4"
          >
            <h3 className="font-semibold text-foreground mb-3">
              {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일 일정
            </h3>
            {selectedDateEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                등록된 일정이 없습니다
              </p>
            ) : (
              <div className="space-y-2">
                {selectedDateEvents.map((event) => {
                  const Icon = event.icon;
                  return (
                    <button
                      key={event.id}
                      onClick={() => {
                        setSelectedEventForPanel(event);
                        setShowEventDetail(event);
                      }}
                      className="w-full flex items-center gap-3 p-3 bg-muted/50 hover:bg-muted rounded-xl transition-colors text-left"
                    >
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", event.bgColor)}>
                        <Icon className={cn("w-5 h-5", event.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground">{event.title}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {event.description || (event.personName && `${event.personName}`)}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                  );
                })}
              </div>
            )}
          </motion.section>
        )}

        {/* 범례 */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl border border-border/60 shadow-sm p-4"
        >
          <h3 className="text-sm font-semibold text-foreground mb-3">일정 구분</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { type: "visit", label: "면회" },
              { type: "release", label: "출소일" },
              { type: "birthday", label: "생일" },
              { type: "trial", label: "재판" },
              { type: "letter_send", label: "쪽지 발송" },
              { type: "anniversary", label: "기념일" },
            ].map(({ type, label }) => {
              const Icon = typeIcons[type];
              return (
                <div key={type} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-orange-500" />
                  </div>
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              );
            })}
          </div>
        </motion.section>
        </div>

        {/* 오른쪽 영역: 선택된 일정 상세 (1/3) - PC에서만 표시 */}
        <div className="hidden lg:block lg:w-1/3 border-l border-border/40 overflow-auto">
          {panelEvent ? (
            <EventDetailPanel event={panelEvent} />
          ) : (
            <div className="h-full flex items-center justify-center p-8">
              <div className="text-center text-muted-foreground">
                <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">일정을 선택하면<br />상세 정보가 표시됩니다</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 일정 상세 모달 (모바일용) */}
      <AnimatePresence>
        {showEventDetail && (
          <div className="lg:hidden">
            <EventDetailModal
              event={showEventDetail}
              onClose={() => setShowEventDetail(null)}
            />
          </div>
        )}
      </AnimatePresence>

      {/* 일정 추가 모달 */}
      <AnimatePresence>
        {showAddModal && (
          <AddScheduleModal onClose={() => setShowAddModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// 일정 상세 모달 컴포넌트
function EventDetailModal({ event, onClose, onSave, onDelete }: {
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
  const [editDescription, setEditDescription] = useState(event.description || "");

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
      description: editDescription,
    };

    onSave?.(updatedEvent);
    toast.success("일정이 수정되었습니다.");
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm("정말 이 일정을 삭제하시겠습니까?")) {
      onDelete?.(event.id);
      toast.success("일정이 삭제되었습니다.");
      onClose();
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(event.title);
    setEditDate(event.date);
    setEditDescription(event.description || "");
    setIsEditing(false);
  };

  const isVisitEvent = event.type === "special_day" && event.facility;

  // 면회 준비물 체크리스트
  const visitChecklist = [
    { id: 1, text: "신분증 (주민등록증, 운전면허증)", checked: false },
    { id: 2, text: "면회 신청서 (사전 작성)", checked: false },
    { id: 3, text: "영치금 (필요시)", checked: false },
    { id: 4, text: "편한 복장 착용", checked: false },
    { id: 5, text: "휴대폰/전자기기 보관 준비", checked: false },
  ];

  // 주변 숙박업소 예시 데이터
  const nearbyHotels = [
    { name: "○○ 호텔", distance: "500m", price: "65,000원~", rating: 4.2 },
    { name: "△△ 모텔", distance: "800m", price: "45,000원~", rating: 3.8 },
    { name: "□□ 게스트하우스", distance: "1.2km", price: "35,000원~", rating: 4.0 },
  ];

  // 교통편 정보
  const transportInfo = {
    publicTransport: "지하철 2호선 ○○역 3번 출구에서 도보 15분, 또는 버스 123번 이용",
    car: "네비게이션 '○○교도소' 검색, 주차장 이용 가능 (무료)",
    estimatedTime: "서울역 기준 약 1시간 30분 소요",
  };

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
        className="relative z-10 w-full max-w-lg mx-4 bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] overflow-y-auto"
      >
        {/* 헤더 */}
        <div className="px-6 py-5 bg-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center">
                <Icon className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                {isEditing ? (
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="h-8 text-lg font-bold bg-white border-orange-200 focus:border-orange-400"
                    placeholder="일정 제목"
                  />
                ) : (
                  <h2 className="text-lg font-bold text-foreground">{event.title}</h2>
                )}
                {event.personName && (
                  <p className="text-sm text-muted-foreground">{event.personName}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <Pencil className="w-4 h-4 text-orange-500" />
                </button>
              )}
              <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>

        {/* 내용 */}
        <div className="p-6 space-y-5">
          {/* D-Day & 날짜 */}
          <div className="flex items-center justify-between bg-muted/50 rounded-2xl p-4">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">날짜</p>
              {isEditing ? (
                <Input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="h-10 mt-1 bg-white border-orange-200 focus:border-orange-400"
                />
              ) : (
                <p className="font-semibold text-foreground">{event.date}</p>
              )}
            </div>
            <div className={cn(
              "px-4 py-2 rounded-xl font-bold text-lg ml-4",
              daysUntil === 0 ? "bg-red-100 text-red-600" :
              daysUntil < 0 ? "bg-gray-100 text-gray-600" :
              "bg-orange-100 text-orange-600"
            )}>
              {daysUntil === 0 ? "D-Day" : daysUntil > 0 ? `D-${daysUntil}` : `D+${Math.abs(daysUntil)}`}
            </div>
          </div>

          {/* 설명/메모 */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Info className="w-4 h-4" />
              메모
            </h4>
            {isEditing ? (
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="메모를 입력하세요..."
                className="min-h-[100px] bg-white border-orange-200 focus:border-orange-400 resize-none"
              />
            ) : (
              <p className="text-foreground bg-muted/50 rounded-xl p-4">
                {event.description || "메모 없음"}
              </p>
            )}
          </div>

          {/* 면회 관련 정보 (면회일이고 수정 모드가 아닐 때만) */}
          {isVisitEvent && !isEditing && (
            <>
              {/* 시설 정보 */}
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

              {/* 투오렌지 서비스 연동 안내 */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-4 border border-orange-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">투오렌지 서비스 연동</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      면회 일정이 등록되어 있으면 편지쓰기 서비스에서 교통편, 숙박, 준비물 정보를 자동으로 안내받을 수 있어요.
                    </p>
                  </div>
                </div>
              </div>

              {/* 면회 준비 정보 카드들 */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-foreground">면회 준비 안내</h4>

                {/* 교통편 안내 */}
                <div className="rounded-xl border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => setExpandedSection(expandedSection === "transport" ? null : "transport")}
                    className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
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
                          <p className="text-xs text-muted-foreground">{transportInfo.publicTransport}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Car className="w-4 h-4 text-orange-500 mt-0.5" />
                        <div>
                          <p className="text-xs font-medium text-foreground">자가용</p>
                          <p className="text-xs text-muted-foreground">{transportInfo.car}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <p className="text-xs text-muted-foreground">{transportInfo.estimatedTime}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 숙박 안내 */}
                <div className="rounded-xl border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => setExpandedSection(expandedSection === "hotel" ? null : "hotel")}
                    className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                      <Hotel className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-foreground text-sm">주변 숙박업소</p>
                      <p className="text-xs text-muted-foreground">{nearbyHotels.length}개 업소 추천</p>
                    </div>
                    <ChevronRight className={cn("w-4 h-4 text-muted-foreground transition-transform", expandedSection === "hotel" && "rotate-90")} />
                  </button>
                  {expandedSection === "hotel" && (
                    <div className="p-4 bg-white border-t border-gray-200 space-y-2">
                      {nearbyHotels.map((hotel, idx) => (
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

                {/* 준비물 체크리스트 */}
                <div className="rounded-xl border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => setExpandedSection(expandedSection === "checklist" ? null : "checklist")}
                    className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                      <CheckSquare className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-foreground text-sm">준비물 체크리스트</p>
                      <p className="text-xs text-muted-foreground">{visitChecklist.length}개 항목</p>
                    </div>
                    <ChevronRight className={cn("w-4 h-4 text-muted-foreground transition-transform", expandedSection === "checklist" && "rotate-90")} />
                  </button>
                  {expandedSection === "checklist" && (
                    <div className="p-4 bg-white border-t border-gray-200 space-y-2">
                      {visitChecklist.map((item) => (
                        <label key={item.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 rounded border-orange-300 text-orange-500 focus:ring-orange-500" />
                          <span className="text-sm text-foreground">{item.text}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 투오렌지가 챙겨드려요 */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-orange-500" />
                  투오렌지가 챙겨드려요
                </h4>
                <p className="text-xs text-muted-foreground">면회 갈 때 이런 거 가져가서 대화하면 좋아요!</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-xl border border-orange-100">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Camera className="w-4 h-4 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">아이들 사진 모음</p>
                      <p className="text-xs text-muted-foreground mt-0.5">최근 학교 행사, 일상 사진을 인화해서 가져가세요. 함께 못한 시간을 공유할 수 있어요.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-xl border border-orange-100">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Smile className="w-4 h-4 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">가벼운 유머 하나</p>
                      <p className="text-xs text-muted-foreground mt-0.5">"요즘 유행하는 거 알아?" 하며 재미있는 이야기를 준비해보세요. 웃음이 마음을 열어줘요.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-xl border border-orange-100">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-4 h-4 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">출소 후 계획 이야기</p>
                      <p className="text-xs text-muted-foreground mt-0.5">"나오면 같이 뭐 하고 싶어?" 미래에 대한 긍정적인 대화가 희망을 줘요.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-xl border border-orange-100">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Gift className="w-4 h-4 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">작은 선물 아이디어</p>
                      <p className="text-xs text-muted-foreground mt-0.5">영치금으로 넣어줄 간식 목록을 미리 물어보세요. 좋아하는 것을 기억하는 게 사랑이에요.</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="px-6 py-4 bg-gray-50 border-t border-border/40">
          {isEditing ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 text-red-500 border-red-200 hover:bg-red-50"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                삭제
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleCancelEdit}
              >
                취소
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white"
                onClick={handleSave}
              >
                <Save className="w-4 h-4 mr-1" />
                저장
              </Button>
            </div>
          ) : (
            <Button variant="outline" className="w-full" onClick={onClose}>
              닫기
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

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
  const [editDescription, setEditDescription] = useState(event.description || "");

  // event가 변경되면 편집 상태 초기화
  useMemo(() => {
    setEditTitle(event.title);
    setEditDate(event.date);
    setEditDescription(event.description || "");
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
      description: editDescription,
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
    setEditDescription(event.description || "");
    setIsEditing(false);
  };

  const isVisitEvent = event.type === "special_day" && event.facility;

  // 면회 준비물 체크리스트
  const visitChecklist = [
    { id: 1, text: "신분증 (주민등록증, 운전면허증)", checked: false },
    { id: 2, text: "면회 신청서 (사전 작성)", checked: false },
    { id: 3, text: "영치금 (필요시)", checked: false },
    { id: 4, text: "편한 복장 착용", checked: false },
    { id: 5, text: "휴대폰/전자기기 보관 준비", checked: false },
  ];

  // 주변 숙박업소 예시 데이터
  const nearbyHotels = [
    { name: "○○ 호텔", distance: "500m", price: "65,000원~", rating: 4.2 },
    { name: "△△ 모텔", distance: "800m", price: "45,000원~", rating: 3.8 },
    { name: "□□ 게스트하우스", distance: "1.2km", price: "35,000원~", rating: 4.0 },
  ];

  // 교통편 정보
  const transportInfo = {
    publicTransport: "지하철 2호선 ○○역 3번 출구에서 도보 15분, 또는 버스 123번 이용",
    car: "네비게이션 '○○교도소' 검색, 주차장 이용 가능 (무료)",
    estimatedTime: "서울역 기준 약 1시간 30분 소요",
  };

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

        {/* 설명/메모 */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            메모
          </h4>
          {isEditing ? (
            <Textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="메모를 입력하세요..."
              className="min-h-[80px] text-sm bg-white border-orange-200 focus:border-orange-400 resize-none"
            />
          ) : (
            <p className="text-sm text-foreground bg-muted/50 rounded-xl p-3">
              {event.description || "메모 없음"}
            </p>
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
                        <p className="text-[11px] text-muted-foreground">{transportInfo.publicTransport}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Car className="w-3.5 h-3.5 text-orange-500 mt-0.5" />
                      <div>
                        <p className="text-[11px] font-medium text-foreground">자가용</p>
                        <p className="text-[11px] text-muted-foreground">{transportInfo.car}</p>
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
                    {nearbyHotels.map((hotel, idx) => (
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
                    {visitChecklist.map((item) => (
                      <label key={item.id} className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded cursor-pointer">
                        <input type="checkbox" className="w-3.5 h-3.5 rounded border-orange-300 text-orange-500 focus:ring-orange-500" />
                        <span className="text-xs text-foreground">{item.text}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 투오렌지가 챙겨드려요 */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-orange-500" />
                투오렌지가 챙겨드려요
              </h4>
              <p className="text-[11px] text-muted-foreground">면회 갈 때 이런 거 가져가서 대화하면 좋아요!</p>
              <div className="space-y-1.5">
                <div className="flex items-start gap-2 p-2 bg-orange-50 rounded-lg border border-orange-100">
                  <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Camera className="w-3 h-3 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">아이들 사진 모음</p>
                    <p className="text-[10px] text-muted-foreground">최근 학교 행사, 일상 사진을 인화해서 가져가세요.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2 bg-orange-50 rounded-lg border border-orange-100">
                  <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Smile className="w-3 h-3 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">가벼운 유머 하나</p>
                    <p className="text-[10px] text-muted-foreground">재미있는 이야기를 준비해보세요. 웃음이 마음을 열어줘요.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2 bg-orange-50 rounded-lg border border-orange-100">
                  <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-3 h-3 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">출소 후 계획 이야기</p>
                    <p className="text-[10px] text-muted-foreground">미래에 대한 긍정적인 대화가 희망을 줘요.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2 bg-orange-50 rounded-lg border border-orange-100">
                  <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Gift className="w-3 h-3 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">작은 선물 아이디어</p>
                    <p className="text-[10px] text-muted-foreground">영치금으로 넣어줄 간식 목록을 미리 물어보세요.</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// 일정 추가 모달 컴포넌트
function AddScheduleModal({ onClose }: { onClose: () => void }) {
  const [selectedType, setSelectedType] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [memo, setMemo] = useState("");

  const scheduleTypes = [
    { id: "visit", label: "면회", icon: Users },
    { id: "release", label: "출소", icon: Home },
    { id: "birthday", label: "생일", icon: Cake },
    { id: "anniversary", label: "기념일", icon: Heart },
    { id: "trial", label: "재판일", icon: Scale },
    { id: "program", label: "교육", icon: GraduationCap },
    { id: "health", label: "건강", icon: Activity },
    { id: "other", label: "기타", icon: Edit3 },
  ];

  const isFormValid = selectedType && startDate && (selectedType !== "other" || customTitle.trim());

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
        className="relative z-10 w-full max-w-lg mx-4 bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-orange-400 to-amber-400 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">새 일정 추가</h2>
                <p className="text-sm text-white/80">일정 정보를 입력하세요</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20 transition-colors">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* 내용 */}
        <div className="p-6 space-y-5">
          {/* 일정 유형 선택 */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">일정 유형</label>
            <div className="grid grid-cols-4 gap-2">
              {scheduleTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all",
                      isSelected
                        ? "border-orange-400 bg-orange-50"
                        : "border-border/60 hover:border-orange-200"
                    )}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-orange-500" />
                    </div>
                    <span className={cn("text-xs font-medium", isSelected ? "text-orange-600" : "text-foreground")}>
                      {type.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 기타 선택 시 직접 입력 필드 */}
          {selectedType === "other" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">일정 이름</label>
              <input
                type="text"
                placeholder="일정 이름을 입력하세요"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full h-12 px-4 text-base border-2 border-orange-200 rounded-xl focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20"
                autoFocus
              />
            </div>
          )}

          {/* 날짜 선택 */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <CalendarDays className="w-4 h-4 text-orange-500" />
              날짜
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <span className="text-xs text-muted-foreground">시작일</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full h-12 px-4 text-base border-2 border-orange-200 rounded-xl focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20"
                />
              </div>
              <div className="space-y-1.5">
                <span className="text-xs text-muted-foreground">종료일 (선택)</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  className="w-full h-12 px-4 text-base border-2 border-orange-200 rounded-xl focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20"
                />
              </div>
            </div>
          </div>

          {/* 메모 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">메모 (선택)</label>
            <textarea
              placeholder="추가 메모를 입력하세요..."
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="w-full min-h-[80px] px-4 py-3 text-base border-2 border-orange-200 rounded-xl focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20 resize-none"
            />
          </div>

          <p className="text-xs text-muted-foreground text-center">
            오렌지나무에서 등록한 소중한 날들이 자동으로 연동됩니다
          </p>
        </div>

        {/* 하단 버튼 */}
        <div className="px-6 py-4 bg-gray-50 border-t border-border/40 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            취소
          </Button>
          <Button
            className="flex-1 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white"
            disabled={!isFormValid}
          >
            <Plus className="w-4 h-4 mr-2" />
            일정 추가
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
