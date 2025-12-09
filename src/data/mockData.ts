import type { FamilyMember, Mail, MailOption } from "@/types/mail";

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
  // 보낸편지함 (sent)
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
