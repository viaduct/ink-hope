import { useState } from "react";
import { Image, Reply, Bookmark, ChevronLeft, ChevronRight, Printer, Download, Star, Trash2, Mail as MailIcon, Send, Calendar, Pencil, Truck, FileEdit, Forward, AlertTriangle, FolderInput, MoreHorizontal, RefreshCw, Eye, EyeOff, ReplyAll } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Mail, FolderType, FamilyMember } from "@/types/mail";
import { motion, AnimatePresence } from "framer-motion";

interface MailContentProps {
  mails: Mail[];
  selectedMail: Mail | null;
  onSelectMail: (mail: Mail | null) => void;
  activeFolder: FolderType;
  onReply: () => void;
  selectedMember?: FamilyMember | null;
  allMails?: Mail[];
  onMoveToFolder?: (mailId: string, targetFolder: FolderType) => void;
  onEditAddressBook?: () => void;
}

const folderTitles: Record<FolderType, string> = {
  inbox: "받은 편지함",
  sent: "보낸 편지함",
  draft: "임시보관함",
  archive: "중요편지함",
  gallery: "갤러리",
  schedule: "스케줄 관리",
  spam: "스팸함",
  trash: "휴지통",
  orangetree: "오렌지 나무",
  timecapsule: "타임캡슐",
  deals: "특가 할인",
  faq: "자주 묻는 질문",
  feedback: "고객의 소리",
  rewards: "내가 받은 경품",
};

type TabType = "all" | "unread" | "handwritten";

export function MailContent({
  mails,
  selectedMail,
  onSelectMail,
  activeFolder,
  onReply,
  selectedMember,
  allMails = [],
  onMoveToFolder,
  onEditAddressBook,
}: MailContentProps) {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [selectedMailIds, setSelectedMailIds] = useState<Set<string>>(new Set());

  const toggleMailSelection = (mailId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedMailIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(mailId)) {
        newSet.delete(mailId);
      } else {
        newSet.add(mailId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedMailIds.size === filteredMails.length) {
      setSelectedMailIds(new Set());
    } else {
      setSelectedMailIds(new Set(filteredMails.map(m => m.id)));
    }
  };

  const unreadCount = mails.filter((mail) => !mail.isRead).length;
  const handwrittenCount = mails.filter((mail) => mail.isHandwritten).length;

  // 선택된 멤버와의 통계 계산
  const memberStats = selectedMember ? {
    receivedCount: allMails.filter((mail) => mail.sender.id === selectedMember.id).length,
    sentCount: 0, // 보낸 편지 데이터가 있으면 여기서 계산
    lastMailDate: mails.length > 0 ? mails[0].date : "없음",
  } : null;

  const filteredMails = mails.filter((mail) => {
    if (activeTab === "unread") return !mail.isRead;
    if (activeTab === "handwritten") return mail.isHandwritten;
    return true;
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      {/* Action Toolbar */}
      <div className="h-14 border-b border-border bg-muted/30 flex items-center justify-between px-4">
        <div className="flex items-center gap-1">
          {/* 전체선택 체크박스 */}
          {!selectedMail && (
            <button
              onClick={toggleSelectAll}
              className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors mr-2"
            >
              <div className={cn(
                "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                selectedMailIds.size === filteredMails.length && filteredMails.length > 0
                  ? "bg-primary border-primary"
                  : selectedMailIds.size > 0
                    ? "bg-primary/50 border-primary"
                    : "border-muted-foreground/40"
              )}>
                {selectedMailIds.size > 0 && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>
          )}

          {/* 뒤로/이전 버튼 */}
          <button
            onClick={() => selectedMail ? onSelectMail(null) : null}
            className="h-9 px-3 flex items-center gap-1 rounded-full border border-border bg-background text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {selectedMail ? "답장" : ""}
          </button>

          {selectedMail ? (
            <>
              <button className="h-9 px-4 text-sm text-muted-foreground hover:text-foreground transition-colors">
                전체답장
              </button>
              <button className="h-9 px-4 text-sm text-muted-foreground hover:text-foreground transition-colors">
                전달
              </button>
            </>
          ) : null}

          <button 
            onClick={() => selectedMail && onMoveToFolder?.(selectedMail.id, "trash")}
            className="h-9 px-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            삭제
          </button>
          <button 
            onClick={() => selectedMail && onMoveToFolder?.(selectedMail.id, "spam")}
            className="h-9 px-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            스팸신고
          </button>

          {!selectedMail && (
            <button className="h-9 px-4 text-sm text-muted-foreground hover:text-foreground transition-colors">
              전달
            </button>
          )}

          {/* 구분선 */}
          <div className="w-px h-5 bg-border mx-2" />

          {/* 이동 드롭다운 */}
          <DropdownMenu>
            <DropdownMenuTrigger className="h-9 px-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
              이동
              <ChevronRight className="w-3 h-3 rotate-90" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white z-50">
              <DropdownMenuItem onClick={() => selectedMail && onMoveToFolder?.(selectedMail.id, "inbox")}>
                받은 편지함
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => selectedMail && onMoveToFolder?.(selectedMail.id, "spam")}>
                스팸함
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => selectedMail && onMoveToFolder?.(selectedMail.id, "trash")}>
                휴지통
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 읽음 표시 드롭다운 (리스트뷰) */}
          {!selectedMail && (
            <DropdownMenu>
              <DropdownMenuTrigger className="h-9 px-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                읽음 표시
                <ChevronRight className="w-3 h-3 rotate-90" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white z-50">
                <DropdownMenuItem>
                  <Eye className="w-4 h-4 mr-2" />
                  읽음으로 표시
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <EyeOff className="w-4 h-4 mr-2" />
                  읽지않음으로 표시
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* 추가 기능 드롭다운 (상세뷰) */}
          {selectedMail && (
            <DropdownMenu>
              <DropdownMenuTrigger className="h-9 px-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                추가 기능
                <ChevronRight className="w-3 h-3 rotate-90" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white z-50">
                <DropdownMenuItem onClick={() => window.print()}>
                  <Printer className="w-4 h-4 mr-2" />
                  인쇄
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="w-4 h-4 mr-2" />
                  다운로드
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* 오른쪽: 페이지네이션 & 새로고침 */}
        <div className="flex items-center gap-2">
          {!selectedMail && (
            <>
              <span className="text-sm text-muted-foreground">
                1 / {mails.length}
              </span>
              <button className="h-9 px-3 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                새로고침
                <RefreshCw className="w-4 h-4" />
              </button>
            </>
          )}
          <button className="h-9 w-9 flex items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Header */}
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          {!selectedMail && (
            <>
              <h1 className="text-lg font-semibold text-foreground">
                {selectedMember 
                  ? `${selectedMember.name}님과의 편지` 
                  : folderTitles[activeFolder]}
              </h1>
              <span className="text-sm text-muted-foreground">
                {mails.length}개의 편지
              </span>
            </>
          )}
          {selectedMail && (
            <h1 className="text-lg font-semibold text-foreground">
              {selectedMail.subject}
            </h1>
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
              {/* 선택된 멤버 통계 */}
              {selectedMember && memberStats && (
                <div className="px-6 py-4 bg-accent/30 border-b border-border">
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center font-medium text-lg flex-shrink-0",
                        selectedMember.color
                      )}
                    >
                      {selectedMember.avatar}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{selectedMember.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedMember.relation} · {selectedMember.facility}</p>
                    </div>
                    <button
                      onClick={onEditAddressBook}
                      className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      title="주소록 수정"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 bg-background rounded-lg p-3 shadow-sm">
                      <MailIcon className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">받은 편지</p>
                        <p className="font-semibold text-foreground">{memberStats.receivedCount}통</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-background rounded-lg p-3 shadow-sm">
                      <Send className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">보낸 편지</p>
                        <p className="font-semibold text-foreground">{memberStats.sentCount}통</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-background rounded-lg p-3 shadow-sm">
                      <Calendar className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">마지막 편지</p>
                        <p className="font-semibold text-foreground">{memberStats.lastMailDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

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
                {activeFolder === "inbox" && handwrittenCount > 0 && (
                  <button
                    onClick={() => setActiveTab("handwritten")}
                    className={cn(
                      "text-sm font-medium transition-colors pb-2 -mb-3 border-b-2 flex items-center gap-1",
                      activeTab === "handwritten"
                        ? "text-primary border-primary"
                        : "text-muted-foreground border-transparent hover:text-foreground"
                    )}
                  >
                    <FileEdit className="w-3.5 h-3.5" />
                    손편지 <span className="ml-1">{handwrittenCount}</span>
                  </button>
                )}
              </div>

              {/* Mail List */}
              <div className="flex-1 overflow-y-auto scrollbar-thin">
                <div className="divide-y divide-border">
                  {filteredMails.map((mail) => (
                    <div
                      key={mail.id}
                      onClick={() => onSelectMail(mail)}
                      className={cn(
                        "w-full text-left px-6 py-4 bg-card hover:bg-secondary/50 transition-all duration-150 cursor-pointer",
                        selectedMailIds.has(mail.id) && "bg-primary/5"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {/* 체크박스 */}
                        <button
                          onClick={(e) => toggleMailSelection(mail.id, e)}
                          className="p-1 -ml-1 rounded hover:bg-secondary transition-colors flex-shrink-0"
                        >
                          <div className={cn(
                            "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                            selectedMailIds.has(mail.id)
                              ? "bg-primary border-primary"
                              : "border-muted-foreground/40 hover:border-primary"
                          )}>
                            {selectedMailIds.has(mail.id) && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </button>
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
                              {mail.isHandwritten && (
                                <span className="inline-flex items-center gap-1 text-xs text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full font-medium">
                                  <FileEdit className="w-3 h-3" />
                                  손편지
                                </span>
                              )}
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
                          {/* 보낸편지함 진행상태 */}
                          {activeFolder === "sent" && mail.status && (
                            <div className="mt-2 flex items-center gap-1.5">
                              <Truck className="w-3.5 h-3.5 text-primary" />
                              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                {mail.status}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
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
                      나에게
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground mr-2">
                    {selectedMail.date}
                  </span>
                  <button 
                    onClick={onReply}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors print:hidden"
                    title="답장"
                  >
                    <Reply className="w-5 h-5" />
                  </button>
                  {/* 더보기 드롭다운 */}
                  <DropdownMenu>
                    <DropdownMenuTrigger className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors print:hidden">
                      <MoreHorizontal className="w-5 h-5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-white z-50">
                      <DropdownMenuItem onClick={onReply} className="gap-3">
                        <Reply className="w-4 h-4" />
                        답장
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-3">
                        <Forward className="w-4 h-4" />
                        전달
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onMoveToFolder?.(selectedMail.id, "trash")}
                        className="gap-3"
                      >
                        <Trash2 className="w-4 h-4" />
                        삭제
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-3">
                        <EyeOff className="w-4 h-4" />
                        읽지않음으로 표시
                      </DropdownMenuItem>
                      <div className="my-1 border-t border-border" />
                      <DropdownMenuItem className="gap-3">
                        <AlertTriangle className="w-4 h-4" />
                        {selectedMail.sender.name}님 차단
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onMoveToFolder?.(selectedMail.id, "spam")}
                        className="gap-3"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        스팸 신고
                      </DropdownMenuItem>
                      <div className="my-1 border-t border-border" />
                      <DropdownMenuItem onClick={() => window.print()} className="gap-3">
                        <Printer className="w-4 h-4" />
                        인쇄
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-3">
                        <Download className="w-4 h-4" />
                        메시지 다운로드
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
