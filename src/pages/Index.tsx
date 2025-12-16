import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Sidebar } from "@/components/mail/Sidebar";
import { MailContent } from "@/components/mail/MailContent";
import { ComposeContent } from "@/components/mail/ComposeContent";
import { FloatingComposeButton } from "@/components/mail/FloatingComposeButton";
import { AddressBookModal } from "@/components/mail/AddressBookModal";
import { HandwrittenUploadContent } from "@/components/mail/HandwrittenUploadContent";
import { familyMembers as initialFamilyMembers, mockMails } from "@/data/mockData";
import type { Mail, FolderType, FamilyMember } from "@/types/mail";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";

type ViewMode = "compose" | "mail" | "handwritten";

const Index = () => {
  const [activeFolder, setActiveFolder] = useState<FolderType | null>("inbox");
  const [selectedMail, setSelectedMail] = useState<Mail | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("compose");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [mails, setMails] = useState<Mail[]>(mockMails);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(initialFamilyMembers);
  const [isAddressBookOpen, setIsAddressBookOpen] = useState(false);
  const [userPoints, setUserPoints] = useState(12500); // 목업 포인트
  const userName = "방경창"; // 목업 사용자 이름
  // 메일 폴더 이동 함수
  const moveMailToFolder = (mailId: string, targetFolder: FolderType) => {
    setMails((prevMails) =>
      prevMails.map((mail) => {
        if (mail.id !== mailId) return mail;
        
        // 중요편지함으로 이동 시 원래 폴더 저장
        if (targetFolder === "archive" && mail.folder !== "archive") {
          return { 
            ...mail, 
            folder: targetFolder, 
            originalFolder: mail.folder,
            isImportant: true 
          };
        }
        
        // 중요편지함에서 해제 시 원래 폴더로 복귀
        if (mail.folder === "archive" && targetFolder !== "archive") {
          const restoreFolder = mail.originalFolder || "inbox";
          return { 
            ...mail, 
            folder: restoreFolder, 
            originalFolder: undefined,
            isImportant: false 
          };
        }
        
        return { ...mail, folder: targetFolder };
      })
    );
    setSelectedMail(null);
    
    const folderNames: Record<FolderType, string> = {
      inbox: "받은편지함",
      sent: "보낸편지함",
      draft: "임시저장함",
      archive: "중요편지함",
      spam: "스팸함",
      trash: "휴지통",
      orangetree: "오렌지나무",
      timecapsule: "타임캡슐",
    };
    toast.success(`${folderNames[targetFolder]}으로 이동했습니다.`);
  };

  // 현재 폴더에 맞는 메일 필터링
  const folderMails = activeFolder ? mails.filter((mail) => mail.folder === activeFolder) : mails.filter((mail) => mail.folder === "inbox");

  // 선택된 가족 구성원에 따라 편지 필터링
  const filteredMails = selectedMemberId
    ? folderMails.filter((mail) => mail.sender.id === selectedMemberId)
    : folderMails;

  const unreadCount = mails.filter((m) => !m.isRead && m.folder === "inbox").length;
  const draftCount = mails.filter((m) => m.folder === "draft").length;
  const archiveCount = mails.filter((m) => m.folder === "archive").length;
  const trashCount = mails.filter((m) => m.folder === "trash").length;

  // 마지막 편지 보낸 날짜 (목업)
  const lastSentDate = new Date();
  lastSentDate.setDate(lastSentDate.getDate() - 3);
  const daysSinceLastLetter = 3;

  return (
    <>
      <Helmet>
        <title>Orange Mail - 수감자와 가족을 위한 편지 서비스</title>
        <meta
          name="description"
          content="Orange Mail은 수감자와 가족이 쉽게 편지를 주고받을 수 있는 서비스입니다. 따뜻한 마음을 전하세요."
        />
      </Helmet>

      <div className="flex h-screen overflow-hidden bg-background">
        {/* Sidebar */}
        <Sidebar
          familyMembers={familyMembers}
          activeFolder={activeFolder}
          onFolderChange={(folder) => {
            setActiveFolder(folder);
            setSelectedMemberId(null);
            setViewMode("mail");
          }}
          unreadCount={unreadCount}
          draftCount={draftCount}
          archiveCount={archiveCount}
          trashCount={trashCount}
          onCompose={() => setViewMode("compose")}
          isComposeOpen={viewMode === "compose"}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          selectedMemberId={selectedMemberId}
          onSelectMember={setSelectedMemberId}
          onUpdateFamilyMembers={setFamilyMembers}
          onHandwrittenUpload={() => setViewMode("handwritten")}
        />

        {/* Main Content Area */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Top Header with Points */}
          <header className="h-14 border-b border-border/40 bg-card flex items-center justify-end px-6 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Coins className="w-4 h-4 text-amber-500" />
                <span className="text-muted-foreground">현재</span>
                <span className="font-semibold text-foreground">{userName}</span>
                <span className="text-muted-foreground">님의 보유 포인트는</span>
                <span className="font-bold text-primary">{userPoints.toLocaleString()}원</span>
                <span className="text-muted-foreground">입니다.</span>
              </div>
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-medium"
                onClick={() => toast.info("충전 페이지로 이동합니다.")}
              >
                충전하기
              </Button>
            </div>
          </header>

          {/* Main Content - 뷰 모드에 따라 다른 화면 표시 */}
          {viewMode === "compose" ? (
          <ComposeContent
            familyMembers={familyMembers}
            onClose={() => setViewMode("mail")}
          />
        ) : viewMode === "handwritten" ? (
          <HandwrittenUploadContent
            onClose={() => setViewMode("mail")}
            onComposeWithText={(text) => {
              // TODO: Pass OCR text to compose
              setViewMode("compose");
            }}
          />
        ) : (
          <MailContent
            mails={filteredMails}
            selectedMail={selectedMail}
            onSelectMail={setSelectedMail}
            activeFolder={activeFolder}
            onReply={() => setViewMode("compose")}
            selectedMember={selectedMemberId ? familyMembers.find(m => m.id === selectedMemberId) : null}
            allMails={mails}
            onMoveToFolder={moveMailToFolder}
            onEditAddressBook={() => setIsAddressBookOpen(true)}
          />
        )}
        </div>

        {/* Floating Compose Button */}
        {viewMode === "mail" && (
          <FloatingComposeButton 
            onCompose={() => setViewMode("compose")}
            daysSinceLastLetter={daysSinceLastLetter}
            draftCount={draftCount}
          />
        )}

        {/* Address Book Modal */}
        <AddressBookModal
          isOpen={isAddressBookOpen}
          onClose={() => setIsAddressBookOpen(false)}
          familyMembers={familyMembers}
          onUpdateMembers={setFamilyMembers}
        />
      </div>
    </>
  );
};

export default Index;