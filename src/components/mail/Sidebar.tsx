import { Mail, Send, FileText, Settings, Plus, PenLine, PanelLeftClose, PanelLeft, TreeDeciduous, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { FamilyMember, FolderType } from "@/types/mail";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface SidebarProps {
  familyMembers: FamilyMember[];
  activeFolder: FolderType;
  onFolderChange: (folder: FolderType) => void;
  unreadCount: number;
  draftCount: number;
  onCompose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  selectedMemberId: string | null;
  onSelectMember: (memberId: string | null) => void;
}

const folders = [
  { id: "inbox" as FolderType, label: "받은편지함", icon: Mail },
  { id: "sent" as FolderType, label: "보낸편지함", icon: Send },
  { id: "draft" as FolderType, label: "임시보관함", icon: FileText },
];

export function Sidebar({
  familyMembers,
  activeFolder,
  onFolderChange,
  unreadCount,
  draftCount,
  onCompose,
  isCollapsed,
  onToggleCollapse,
  selectedMemberId,
  onSelectMember,
}: SidebarProps) {
  const [isTreeExpanded, setIsTreeExpanded] = useState(true);
  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 72 : 256 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="bg-card border-r border-border flex flex-col h-full overflow-hidden"
    >
      {/* Logo */}
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
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex-shrink-0"
        >
          {isCollapsed ? (
            <PanelLeft className="w-4 h-4" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Compose Button */}
      <div className="p-3">
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

      {/* Folders */}
      <nav className="flex-1 px-3 overflow-y-auto scrollbar-thin">
        <ul className="space-y-1">
          {folders.map((folder) => {
            const Icon = folder.icon;
            const isActive = activeFolder === folder.id;
            const count = folder.id === "inbox" ? unreadCount : folder.id === "draft" ? draftCount : 0;

            return (
              <li key={folder.id}>
                <button
                  onClick={() => onFolderChange(folder.id)}
                  title={isCollapsed ? folder.label : undefined}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] transition-all duration-150",
                    isCollapsed && "justify-center px-0",
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

        {/* Divider */}
        <div className="my-4 border-t border-border" />

        {/* Orange Tree - Family Members */}
        {!isCollapsed && (
          <>
            <button
              onClick={() => setIsTreeExpanded(!isTreeExpanded)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-foreground hover:bg-secondary transition-colors"
            >
              {isTreeExpanded ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
              <TreeDeciduous className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">오렌지 나무</span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="ml-auto p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </button>
            
            {isTreeExpanded && (
              <ul className="ml-4 border-l border-border/50 space-y-0.5">
                {familyMembers.map((member) => {
                  const isSelected = selectedMemberId === member.id;
                  return (
                    <li key={member.id}>
                      <button 
                        onClick={() => onSelectMember(isSelected ? null : member.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 rounded-r-xl transition-colors",
                          isSelected
                            ? "bg-primary/10 text-primary border-l-2 border-primary -ml-[1px]"
                            : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                        )}
                      >
                        <div
                          className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0",
                            member.color
                          )}
                        >
                          {member.avatar}
                        </div>
                        <span className="text-sm flex-1 text-left truncate">{member.name}</span>
                      </button>
                    </li>
                  );
                })}
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
                  webbreak@kakao...
                </p>
              </div>
              <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
