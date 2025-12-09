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
import orangeSprout from "@/assets/emoticons/orange-sprout.png";
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
      className="bg-card border-r border-border/60 flex flex-col h-full overflow-hidden"
    >
      {/* Logo & Toggle */}
      <div className="h-14 flex items-center px-4 border-b border-border/40 justify-between">
        <div className="flex items-center overflow-hidden">
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-base font-bold text-foreground tracking-tight whitespace-nowrap"
            >
              To.<span className="text-primary">orange letter</span>
            </motion.span>
          )}
          {isCollapsed && (
            <span className="text-base font-bold text-primary">To.</span>
          )}
        </div>
        <motion.button
          onClick={onToggleCollapse}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "p-1.5 rounded-lg transition-all duration-200 flex-shrink-0",
            isCollapsed 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted/60 text-muted-foreground hover:bg-muted"
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

      {/* Profile Card */}
      <div className="px-3 pt-4 pb-4">
        {!isCollapsed ? (
          <div className="flex flex-col items-center text-center">
            {/* 프로필 이미지 - 심플 스타일 */}
            <div className="relative mb-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 p-[2px]">
                <div className="w-full h-full rounded-full bg-white p-1">
                  <div className="w-full h-full rounded-full bg-orange-50 flex items-center justify-center overflow-hidden">
                    <img src={orangeSprout} alt="프로필" className="w-10 h-10 object-contain rounded-full" />
                  </div>
                </div>
              </div>
              {/* Kakao Badge */}
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#FEE500] flex items-center justify-center border-2 border-white">
                <svg viewBox="0 0 24 24" className="w-3 h-3 fill-[#3C1E1E]">
                  <path d="M12 3C6.48 3 2 6.48 2 10.8c0 2.76 1.84 5.18 4.6 6.58-.2.72-.76 2.6-.87 3-.14.5.18.5.38.36.16-.1 2.52-1.7 3.54-2.4.78.1 1.56.16 2.35.16 5.52 0 10-3.48 10-7.8S17.52 3 12 3z"/>
                </svg>
              </div>
            </div>
            
            {/* 이름 & 이메일 */}
            <p className="text-sm font-semibold text-foreground mb-0.5">Bang Kyung Chang</p>
            <p className="text-xs text-muted-foreground mb-3 truncate max-w-full">webbreak@kakao...</p>
            
            {/* 통계 카드 - 가로 배치 */}
            <div className="flex gap-2 w-full">
              <button 
                onClick={() => onFolderChange("inbox")}
                className="flex-1 bg-muted/50 rounded-xl py-2.5 px-2 hover:bg-muted transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 mx-auto mb-1 fill-primary">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <p className="text-[10px] text-muted-foreground">새로운편지</p>
              </button>
              <button 
                onClick={onHandwrittenUpload}
                className="flex-1 bg-muted/50 rounded-xl py-2.5 px-2 hover:bg-muted transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 mx-auto mb-1 fill-primary">
                  <path d="M9.5 6.5v3h-3v-3h3M11 5H5v6h6V5zm-1.5 9.5v3h-3v-3h3M11 13H5v6h6v-6zm6.5-6.5v3h-3v-3h3M19 5h-6v6h6V5zm-6 8h1.5v1.5H13V13zm1.5 1.5H16V16h-1.5v-1.5zM16 13h1.5v1.5H16V13zm-3 3h1.5v1.5H13V16zm1.5 1.5H16V19h-1.5v-1.5zM16 16h1.5v1.5H16V16zm1.5-1.5H19V16h-1.5v-1.5zm0 3H19V19h-1.5v-1.5zM19 13h-1.5v1.5H19V13z"/>
                </svg>
                <p className="text-[10px] text-muted-foreground">손편지 스캔</p>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="relative">
              <img 
                src={orangeRipe} 
                alt="프로필" 
                className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/30"
              />
            </div>
          </div>
        )}
      </div>

      {/* Top Action Buttons */}
      <div className="px-3 pb-4 flex flex-col gap-1.5">
        {/* Compose Button - 편지 쓰기 */}
        {isCollapsed ? (
          <Button
            onClick={onCompose}
            size="icon"
            className="w-full h-12 rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 shadow-[0_4px_14px_rgba(251,146,60,0.4)] hover:shadow-[0_6px_20px_rgba(251,146,60,0.5)] transition-all duration-200"
          >
            <Send className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={onCompose}
            className="w-full h-12 rounded-xl text-sm font-semibold bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 shadow-[0_4px_14px_rgba(251,146,60,0.4)] hover:shadow-[0_6px_20px_rgba(251,146,60,0.5)] transition-all duration-200 justify-center"
          >
            <span>편지 쓰기</span>
            {isComposeOpen && (
              <span className="bg-white/20 text-primary-foreground text-[10px] font-medium px-2 py-0.5 rounded-full ml-2">작성중</span>
            )}
          </Button>
        )}

      </div>

      {/* Folders */}
      <nav className="flex-1 px-3 overflow-y-auto scrollbar-thin">
        {/* 전체 편지함 */}
        {!isCollapsed && (
          <div className="flex items-center justify-between px-2 py-2">
            <button
              onClick={() => setIsFolderExpanded(!isFolderExpanded)}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              {isFolderExpanded ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
              <span className="text-sm font-medium">전체 편지함</span>
            </button>
          </div>
        )}
        
        {(isCollapsed || isFolderExpanded) && (
          <ul className="space-y-1.5">
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
                      "w-full flex items-center gap-2.5 px-2.5 py-3 rounded-lg text-sm transition-all duration-150",
                      isCollapsed && "justify-center px-0",
                      !isCollapsed && "ml-1",
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-foreground hover:bg-muted/60"
                    )}
                  >
                    <Icon className={cn("w-4 h-4 flex-shrink-0", isActive && "text-primary")} />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left">{folder.label}</span>
                        {count > 0 && (
                          <span
                            className={cn(
                              "min-w-5 h-5 text-[10px] font-semibold rounded-full tabular-nums flex items-center justify-center",
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
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-primary text-primary-foreground text-[9px] rounded-full flex items-center justify-center">
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
        <div className="my-3 border-t border-border/50" />

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
              <ul className="space-y-1.5 px-1">
                {familyMembers.map((member) => {
                  const isSelected = selectedMemberId === member.id;
                  const mailCount = Math.floor(Math.random() * 10); // 임시 카운트
                  return (
                    <li key={member.id}>
                      <button 
                        onClick={() => onSelectMember(isSelected ? null : member.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors",
                          isSelected
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-secondary"
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
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-foreground hover:bg-secondary"
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
