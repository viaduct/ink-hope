import type { FamilyMember, Mail, MailOption, OrangeTree, SpecialDay, RecentActivity, GrowthStage } from "@/types/mail";

// Mock user for in-memory auth
export interface MockUser {
  id: string;
  email: string;
  display_name: string;
}

export const mockUser: MockUser = {
  id: "mock-user-001",
  email: "demo@example.com",
  display_name: "데모 사용자",
};
import orangeSeed from "@/assets/emoticons/orange-seed-icon.png";
import orangeSprout from "@/assets/emoticons/orange-sprout-icon.png";
import orangeYoungTree from "@/assets/emoticons/orange-young-tree-icon.png";
import orangeFullTree from "@/assets/emoticons/orange-full-tree-icon.png";
import orangeRipe from "@/assets/emoticons/orange-ripe-icon.png";

// 성장 단계 정의 (명세서 기준)
export const growthStages: GrowthStage[] = [
  { 
    level: 1, 
    name: "씨앗", 
    minLetters: 0, 
    icon: orangeSeed,
    message: "마음을 심었어요. 첫 편지를 보내볼까요?"
  },
  { 
    level: 2, 
    name: "새싹", 
    minLetters: 5, 
    icon: orangeSprout,
    message: "작은 싹이 돋았어요. 꾸준히 마음을 나눠보세요."
  },
  { 
    level: 3, 
    name: "푸른 가지", 
    minLetters: 15, 
    icon: orangeYoungTree,
    message: "잎이 무성해지고 있어요. 조금만 더 마음을 나누면 꽃이 필 거예요."
  },
  { 
    level: 4, 
    name: "흰 꽃나무", 
    minLetters: 30, 
    icon: orangeFullTree,
    message: "드디어 꽃이 피었어요. 하얀 꽃잎처럼 마음이 전해지고 있어요."
  },
  { 
    level: 5, 
    name: "오렌지나무", 
    minLetters: 50, 
    icon: orangeRipe,
    message: "마침내 열매를 맺었어요. 함께 키운 이 나무처럼, 희망도 익어가고 있어요."
  },
];

// 성장 단계 계산 함수
export const getGrowthStage = (totalLetters: number): GrowthStage => {
  for (let i = growthStages.length - 1; i >= 0; i--) {
    if (totalLetters >= growthStages[i].minLetters) {
      return growthStages[i];
    }
  }
  return growthStages[0];
};

// 다음 단계까지 남은 편지 수 계산
export const getLettersToNextStage = (totalLetters: number): { nextStage: GrowthStage | null; lettersRemaining: number } => {
  const currentStageIndex = growthStages.findIndex((stage, index) => {
    const nextStage = growthStages[index + 1];
    return !nextStage || totalLetters < nextStage.minLetters;
  });
  
  if (currentStageIndex === growthStages.length - 1) {
    return { nextStage: null, lettersRemaining: 0 };
  }
  
  const nextStage = growthStages[currentStageIndex + 1];
  return {
    nextStage,
    lettersRemaining: nextStage.minLetters - totalLetters
  };
};

// 소중한 사람들 (수신자)
export const familyMembers: FamilyMember[] = [
  {
    id: "1",
    name: "이재원",
    relation: "아들",
    facility: "서울남부교도소",
    facilityAddress: "서울특별시 금천구 시흥대로 439",
    prisonerNumber: "2024-1234",
    avatar: "이",
    color: "bg-orange-100 text-orange-600",
  },
  {
    id: "2",
    name: "서은우",
    relation: "남편",
    facility: "수원구치소",
    facilityAddress: "경기도 수원시 팔달구 동수원로 399",
    prisonerNumber: "2024-5678",
    avatar: "서",
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: "3",
    name: "임성훈",
    relation: "동생",
    facility: "대전교도소",
    facilityAddress: "대전광역시 중구 보문로 285",
    prisonerNumber: "",
    avatar: "임",
    color: "bg-blue-100 text-blue-500",
  },
];

// 오렌지나무 (관계 = 나무)
export const orangeTrees: OrangeTree[] = [
  {
    id: "tree-1",
    personId: "1",
    personName: "이재원",
    relation: "아들",
    sentLetters: 3,
    receivedLetters: 4,
    totalLetters: 7, // Lv.2 새싹
    createdAt: "2024-03-15",
    isArchived: false,
    facility: "서울남부교도소",
    prisonerNumber: "2024-1234",
    expectedReleaseDate: "2025-06-15",
    daysRemaining: 178,
  },
  {
    id: "tree-2",
    personId: "2",
    personName: "서은우",
    relation: "남편",
    sentLetters: 8,
    receivedLetters: 4,
    totalLetters: 12, // Lv.2 새싹
    createdAt: "2024-06-01",
    isArchived: false,
    facility: "수원구치소",
    prisonerNumber: "2024-5678",
    expectedReleaseDate: "2026-01-20",
    daysRemaining: 395,
  },
  {
    id: "tree-3",
    personId: "3",
    personName: "임성훈",
    relation: "동생",
    sentLetters: 3,
    receivedLetters: 1,
    totalLetters: 4, // Lv.1 씨앗
    createdAt: "2024-09-01",
    isArchived: false,
    facility: "대전교도소",
    prisonerNumber: "2024-9012",
    expectedReleaseDate: "2025-12-01",
    daysRemaining: 345,
  },
];

// 소중한 날들 (열매)
export const specialDays: SpecialDay[] = [
  // 2025년 12월 일정들
  { id: "sd-11", treeId: "tree-1", type: "visit", title: "정기 면회", date: "2025-12-07", time: "14:00", description: "재원이 12월 첫 면회, 간식과 책 전달 예정" },
  { id: "sd-12", treeId: "tree-2", type: "visit", title: "가족 면회", date: "2025-12-10", time: "15:00", description: "은우 면회, 아이들 성적표 전달" },
  { id: "sd-13", treeId: "tree-1", type: "program", title: "직업훈련 수료식", date: "2025-12-12", time: "10:00", description: "재원이 컴퓨터 자격증 취득 수료식" },
  { id: "sd-14", treeId: "tree-3", type: "health", title: "건강검진", date: "2025-12-15", time: "09:00", description: "성훈이 정기 건강검진일" },
  { id: "sd-15", treeId: "tree-1", type: "visit", title: "크리스마스 특별면회", date: "2025-12-24", time: "13:00", description: "크리스마스 이브 특별 면회, 케이크 전달" },
  { id: "sd-16", treeId: "tree-2", type: "birthday", title: "아이 생일", date: "2025-12-25", time: "12:00", description: "막내 아이 생일 - 은우에게 영상 전달 예정" },
  { id: "sd-17", treeId: "tree-1", type: "anniversary", title: "부모님 결혼기념일", date: "2025-12-28", time: "18:00", description: "엄마 아빠 35주년 결혼기념일" },
  { id: "sd-9", treeId: "tree-3", type: "release", title: "출소 예정일", date: "2025-12-31", time: "10:00", description: "성훈이 출소 예정! 새해 첫날 가족과 함께" },

  // 2026년 1월 일정들
  { id: "sd-1", treeId: "tree-1", type: "visit", title: "가족 면회", date: "2026-01-03", time: "15:00", description: "어머니, 여동생 면회 예정" },
  { id: "sd-8", treeId: "tree-2", type: "visit", title: "정기 면회", date: "2026-01-04", time: "14:00", description: "아이들과 함께 면회" },
  { id: "sd-18", treeId: "tree-1", type: "trial", title: "가석방 심사", date: "2026-01-15", time: "10:00", description: "재원이 가석방 심사일" },
  { id: "sd-10", treeId: "tree-1", type: "visit", title: "정기 면회", date: "2026-01-21", time: "15:00", description: "재원이 정기 면회일" },
  { id: "sd-19", treeId: "tree-2", type: "program", title: "인성교육 프로그램", date: "2026-01-25", time: "14:00", description: "은우 인성교육 프로그램 참여" },

  // 2026년 2월 이후 일정들
  { id: "sd-2", treeId: "tree-1", type: "trial", title: "재판일", date: "2026-02-15", time: "10:00", description: "항소심 재판" },
  { id: "sd-3", treeId: "tree-1", type: "birthday", title: "생일", date: "2026-03-20", time: "12:00", description: "재원이의 생일" },
  { id: "sd-5", treeId: "tree-1", type: "anniversary", title: "결혼기념일", date: "2026-04-10", time: "18:00", description: "10주년 결혼기념일" },
  { id: "sd-6", treeId: "tree-2", type: "birthday", title: "생일", date: "2026-05-12", time: "12:00", description: "은우의 생일" },
  { id: "sd-4", treeId: "tree-1", type: "release", title: "출소 예정일", date: "2026-06-15", time: "09:00", description: "드디어 집으로" },
  { id: "sd-7", treeId: "tree-2", type: "release", title: "출소 예정일", date: "2027-01-20", time: "09:00", description: "출소 예정" },
];

// 최근 활동
export const recentActivities: RecentActivity[] = [
  { id: "act-1", type: "sent", personName: "이재원", date: "2025-12-26", status: "전달완료", mailTypes: ["편지", "사진"] },
  { id: "act-2", type: "received", personName: "이재원", date: "2025-12-24", status: "수신완료", mailTypes: ["편지"] },
];

// 타임캡슐 쪽지 발송 일정
export interface TimeCapsuleSendSchedule {
  id: string;
  capsuleId: string;
  capsuleName: string;
  recipientId: string;
  recipientName: string;
  relation: string;
  facility: string;
  sendDate: string;
  letterCount: number;
  isUrgent: boolean;
}

export const timeCapsuleSendSchedules: TimeCapsuleSendSchedule[] = [
  {
    id: "tc-send-1",
    capsuleId: "1",
    capsuleName: "재원이에게 보내는 희망의 편지",
    recipientId: "1",
    recipientName: "이재원",
    relation: "아들",
    facility: "서울남부교도소",
    sendDate: "2025-12-30",
    letterCount: 12,
    isUrgent: true,
  },
];

export const mockMails: Mail[] = [
  {
    id: "1",
    sender: familyMembers[0],
    subject: "엄마, 요즘 어떻게 지내세요?",
    preview: "엄마 건강은 좀 어떠세요? 저는 여기서 잘 지내고 있어요. 날씨가 많이 추워졌는데...",
    content: `엄마 건강은 좀 어떠세요? 저는 여기서 잘 지내고 있어요.

날씨가 많이 추워졌는데 감기 조심하세요. 아버지도 건강하시죠? 동생은 학교 잘 다니고 있나요?

요즘 여기서 책을 많이 읽고 있어요. 엄마가 좋아하시던 그 작가 책도 읽었어요. 이제야 왜 좋아하셨는지 알 것 같아요.

다음 면회 때 뵐게요. 그때까지 건강하세요.

사랑해요, 엄마.

- 재원 올림`,
    date: "오늘",
    isRead: false,
    isNew: true,
    folder: "inbox",
  },
  {
    id: "2",
    sender: familyMembers[1],
    subject: "면회 일정 변경됐어요",
    preview: "다음 주 화요일로 면회 날짜가 바뀌었어요. 시간은 같으니까...",
    content: `다음 주 화요일로 면회 날짜가 바뀌었어요. 시간은 같으니까 걱정하지 마세요.

아이들도 데려갈게요. 막내가 아빠 보고 싶다고 매일 얘기해요.

필요한 거 있으면 미리 말해줘요.`,
    date: "3일 전",
    isRead: true,
    isNew: false,
    folder: "inbox",
  },
  {
    id: "3",
    sender: familyMembers[0],
    subject: "사진 고마워요",
    preview: "보내주신 가족사진 잘 받았어요. 동생이 많이 컸네요...",
    content: `보내주신 가족사진 잘 받았어요. 동생이 많이 컸네요.

사진 보면서 많이 웃었어요. 잘 보관하고 있을게요.`,
    date: "1주 전",
    isRead: true,
    isNew: false,
    hasAttachments: true,
    attachmentCount: 2,
    folder: "inbox",
  },
  // 손편지 (handwritten)
  {
    id: "8",
    sender: familyMembers[2],
    subject: "손으로 쓴 편지",
    preview: "사랑하는 가족에게, 오늘도 건강하게 지내고 있어요...",
    content: `사랑하는 가족에게,

오늘도 건강하게 지내고 있어요. 날씨가 많이 추워졌는데 감기 조심하세요.

항상 보고싶고 사랑해요.

2024년 12월`,
    date: "어제",
    isRead: false,
    isNew: true,
    folder: "inbox",
    isHandwritten: true,
  },
  {
    id: "4",
    sender: familyMembers[0],
    subject: "재원아, 잘 지내고 있지?",
    preview: "요즘 날씨가 많이 추워졌는데, 감기 조심해...",
    content: `재원아, 잘 지내고 있지?

요즘 날씨가 많이 추워졌는데, 감기 조심해. 아빠도 건강하시고, 동생도 학교 잘 다니고 있어.

다음 면회 때 좋아하는 과자 가져갈게. 그때 보자.

- 엄마가`,
    date: "2일 전",
    isRead: true,
    isNew: false,
    folder: "sent",
    status: "우체국 발송완료",
  },
  // 임시저장함 (draft)
  {
    id: "5",
    sender: familyMembers[1],
    subject: "여보, 오늘 면회 다녀왔어요",
    preview: "오늘 면회 다녀와서 너무 기뻤어요...",
    content: `여보, 오늘 면회 다녀왔어요.

아이들이 아빠 만나서 너무 좋아했어요.`,
    date: "1일 전",
    isRead: true,
    isNew: false,
    folder: "draft",
  },
  // 중요편지함 (archive)
  {
    id: "6",
    sender: familyMembers[0],
    subject: "엄마 생일 축하해요!",
    preview: "엄마, 생일 축하드려요! 여기서 직접 축하드리지 못해서...",
    content: `엄마, 생일 축하드려요!

여기서 직접 축하드리지 못해서 너무 죄송해요.
다음에 만나면 직접 축하해 드릴게요.

사랑해요, 엄마.`,
    date: "2주 전",
    isRead: true,
    isNew: false,
    isImportant: true,
    folder: "archive",
  },
  // 휴지통 (trash)
  {
    id: "7",
    sender: familyMembers[1],
    subject: "지난주 면회 일정",
    preview: "다음 주 면회 일정 확인해주세요...",
    content: `다음 주 면회 일정 확인해주세요.

일정이 변경될 수 있으니 미리 확인 부탁드려요.`,
    date: "3주 전",
    isRead: true,
    isNew: false,
    folder: "trash",
  },
];

export const mailOptions: MailOption[] = [
  {
    id: "regular",
    name: "일반우편",
    description: "발송 후 3~5일 소요",
    price: 430,
  },
  {
    id: "semi-registered",
    name: "준등기우편",
    description: "발송 후 3~4일 소요",
    price: 1800,
    badge: "추적가능",
  },
  {
    id: "registered",
    name: "등기우편",
    description: "발송 후 2~3일 소요",
    price: 2830,
    badge: "추적가능",
  },
];
