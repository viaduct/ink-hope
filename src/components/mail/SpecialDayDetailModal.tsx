import { motion } from "framer-motion";
import { X, Calendar, Clock, Bell, Edit2, Trash2, Send, Home, Cake, Heart, Users, GraduationCap, Scale, Activity, PenLine, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SpecialDayDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  specialDay: {
    id: number;
    type: string;
    title: string;
    date: string;
    description: string;
  } | null;
  onWriteLetter?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const getTypeInfo = (type: string) => {
  switch (type) {
    case "release":
      return { icon: Home, label: "출소일", color: "bg-orange-100 text-orange-600", accent: "orange" };
    case "birthday":
      return { icon: Cake, label: "생일", color: "bg-pink-100 text-pink-600", accent: "pink" };
    case "anniversary":
      return { icon: Heart, label: "기념일", color: "bg-red-100 text-red-600", accent: "red" };
    case "visit":
      return { icon: Users, label: "면회", color: "bg-blue-100 text-blue-600", accent: "blue" };
    case "program":
      return { icon: GraduationCap, label: "교육", color: "bg-purple-100 text-purple-600", accent: "purple" };
    case "trial":
      return { icon: Scale, label: "재판", color: "bg-gray-100 text-gray-600", accent: "gray" };
    case "health":
      return { icon: Activity, label: "건강검진", color: "bg-green-100 text-green-600", accent: "green" };
    default:
      return { icon: Calendar, label: "기타", color: "bg-gray-100 text-gray-600", accent: "gray" };
  }
};

const getDaysRemaining = (dateStr: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export function SpecialDayDetailModal({ isOpen, onClose, specialDay, onWriteLetter, onEdit, onDelete }: SpecialDayDetailModalProps) {
  if (!isOpen || !specialDay) return null;

  const typeInfo = getTypeInfo(specialDay.type);
  const Icon = typeInfo.icon;
  const daysRemaining = getDaysRemaining(specialDay.date);

  const handleDelete = () => {
    onDelete?.();
    toast.success("날짜가 삭제되었습니다.");
    onClose();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ko-KR", { 
      year: "numeric", 
      month: "long", 
      day: "numeric",
      weekday: "long"
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative z-10 w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-400 to-amber-400 px-6 py-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                <Icon className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white mb-2`}>
                  {typeInfo.label}
                </span>
                <h2 className="text-xl font-bold text-white">{specialDay.title}</h2>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20 transition-colors">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* D-Day */}
        <div className="bg-orange-50 px-6 py-4 border-b border-orange-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-orange-500" />
              <span className="text-sm text-foreground">남은 시간</span>
            </div>
            <div className={`text-xl font-bold ${daysRemaining <= 0 ? "text-green-500" : daysRemaining <= 7 ? "text-red-500" : "text-orange-600"}`}>
              {daysRemaining === 0 ? "D-Day" : daysRemaining > 0 ? `D-${daysRemaining}` : `D-Day (${Math.abs(daysRemaining)}일 지남)`}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* 날짜 정보 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-foreground">{formatDate(specialDay.date)}</p>
                {daysRemaining > 0 && daysRemaining <= 30 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {daysRemaining}일 후에 다가옵니다
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 메모 */}
          {specialDay.description && (
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">메모</p>
              <p className="text-foreground">{specialDay.description}</p>
            </div>
          )}

          {/* 알림 상태 */}
          <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-foreground">편지 발송 미리 알림</p>
                <p className="text-xs text-muted-foreground">7일 전, 3일 전, 당일에 알림을 보내드려요</p>
              </div>
            </div>
          </div>

          {/* 편지 쓰기 버튼 */}
          <button 
            onClick={() => {
              onWriteLetter?.();
              onClose();
            }}
            className="w-full bg-gradient-to-r from-orange-100 to-amber-100 hover:from-orange-200 hover:to-amber-200 rounded-xl p-4 border border-orange-200 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-200 flex items-center justify-center">
                  <PenLine className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-orange-700">지금 편지 쓰기</p>
                  <p className="text-xs text-orange-600/70">
                    {specialDay.title}을 앞두고 마음을 전해요
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-orange-500" />
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-border/40 flex items-center justify-between">
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="border-gray-300 text-foreground hover:bg-gray-100"
            >
              <Edit2 className="w-4 h-4 mr-1.5" />
              수정
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="border-red-200 text-red-500 hover:text-red-600 hover:bg-red-50 hover:border-red-300"
            >
              <Trash2 className="w-4 h-4 mr-1.5" />
              삭제
            </Button>
          </div>
          <Button
            onClick={() => {
              onWriteLetter?.();
              onClose();
            }}
            className="bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white"
          >
            <Send className="w-4 h-4 mr-2" />
            편지 쓰기
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
