import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sidebar } from "@/components/mail/Sidebar";
import { familyMembers as initialFamilyMembers } from "@/data/mockData";
import type { FamilyMember, FolderType } from "@/types/mail";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(initialFamilyMembers);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  // 현재 경로에 따른 activeFolder 결정
  const getActiveFolder = (): FolderType | null => {
    if (location.pathname.startsWith("/time-capsule")) return "timecapsule";
    if (location.pathname === "/") return "inbox";
    return null;
  };

  const handleFolderChange = (folder: FolderType) => {
    if (folder === "timecapsule") {
      navigate("/time-capsule");
    } else if (folder === "orangetree") {
      navigate("/?view=orangetree");
    } else {
      navigate(`/?folder=${folder}`);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        familyMembers={familyMembers}
        activeFolder={getActiveFolder()}
        onFolderChange={handleFolderChange}
        unreadCount={0}
        draftCount={0}
        trashCount={0}
        onCompose={() => navigate("/?view=compose")}
        isComposeOpen={false}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        selectedMemberId={selectedMemberId}
        onSelectMember={(memberId) => setSelectedMemberId(memberId)}
        onUpdateFamilyMembers={setFamilyMembers}
        onHandwrittenUpload={() => navigate("/?view=handwritten")}
      />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
