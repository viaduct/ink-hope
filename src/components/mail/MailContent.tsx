import { useState } from "react";
import { Search, Image, Reply, Bookmark, ChevronLeft } from "lucide-react";
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

export function MailContent({
  mails,
  selectedMail,
  onSelectMail,
  activeFolder,
  onReply,
}: MailContentProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMails = mails.filter(
    (mail) =>
      mail.subject.includes(searchQuery) ||
      mail.sender.name.includes(searchQuery) ||
      mail.preview.includes(searchQuery)
  );

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
              {/* Search */}
              <div className="px-6 py-4">
                <div className="relative max-w-md">
                  <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="편지 검색..."
                    className="w-full h-10 pl-10 pr-4 bg-card border border-border rounded-xl text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  />
                </div>
              </div>

              {/* Mail Grid */}
              <div className="flex-1 overflow-y-auto scrollbar-thin px-6 pb-6">
                <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {filteredMails.map((mail) => (
                    <button
                      key={mail.id}
                      onClick={() => onSelectMail(mail)}
                      className="text-left p-4 bg-card border border-border rounded-xl transition-all duration-150 hover:shadow-xl shadow-md"
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
                            <span className="text-xs text-muted-foreground">
                              {mail.date}
                            </span>
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
                          <p className="text-xs text-muted-foreground/80 line-clamp-2">
                            {mail.preview}
                          </p>
                        </div>
                      </div>

                      {/* Tags */}
                      {(mail.isNew || mail.hasAttachments) && (
                        <div className="mt-3 flex items-center gap-2">
                          {mail.isNew && (
                            <span className="inline-flex items-center gap-1.5 text-xs text-primary bg-accent px-2 py-0.5 rounded-full font-medium">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                              신규
                            </span>
                          )}
                          {mail.hasAttachments && (
                            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                              <Image className="w-3.5 h-3.5" />
                              사진 {mail.attachmentCount}장
                            </span>
                          )}
                        </div>
                      )}
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
              className="h-full overflow-y-auto scrollbar-thin"
            >
              <div className="max-w-2xl mx-auto p-8">
                {/* Mail Header */}
                <div className="bg-card rounded-2xl shadow-card p-6 mb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-medium text-lg ${selectedMail.sender.color}`}
                      >
                        {selectedMail.sender.avatar}
                      </div>
                      <div>
                        <h2 className="font-semibold text-foreground text-lg">
                          {selectedMail.sender.name}
                          <span className="text-sm font-normal text-muted-foreground ml-2">
                            {selectedMail.sender.relation}
                          </span>
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {selectedMail.sender.facility} · {selectedMail.date} 도착
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
                        <Reply className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
                        <Bookmark className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-xl font-medium text-foreground">
                    {selectedMail.subject}
                  </h3>
                </div>

                {/* Mail Content */}
                <div className="bg-card rounded-2xl shadow-card p-8">
                  <div className="prose prose-gray max-w-none">
                    {selectedMail.content.split("\n\n").map((paragraph, index) => (
                      <p
                        key={index}
                        className="text-foreground/90 leading-relaxed mb-4 last:mb-0"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Reply Button */}
                <div className="mt-8 flex justify-center">
                  <Button
                    onClick={onReply}
                    size="lg"
                    className="h-12 px-8 rounded-xl text-[15px] font-semibold shadow-card hover:shadow-card-hover transition-all duration-200"
                  >
                    <Reply className="w-5 h-5 mr-2" />
                    답장하기
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
