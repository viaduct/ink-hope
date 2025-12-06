import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Sidebar } from "@/components/mail/Sidebar";
import { MailContent } from "@/components/mail/MailContent";
import { ComposeModal } from "@/components/mail/ComposeModal";
import { FloatingComposeButton } from "@/components/mail/FloatingComposeButton";
import { familyMembers, mockMails } from "@/data/mockData";
import type { Mail, FolderType } from "@/types/mail";

const Index = () => {
  const [activeFolder, setActiveFolder] = useState<FolderType>("inbox");
  const [selectedMail, setSelectedMail] = useState<Mail | null>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  // 선택된 가족 구성원에 따라 편지 필터링
  const filteredMails = selectedMemberId
    ? mockMails.filter((mail) => mail.sender.id === selectedMemberId)
    : mockMails;

  const unreadCount = mockMails.filter((m) => !m.isRead).length;
  const draftCount = 1;

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
          onFolderChange={setActiveFolder}
          unreadCount={unreadCount}
          draftCount={draftCount}
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
