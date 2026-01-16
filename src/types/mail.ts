// 소중한 사람 (수신자)
export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  facility: string;
  facilityAddress?: string;
  prisonerNumber?: string;
  avatar: string;
  color: string;
}

// 오렌지나무 (관계 = 나무)
export interface OrangeTree {
  id: string;
  personId: string; // FamilyMember id
  personName: string;
  relation: string;
  sentLetters: number; // 보낸 편지 수
  receivedLetters: number; // 받은 편지 수
  totalLetters: number; // sentLetters + receivedLetters
  createdAt: string;
  isArchived: boolean; // 완성된 나무 (출소 후)
  facility: string;
  prisonerNumber: string;
  expectedReleaseDate?: string;
  daysRemaining?: number;
}

// 성장 단계
export interface GrowthStage {
  level: number;
  name: string;
  minLetters: number;
  icon: string;
  message: string;
}

// 소중한 날들 (열매)
export interface SpecialDay {
  id: string;
  treeId: string; // OrangeTree id
  type: "release" | "parole" | "birthday" | "anniversary" | "visit" | "trial" | "education" | "other";
  title: string;
  date: string;
  time?: string;
  description?: string;
  isGolden?: boolean; // 타임캡슐 연동 시 골든 오렌지
}

// 최근 활동
export interface RecentActivity {
  id: string;
  type: "sent" | "received";
  personName: string;
  date: string;
  status: string;
  mailTypes: string[];
}

export interface Mail {
  id: string;
  sender: FamilyMember;
  subject: string;
  preview: string;
  content: string;
  date: string;
  isRead: boolean;
  isNew: boolean;
  isImportant?: boolean;
  hasAttachments?: boolean;
  attachmentCount?: number;
  folder: FolderType;
  originalFolder?: FolderType;
  status?: MailStatus;
  isHandwritten?: boolean;
  originalImage?: string;
}

export type MailStatus = "편지발송완료" | "접수완료" | "동봉시작" | "우체국 접수" | "우체국 발송완료";

export type FolderType = "inbox" | "sent" | "draft" | "archive" | "gallery" | "schedule" | "spam" | "trash" | "orangetree" | "timecapsule" | "deals" | "notice" | "faq" | "feedback" | "rewards" | "customerService" | "handwrittenUpload" | "handwrittenArchive";

export interface MailOption {
  id: string;
  name: string;
  description: string;
  price: number;
  badge?: string;
}
