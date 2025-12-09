import { Mail, Send, FileText, Settings, PenLine, ChevronDown, ChevronRight, Star, Trash2, Menu, X, Plus, Folder, FolderOpen, Bell, FileSignature } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { FamilyMember, FolderType } from "@/types/mail";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AddressBookModal } from "./AddressBookModal";
import { DeadlineTimer } from "./DeadlineTimer";

interface SidebarProps {
  familyMembers: FamilyMember[];
  activeFolder: FolderType | null;
  onFolderChange: (folder: FolderType) => void;
  unreadCount: number;
  draftCount: number;
  archiveCount: number;
  trashCount: number;
  onCompose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  selectedMemberId: string | null;
  onSelectMember: (memberId: string | null) => void;
  onUpdateFamilyMembers: (members: FamilyMember[]) => void;
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
  isCollapsed,
  onToggleCollapse,
  selectedMemberId,
  onSelectMember,
  onUpdateFamilyMembers,
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

      {/* New Mail Notification */}
      <div className="px-3 pt-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {isCollapsed ? (
                <div className="w-full h-10 bg-amber-100 border border-amber-300 rounded-xl flex items-center justify-center">
                  <Bell className="w-4 h-4 text-amber-600" />
                </div>
              ) : (
                <div className="w-full h-10 bg-amber-100 border border-amber-300 rounded-xl flex items-center justify-center gap-2 cursor-pointer hover:bg-amber-200 transition-colors">
                  <Bell className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-700">새로 들어온 편지</span>
                  <span className="bg-amber-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">3</span>
                </div>
              )}
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-amber-50 border-amber-200 text-amber-800">
              <p>새로 들어온 편지 3건이 있어요🧡</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Compose Button */}
      <div className="px-3 pb-1.5">
        {isCollapsed ? (
          <Button
            onClick={onCompose}
            size="icon"
            className="w-full h-11 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-200"
          >
            <PenLine className="w-5 h-5" />
          </Button>
        ) : (
          <Button
            onClick={onCompose}
            className="w-full h-11 rounded-xl text-[15px] font-semibold shadow-card hover:shadow-card-hover transition-all duration-200"
          >
            <PenLine className="w-4 h-4 mr-2" />
            편지 쓰기
          </Button>
        )}
      </div>

      {/* Handwritten Letter Auto-Registration */}
      <div className="px-3 pb-3">
        {isCollapsed ? (
          <Button
            variant="outline"
            size="icon"
            className="w-full h-10 rounded-xl"
          >
            <FileSignature className="w-5 h-5" />
          </Button>
        ) : (
          <Button
            variant="outline"
            className="w-full h-10 rounded-xl text-[14px] font-medium"
          >
            <FileSignature className="w-4 h-4 mr-2" />
            손편지 자동등록
          </Button>
        )}
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

      {/* Profile */}
      <div className="p-3 border-t border-border">
        <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
          <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm flex-shrink-0">
            B
          </div>
          {!isCollapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  Bang Kyung
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  서울시 강남구 테헤란로 123
                </p>
              </div>
              <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
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
