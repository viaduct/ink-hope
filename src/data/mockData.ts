import type { FamilyMember, Mail, MailOption } from "@/types/mail";

export const familyMembers: FamilyMember[] = [
  {
    id: "1",
    name: "이재원",
    relation: "아들",
    facility: "서울남부교도소",
    facilityAddress: "서울특별시 금천구 시흥대로 143",
    prisonerNumber: "2024-12345",
    avatar: "이",
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: "2",
    name: "서은우",
    relation: "남편",
    facility: "수원구치소",
    facilityAddress: "경기도 수원시 팔달구 동수원로 397",
    prisonerNumber: "2024-67890",
    avatar: "서",
    color: "bg-purple-100 text-purple-600",
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
