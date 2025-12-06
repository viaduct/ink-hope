import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Sidebar } from "@/components/mail/Sidebar";
import { MailContent } from "@/components/mail/MailContent";
import { ComposeModal } from "@/components/mail/ComposeModal";
import { FloatingComposeButton } from "@/components/mail/FloatingComposeButton";
import { familyMembers, mockMails } from "@/data/mockData";
import type { Mail, FolderType } from "@/types/mail";
import { toast } from "sonner";

const Index = () => {
  const [activeFolder, setActiveFolder] = useState<FolderType>("inbox");
  const [selectedMail, setSelectedMail] = useState<Mail | null>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [mails, setMails] = useState<Mail[]>(mockMails);

  // 메일 폴더 이동 함수
  const moveMailToFolder = (mailId: string, targetFolder: FolderType) => {
    setMails((prevMails) =>
      prevMails.map((mail) =>
        mail.id === mailId ? { ...mail, folder: targetFolder } : mail
      )
    );
    setSelectedMail(null);
    
    const folderNames: Record<FolderType, string> = {
      inbox: "받은편지함",
      sent: "보낸편지함",
      draft: "임시보관함",
      archive: "보관함",
      trash: "휴지통",
    };
    toast.success(`${folderNames[targetFolder]}으로 이동했습니다.`);
  };

  // 현재 폴더에 맞는 메일 필터링
  const folderMails = mails.filter((mail) => mail.folder === activeFolder);

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
          }}
          unreadCount={unreadCount}
          draftCount={draftCount}
          archiveCount={archiveCount}
          trashCount={trashCount}
          onCompose={() => setIsComposeOpen(true)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          selectedMemberId={selectedMemberId}
          onSelectMember={setSelectedMemberId}
        />

        {/* Main Content - 2단 구조 */}
        <MailContent
          mails={filteredMails}
          selectedMail={selectedMail}
          onSelectMail={setSelectedMail}
          activeFolder={activeFolder}
          onReply={() => setIsComposeOpen(true)}
          selectedMember={selectedMemberId ? familyMembers.find(m => m.id === selectedMemberId) : null}
          allMails={mails}
          onMoveToFolder={moveMailToFolder}
        />

        {/* Floating Compose Button */}
        <FloatingComposeButton 
          onCompose={() => setIsComposeOpen(true)}
          daysSinceLastLetter={daysSinceLastLetter}
        />

        {/* Compose Modal */}
        <ComposeModal
          isOpen={isComposeOpen}
          onClose={() => setIsComposeOpen(false)}
          familyMembers={familyMembers}
        />
      </div>
    </>
  );
};

export default Index;