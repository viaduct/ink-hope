import { Mail, Send, FileText, Settings, PenLine, ChevronDown, ChevronRight, Star, Trash2, Menu, X, Plus, Folder, FolderOpen, Bell, Inbox } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { FamilyMember, FolderType } from "@/types/mail";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AddressBookModal } from "./AddressBookModal";
import { DeadlineTimer } from "./DeadlineTimer";
import orangeRipe from "@/assets/emoticons/orange-ripe.png";
interface SidebarProps {
  familyMembers: FamilyMember[];
  activeFolder: FolderType | null;
  onFolderChange: (folder: FolderType) => void;
  unreadCount: number;
  draftCount: number;
  archiveCount: number;
  trashCount: number;
  onCompose: () => void;
  isComposeOpen?: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  selectedMemberId: string | null;
  onSelectMember: (memberId: string | null) => void;
  onUpdateFamilyMembers: (members: FamilyMember[]) => void;
  onHandwrittenUpload?: () => void;
}

const folders = [
  { id: "inbox" as FolderType, label: "받은편지함", icon: Mail },
  { id: "sent" as FolderType, label: "보낸편지함", icon: Send },
  { id: "draft" as FolderType, label: "임시저장함", icon: FileText },
  { id: "archive" as FolderType, label: "중요편지함", icon: Star },
  { id: "trash" as FolderType, label: "휴지통", icon: Trash2 },
];

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
}

export function Sidebar({
  familyMembers,
  activeFolder,
  onFolderChange,
  unreadCount,
  draftCount,
  archiveCount,
  trashCount,
  onCompose,
  isComposeOpen = false,
  isCollapsed,
  onToggleCollapse,
  selectedMemberId,
  onSelectMember,
  onUpdateFamilyMembers,
  onHandwrittenUpload,
}: SidebarProps) {
  const [isTreeExpanded, setIsTreeExpanded] = useState(true);
  const [isFolderExpanded, setIsFolderExpanded] = useState(true);
  const [isAddressBookOpen, setIsAddressBookOpen] = useState(false);
  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 72 : 256 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="bg-card border-r border-border flex flex-col h-full overflow-hidden"
    >
      {/* Logo & Toggle */}
      <div className="h-16 flex items-center px-4 border-b border-border/50 justify-between">
        <div className="flex items-center overflow-hidden">
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-lg font-bold text-foreground tracking-tight whitespace-nowrap"
            >
              To.<span className="text-primary">orange letter</span>
            </motion.span>
          )}
          {isCollapsed && (
            <span className="text-lg font-bold text-primary">To.</span>
          )}
        </div>
        <motion.button
          onClick={onToggleCollapse}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "p-2 rounded-full transition-all duration-200 flex-shrink-0",
            isCollapsed 
              ? "bg-primary text-primary-foreground shadow-md" 
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 0 : 180 }}
            transition={{ duration: 0.2 }}
          >
            {isCollapsed ? (
              <Menu className="w-4 h-4" />
            ) : (
              <X className="w-4 h-4" />
            )}
          </motion.div>
        </motion.button>
      </div>

      {/* Profile - 편지 쓰기 버튼 위에 배치 */}
      <div className="px-3 pt-3 pb-6">
        <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
          <div className="relative flex-shrink-0">
            <img 
              src={orangeRipe} 
              alt="프로필" 
              className="w-11 h-11 rounded-full object-cover ring-2 ring-primary ring-offset-1"
            />
            {/* Social Login Provider Badge */}
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#FEE500] flex items-center justify-center shadow-sm border border-white">
              {/* Kakao Icon */}
              <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-[#3C1E1E]">
                <path d="M12 3C6.48 3 2 6.48 2 10.8c0 2.76 1.84 5.18 4.6 6.58-.2.72-.76 2.6-.87 3-.14.5.18.5.38.36.16-.1 2.52-1.7 3.54-2.4.78.1 1.56.16 2.35.16 5.52 0 10-3.48 10-7.8S17.52 3 12 3z"/>
              </svg>
            </div>
          </div>
          {!isCollapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-foreground truncate">
                  Bang Kyung
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  bangkyung@kakao.com
                </p>
              </div>
              <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Top Action Buttons */}
      <div className="px-3 pb-5 flex flex-col gap-1.5">
        {/* Compose Button - 편지 쓰기 */}
        {isCollapsed ? (
          <Button
            onClick={onCompose}
            size="icon"
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#FFB347] to-[#FF7F24] hover:bg-[#FF9500] hover:from-[#FF9500] hover:to-[#FF9500] shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <Send className="w-5 h-5" />
          </Button>
        ) : (
          <Button
            onClick={onCompose}
            className="w-full h-14 rounded-2xl text-base font-semibold bg-gradient-to-r from-[#FFB347] to-[#FF7F24] hover:bg-[#FF9500] hover:from-[#FF9500] hover:to-[#FF9500] shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 justify-center gap-2"
          >
            <Send className="w-5 h-5 flex-shrink-0" />
            <span>편지 쓰기</span>
            {isComposeOpen && (
              <span className="bg-white/20 text-primary-foreground text-[11px] font-medium px-2 py-0.5 rounded-full">작성중</span>
            )}
          </Button>
        )}

        {/* New Mail Notification - 받은편지함으로 이동 */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {isCollapsed ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onFolderChange("inbox")}
                  className="w-full h-11 rounded-xl bg-white text-orange-500 shadow-md hover:shadow-lg hover:bg-white hover:text-orange-600 transition-all"
                >
                  <Bell className="w-5 h-5" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => onFolderChange("inbox")}
                  className="w-full h-11 rounded-xl text-[15px] font-medium bg-white text-orange-500 shadow-md hover:shadow-lg hover:bg-white hover:text-orange-600 justify-start px-4 transition-all"
                >
                  <Bell className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span className="flex-1 text-left">새로 들어온 편지</span>
                  {unreadCount > 0 && (
                    <span className="bg-orange-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{unreadCount}</span>
                  )}
                </Button>
              )}
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-orange-50 border-orange-200 text-orange-800">
              <p>새로 들어온 편지 {unreadCount}건이 있어요🧡</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Handwritten Letter Auto-Registration */}
        <Tooltip>
          <TooltipTrigger asChild>
            {isCollapsed ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={onHandwrittenUpload}
                className="w-full h-11 rounded-xl bg-white text-orange-500 shadow-md hover:shadow-lg hover:bg-white hover:text-orange-600 transition-all"
              >
                <Inbox className="w-5 h-5" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                onClick={onHandwrittenUpload}
                className="w-full h-11 rounded-xl text-[15px] font-medium bg-white text-orange-500 shadow-md hover:shadow-lg hover:bg-white hover:text-orange-600 justify-start px-4 transition-all"
              >
                <Inbox className="w-4 h-4 mr-1 flex-shrink-0" />
                <span>손편지 자동등록</span>
              </Button>
            )}
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-[240px] text-center">
            <p>손편지를 여러 장 업로드하면, OCR로 자동 변환되어 발송용 문장으로 정리됩니다.</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Folders */}
      <nav className="flex-1 px-3 overflow-y-auto scrollbar-thin">
        {/* 전체 편지함 */}
        {!isCollapsed && (
          <div className="flex items-center justify-between px-3 py-2">
            <button
              onClick={() => setIsFolderExpanded(!isFolderExpanded)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {isFolderExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">전체 편지함</span>
            </button>
          </div>
        )}
        
        {(isCollapsed || isFolderExpanded) && (
          <ul className="space-y-1">
            {folders.map((folder) => {
              const Icon = folder.icon;
              const isActive = activeFolder === folder.id;
              const count = folder.id === "inbox" ? unreadCount : folder.id === "draft" ? draftCount : folder.id === "archive" ? archiveCount : folder.id === "trash" ? trashCount : 0;

              return (
                <li key={folder.id}>
                  <button
                    onClick={() => onFolderChange(folder.id)}
                    title={isCollapsed ? folder.label : undefined}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] transition-all duration-150",
                      isCollapsed && "justify-center px-0",
                      !isCollapsed && "ml-2",
                      isActive
                        ? "bg-accent text-accent-foreground font-medium"
                        : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                    )}
                  >
                    <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left">{folder.label}</span>
                        {count > 0 && (
                          <span
                            className={cn(
                              "text-xs font-semibold px-2 py-0.5 rounded-full",
                              isActive
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {count}
                          </span>
                        )}
                      </>
                    )}
                    {isCollapsed && count > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
                        {count}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {/* Divider */}
        <div className="my-4 border-t border-border" />

        {/* 내 편지함 - 사용자 분류 */}
        {!isCollapsed && (
          <>
            <div className="flex items-center justify-between px-3 py-2">
              <button
                onClick={() => setIsTreeExpanded(!isTreeExpanded)}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {isTreeExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">내 편지함</span>
              </button>
              <div className="flex items-center gap-1">
                <button
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  title="새 편지함 추가"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsAddressBookOpen(true)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  title="편지함 관리"
                >
                  <Settings className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            
            {isTreeExpanded && (
              <ul className="space-y-0.5 px-1">
                {familyMembers.map((member) => {
                  const isSelected = selectedMemberId === member.id;
                  const mailCount = Math.floor(Math.random() * 10); // 임시 카운트
                  return (
                    <li key={member.id}>
                      <button 
                        onClick={() => onSelectMember(isSelected ? null : member.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                          isSelected
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                        )}
                      >
                        {isSelected ? (
                          <FolderOpen className="w-4 h-4 text-amber-500" />
                        ) : (
                          <Folder className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span className="text-sm flex-1 text-left truncate">{member.name}</span>
                        <span className="text-xs text-muted-foreground">{mailCount}</span>
                      </button>
                    </li>
                  );
                })}
                {/* 새 편지함 추가 */}
                <li>
                  <button 
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm">새 편지함 추가</span>
                  </button>
                </li>
              </ul>
            )}
          </>
        )}

        {/* Collapsed Family Avatars */}
        {isCollapsed && (
          <ul className="space-y-2">
            {familyMembers.map((member) => {
              const isSelected = selectedMemberId === member.id;
              return (
                <li key={member.id} className="flex justify-center">
                  <button
                    onClick={() => onSelectMember(isSelected ? null : member.id)}
                    title={`${member.name} (${member.relation})`}
                    className={cn(
                      "p-1.5 rounded-xl transition-colors",
                      isSelected
                        ? "bg-primary/10 ring-2 ring-primary"
                        : "text-muted-foreground hover:bg-secondary"
                    )}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
                        member.color
                      )}
                    >
                      {member.avatar}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </nav>

      {/* Deadline Timer */}
      <div className="px-3 pb-3">
        <DeadlineTimer deadlineHour={17} isCollapsed={isCollapsed} />
      </div>
      {/* Address Book Modal */}
      <AddressBookModal
        isOpen={isAddressBookOpen}
        onClose={() => setIsAddressBookOpen(false)}
        familyMembers={familyMembers}
        onUpdateMembers={onUpdateFamilyMembers}
      />
    </motion.aside>
  );
}
