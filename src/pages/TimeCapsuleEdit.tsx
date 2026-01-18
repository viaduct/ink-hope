import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  ChevronLeft, Home, Sparkles, Cake, Heart, Calendar,
  Plus, Info, Loader2, User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { AppLayout } from "@/components/layout/AppLayout";
import { cn } from "@/lib/utils";

// 캡슐 유형
const capsuleTypes = [
  { id: "release", label: "출소 축하", icon: Home },
  { id: "parole", label: "가석방 축하", icon: Sparkles },
  { id: "birthday", label: "생일 축하", icon: Cake },
  { id: "anniversary", label: "기념일", icon: Calendar },
  { id: "encouragement", label: "응원", icon: Heart },
];

// 관계 옵션
const relationOptions = [
  "배우자", "자녀", "엄마", "아빠", "형제", "자매", "친구", "이모/삼촌", "친척", "연인"
];

// 요일 옵션
const weekDays = [
  { id: "mon", label: "월" },
  { id: "tue", label: "화" },
  { id: "wed", label: "수" },
  { id: "thu", label: "목" },
  { id: "fri", label: "금" },
];

// 연도 생성 (현재년도 ~ +10년)
const generateYears = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 11 }, (_, i) => currentYear + i);
};

// 월 생성
const months = Array.from({ length: 12 }, (_, i) => i + 1);

// 일 생성
const generateDays = (year: number, month: number) => {
  const daysInMonth = new Date(year, month, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => i + 1);
};

// 참여자 타입
interface Participant {
  id: string;
  name: string;
  relation: string;
  phone: string;
}

// 목업 데이터 - 기존 타임캡슐 정보
const mockCapsuleData: Record<string, {
  type: string;
  recipientId: string;
  recipientName: string;
  recipientRelation: string;
  year: string;
  month: string;
  day: string;
  weekDay: string | null;
  participants: Participant[];
}> = {
  "1": {
    type: "release",
    recipientId: "1",
    recipientName: "서은우",
    recipientRelation: "자녀",
    year: "2026",
    month: "12",
    day: "23",
    weekDay: "wed",
    participants: [
      { id: "p1", name: "김영희", relation: "엄마", phone: "010-1234-5678" },
      { id: "p2", name: "박철수", relation: "아빠", phone: "010-9876-5432" },
      { id: "p3", name: "이민수", relation: "친구", phone: "010-5555-5555" },
    ],
  },
};

export default function TimeCapsuleEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  // 기존 데이터 로드
  const existingData = mockCapsuleData[id || "1"];

  // 모든 필드 수정 가능한 상태
  const [selectedType, setSelectedType] = useState<string | null>(existingData?.type || null);
  const [recipientName, setRecipientName] = useState(existingData?.recipientName || "");
  const [recipientRelation, setRecipientRelation] = useState(existingData?.recipientRelation || "");

  // 기타 수정 가능한 상태
  const [selectedYear, setSelectedYear] = useState<string>(existingData?.year || "");
  const [selectedMonth, setSelectedMonth] = useState<string>(existingData?.month || "");
  const [selectedDay, setSelectedDay] = useState<string>(existingData?.day || "");
  const [participants, setParticipants] = useState<Participant[]>(existingData?.participants || []);
  const [selectedWeekDay, setSelectedWeekDay] = useState<string | null>(existingData?.weekDay || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 참여자 수정 모달 상태
  const [showEditParticipantModal, setShowEditParticipantModal] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  const [editParticipantName, setEditParticipantName] = useState("");
  const [editParticipantRelation, setEditParticipantRelation] = useState("");
  const [editParticipantPhone, setEditParticipantPhone] = useState("");

  // 새 참여자 추가 모달 상태
  const [showAddParticipantModal, setShowAddParticipantModal] = useState(false);
  const [newParticipantName, setNewParticipantName] = useState("");
  const [newParticipantRelation, setNewParticipantRelation] = useState("");
  const [newParticipantPhone, setNewParticipantPhone] = useState("");

  const years = generateYears();
  const days = selectedYear && selectedMonth
    ? generateDays(parseInt(selectedYear), parseInt(selectedMonth))
    : [];

  // 참여자 수정 시작
  const handleEditParticipant = (participant: Participant) => {
    setEditingParticipant(participant);
    setEditParticipantName(participant.name);
    setEditParticipantRelation(participant.relation);
    setEditParticipantPhone(participant.phone);
    setShowEditParticipantModal(true);
  };

  // 참여자 수정 저장
  const handleSaveParticipant = () => {
    if (!editParticipantName.trim()) {
      toast.error("이름을 입력해주세요");
      return;
    }
    if (!editParticipantRelation) {
      toast.error("관계를 선택해주세요");
      return;
    }
    if (!editParticipantPhone.trim()) {
      toast.error("전화번호를 입력해주세요");
      return;
    }

    if (editingParticipant) {
      setParticipants(participants.map(p =>
        p.id === editingParticipant.id
          ? { ...p, name: editParticipantName, relation: editParticipantRelation, phone: editParticipantPhone }
          : p
      ));
      toast.success("참여자 정보가 수정되었습니다");
    }

    setShowEditParticipantModal(false);
    setEditingParticipant(null);
  };

  // 참여자 삭제
  const handleRemoveParticipant = (participantId: string) => {
    setParticipants(participants.filter(p => p.id !== participantId));
    toast.success("참여자가 삭제되었습니다");
  };

  // 새 참여자 추가
  const handleAddParticipant = () => {
    if (!newParticipantName.trim()) {
      toast.error("이름을 입력해주세요");
      return;
    }
    if (!newParticipantRelation) {
      toast.error("관계를 선택해주세요");
      return;
    }
    if (!newParticipantPhone.trim()) {
      toast.error("전화번호를 입력해주세요");
      return;
    }

    const newParticipant: Participant = {
      id: `p${Date.now()}`,
      name: newParticipantName,
      relation: newParticipantRelation,
      phone: newParticipantPhone,
    };

    setParticipants([...participants, newParticipant]);
    toast.success("참여자가 추가되었습니다");
    setShowAddParticipantModal(false);
    setNewParticipantName("");
    setNewParticipantRelation("");
    setNewParticipantPhone("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedType) {
      toast.error("캡슐 유형을 선택해주세요");
      return;
    }

    if (!selectedYear || !selectedMonth || !selectedDay) {
      toast.error("전달일을 선택해주세요");
      return;
    }

    if (!recipientName.trim()) {
      toast.error("받는 사람 이름을 입력해주세요");
      return;
    }

    if (!recipientRelation) {
      toast.error("받는 사람과의 관계를 선택해주세요");
      return;
    }

    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success("타임캡슐이 수정되었습니다!");
    navigate(`/time-capsule/${id}`);
    setIsSubmitting(false);
  };

  if (!existingData) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">타임캡슐을 찾을 수 없습니다</p>
            <Button onClick={() => navigate("/time-capsule")}>돌아가기</Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Helmet>
        <title>타임캡슐 수정하기 - Orange Mail</title>
      </Helmet>

      <div className="h-full overflow-auto bg-muted/30">
        {/* Header */}
        <header className="h-14 border-b border-border/40 bg-white/80 backdrop-blur-sm flex items-center px-6">
          <button
            onClick={() => navigate(`/time-capsule/${id}`)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">타임캡슐로 돌아가기</span>
          </button>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-10">
          <form onSubmit={handleSubmit}>
            {/* 흰색 카드 박스 */}
            <div className="bg-white rounded-2xl border border-border/60 p-8 space-y-[30px]">

            {/* 1. 어떤 날을 위한 캡슐인가요? - 수정 가능 */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">1</span>
                <Label className="text-base font-semibold text-foreground">
                  어떤 날을 위한 캡슐인가요?
                </Label>
                <span className="text-xs text-primary ml-2">(수정 가능)</span>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {capsuleTypes.map((type) => {
                  const IconComponent = type.icon;
                  const isSelected = selectedType === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedType(type.id)}
                      className="flex flex-col items-center gap-2 cursor-pointer"
                    >
                      <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center transition-all",
                        isSelected
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                      )}>
                        <IconComponent className="w-7 h-7" />
                      </div>
                      <span className={cn(
                        "text-xs font-medium text-center",
                        isSelected ? "text-primary" : "text-gray-400"
                      )}>
                        {type.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 2. 타임캡슐 전달일 - 수정 가능 */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">2</span>
                <Label className="text-base font-semibold text-foreground">
                  타임캡슐 전달일
                </Label>
                <span className="text-xs text-primary ml-2">(수정 가능)</span>
              </div>

              <div className="flex gap-3">
                {/* 연도 선택 */}
                <Select value={selectedYear} onValueChange={(value) => {
                  setSelectedYear(value);
                  setSelectedDay("");
                }}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="연도 선택" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}년
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* 월 선택 */}
                <Select value={selectedMonth} onValueChange={(value) => {
                  setSelectedMonth(value);
                  setSelectedDay("");
                }}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="월 선택" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    {months.map((month) => (
                      <SelectItem key={month} value={month.toString()}>
                        {month}월
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* 일 선택 */}
                <Select value={selectedDay} onValueChange={setSelectedDay} disabled={!selectedYear || !selectedMonth}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="일 선택" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50 max-h-60">
                    {days.map((day) => (
                      <SelectItem key={day} value={day.toString()}>
                        {day}일
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedType === "release" && (
                <p className="text-xs text-primary mt-3 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" />
                  출소 축하의 경우 출소일 2-3일 전으로 지정해야 전달받을 수 있어요!
                </p>
              )}
            </section>

            {/* 3. 받는 사람 - 수정 가능 */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">3</span>
                <Label className="text-base font-semibold text-foreground">
                  받는 사람
                </Label>
                <span className="text-xs text-primary ml-2">(수정 가능)</span>
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <Label htmlFor="recipientName" className="text-sm font-medium text-foreground mb-1.5 block">
                    이름 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="recipientName"
                    type="text"
                    placeholder="받는 사람 이름"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-sm font-medium text-foreground mb-1.5 block">
                    관계 <span className="text-destructive">*</span>
                  </Label>
                  <Select value={recipientRelation} onValueChange={setRecipientRelation}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="관계를 선택해주세요" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      {relationOptions.map((relation) => (
                        <SelectItem key={relation} value={relation}>
                          {relation}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            {/* 4. 참여자 관리 - 수정 가능 */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">4</span>
                <Label className="text-base font-semibold text-foreground">
                  참여자 관리
                </Label>
                <span className="text-xs text-primary ml-2">(수정 가능)</span>
              </div>

              {/* 참여자 목록 */}
              {participants.length > 0 && (
                <div className="space-y-3 mb-4">
                  {participants.map((participant) => (
                    <motion.div
                      key={participant.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{participant.name}</p>
                          <p className="text-xs text-muted-foreground">{participant.relation} · {participant.phone}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditParticipant(participant)}
                          className="px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveParticipant(participant.id)}
                          className="px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          삭제
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowAddParticipantModal(true)}
                className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 font-medium"
              >
                <Plus className="w-4 h-4" />
                새 참여자 추가하기
              </button>
            </section>

            {/* 5. 쪽지 작성 요일 선택 - 수정 가능 */}
            <section>
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">5</span>
                <Label className="text-base font-semibold text-foreground">
                  쪽지 작성 요일 선택
                </Label>
                <span className="text-xs text-primary ml-2">(수정 가능)</span>
              </div>

              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                요일을 정하는 건 약속이 아니라, 마음을 전할 수 있는 기준을 만드는 일입니다. 길지 않아도 괜찮아요. 그 한 줄이, 누군가에겐 오늘을 넘기는 힘이 됩니다.
              </p>

              <div className="flex gap-2">
                {weekDays.map((day) => {
                  const isSelected = selectedWeekDay === day.id;
                  return (
                    <button
                      key={day.id}
                      type="button"
                      onClick={() => setSelectedWeekDay(isSelected ? null : day.id)}
                      className={cn(
                        "flex-1 py-3 rounded-xl text-sm font-medium transition-all border-2",
                        isSelected
                          ? "text-primary border-primary bg-white"
                          : "text-gray-400 border-gray-200 bg-white hover:border-gray-300"
                      )}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 제출 버튼 */}
            <section className="pt-4 space-y-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-6 bg-primary hover:bg-primary/90 text-lg font-semibold rounded-2xl shadow-lg"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : null}
                타임캡슐 수정 완료
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                수정된 내용은 모든 참여자에게 알림이 전송됩니다.
              </p>
            </section>

            </div>
          </form>
        </main>
      </div>

      {/* 참여자 수정 모달 */}
      <Dialog open={showEditParticipantModal} onOpenChange={setShowEditParticipantModal}>
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              참여자 정보 수정
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* 이름 */}
            <div>
              <Label htmlFor="editName" className="text-sm font-medium text-foreground mb-1.5 block">
                이름 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="editName"
                type="text"
                placeholder="참여자 이름"
                value={editParticipantName}
                onChange={(e) => setEditParticipantName(e.target.value)}
                className="w-full"
              />
            </div>

            {/* 관계 */}
            <div>
              <Label className="text-sm font-medium text-foreground mb-1.5 block">
                관계 <span className="text-destructive">*</span>
              </Label>
              <Select value={editParticipantRelation} onValueChange={setEditParticipantRelation}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="관계를 선택해주세요" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  {relationOptions.map((relation) => (
                    <SelectItem key={relation} value={relation}>
                      {relation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 전화번호 또는 이메일 */}
            <div>
              <Label htmlFor="editPhone" className="text-sm font-medium text-foreground mb-1.5 block">
                전화번호 또는 이메일 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="editPhone"
                type="text"
                placeholder="010-0000-0000 또는 이메일주소"
                value={editParticipantPhone}
                onChange={(e) => setEditParticipantPhone(e.target.value)}
                className="w-full"
              />
            </div>

            {/* 버튼 */}
            <div className="pt-2">
              <Button
                type="button"
                onClick={handleSaveParticipant}
                className="w-full bg-primary hover:bg-primary/90"
              >
                수정 완료
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 새 참여자 추가 모달 */}
      <Dialog open={showAddParticipantModal} onOpenChange={setShowAddParticipantModal}>
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              새 참여자 추가
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* 이름 */}
            <div>
              <Label htmlFor="newName" className="text-sm font-medium text-foreground mb-1.5 block">
                이름 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="newName"
                type="text"
                placeholder="참여자 이름"
                value={newParticipantName}
                onChange={(e) => setNewParticipantName(e.target.value)}
                className="w-full"
              />
            </div>

            {/* 관계 */}
            <div>
              <Label className="text-sm font-medium text-foreground mb-1.5 block">
                관계 <span className="text-destructive">*</span>
              </Label>
              <Select value={newParticipantRelation} onValueChange={setNewParticipantRelation}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="관계를 선택해주세요" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  {relationOptions.map((relation) => (
                    <SelectItem key={relation} value={relation}>
                      {relation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 전화번호 또는 이메일 */}
            <div>
              <Label htmlFor="newPhone" className="text-sm font-medium text-foreground mb-1.5 block">
                전화번호 또는 이메일 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="newPhone"
                type="text"
                placeholder="010-0000-0000 또는 이메일주소"
                value={newParticipantPhone}
                onChange={(e) => setNewParticipantPhone(e.target.value)}
                className="w-full"
              />
            </div>

            {/* 버튼 */}
            <div className="pt-2">
              <Button
                type="button"
                onClick={handleAddParticipant}
                className="w-full bg-primary hover:bg-primary/90"
              >
                추가하기
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
