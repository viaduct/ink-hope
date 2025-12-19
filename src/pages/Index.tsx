import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Sidebar } from "@/components/mail/Sidebar";
import { MailContent } from "@/components/mail/MailContent";
import { ComposeContent } from "@/components/mail/ComposeContent";
import { FloatingComposeButton } from "@/components/mail/FloatingComposeButton";
import { AddressBookModal } from "@/components/mail/AddressBookModal";
import { HandwrittenUploadContent } from "@/components/mail/HandwrittenUploadContent";
import { OrangeTreeContent } from "@/components/mail/OrangeTreeContent";
import { TimeCapsuleContent } from "@/components/mail/TimeCapsuleContent";
import { GalleryContent } from "@/components/mail/GalleryContent";
import { ScheduleContent } from "@/components/mail/ScheduleContent";
import { RewardsContent } from "@/components/mail/RewardsContent";
import { FaqContent } from "@/components/mail/FaqContent";
import { FeedbackContent } from "@/components/mail/FeedbackContent";
import { DealsContent } from "@/components/mail/DealsContent";
import { familyMembers as initialFamilyMembers, mockMails } from "@/data/mockData";
import type { Mail, FolderType, FamilyMember } from "@/types/mail";
import { toast } from "sonner";

type ViewMode = "compose" | "mail" | "handwritten" | "orangetree" | "timecapsule" | "gallery" | "schedule" | "rewards" | "faq" | "feedback" | "deals";

const Index = () => {
  const [activeFolder, setActiveFolder] = useState<FolderType | null>("inbox");
  const [selectedMail, setSelectedMail] = useState<Mail | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("compose");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [mails, setMails] = useState<Mail[]>(mockMails);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(initialFamilyMembers);
  const [isAddressBookOpen, setIsAddressBookOpen] = useState(false);

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
            // 오렌지나무, 타임캡슐, 갤러리, 스케줄, 경품, FAQ, 고객의소리, 특가 폴더 선택 시 해당 화면으로 전환
            if (folder === "orangetree") {
              setViewMode("orangetree");
            } else if (folder === "timecapsule") {
              setViewMode("timecapsule");
            } else if (folder === "gallery") {
              setViewMode("gallery");
            } else if (folder === "schedule") {
              setViewMode("schedule");
            } else if (folder === "rewards") {
              setViewMode("rewards");
            } else if (folder === "faq") {
              setViewMode("faq");
            } else if (folder === "feedback") {
              setViewMode("feedback");
            } else if (folder === "deals") {
              setViewMode("deals");
            } else {
              setViewMode("mail");
            }
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

        {/* Main Content - 뷰 모드에 따라 다른 화면 표시 */}
        {viewMode === "compose" ? (
          <ComposeContent
            familyMembers={familyMembers}
            onClose={() => setViewMode("mail")}
          />
        ) : viewMode === "handwritten" ? (
          <HandwrittenUploadContent
            onClose={() => setViewMode("mail")}
            onComposeWithText={(text, senderName) => {
              // TODO: Pass OCR text to compose with sender context
              setViewMode("compose");
            }}
            onSaveToInbox={(data) => {
              // 손편지를 받은 편지함에 저장
              const newMail: Mail = {
                id: crypto.randomUUID(),
                sender: {
                  id: crypto.randomUUID(),
                  name: data.senderName,
                  relation: "손편지 발신자",
                  facility: "",
                  avatar: data.senderName.charAt(0),
                  color: "bg-orange-100 text-orange-600",
                },
                subject: `${data.senderName}님의 손편지`,
                preview: data.ocrText.slice(0, 50) + "...",
                content: data.ocrText,
                date: "오늘",
                isRead: false,
                isNew: true,
                folder: "inbox",
                isHandwritten: true,
                originalImage: data.originalImage,
              };
              setMails((prev) => [newMail, ...prev]);
              setActiveFolder("inbox");
              setViewMode("mail");
            }}
          />
        ) : viewMode === "orangetree" ? (
          <OrangeTreeContent
            onClose={() => {
              setActiveFolder("inbox");
              setViewMode("mail");
            }}
          />
        ) : viewMode === "timecapsule" ? (
          <TimeCapsuleContent
            onClose={() => {
              setActiveFolder("inbox");
              setViewMode("mail");
            }}
          />
        ) : viewMode === "gallery" ? (
          <GalleryContent />
        ) : viewMode === "schedule" ? (
          <ScheduleContent />
        ) : viewMode === "rewards" ? (
          <RewardsContent
            onClose={() => {
              setActiveFolder("inbox");
              setViewMode("mail");
            }}
          />
        ) : viewMode === "faq" ? (
          <FaqContent
            onClose={() => {
              setActiveFolder("inbox");
              setViewMode("mail");
            }}
          />
        ) : viewMode === "feedback" ? (
          <FeedbackContent
            onClose={() => {
              setActiveFolder("inbox");
              setViewMode("mail");
            }}
          />
        ) : viewMode === "deals" ? (
          <DealsContent
            onClose={() => {
              setActiveFolder("inbox");
              setViewMode("mail");
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