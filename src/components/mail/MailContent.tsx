import { useState } from "react";
import { Image, Reply, Bookmark, ChevronLeft, Printer, Download, Star, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Mail, FolderType } from "@/types/mail";
import { motion, AnimatePresence } from "framer-motion";

interface MailContentProps {
  mails: Mail[];
  selectedMail: Mail | null;
  onSelectMail: (mail: Mail | null) => void;
  activeFolder: FolderType;
  onReply: () => void;
}

const folderTitles: Record<FolderType, string> = {
  inbox: "받은편지함",
  sent: "보낸편지함",
  draft: "임시보관함",
};

type TabType = "all" | "unread" | "important";

export function MailContent({
  mails,
  selectedMail,
  onSelectMail,
  activeFolder,
  onReply,
}: MailContentProps) {
  const [activeTab, setActiveTab] = useState<TabType>("all");

  const unreadCount = mails.filter((mail) => !mail.isRead).length;
  const importantCount = mails.filter((mail) => mail.isImportant).length;

  const filteredMails = mails.filter((mail) => {
    if (activeTab === "unread") return !mail.isRead;
    if (activeTab === "important") return mail.isImportant;
    return true;
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      {/* Header */}
      <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          {selectedMail && (
            <button
              onClick={() => onSelectMail(null)}
              className="p-2 -ml-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-lg font-semibold text-foreground">
            {selectedMail ? selectedMail.subject : folderTitles[activeFolder]}
          </h1>
          {!selectedMail && (
            <span className="text-sm text-muted-foreground">
              {mails.length}개의 편지
            </span>
          )}
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {!selectedMail ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full flex flex-col"
            >
              {/* Tabs */}
              <div className="px-6 py-3 border-b border-border flex items-center gap-6">
                <button
                  onClick={() => setActiveTab("all")}
                  className={cn(
                    "text-sm font-medium transition-colors pb-2 -mb-3 border-b-2",
                    activeTab === "all"
                      ? "text-primary border-primary"
                      : "text-muted-foreground border-transparent hover:text-foreground"
                  )}
                >
                  전체 <span className="ml-1">{mails.length}</span>
                </button>
                <button
                  onClick={() => setActiveTab("unread")}
                  className={cn(
                    "text-sm font-medium transition-colors pb-2 -mb-3 border-b-2",
                    activeTab === "unread"
                      ? "text-primary border-primary"
                      : "text-muted-foreground border-transparent hover:text-foreground"
                  )}
                >
                  읽지않음 <span className="ml-1">{unreadCount}</span>
                </button>
                <button
                  onClick={() => setActiveTab("important")}
                  className={cn(
                    "text-sm font-medium transition-colors pb-2 -mb-3 border-b-2",
                    activeTab === "important"
                      ? "text-primary border-primary"
                      : "text-muted-foreground border-transparent hover:text-foreground"
                  )}
                >
                  중요
                </button>
              </div>

              {/* Mail List */}
              <div className="flex-1 overflow-y-auto scrollbar-thin">
                <div className="divide-y divide-border">
                  {filteredMails.map((mail) => (
                    <button
                      key={mail.id}
                      onClick={() => onSelectMail(mail)}
                      className="w-full text-left px-6 py-4 bg-card hover:bg-secondary/50 transition-all duration-150"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center font-medium flex-shrink-0 text-sm",
                            mail.sender.color
                          )}
                        >
                          {mail.sender.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "text-[15px]",
                                  mail.isRead
                                    ? "font-medium text-foreground/80"
                                    : "font-semibold text-foreground"
                                )}
                              >
                                {mail.sender.name}
                              </span>
                              {!mail.isRead && (
                                <span className="inline-flex items-center gap-1 text-xs text-primary bg-accent px-2 py-0.5 rounded-full font-medium">
                                  읽지않음
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {mail.hasAttachments && (
                                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                  <Image className="w-3.5 h-3.5" />
                                  {mail.attachmentCount}
                                </span>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {mail.date}
                              </span>
                            </div>
                          </div>
                          <p
                            className={cn(
                              "text-sm mb-1 truncate",
                              mail.isRead
                                ? "text-muted-foreground"
                                : "text-foreground font-medium"
                            )}
                          >
                            {mail.subject}
                          </p>
                          <p className="text-xs text-muted-foreground/80 line-clamp-1">
                            {mail.preview}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="h-full overflow-y-auto scrollbar-thin print:overflow-visible"
            >
              <div className="max-w-3xl mx-auto p-8 print:p-0 print:max-w-none">
                {/* Top Actions */}
                <div className="flex items-center justify-between mb-6 print:hidden">
                  <button
                    onClick={() => onSelectMail(null)}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    목록으로
                  </button>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
                      <Star className="w-4 h-4" />
                      즐겨찾기
                    </button>
                    <button 
                      onClick={() => window.print()}
                      className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                    >
                      <Printer className="w-4 h-4" />
                      인쇄
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                      다운로드
                    </button>
                  </div>
                </div>

                {/* Letter Container */}
                <div className="bg-card border border-border rounded-xl overflow-hidden print:border-0 print:shadow-none">
                  {/* Letter Header */}
                  <div className="p-8 border-b border-border">
                    <div className="flex justify-between items-start mb-5">
                      <div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">
                          {selectedMail.sender.name}님께
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          발신: {selectedMail.sender.facility}
                        </p>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <p>수신일: {selectedMail.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!selectedMail.isRead && (
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-accent text-primary">
                          읽지않음
                        </span>
                      )}
                      {selectedMail.isRead && (
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                          읽음
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Letter Body */}
                  <div className="p-8">
                    <h3 className="text-base font-bold text-foreground mb-4">편지 내용</h3>
                    <div className="p-6 bg-secondary/50 border border-border rounded-lg">
                      <div className="text-foreground/90 leading-[1.8] whitespace-pre-wrap">
                        {selectedMail.content}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Actions */}
                  <div className="p-8 border-t border-border bg-secondary/30 print:hidden">
                    <p className="text-sm font-bold text-muted-foreground text-center mb-4">
                      이 편지에 대해
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <Button
                        onClick={onReply}
                        className="h-16 flex-col gap-1 rounded-xl bg-foreground text-background hover:bg-foreground/90"
                      >
                        <Reply className="w-5 h-5" />
                        <span className="text-sm font-bold">답장하기</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-16 flex-col gap-1 rounded-xl border-foreground text-foreground hover:bg-foreground hover:text-background"
                      >
                        <Bookmark className="w-5 h-5" />
                        <span className="text-sm font-bold">보관하기</span>
                      </Button>
                    </div>
                    <div className="flex justify-center gap-3">
                      <button className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-muted-foreground border border-border rounded-lg hover:border-foreground hover:text-foreground transition-colors">
                        <Star className="w-4 h-4" />
                        즐겨찾기
                      </button>
                      <button className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-destructive border border-destructive rounded-lg hover:bg-destructive hover:text-destructive-foreground transition-colors">
                        <Trash2 className="w-4 h-4" />
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
