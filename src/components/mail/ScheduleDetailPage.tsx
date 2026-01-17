import React, { useState } from 'react';
import { MapPin, Copy, Car, Bus, Building2, Coffee, Bed, Navigation, ExternalLink, Check, Calendar, Users, ChevronLeft, Share2, Pencil, Trash2, Briefcase, Scale, Home, Sparkles, Cake, Heart, GraduationCap, Activity, LucideIcon, ChevronRight, Gift, BookOpen } from 'lucide-react';
import { ScheduleEvent } from './ScheduleContent';
import HotelDetailPopup, { HotelInfo } from './HotelDetailPage';

interface ScheduleDetailPageProps {
  event: ScheduleEvent;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onNavigateToTimeCapsule?: () => void;
}

interface CafeInfo {
  name: string;
  distance: string;
  price: string;
}

type CopyType = 'phone' | 'address' | 'taxi';

export default function ScheduleDetailPage({ event, onClose, onEdit, onDelete, onNavigateToTimeCapsule }: ScheduleDetailPageProps): React.ReactElement {
  const [transportTab, setTransportTab] = useState<'car' | 'public'>('car');
  const [copiedPhone, setCopiedPhone] = useState<boolean>(false);
  const [copiedAddress, setCopiedAddress] = useState<boolean>(false);
  const [copiedTaxiScript, setCopiedTaxiScript] = useState<boolean>(false);
  const [selectedHotel, setSelectedHotel] = useState<HotelInfo | null>(null);
  const [isHotelPopupOpen, setIsHotelPopupOpen] = useState<boolean>(false);

  // 시설 정보 (실제로는 event에서 가져와야 함)
  const facilityInfo = {
    name: event.facility || '수원구치소',
    address: '경기도 수원시 팔달구 동수원로 399',
    phone: '031-250-5500'
  };

  // 대중교통 정보
  const publicTransportInfo = {
    taxiScript: `${facilityInfo.name} 민원실 정문 앞으로 가주세요`
  };

  // 숙박시설 상세 정보
  const hotels: HotelInfo[] = [
    {
      id: '1',
      name: '종로 호텔팝 리즈 프리미어',
      location: '종로3가역 도보 3분',
      distance: '차량 1.2km',
      images: [
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
      ],
      phone: '02-1234-5678',
      tags: ['유튜브', '야외테라스', '욕조'],
      description: '팝 호텔은 금연건물로 전 객실 금연룸으로 운영됩니다.',
      facilities: ['금연객실', '스타일러', '와이파이', '주차가능', 'OTT (스트리밍 서비스)', '테라스/발코니', '24시간데스크', 'VOD'],
      serviceLanguage: '한국어',
      facilityInfo: ['오로지 회원에게만 !', '예약 회원 특별 할인가 제공 !'],
      totalRooms: 34,
      price: '8만원대~',
    },
    {
      id: '2',
      name: '이비스 앰배서더 수원',
      location: '수원역 도보 5분',
      distance: '차량 3.1km',
      images: [
        'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
      ],
      phone: '031-2345-6789',
      tags: ['조식포함', '피트니스', '비즈니스'],
      description: '이비스 앰배서더 수원은 편리한 접근성과 쾌적한 시설을 자랑합니다.',
      facilities: ['금연객실', '피트니스', '와이파이', '주차가능', '조식 제공', '비즈니스 센터', '24시간데스크'],
      serviceLanguage: '한국어, 영어',
      facilityInfo: ['멤버십 회원 할인 적용'],
      totalRooms: 120,
      price: '10만원대~',
    },
    {
      id: '3',
      name: '수원 호텔캐슬',
      location: '화서역 도보 7분',
      distance: '차량 2.8km',
      images: [
        'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800',
        'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800',
      ],
      phone: '031-3456-7890',
      tags: ['가성비', '깨끗함', '친절'],
      description: '수원 호텔캐슬은 합리적인 가격에 깨끗한 객실을 제공합니다.',
      facilities: ['금연객실', '와이파이', '주차가능', 'TV', '에어컨', '24시간데스크'],
      serviceLanguage: '한국어',
      facilityInfo: ['장기 투숙 할인 가능'],
      totalRooms: 45,
      price: '6만원대~',
    },
  ];

  // 대기장소/카페
  const cafes: CafeInfo[] = [
    { name: '투썸플레이스 수원법원점', distance: '1.2km', price: '아메리카노 4,500원' },
    { name: '스타벅스 수원역점', distance: '2.5km', price: '아메리카노 4,500원' },
    { name: '할리스 수원점', distance: '1.8km', price: '아메리카노 4,300원' },
  ];

  // 일정 유형 아이콘 매핑
  const typeIcons: Record<string, LucideIcon> = {
    'visit': Users,
    'consultation': Briefcase,
    'special_day': Scale,
    '일반접견': Users,
    '공식변호인접견': Briefcase,
    '사건관련일': Scale,
    '출소 예정': Home,
    '출소 축하': Home,
    '가석방 축하': Sparkles,
    '생일 축하': Cake,
    '기념일': Heart,
    '교육': GraduationCap,
    '건강': Activity,
  };

  const typeLabels: Record<string, string> = {
    'visit': '일반접견',
    'consultation': '공식변호인접견',
    'special_day': '사건관련일',
  };

  const handleCopy = (text: string, type: CopyType): void => {
    navigator.clipboard.writeText(text);
    if (type === 'phone') {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } else if (type === 'address') {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } else if (type === 'taxi') {
      setCopiedTaxiScript(true);
      setTimeout(() => setCopiedTaxiScript(false), 2000);
    }
  };

  const TypeIcon = typeIcons[event.type] || Users;
  const typeLabel = typeLabels[event.type] || event.title;

  // 타임캡슐 일정 유형
  const timeCapsuleTypes = ['출소 축하', '출소 예정', '가석방 축하', '생일 축하', '기념일'];
  const isTimeCapsuleType = timeCapsuleTypes.includes(typeLabel) || timeCapsuleTypes.includes(event.type);

  // 받는 사람 정보 (타임캡슐용)
  const recipientInfo = {
    name: '서은우', // 실제로는 event에서 가져와야 함
    facility: event.facility || '수원구치소',
    relation: '남편',
  };

  // 날짜 포맷
  const eventDate = new Date(event.date);
  const formattedDate = `${eventDate.getFullYear()}년 ${eventDate.getMonth() + 1}월 ${eventDate.getDate()}일`;

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="h-14 border-b border-border/40 bg-white/80 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-all"
            >
              <ChevronLeft className="text-gray-500" size={24} />
            </button>
            <h1 className="text-lg font-semibold text-foreground">일정 상세</h1>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <Share2 className="text-gray-500" size={20} />
            </button>
            <button
              onClick={onEdit}
              className="p-2 hover:bg-gray-100 rounded-full transition-all"
            >
              <Pencil className="text-gray-500" size={20} />
            </button>
            <button
              onClick={onDelete}
              className="p-2 hover:bg-gray-100 rounded-full transition-all"
            >
              <Trash2 className="text-gray-500" size={20} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto px-4 py-10 lg:px-6">
          <div className="max-w-4xl mx-auto space-y-6">
          {/* 날짜 및 시간 */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="text-orange-500" size={18} />
              <h2 className="font-semibold text-gray-800 text-sm">날짜 및 시간</h2>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-4 py-2 bg-orange-50 border border-orange-200 rounded-full text-orange-600 text-sm font-medium">
                {formattedDate}
              </span>
              {event.time && (
                <span className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-gray-700 text-sm font-medium">
                  {event.time}
                </span>
              )}
            </div>
          </section>

          {/* 일정유형 */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Users className="text-orange-500" size={18} />
              <h2 className="font-semibold text-gray-800 text-sm">일정유형</h2>
            </div>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-full text-sm font-medium">
              <TypeIcon size={14} />
              {typeLabel}
            </span>

            {/* 안내 메시지 - Tip */}
            <div className="rounded-2xl p-4 bg-orange-50 mt-4">
              {typeLabel === '출소 축하' || typeLabel === '출소 예정' ? (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-orange-500 font-bold text-sm">Tip</span>
                    <Home className="text-orange-500" size={18} />
                    <span className="font-semibold text-gray-800 text-sm">출소 일정을 선택한 경우</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-1">
                    출소는 끝이 아니라, <span className="font-bold text-gray-800">새로운 시작의 날</span>입니다.
                  </p>
                  <p className="text-gray-600 text-sm mb-4">그날을 위해 타임캡슐과 함께 준비해보세요.</p>
                  <div className="flex gap-2 mb-4 flex-wrap">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#C9C1B9] rounded-full text-sm text-gray-600 hover:bg-gray-50">
                      <Gift size={16} className="text-orange-400" />
                      출소복 선물하기
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#C9C1B9] rounded-full text-sm text-gray-600 hover:bg-gray-50">
                      <BookOpen size={16} className="text-green-500" />
                      도서 선물하기
                    </button>
                  </div>
                  <p className="text-gray-500 text-sm">
                    출소 이후의 생활을 바로 시작할 수 있도록,<br />
                    실질적으로 도움이 되는 선물을 담을 수 있어요.
                  </p>
                </>
              ) : typeLabel === '일반접견' ? (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-orange-500 font-bold text-sm">Tip</span>
                    <Users className="text-orange-500" size={18} />
                    <span className="font-semibold text-gray-800 text-sm">일반접견을 선택한 경우</span>
                  </div>
                  <ol className="text-sm text-gray-600 space-y-1 mb-4">
                    <li className="flex items-start gap-2">
                      <span className="text-gray-500">1.</span>
                      <span>신분증 + 가족관계증명서 필수 <span className="text-gray-400">- 휴대폰, 가방 반입 불가</span></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-500">2.</span>
                      당일 상황에 따라 면회가 취소될 수 있어요
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-500">3.</span>
                      <span>접견 30-40분 전 도착 권장</span>
                    </li>
                  </ol>
                  <div className="border-t border-orange-200 pt-3">
                    <p className="text-orange-600 font-bold text-sm mb-1">필독! 일정 등록 후 상세화면에서 확인하세요!</p>
                    <p className="text-gray-500 text-sm">찾아가는 법, 준비물 체크리스트, 주변 숙박 및 대기장소 정보를 추천해드립니다.</p>
                  </div>
                </>
              ) : typeLabel === '공식변호인접견' ? (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-orange-500 font-bold text-sm">Tip</span>
                    <Briefcase className="text-orange-500" size={18} />
                    <span className="font-semibold text-gray-800 text-sm">공식변호인접견을 선택한 경우</span>
                  </div>
                  <ol className="text-sm text-gray-600 space-y-2 mb-4">
                    <li className="flex items-start gap-2">
                      <span className="text-gray-500">1.</span>
                      <div>
                        <p>접견 시간 30~40분 전 도착을 권장합니다.</p>
                        <p className="text-gray-400">특히 처음 방문하는 경우 길 찾는 데 시간이 걸릴 수 있어요.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-500">2.</span>
                      선임된 변호인이 사건 진행을 위해 공식적으로 접견하는 방식이에요.
                    </li>
                  </ol>
                  <div className="bg-orange-100 rounded-xl p-3">
                    <p className="text-orange-700 font-semibold text-sm mb-1">변호사 선임 전이라면?</p>
                    <p className="text-gray-600 text-sm">선임 전 변호사 방문은 "일반접견"으로 진행돼요.</p>
                  </div>
                </>
              ) : typeLabel === '사건관련일' ? (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    아직 재판이 시작되지 않았어도 괜찮아요. 조사, 출석, 재판 등 사건과 관련된 중요한 날짜라면 이곳에 모두 등록할 수 있어요.
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-orange-500 font-bold text-sm">Tip</span>
                    <Scale className="text-orange-500" size={18} />
                    <span className="font-semibold text-gray-800 text-sm">사건관련일을 선택한 경우</span>
                  </div>
                  <ol className="text-sm text-gray-600 space-y-1">
                    <li className="flex items-start gap-2">
                      <span className="text-gray-500">1.</span>
                      일정은 변경될 수 있으니 사전에 확인하세요
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-500">2.</span>
                      장소 위치와 주차 정보를 미리 확인해두세요
                    </li>
                  </ol>
                </>
              ) : typeLabel === '가석방 축하' ? (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-orange-500 font-bold text-sm">Tip</span>
                    <Sparkles className="text-orange-500" size={18} />
                    <span className="font-semibold text-gray-800 text-sm">가석방 축하 일정을 선택한 경우</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-1">
                    가석방은 <span className="font-bold text-gray-800">새로운 희망의 시작</span>입니다.
                  </p>
                  <p className="text-gray-600 text-sm mb-4">소중한 그날을 타임캡슐에 기록하고, 함께 축하해보세요.</p>
                  <div className="flex gap-2 mb-4 flex-wrap">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#C9C1B9] rounded-full text-sm text-gray-600 hover:bg-gray-50">
                      <Gift size={16} className="text-orange-400" />
                      축하 선물하기
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#C9C1B9] rounded-full text-sm text-gray-600 hover:bg-gray-50">
                      <Heart size={16} className="text-pink-500" />
                      타임캡슐 편지 쓰기
                    </button>
                  </div>
                  <p className="text-gray-500 text-sm">
                    가석방 후 새 출발을 응원하는 마음을 담아<br />
                    미리 준비한 선물과 편지를 전해보세요.
                  </p>
                </>
              ) : typeLabel === '생일 축하' ? (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-orange-500 font-bold text-sm">Tip</span>
                    <Cake className="text-orange-500" size={18} />
                    <span className="font-semibold text-gray-800 text-sm">생일 축하 일정을 선택한 경우</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-1">
                    멀리 있어도 마음은 가까이, <span className="font-bold text-gray-800">특별한 생일</span>을 만들어주세요.
                  </p>
                  <p className="text-gray-600 text-sm mb-4">타임캡슐에 생일 축하 편지를 미리 담아두면 그날 전달됩니다.</p>
                  <div className="flex gap-2 mb-4 flex-wrap">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#C9C1B9] rounded-full text-sm text-gray-600 hover:bg-gray-50">
                      <Cake size={16} className="text-pink-400" />
                      생일 카드 보내기
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#C9C1B9] rounded-full text-sm text-gray-600 hover:bg-gray-50">
                      <Gift size={16} className="text-orange-400" />
                      생일 선물하기
                    </button>
                  </div>
                  <p className="text-gray-500 text-sm">
                    생일 당일에 도착할 수 있도록<br />
                    미리 편지와 선물을 준비해보세요.
                  </p>
                </>
              ) : typeLabel === '기념일' ? (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-orange-500 font-bold text-sm">Tip</span>
                    <Heart className="text-orange-500" size={18} />
                    <span className="font-semibold text-gray-800 text-sm">기념일을 선택한 경우</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-1">
                    결혼기념일, 만난 날, 특별한 날... <span className="font-bold text-gray-800">함께한 시간</span>을 기억해주세요.
                  </p>
                  <p className="text-gray-600 text-sm mb-4">기념일에 맞춰 타임캡슐 편지를 전달해보세요.</p>
                  <div className="flex gap-2 mb-4 flex-wrap">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#C9C1B9] rounded-full text-sm text-gray-600 hover:bg-gray-50">
                      <Heart size={16} className="text-pink-500" />
                      기념일 편지 쓰기
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#C9C1B9] rounded-full text-sm text-gray-600 hover:bg-gray-50">
                      <Gift size={16} className="text-orange-400" />
                      기념일 선물하기
                    </button>
                  </div>
                  <p className="text-gray-500 text-sm">
                    떨어져 있어도 기념일의 의미를 잊지 않도록<br />
                    미리 마음을 담은 편지를 준비해보세요.
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-orange-500 font-bold text-sm">Tip</span>
                    <span className="font-semibold text-gray-800 text-sm">일정 안내</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    등록된 일정의 상세 정보를 확인하고 필요한 준비를 해보세요.
                  </p>
                </>
              )}
            </div>
          </section>

          {/* 타임캡슐 일정 - 받는 사람 */}
          {isTimeCapsuleType && (
            <>
              <div className="border-t border-gray-300"></div>
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Users className="text-orange-500" size={18} />
                  <h2 className="font-semibold text-gray-800 text-sm">받는 사람</h2>
                </div>
                <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-medium">
                    {recipientInfo.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium text-sm">{recipientInfo.name} <span className="text-gray-500 font-normal">({recipientInfo.relation})</span></p>
                    <p className="text-orange-500 text-xs">{recipientInfo.facility}</p>
                  </div>
                </div>
              </section>

              {/* 타임캡슐로 이동 버튼 */}
              <button
                onClick={onNavigateToTimeCapsule}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition-all"
              >
                <Sparkles size={18} />
                타임캡슐로 이동
              </button>
            </>
          )}

          {/* 구분선 - 위치 섹션용 (타임캡슐 아닐 때만) */}
          {!isTimeCapsuleType && <div className="border-t border-gray-300"></div>}

          {/* 위치 섹션 - 타임캡슐 일정이 아닐 때만 표시 */}
          {!isTimeCapsuleType && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="text-orange-500" size={18} />
              <h2 className="font-semibold text-gray-800 text-sm">위치</h2>
            </div>

            {/* 찾아가는 법 */}
            <p className="text-gray-500 text-sm mb-4">찾아가는 법</p>

            {/* 위치 정보 카드 */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-4">
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                  <Building2 size={32} className="text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-base mb-1">{facilityInfo.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-gray-600 text-sm truncate">{facilityInfo.address}</p>
                    <button
                      onClick={() => handleCopy(facilityInfo.address, 'address')}
                      className="flex-shrink-0 p-1 hover:bg-gray-200 rounded transition-all"
                    >
                      {copiedAddress ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-gray-400" />}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <a href={`tel:${facilityInfo.phone}`} className="text-orange-500 text-sm font-medium">{facilityInfo.phone}</a>
                    <button
                      onClick={() => handleCopy(facilityInfo.phone, 'phone')}
                      className="flex-shrink-0 p-1 hover:bg-gray-200 rounded transition-all"
                    >
                      {copiedPhone ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-gray-400" />}
                    </button>
                  </div>
                  <p className="text-gray-400 text-xs mt-1">주차 가능 여부는 시설마다 달라요. 방문 전 전화로 미리 확인하세요.</p>
                </div>
              </div>
            </div>

            {/* 교통수단 탭 */}
            <div className="flex bg-gray-100 rounded-full p-1 mb-4">
              <button
                onClick={() => setTransportTab('car')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-medium transition-all ${
                  transportTab === 'car' ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Car size={16} />
                자가용 이용자
              </button>
              <button
                onClick={() => setTransportTab('public')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-medium transition-all ${
                  transportTab === 'public' ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Bus size={16} />
                대중교통 이용자
              </button>
            </div>

            {/* 자가용 탭 컨텐츠 */}
            {transportTab === 'car' && (
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Navigation size={16} className="text-orange-500" />
                    <span className="font-semibold text-gray-800 text-sm">근처까지 내비게이션 안내</span>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-orange-700 text-sm">
                        교정시설은 지도 앱에 정확히 표시되지 않는 경우가 많아요. 주소 또는 정류장 기준 안내를 따라주세요.
                      </p>
                      <button className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 bg-orange-500 text-white rounded-full text-xs font-medium hover:bg-orange-600 transition-all">
                        자세히보기
                        <ExternalLink size={10} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">🚶</span>
                    <span className="font-semibold text-gray-800 text-sm">현장이동안내</span>
                  </div>
                  <p className="text-gray-500 text-xs mb-3">지도에 표시되는 기준 지점: {facilityInfo.name} 민원실</p>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <ol className="text-sm text-gray-600 space-y-2">
                      <li className="flex gap-2"><span className="text-orange-500 font-medium">1.</span>기준 지점에서 정문 방향으로 이동</li>
                      <li className="flex gap-2"><span className="text-orange-500 font-medium">2.</span>큰 도로를 따라 약 100m 직진</li>
                      <li className="flex gap-2"><span className="text-orange-500 font-medium">3.</span>'민원실' 안내판이 보이면 좌측으로 진입</li>
                      <li className="flex gap-2"><span className="text-orange-500 font-medium">4.</span>신분증 확인 후 접견 대기실로 이동</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {/* 대중교통 탭 컨텐츠 */}
            {transportTab === 'public' && (
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Bus size={16} className="text-orange-500" />
                    <span className="font-semibold text-gray-800 text-sm">가장 가까운 버스 정류장</span>
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-xs rounded-full">우선 안내</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-gray-700 text-sm font-medium mb-1">구치소 인근 정류장</p>
                    <p className="text-gray-500 text-xs mb-2">
                      버스 노선에 따라 정류장 이름이 다를 수 있어요
                    </p>
                    <p className="text-gray-600 text-sm">
                      하차 후 <span className="font-medium text-orange-600">택시 이용을 권장</span>드려요.<br />
                      도보 이동은 길이 복잡하고 시간이 오래 걸릴 수 있어요.
                    </p>
                  </div>
                  <p className="text-gray-400 text-xs">정류장 이름이 달라도 괜찮아요. 택시 기사님이 알아요.</p>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">🚕</span>
                    <span className="font-semibold text-gray-800 text-sm">택시 미리 예약하세요</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">면회 시간대에는 택시 잡기가 어려울 수 있어요.</p>
                  <div className="bg-white rounded-lg p-3 mb-3">
                    <p className="text-gray-500 text-xs mb-2">택시 기사님께 이렇게 말씀하세요</p>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-700 text-sm font-medium">"{publicTransportInfo.taxiScript}"</p>
                      <button
                        onClick={() => handleCopy(publicTransportInfo.taxiScript, 'taxi')}
                        className="flex-shrink-0 p-1.5 hover:bg-gray-100 rounded transition-all"
                      >
                        {copiedTaxiScript ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-gray-400" />}
                      </button>
                    </div>
                  </div>
                  <button className="flex items-center gap-1.5 px-4 py-2 bg-yellow-400 text-yellow-900 rounded-full text-sm font-medium hover:bg-yellow-500 transition-all">
                    카카오T 예약하기
                    <ExternalLink size={12} />
                  </button>
                </div>
              </div>
            )}
          </section>
          )}

          {/* 구분선 - 주변 편의시설용 (타임캡슐 아닐 때만) */}
          {!isTimeCapsuleType && <div className="border-t border-gray-300"></div>}

          {/* 주변 편의시설 - 타임캡슐 일정이 아닐 때만 표시 */}
          {!isTimeCapsuleType && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="text-orange-500" size={18} />
              <h2 className="font-semibold text-gray-800 text-sm">주변 편의시설</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 숙박시설 */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Bed size={14} className="text-gray-500" />
                  <span className="text-sm text-gray-600 font-medium">숙박시설</span>
                </div>
                <div className="space-y-3">
                  {hotels.map((hotel) => (
                    <div
                      key={hotel.id}
                      onClick={() => {
                        setSelectedHotel(hotel);
                        setIsHotelPopupOpen(true);
                      }}
                      className="bg-gray-50 rounded-xl overflow-hidden hover:bg-gray-100 transition-all cursor-pointer"
                    >
                      <div className="flex">
                        <div className="w-20 h-20 bg-gray-200 flex-shrink-0 overflow-hidden">
                          {hotel.images[0] ? (
                            <img src={hotel.images[0]} alt={hotel.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Building2 size={24} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 p-3">
                          <p className="text-gray-800 text-sm font-medium truncate">{hotel.name}</p>
                          <p className="text-gray-500 text-xs">{hotel.distance}</p>
                          <p className="text-orange-500 text-xs font-medium">{hotel.price}</p>
                        </div>
                        <div className="flex items-center pr-3">
                          <ChevronRight size={16} className="text-gray-400" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 대기장소/카페 */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Coffee size={14} className="text-gray-500" />
                  <span className="text-sm text-gray-600 font-medium">대기장소 및 카페</span>
                </div>
                <div className="space-y-3">
                  {cafes.map((cafe, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-xl overflow-hidden hover:bg-gray-100 transition-all cursor-pointer">
                      <div className="flex">
                        <div className="w-20 bg-gray-200 flex-shrink-0 flex items-center justify-center">
                          <Coffee size={24} className="text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0 p-3">
                          <p className="text-gray-800 text-sm font-medium truncate">{cafe.name}</p>
                          <p className="text-gray-500 text-xs">{cafe.distance}</p>
                          <p className="text-orange-500 text-xs font-medium">{cafe.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
          )}
          </div>
        </div>
      </div>

      {/* 호텔 상세 팝업 */}
      <HotelDetailPopup
        hotel={selectedHotel}
        isOpen={isHotelPopupOpen}
        onClose={() => {
          setIsHotelPopupOpen(false);
          setSelectedHotel(null);
        }}
      />
    </div>
  );
}
