import { useState } from "react";
import { Image, Reply, Bookmark, ChevronLeft, ChevronRight, Printer, Download, Star, Trash2, Mail as MailIcon, Send, Calendar, Pencil, Truck, FileEdit, Forward, AlertTriangle, FolderInput, MoreHorizontal, RefreshCw, Eye, EyeOff, ReplyAll } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Mail, FolderType, FamilyMember } from "@/types/mail";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

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
  const [spamReportOpen, setSpamReportOpen] = useState(false);

  const unreadCount = mails.filter((mail) => !mail.isRead).length;
  const handwrittenCount = mails.filter((mail) => mail.isHandwritten).length;

  // 선택된 멤버와의 통계 계산
  const memberStats = selectedMember ? {
    receivedCount: allMails.filter((mail) => mail.sender.id === selectedMember.id).length,
    sentCount: 0, // 보낸 편지 데이터가 있으면 여기서 계산
    lastMailDate: mails.length > 0 ? mails[0].date : "없음",
  } : null;

  // 탭에 따라 해당 항목을 상단에 정렬 (전체 리스트 유지)
  const sortedMails = [...mails].sort((a, b) => {
    if (activeTab === "unread") {
      // 읽지않음 탭: 읽지않은 편지가 상단에
      if (!a.isRead && b.isRead) return -1;
      if (a.isRead && !b.isRead) return 1;
      return 0;
    }
    if (activeTab === "handwritten") {
      // 손편지 탭: 손편지가 상단에
      if (a.isHandwritten && !b.isHandwritten) return -1;
      if (!a.isHandwritten && b.isHandwritten) return 1;
      return 0;
    }
    return 0; // 전체 탭은 원래 순서 유지
  });

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
    if (selectedMailIds.size === sortedMails.length) {
      setSelectedMailIds(new Set());
    } else {
      setSelectedMailIds(new Set(sortedMails.map(m => m.id)));
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      {/* Header - 목록 뷰에서만 표시 (최상단) */}
      {!selectedMail && (
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-foreground">
              {selectedMember
                ? `${selectedMember.name}님과의 편지`
                : folderTitles[activeFolder]}
            </h1>
            <span className="text-sm text-muted-foreground">
              {mails.length}개의 편지
            </span>
          </div>
        </header>
      )}

      {/* Action Toolbar - 폴더 타이틀 아래 (목록 뷰에서만) */}
      {!selectedMail && (
        <div className="h-12 border-b border-border bg-muted/30 flex items-center justify-between px-4">
          <div className="flex items-center gap-1">
            {/* 전체선택 체크박스 */}
            <button
              onClick={toggleSelectAll}
              className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
            >
              <div className={cn(
                "w-4 h-4 rounded border-2 flex items-center justify-center transition-colors",
                selectedMailIds.size === sortedMails.length && sortedMails.length > 0
                  ? "bg-primary border-primary"
                  : selectedMailIds.size > 0
                    ? "bg-primary/50 border-primary"
                    : "border-muted-foreground/40"
              )}>
                {selectedMailIds.size > 0 && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>

            <button className="h-9 px-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
              삭제
            </button>
            <button
              onClick={() => selectedMailIds.size > 0 && setSpamReportOpen(true)}
              className="h-9 px-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              스팸신고
            </button>
            <button className="h-9 px-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
              전달
            </button>

            {/* 구분선 */}
            <div className="w-px h-5 bg-border mx-2" />

            {/* 이동 드롭다운 */}
            <DropdownMenu>
              <DropdownMenuTrigger className="h-9 px-3 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                이동
                <ChevronRight className="w-3 h-3 rotate-90" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white z-50">
                <DropdownMenuItem>받은 편지함</DropdownMenuItem>
                <DropdownMenuItem>스팸함</DropdownMenuItem>
                <DropdownMenuItem>휴지통</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 읽음 표시 드롭다운 */}
            <DropdownMenu>
              <DropdownMenuTrigger className="h-9 px-3 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
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
          </div>

          {/* 오른쪽: 페이지네이션 & 새로고침 */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              1 / {mails.length}
            </span>
            <button
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              title="새로고침"
            >
              새로고침
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

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
              </div>

              {/* Mail List */}
              <div className="flex-1 overflow-y-auto scrollbar-thin">
                <div className="divide-y divide-border">
                  {sortedMails.map((mail) => (
                    <div
                      key={mail.id}
                      onClick={() => onSelectMail(mail)}
                      className={cn(
                        "w-full text-left px-4 py-3 bg-card hover:bg-secondary/50 transition-all duration-150 cursor-pointer",
                        selectedMailIds.has(mail.id) && "bg-primary/5"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {/* 체크박스 */}
                        <button
                          onClick={(e) => toggleMailSelection(mail.id, e)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors flex-shrink-0"
                        >
                          <div className={cn(
                            "w-4 h-4 rounded border-2 flex items-center justify-center transition-colors",
                            selectedMailIds.has(mail.id)
                              ? "bg-primary border-primary"
                              : "border-muted-foreground/40 hover:border-primary"
                          )}>
                            {selectedMailIds.has(mail.id) && (
                              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </button>

                        {/* 중요편지 별표 */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: 중요편지 토글 로직
                          }}
                          className="p-1 rounded hover:bg-secondary transition-colors flex-shrink-0"
                        >
                          <Star className={cn(
                            "w-4 h-4 transition-colors",
                            mail.isImportant
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground/50 hover:text-yellow-400"
                          )} />
                        </button>

                        {/* 발신자명 */}
                        <span
                          className={cn(
                            "text-sm w-24 flex-shrink-0 truncate",
                            mail.isRead
                              ? "font-medium text-foreground/80"
                              : "font-semibold text-foreground"
                          )}
                        >
                          {mail.sender.name}
                        </span>

                        {/* 제목 */}
                        <p
                          className={cn(
                            "text-sm flex-1 min-w-0 truncate",
                            mail.isRead
                              ? "font-medium text-foreground/80"
                              : "font-semibold text-foreground"
                          )}
                        >
                          {mail.subject}
                        </p>

                        {/* 보낸편지함 진행상태 */}
                        {activeFolder === "sent" && mail.status && (
                          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full flex-shrink-0">
                            {mail.status}
                          </span>
                        )}

                        {/* 날짜 */}
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {mail.date}
                        </span>
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
              {/* Title Bar */}
              <header className="h-14 border-b border-border bg-card flex items-center px-6">
                <button
                  onClick={() => onSelectMail(null)}
                  className="p-1.5 -ml-1.5 mr-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h1 className="text-lg font-semibold text-foreground">
                  {selectedMail.folder === "inbox" ? "받은편지함" :
                   selectedMail.folder === "sent" ? "보낸편지함" :
                   selectedMail.folder === "draft" ? "임시저장함" :
                   selectedMail.folder === "archive" ? "중요편지함" :
                   selectedMail.folder === "trash" ? "휴지통" : "편지함"} 상세
                </h1>
              </header>

              {/* Subject & Sender Info */}
              <div className="px-6 py-5 border-b border-border space-y-3">
                {/* Subject Row */}
                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-xl font-bold text-foreground flex-1">
                    {selectedMail.subject}
                  </h1>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="text-sm text-muted-foreground mr-1">
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

                {/* Sender/Recipient Info - 폴더별 다르게 표시 */}
                <div className="space-y-1">
                  {selectedMail.folder === "sent" || selectedMail.folder === "draft" ? (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">보낸사람</span>
                        <span className="text-sm text-foreground">
                          나&lt;user@toorange.kr&gt;
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">받는사람</span>
                        <span className="text-sm text-foreground">
                          {selectedMail.sender.name}&lt;{selectedMail.sender.facility}&gt;
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">보낸사람</span>
                        <span className="text-sm text-foreground">
                          {selectedMail.sender.name}&lt;{selectedMail.sender.facility}&gt;
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">받는사람</span>
                        <span className="text-sm text-foreground">
                          나&lt;user@toorange.kr&gt;
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Mail Content */}
              <div className="px-6 py-4">
                <div className="text-foreground leading-[1.8] whitespace-pre-wrap">
                  {selectedMail.content}
                </div>
              </div>

              {/* Reply Button */}
              <div className="px-6 py-6 print:hidden">
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

      {/* 스팸신고 팝업 */}
      <Dialog open={spamReportOpen} onOpenChange={setSpamReportOpen}>
        <DialogContent className="sm:max-w-md p-8">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-xl font-bold text-foreground">스팸신고</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground leading-relaxed">
            선택한 메일은 스팸함으로 이동 및 스팸신고되며,<br />
            보낸사람은 수신차단 목록에 추가됩니다.
          </p>

          {/* 선택된 메일 발신자 목록 */}
          <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border">
            <div className="flex flex-col gap-1 items-center justify-center text-center">
              {Array.from(selectedMailIds).map((id) => {
                const mail = mails.find((m) => m.id === id);
                if (!mail) return null;
                return (
                  <span key={id} className="text-sm text-orange-500 font-medium">
                    {mail.sender.name} &lt;{mail.sender.facility}&gt;
                  </span>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center gap-3 mt-6">
            <Button
              onClick={() => {
                // 스팸 처리 로직
                selectedMailIds.forEach((id) => {
                  onMoveToFolder?.(id, "spam");
                });
                setSelectedMailIds(new Set());
                setSpamReportOpen(false);
                toast.success("스팸 신고가 완료되었습니다", {
                  description: "선택한 메일이 스팸함으로 이동되었습니다."
                });
              }}
              className="px-8 bg-orange-400 hover:bg-orange-500 text-foreground font-medium"
            >
              차단
            </Button>
            <Button
              variant="outline"
              onClick={() => setSpamReportOpen(false)}
              className="px-8 border-gray-300"
            >
              취소
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
