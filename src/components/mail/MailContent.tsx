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
              {/* Subject Bar */}
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-normal text-foreground">
                    {selectedMail.subject}
                  </h1>
                  {!selectedMail.isRead && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded bg-accent text-primary">
                      받은편지함
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 print:hidden">
                  <button 
                    onClick={() => window.print()}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors"
                  >
                    <Printer className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Sender Info */}
              <div className="px-6 py-4 flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm flex-shrink-0",
                      selectedMail.sender.color
                    )}
                  >
                    {selectedMail.sender.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">
                        {selectedMail.sender.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        &lt;{selectedMail.sender.facility}&gt;
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      나에게 ▼
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground mr-2">
                    {selectedMail.date}
                  </span>
                  <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors print:hidden">
                    <Star className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors print:hidden">
                    <Reply className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Mail Content */}
              <div className="px-6 py-4 pl-[70px]">
                <div className="text-foreground leading-[1.8] whitespace-pre-wrap">
                  {selectedMail.content}
                </div>
              </div>

              {/* Reply Button */}
              <div className="px-6 py-6 pl-[70px] print:hidden">
                <Button
                  onClick={onReply}
                  variant="outline"
                  className="h-10 px-6 rounded-full border-border text-foreground hover:bg-secondary"
                >
                  <Reply className="w-4 h-4 mr-2" />
                  답장
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
