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
}

export type MailStatus = "편지발송완료" | "접수완료" | "동봉시작" | "우체국 접수" | "우체국 발송완료";

export type FolderType = "inbox" | "sent" | "draft" | "archive" | "spam" | "trash" | "orangetree" | "timecapsule";

export interface MailOption {
  id: string;
  name: string;
  description: string;
  price: number;
  badge?: string;
}
