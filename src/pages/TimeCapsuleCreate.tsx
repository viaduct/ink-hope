import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { 
  ChevronLeft, Home, Sparkles, Cake, Heart, Calendar, 
  ChevronDown, Plus, X, Info, Loader2
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
import { useFamilyMembers } from "@/hooks/useFamilyMembers";
import { toast } from "sonner";

const capsuleTypes = [
  { id: "release", label: "출소 축하", icon: Home, iconBg: "bg-primary/10", iconColor: "text-primary" },
  { id: "parole", label: "가석방 축하", icon: Sparkles, iconBg: "bg-muted", iconColor: "text-muted-foreground" },
  { id: "birthday", label: "생일 축하", icon: Cake, iconBg: "bg-muted", iconColor: "text-muted-foreground" },
  { id: "encouragement", label: "응원 메시지", icon: Heart, iconBg: "bg-muted", iconColor: "text-muted-foreground" },
  { id: "anniversary", label: "기념일", icon: Calendar, iconBg: "bg-muted", iconColor: "text-muted-foreground" },
];

export default function TimeCapsuleCreate() {
  const navigate = useNavigate();
  const { familyMembers } = useFamilyMembers();
  
  const [selectedType, setSelectedType] = useState("release");
  const [title, setTitle] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [targetLetters, setTargetLetters] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [newParticipant, setNewParticipant] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddParticipant = () => {
    if (newParticipant.trim() && !participants.includes(newParticipant.trim())) {
      setParticipants([...participants, newParticipant.trim()]);
      setNewParticipant("");
    }
  };

  const handleRemoveParticipant = (participant: string) => {
    setParticipants(participants.filter(p => p !== participant));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !recipientId || !targetDate) {
      toast.error("필수 항목을 모두 입력해주세요");
      return;
    }

    setIsSubmitting(true);
    
    // 실제 구현 시 DB에 저장
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("타임캡슐이 생성되었습니다!");
    navigate("/");
    setIsSubmitting(false);
  };

  return (
    <>
      <Helmet>
        <title>새 타임캡슐 만들기 - Orange Mail</title>
      </Helmet>

      <div className="min-h-screen bg-muted/30">
        {/* Header */}
        <header className="bg-background border-b border-border/60 sticky top-0 z-50">
          <div className="max-w-lg mx-auto px-6 h-14 flex items-center justify-between">
            <button 
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">뒤로</span>
            </button>
            <span className="font-semibold text-foreground">새 타임캡슐 만들기</span>
            <div className="w-16"></div>
          </div>
        </header>

        <main className="max-w-lg mx-auto px-6 py-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. 캡슐 종류 선택 */}
            <section>
              <Label className="block text-sm font-semibold text-foreground mb-4">
                어떤 날을 위한 캡슐인가요?
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {capsuleTypes.map((type) => {
                  const IconComponent = type.icon;
                  const isSelected = selectedType === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedType(type.id)}
                      className={`flex flex-col items-center p-4 bg-background border-2 rounded-2xl transition-all ${
                        isSelected 
                          ? "border-primary bg-primary/5 shadow-[0_0_0_3px_rgba(var(--primary),0.1)]" 
                          : "border-border hover:border-primary/40 hover:bg-primary/5"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition-colors ${
                        isSelected ? "bg-primary text-primary-foreground" : type.iconBg
                      }`}>
                        <IconComponent className={`w-6 h-6 ${isSelected ? "" : type.iconColor}`} />
                      </div>
                      <span className={`text-sm font-medium ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                        {type.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 2. 캡슐 이름 */}
            <section>
              <Label htmlFor="title" className="block text-sm font-semibold text-foreground mb-2">
                캡슐 이름
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="예: 아버지 출소 축하 편지 모음"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full"
                required
              />
              <p className="text-xs text-muted-foreground mt-2">받는 분과 참여자들이 볼 수 있는 이름이에요</p>
            </section>

            {/* 3. 받는 사람 */}
            <section>
              <Label className="block text-sm font-semibold text-foreground mb-2">
                받는 사람
              </Label>
              <Select value={recipientId} onValueChange={setRecipientId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="소중한 사람을 선택해주세요" />
                </SelectTrigger>
                <SelectContent>
                  {familyMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name} ({member.relation}) · {member.facility}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <button 
                type="button"
                onClick={() => navigate("/")} // 실제로는 수신자 추가 모달
                className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 mt-2"
              >
                <Plus className="w-4 h-4" />
                새로운 수신자 등록하기
              </button>
            </section>

            {/* 4. 전달 예정일 */}
            <section>
              <Label htmlFor="targetDate" className="block text-sm font-semibold text-foreground mb-2">
                전달 예정일
              </Label>
              <Input
                id="targetDate"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full"
                required
              />
              <p className="text-xs text-muted-foreground mt-2">출소일, 가석방일, 생일 등 전달하고 싶은 날짜를 선택하세요</p>
            </section>

            {/* 5. 목표 편지 수 */}
            <section>
              <Label className="block text-sm font-semibold text-foreground mb-2">
                목표 편지 수 <span className="font-normal text-muted-foreground">(선택)</span>
              </Label>
              <Select value={targetLetters} onValueChange={setTargetLetters}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="제한 없음" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">제한 없음</SelectItem>
                  <SelectItem value="3">3통</SelectItem>
                  <SelectItem value="5">5통</SelectItem>
                  <SelectItem value="10">10통</SelectItem>
                  <SelectItem value="15">15통</SelectItem>
                  <SelectItem value="20">20통</SelectItem>
                </SelectContent>
              </Select>
            </section>

            {/* 6. 참여자 초대 */}
            <section>
              <Label className="block text-sm font-semibold text-foreground mb-2">
                참여자 초대 <span className="font-normal text-muted-foreground">(선택)</span>
              </Label>
              
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
                  placeholder="전화번호 또는 이메일 입력"
                  value={newParticipant}
                  onChange={(e) => setNewParticipant(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddParticipant())}
                  className="flex-1"
                />
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={handleAddParticipant}
                  className="px-4"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>

              {/* 안내 메시지 */}
              <div className="flex items-start gap-2 mt-4 p-4 bg-blue-50 rounded-xl">
                <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700">
                  지금 초대하지 않아도 괜찮아요.<br />
                  캡슐을 만든 후 <span className="font-medium">초대 코드</span>로 언제든 초대할 수 있어요.
                </p>
              </div>
            </section>

            {/* 제출 버튼 */}
            <section className="pt-4">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-6 bg-primary hover:bg-primary/90 text-lg font-semibold rounded-2xl shadow-lg"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : null}
                캡슐 만들기
              </Button>
              <p className="text-center text-sm text-muted-foreground mt-3">
                캡슐을 만들면 바로 편지를 쓸 수 있어요
              </p>
            </section>
          </form>
        </main>
      </div>
    </>
  );
}
