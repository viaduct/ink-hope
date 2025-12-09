import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeadlineTimerProps {
  deadlineHour?: number;
  isCollapsed?: boolean;
}

export function DeadlineTimer({ deadlineHour = 17, isCollapsed = false }: DeadlineTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const deadline = new Date();
      deadline.setHours(deadlineHour, 0, 0, 0);

      if (now >= deadline) {
        setIsExpired(true);
        return { hours: 0, minutes: 0, seconds: 0 };
      }

      const diff = deadline.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setIsExpired(false);
      return { hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [deadlineHour]);

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  if (isCollapsed) {
    return (
      <div className="flex justify-center">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center">
          <Clock className={cn("w-5 h-5", isExpired ? "text-muted-foreground" : "text-orange-500")} />
        </div>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="px-4 py-3 text-center">
        <p className="text-xs text-muted-foreground mb-1">편지 마감 시간까지</p>
        <div className="border-t border-border pt-2 mt-2">
          <p className="font-semibold text-sm text-muted-foreground">오늘 마감 종료</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 text-center">
      <p className="text-xs text-muted-foreground mb-1">편지 마감 시간까지</p>
      <div className="border-t border-border pt-2 mt-2">
        <p className="font-bold text-lg tracking-wide text-orange-500">
          {formatNumber(timeLeft.hours)}시 {formatNumber(timeLeft.minutes)}분 {formatNumber(timeLeft.seconds)}초
        </p>
      </div>
    </div>
  );
}
