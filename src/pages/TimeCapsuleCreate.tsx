import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, Home, Sparkles, Cake, Heart, Calendar,
  Plus, X, Info, Loader2, User, ChevronDown
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
import { useFamilyMembers } from "@/hooks/useFamilyMembers";
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

export default function TimeCapsuleCreate() {
  const navigate = useNavigate();
  const { familyMembers } = useFamilyMembers();

  // 기본 상태
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [recipientId, setRecipientId] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [newParticipant, setNewParticipant] = useState("");
  const [selectedWeekDay, setSelectedWeekDay] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 새 수신자 추가 모달 상태
  const [showAddRecipientModal, setShowAddRecipientModal] = useState(false);
  const [newRecipientName, setNewRecipientName] = useState("");
  const [newRecipientPhone, setNewRecipientPhone] = useState("");
  const [newRecipientEmail, setNewRecipientEmail] = useState("");
  const [newRecipientRelation, setNewRecipientRelation] = useState("");

  const years = generateYears();
  const days = selectedYear && selectedMonth
    ? generateDays(parseInt(selectedYear), parseInt(selectedMonth))
    : [];

  const handleAddParticipant = () => {
    if (newParticipant.trim() && !participants.includes(newParticipant.trim())) {
      setParticipants([...participants, newParticipant.trim()]);
      setNewParticipant("");
    }
  };

  const handleRemoveParticipant = (participant: string) => {
    setParticipants(participants.filter(p => p !== participant));
  };

  const handleAddNewRecipient = () => {
    if (!newRecipientName.trim()) {
      toast.error("이름을 입력해주세요");
      return;
    }
    if (!newRecipientRelation) {
      toast.error("관계를 선택해주세요");
      return;
    }
    if (!newRecipientPhone.trim() && !newRecipientEmail.trim()) {
      toast.error("휴대폰번호 또는 이메일 중 하나는 입력해주세요");
      return;
    }

    toast.success(`${newRecipientName}님이 수신자로 등록되었습니다`);
    setShowAddRecipientModal(false);
    setNewRecipientName("");
    setNewRecipientPhone("");
    setNewRecipientEmail("");
    setNewRecipientRelation("");
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
    if (!recipientId) {
      toast.error("받는 사람을 선택해주세요");
      return;
    }

    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success("타임캡슐이 생성되었습니다!");
    navigate("/time-capsule");
    setIsSubmitting(false);
  };

  return (
    <AppLayout>
      <Helmet>
        <title>새 타임캡슐 만들기 - Orange Mail</title>
      </Helmet>

      <div className="h-full overflow-auto bg-muted/30">
        {/* Header */}
        <header className="h-14 border-b border-border/40 bg-white/80 backdrop-blur-sm flex items-center px-6">
          <button
            onClick={() => navigate("/time-capsule")}
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

            {/* 1. 어떤 날을 위한 캡슐인가요? */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">1</span>
                <Label className="text-base font-semibold text-foreground">
                  어떤 날을 위한 캡슐인가요?
                </Label>
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
                      className="flex flex-col items-center gap-2"
                    >
                      <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center transition-all",
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-lg"
                          : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                      )}>
                        <IconComponent className="w-7 h-7" />
                      </div>
                      <span className={cn(
                        "text-xs font-medium text-center",
                        isSelected ? "text-primary" : "text-muted-foreground"
                      )}>
                        {type.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 2. 타임캡슐 전달일 */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">2</span>
                <Label className="text-base font-semibold text-foreground">
                  타임캡슐 전달일
                </Label>
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

            {/* 3. 받는 사람 */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">3</span>
                <Label className="text-base font-semibold text-foreground">
                  받는 사람
                </Label>
              </div>

              <Select value={recipientId} onValueChange={setRecipientId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="소중한 사람을 선택하세요" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  {familyMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name} ({member.relation})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <button
                type="button"
                onClick={() => setShowAddRecipientModal(true)}
                className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 mt-3 font-medium"
              >
                <Plus className="w-4 h-4" />
                새로운 수신자 등록하기
              </button>
            </section>

            {/* 4. 참여자 초대 */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">4</span>
                <Label className="text-base font-semibold text-foreground">
                  참여자 초대
                </Label>
              </div>

              {/* 추가된 참여자들 */}
              {participants.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {participants.map((participant) => (
                    <motion.span
                      key={participant}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {participant}
                      <button
                        type="button"
                        onClick={() => handleRemoveParticipant(participant)}
                        className="hover:text-primary/70"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.span>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="휴대폰번호 또는 이메일주소 입력"
                  value={newParticipant}
                  onChange={(e) => setNewParticipant(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddParticipant())}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={handleAddParticipant}
                  className="px-6 bg-primary hover:bg-primary/90"
                >
                  초대하기
                </Button>
              </div>

              {/* 안내 메시지 */}
              <div className="mt-4 text-sm text-muted-foreground leading-relaxed">
                <p>지금 초대하지 않아도 괜찮아요.</p>
                <p>캡슐을 만든 후 초대 코드로 언제든 초대할 수 있어요.</p>
              </div>
            </section>

            {/* 5. 쪽지 작성 요일 선택 (선택) */}
            <section>
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">5</span>
                <Label className="text-base font-semibold text-foreground">
                  쪽지 작성 요일 선택
                </Label>
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
                타임캡슐 만들기
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                처음 만드는 사람이 방장이에요!
              </p>
            </section>

            </div>
          </form>
        </main>
      </div>

      {/* 새 수신자 추가 모달 */}
      <Dialog open={showAddRecipientModal} onOpenChange={setShowAddRecipientModal}>
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              새로운 수신자 등록
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* 이름 */}
            <div>
              <Label htmlFor="recipientName" className="text-sm font-medium text-foreground mb-1.5 block">
                이름 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="recipientName"
                type="text"
                placeholder="받는 분의 이름"
                value={newRecipientName}
                onChange={(e) => setNewRecipientName(e.target.value)}
                className="w-full"
              />
            </div>

            {/* 관계 */}
            <div>
              <Label className="text-sm font-medium text-foreground mb-1.5 block">
                관계 <span className="text-destructive">*</span>
              </Label>
              <Select value={newRecipientRelation} onValueChange={setNewRecipientRelation}>
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

            {/* 휴대폰 번호 */}
            <div>
              <Label htmlFor="recipientPhone" className="text-sm font-medium text-foreground mb-1.5 block">
                휴대폰번호
              </Label>
              <Input
                id="recipientPhone"
                type="tel"
                placeholder="010-0000-0000"
                value={newRecipientPhone}
                onChange={(e) => setNewRecipientPhone(e.target.value)}
                className="w-full"
              />
            </div>

            {/* 이메일 */}
            <div>
              <Label htmlFor="recipientEmail" className="text-sm font-medium text-foreground mb-1.5 block">
                이메일
              </Label>
              <Input
                id="recipientEmail"
                type="email"
                placeholder="example@email.com"
                value={newRecipientEmail}
                onChange={(e) => setNewRecipientEmail(e.target.value)}
                className="w-full"
              />
            </div>

            <p className="text-xs text-primary flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              휴대폰번호와 이메일 중 하나는 입력해주세요.
            </p>

            {/* 버튼 */}
            <div className="pt-2">
              <Button
                type="button"
                onClick={handleAddNewRecipient}
                className="w-full bg-primary hover:bg-primary/90"
              >
                등록하기
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
