export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  facility: string;
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
}

export type FolderType = "inbox" | "sent" | "draft";

export interface MailOption {
  id: string;
  name: string;
  description: string;
  price: number;
  badge?: string;
}
