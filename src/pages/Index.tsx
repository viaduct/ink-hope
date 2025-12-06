import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Sidebar } from "@/components/mail/Sidebar";
import { MailList } from "@/components/mail/MailList";
import { MailDetail } from "@/components/mail/MailDetail";
import { ComposeModal } from "@/components/mail/ComposeModal";
import { familyMembers, mockMails } from "@/data/mockData";
import type { Mail, FolderType } from "@/types/mail";

const Index = () => {
  const [activeFolder, setActiveFolder] = useState<FolderType>("inbox");
  const [selectedMail, setSelectedMail] = useState<Mail | null>(mockMails[0]);
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  const unreadCount = mockMails.filter((m) => !m.isRead).length;
  const draftCount = 1;

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
        />

        {/* Main Content */}
        <main className="flex-1 flex overflow-hidden">
          {/* Mail List */}
          <MailList
            mails={mockMails}
            selectedMailId={selectedMail?.id || null}
            onSelectMail={setSelectedMail}
            activeFolder={activeFolder}
          />

          {/* Mail Detail */}
          <MailDetail
            mail={selectedMail}
            onReply={() => setIsComposeOpen(true)}
          />
        </main>

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
