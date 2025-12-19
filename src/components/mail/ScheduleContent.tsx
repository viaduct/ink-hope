import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScheduleContent() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      {/* 헤더 */}
      <div className="p-6 border-b border-border/40">
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-primary" />
          스케줄 관리
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          편지 발송 일정을 관리하세요
        </p>
      </div>

      {/* 캘린더 영역 */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className={cn("rounded-xl border shadow-sm bg-card p-4 pointer-events-auto")}
        />
      </div>
    </div>
  );
}
