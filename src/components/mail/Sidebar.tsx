import { Mail, Send, FileText, Settings, PenLine, ChevronDown, ChevronRight, Star, Trash2, Menu, X, Plus, Folder, FolderOpen, Bell, Inbox, AlertCircle, TreeDeciduous, Clock, Image, CalendarDays, Tag, HelpCircle, MessageSquare, Gift, Info, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { FamilyMember, FolderType } from "@/types/mail";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AddressBookModal } from "./AddressBookModal";
import { AddRecipientModal } from "./AddRecipientModal";
import orangeRipe from "@/assets/emoticons/orange-ripe.png";
import orangeSprout from "@/assets/emoticons/orange-sprout.png";
import orangeCharacter from "@/assets/emoticons/orange-character.gif";

interface SidebarProps {
  familyMembers: FamilyMember[];
  activeFolder: FolderType | null;
  onFolderChange: (folder: FolderType) => void;
  unreadCount: number;
  draftCount: number;
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

// 상단 폴더 (받은편지함 ~ 스케줄 관리)
const foldersTop = [
  { id: "inbox" as FolderType, label: "받은 편지함", icon: Mail },
  { id: "sent" as FolderType, label: "보낸 편지함", icon: Send },
  { id: "draft" as FolderType, label: "임시보관함", icon: FileText },
  { id: "schedule" as FolderType, label: "스케줄 관리", icon: CalendarDays },
];

// 스팸함 ~ 타임캡슐
const foldersBottom = [
  { id: "spam" as FolderType, label: "스팸함", icon: AlertCircle, aboutPath: null },
  { id: "trash" as FolderType, label: "휴지통", icon: Trash2, aboutPath: null },
  { id: "orangetree" as FolderType, label: "오렌지 나무", icon: TreeDeciduous, aboutPath: null },
  { id: "timecapsule" as FolderType, label: "타임캡슐", icon: Clock, aboutPath: null },
];

// 고객 지원 메뉴
const supportMenus = [
  { id: "notice" as FolderType, label: "공지사항", icon: Bell },
  { id: "customerService" as FolderType, label: "고객센터", icon: Phone },
  { id: "rewards" as FolderType, label: "내가 받은 경품", icon: Gift },
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
  const [isAddRecipientOpen, setIsAddRecipientOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 72 : 256 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="bg-card border-r border-border/60 flex flex-col h-full overflow-hidden"
    >
      {/* Logo & Toggle */}
      <div className="h-14 flex items-center px-4 border-b border-border/40 justify-between">
        <button 
          onClick={onCompose}
          className="flex items-center overflow-hidden hover:opacity-80 transition-opacity"
        >
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
        </button>
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
                    <img src={orangeCharacter} alt="프로필" className="w-12 h-12 object-contain" />
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
            
            {/* 이름 & 회원등급 뱃지 */}
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-sm font-semibold text-foreground">홍길동</p>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-medium">
                <span>🌱</span>
                <span>새싹회원</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-3 truncate max-w-full">050-1234-5678</p>
            
            {/* 통계 카드 - 가로 배치 */}
            <div className="flex gap-2 w-full">
              <button
                onClick={() => onFolderChange("gallery")}
                className="flex-1 bg-muted/50 rounded-xl py-2.5 px-2 hover:bg-muted transition-colors"
              >
                <Image className="w-5 h-5 mx-auto mb-1 text-primary" />
                <p className="text-[10px] text-muted-foreground">갤러리</p>
              </button>
              <button 
                onClick={onHandwrittenUpload}
                className="flex-1 bg-muted/50 rounded-xl py-2.5 px-2 hover:bg-muted transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 mx-auto mb-1 fill-primary">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                </svg>
                <p className="text-[10px] text-muted-foreground">손편지 담기</p>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="relative">
              <img 
                src={orangeCharacter} 
                alt="프로필" 
                className="w-10 h-10 rounded-full object-contain ring-2 ring-primary/30 bg-orange-50"
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
            {foldersTop.map((folder) => {
              const Icon = folder.icon;
              const isActive = activeFolder === folder.id;
              const count = folder.id === "inbox" ? unreadCount : folder.id === "draft" ? draftCount : folder.id === "trash" ? trashCount : 0;

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

        {/* 내 편지함 - 중요편지함과 스팸함 사이 */}
        {!isCollapsed && (
          <>
            <div className="flex items-center justify-between px-3 py-2 mt-1">
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
              </ul>
            )}
          </>
        )}

        {/* 새 편지함 추가 (분리된 버튼) */}
        {!isCollapsed && (
          <button 
            onClick={() => setIsAddRecipientOpen(true)}
            className="w-full flex items-center gap-2.5 px-3.5 py-3 rounded-lg text-sm transition-all duration-150 text-foreground hover:bg-muted/60"
          >
            <Plus className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1 text-left">새 편지함 추가</span>
          </button>
        )}

        {/* Divider */}
        {!isCollapsed && (
          <div className="my-3 mx-2 border-t border-border/60" />
        )}

        {/* 하단 폴더들 (스팸함, 휴지통 등) */}
        {(isCollapsed || isFolderExpanded) && (
          <ul className="space-y-1.5">
            {foldersBottom.map((folder) => {
              const Icon = folder.icon;
              const isActive = activeFolder === folder.id;
              const count = folder.id === "trash" ? trashCount : 0;

              return (
                <li key={folder.id}>
                  <div className="relative flex items-center">
                    <button
                      onClick={() => onFolderChange(folder.id)}
                      title={isCollapsed ? folder.label : undefined}
                      className={cn(
                        "flex-1 flex items-center gap-2.5 px-2.5 py-3 rounded-lg text-sm transition-all duration-150",
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
                    {/* 도움말 아이콘 - 소개 페이지가 있는 메뉴만 */}
                    {!isCollapsed && folder.aboutPath && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(folder.aboutPath!);
                        }}
                        className="p-1.5 mr-1 rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                        title={`${folder.label} 알아보기`}
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {/* Divider */}
        {!isCollapsed && (
          <div className="my-3 mx-2 border-t border-border/60" />
        )}

        {/* 특가 할인 */}
        {!isCollapsed && (
          <button
            onClick={() => onFolderChange("deals")}
            className={cn(
              "w-full flex items-center gap-2.5 px-3.5 py-3 rounded-lg text-sm transition-all duration-150",
              activeFolder === "deals"
                ? "bg-primary/10 text-primary font-medium"
                : "text-foreground hover:bg-muted/60"
            )}
          >
            <Tag className={cn("w-4 h-4 flex-shrink-0", activeFolder === "deals" && "text-primary")} />
            <span className="flex-1 text-left">특가 할인</span>
            <span className="bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">HOT</span>
          </button>
        )}

        {/* Divider */}
        {!isCollapsed && (
          <div className="my-3 mx-2 border-t border-border/60" />
        )}

        {/* 고객 지원 메뉴 */}
        {!isCollapsed && (
          <ul className="space-y-1.5">
            {supportMenus.map((menu) => {
              const Icon = menu.icon;
              const isActive = activeFolder === menu.id;

              return (
                <li key={menu.id}>
                  <button
                    onClick={() => onFolderChange(menu.id)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3.5 py-3 rounded-lg text-sm transition-all duration-150",
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-foreground hover:bg-muted/60"
                    )}
                  >
                    <Icon className={cn("w-4 h-4 flex-shrink-0", isActive && "text-primary")} />
                    <span className="flex-1 text-left">{menu.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
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

      {/* Address Book Modal */}
      <AddressBookModal
        isOpen={isAddressBookOpen}
        onClose={() => setIsAddressBookOpen(false)}
        familyMembers={familyMembers}
        onUpdateMembers={onUpdateFamilyMembers}
      />
      {/* Add Recipient Modal */}
      <AddRecipientModal
        open={isAddRecipientOpen}
        onOpenChange={setIsAddRecipientOpen}
      />
    </motion.aside>
  );
}
