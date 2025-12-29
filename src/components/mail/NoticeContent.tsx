import { Search, ChevronDown, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface NoticeContentProps {
  onClose?: () => void;
}

interface NoticeItem {
  id: number;
  title: string;
  author: string;
  date: string;
  isHot: boolean;
  content: string;
}

const noticeData: NoticeItem[] = [
  {
    id: 1,
    title: '12/18 (목) 시스템 점검으로 인한 이벤트 참여 제한 안내',
    author: '운영자',
    date: '2025-12-15',
    isHot: false,
    content: `안녕하세요, 투오렌지입니다.

12월 18일(목) 시스템 점검이 예정되어 있어 안내드립니다.

■ 점검 일시: 2025년 12월 18일(목) 02:00 ~ 06:00 (4시간)
■ 점검 내용: 서버 안정화 및 보안 업데이트
■ 영향 범위: 이벤트 참여, 편지 발송 일시 중단

점검 시간 동안 서비스 이용이 제한될 수 있으니 양해 부탁드립니다.
더 안정적인 서비스로 보답하겠습니다.

감사합니다.`,
  },
  {
    id: 2,
    title: '교환 접수 기능 일시 중단 안내(*변경 안내)',
    author: '운영자',
    date: '2025-07-03',
    isHot: true,
    content: `안녕하세요, 투오렌지입니다.

교환 접수 기능이 일시 중단됨을 안내드립니다.

■ 중단 기간: 2025년 7월 3일 ~ 별도 공지 시까지
■ 사유: 시스템 개선 작업

교환이 필요하신 경우 고객센터로 문의해 주시면
개별적으로 안내 도와드리겠습니다.

불편을 드려 죄송합니다.`,
  },
  {
    id: 3,
    title: '1:1 문의 및 유선 상담 종료 안내',
    author: '운영자',
    date: '2025-10-31',
    isHot: false,
    content: `안녕하세요, 투오렌지입니다.

기존 1:1 문의 및 유선 상담 서비스가 종료됨을 안내드립니다.

■ 종료일: 2025년 10월 31일
■ 대체 서비스: 고객센터 > 고객의 소리

앞으로는 '고객의 소리'를 통해 문의해 주시면
빠르게 답변드리겠습니다.

감사합니다.`,
  },
  {
    id: 4,
    title: "채팅 상담 서비스 '채널톡' 도입 및 기존 상담 종료 안내",
    author: '운영자',
    date: '2025-10-14',
    isHot: true,
    content: `안녕하세요, 투오렌지입니다.

더 빠르고 편리한 상담을 위해 채널톡 서비스를 도입합니다.

■ 도입일: 2025년 10월 14일
■ 이용 방법: 화면 우측 하단 채팅 아이콘 클릭
■ 운영 시간: 평일 09:00 ~ 18:00

실시간 채팅으로 빠른 상담을 받아보세요!

감사합니다.`,
  },
  {
    id: 5,
    title: '개인정보처리방침 변경 사전 안내 2025.10.23',
    author: '운영자',
    date: '2025-10-23',
    isHot: false,
    content: `안녕하세요, 투오렌지입니다.

개인정보처리방침이 일부 변경됨을 안내드립니다.

■ 시행일: 2025년 10월 23일
■ 주요 변경 사항:
  - 개인정보 수집 항목 명확화
  - 보관 기간 조정
  - 제3자 제공 내용 업데이트

자세한 내용은 개인정보처리방침 페이지에서 확인해 주세요.

감사합니다.`,
  },
  {
    id: 6,
    title: '개인정보처리방침 변경 사전 안내 2025.10.13',
    author: '운영자',
    date: '2025-10-13',
    isHot: false,
    content: `안녕하세요, 투오렌지입니다.

개인정보처리방침 변경을 사전 안내드립니다.

■ 시행일: 2025년 10월 13일
■ 주요 변경 사항:
  - 마케팅 정보 수신 동의 절차 개선
  - 개인정보 파기 절차 명확화

자세한 내용은 개인정보처리방침 페이지에서 확인해 주세요.

감사합니다.`,
  },
  {
    id: 7,
    title: '10/2(목) 명절 연휴 전 고객센터 단축 운영 안내',
    author: '운영자',
    date: '2025-10-01',
    isHot: false,
    content: `안녕하세요, 투오렌지입니다.

추석 명절 연휴를 앞두고 고객센터 운영 시간이 단축됨을 안내드립니다.

■ 단축 운영일: 2025년 10월 2일(목)
■ 운영 시간: 09:00 ~ 15:00
■ 연휴 기간: 10월 3일 ~ 10월 6일 (휴무)

연휴 기간 중 문의는 '고객의 소리'를 이용해 주시면
연휴 후 순차적으로 답변드리겠습니다.

즐거운 명절 보내세요!`,
  },
  {
    id: 8,
    title: '7월 5일(토) 카카오페이 서비스 일시 중단 안내',
    author: '운영자',
    date: '2025-06-20',
    isHot: false,
    content: `안녕하세요, 투오렌지입니다.

카카오페이 시스템 점검으로 결제 서비스가 일시 중단됩니다.

■ 중단 일시: 2025년 7월 5일(토) 00:00 ~ 06:00
■ 영향 범위: 카카오페이 결제

해당 시간에는 다른 결제 수단을 이용해 주세요.

불편을 드려 죄송합니다.`,
  },
  {
    id: 9,
    title: '간편결제 사용 재개 안내',
    author: '운영자',
    date: '2025-04-24',
    isHot: false,
    content: `안녕하세요, 투오렌지입니다.

간편결제 서비스가 정상 재개되었음을 안내드립니다.

■ 재개일: 2025년 4월 24일
■ 이용 가능 서비스: 카카오페이, 네이버페이, 토스페이

그동안 불편을 드려 죄송합니다.
더 안정적인 서비스로 보답하겠습니다.

감사합니다.`,
  },
  {
    id: 10,
    title: '적립금 사용 정책 변경 사전 안내(시행일 : 2025.05.15)',
    author: '운영자',
    date: '2025-04-14',
    isHot: true,
    content: `안녕하세요, 투오렌지입니다.

적립금 사용 정책이 변경됨을 안내드립니다.

■ 시행일: 2025년 5월 15일
■ 주요 변경 사항:
  - 최소 사용 금액: 1,000원 이상
  - 유효 기간: 적립일로부터 1년
  - 소멸 예정 적립금 안내 서비스 추가

기존 적립금은 변경된 정책에 따라 적용됩니다.

감사합니다.`,
  },
  {
    id: 11,
    title: '앱 업데이트 안내 2025.04.14',
    author: '운영자',
    date: '2025-04-14',
    isHot: false,
    content: `안녕하세요, 투오렌지입니다.

앱이 새롭게 업데이트되었습니다.

■ 업데이트 일시: 2025년 4월 14일
■ 주요 업데이트 내용:
  - 편지 작성 UI 개선
  - 오렌지 나무 애니메이션 추가
  - 버그 수정 및 안정성 개선

최신 버전으로 업데이트하시면 더 쾌적한 서비스를 이용하실 수 있습니다.

감사합니다.`,
  },
  {
    id: 12,
    title: '생일 혜택 안내',
    author: '운영자',
    date: '2025-03-12',
    isHot: true,
    content: `안녕하세요, 투오렌지입니다.

회원님의 특별한 날을 축하하는 생일 혜택을 안내드립니다.

■ 혜택 내용:
  - 생일 축하 적립금 3,000원 지급
  - 편지 발송 시 특별 편지지 무료 제공
  - 생일 당일 무료 배송

■ 적용 대상: 생년월일이 등록된 회원
■ 유효 기간: 생일 당월 1일 ~ 말일

특별한 날, 소중한 사람에게 마음을 전해보세요!

감사합니다.`,
  },
  {
    id: 13,
    title: '휴대폰결제 사용 재개 안내',
    author: '운영자',
    date: '2025-03-07',
    isHot: false,
    content: `안녕하세요, 투오렌지입니다.

휴대폰 결제 서비스가 정상 재개되었음을 안내드립니다.

■ 재개일: 2025년 3월 7일
■ 이용 가능 통신사: SKT, KT, LG U+

그동안 불편을 드려 죄송합니다.

감사합니다.`,
  },
  {
    id: 14,
    title: '간편결제 및 휴대폰결제 사용불가 안내',
    author: '운영자',
    date: '2025-02-27',
    isHot: true,
    content: `안녕하세요, 투오렌지입니다.

결제 시스템 점검으로 일부 결제 수단 사용이 제한됩니다.

■ 제한 기간: 2025년 2월 27일 ~ 별도 공지 시
■ 제한 결제 수단:
  - 간편결제 (카카오페이, 네이버페이 등)
  - 휴대폰 결제

■ 이용 가능 결제 수단:
  - 신용카드 / 체크카드
  - 무통장 입금

불편을 드려 죄송합니다.
빠른 시일 내에 정상화하도록 하겠습니다.

감사합니다.`,
  },
];

const searchOptions = [
  { value: 'title', label: '제목' },
  { value: 'content', label: '내용' },
  { value: 'author', label: '작성자' },
];

export function NoticeContent({ onClose }: NoticeContentProps) {
  const [searchType, setSearchType] = useState('title');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);
  const itemsPerPage = 10;

  const filteredNotices = noticeData.filter((notice) => {
    if (!searchQuery) return true;
    if (searchType === 'title') {
      return notice.title.toLowerCase().includes(searchQuery.toLowerCase());
    }
    if (searchType === 'content') {
      return notice.content.toLowerCase().includes(searchQuery.toLowerCase());
    }
    if (searchType === 'author') {
      return notice.author.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);
  const paginatedNotices = filteredNotices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 상세 화면
  if (selectedNotice) {
    return (
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b border-border/40 bg-white/80 backdrop-blur-sm flex items-center justify-between px-6">
          <button
            onClick={() => setSelectedNotice(null)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">목록으로</span>
          </button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            편지함으로 돌아가기
          </Button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-5 lg:px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* 제목 영역 */}
              <div className="mb-6 pb-6 border-b border-border/40">
                <div className="flex items-center gap-2 mb-3">
                  {selectedNotice.isHot && (
                    <span className="px-2 py-0.5 text-xs font-bold text-white bg-red-500 rounded">
                      HOT
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-foreground mb-3">
                  {selectedNotice.title}
                </h2>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{selectedNotice.author}</span>
                  <span>{selectedNotice.date}</span>
                </div>
              </div>

              {/* 본문 */}
              <div className="prose prose-sm max-w-none">
                <p className="text-base text-foreground leading-relaxed whitespace-pre-line">
                  {selectedNotice.content}
                </p>
              </div>

              {/* 이전/다음 글 네비게이션 */}
              <div className="mt-10 pt-6 border-t border-border/40">
                <div className="flex flex-col gap-2">
                  {noticeData.find(n => n.id === selectedNotice.id - 1) && (
                    <button
                      onClick={() => {
                        const prevNotice = noticeData.find(n => n.id === selectedNotice.id - 1);
                        if (prevNotice) setSelectedNotice(prevNotice);
                      }}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                    >
                      <ChevronLeft className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="text-xs text-muted-foreground shrink-0">이전 글</span>
                      <span className="text-sm text-foreground truncate">
                        {noticeData.find(n => n.id === selectedNotice.id - 1)?.title}
                      </span>
                    </button>
                  )}
                  {noticeData.find(n => n.id === selectedNotice.id + 1) && (
                    <button
                      onClick={() => {
                        const nextNotice = noticeData.find(n => n.id === selectedNotice.id + 1);
                        if (nextNotice) setSelectedNotice(nextNotice);
                      }}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                    >
                      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="text-xs text-muted-foreground shrink-0">다음 글</span>
                      <span className="text-sm text-foreground truncate">
                        {noticeData.find(n => n.id === selectedNotice.id + 1)?.title}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // 목록 화면
  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <header className="h-14 border-b border-border/40 bg-white/80 backdrop-blur-sm flex items-center justify-between px-6">
        <h1 className="text-lg font-semibold text-foreground">공지사항</h1>
        <Button variant="ghost" size="sm" onClick={onClose}>
          편지함으로 돌아가기
        </Button>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-5 lg:px-6">
        <div className="max-w-4xl mx-auto">
          {/* 상단 타이틀 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              투오렌지의 <span className="text-primary underline underline-offset-4">새 소식</span>을 전해드려요
            </h2>
            <div className="mb-6">
              <p className="text-base text-muted-foreground leading-normal">
                서비스 업데이트, 이벤트, 점검 안내 등
                <br />
                투오렌지의 중요한 소식을 확인해 보세요.
              </p>
            </div>
          </div>

          {/* 검색 영역 */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <p className="text-sm text-muted-foreground">{filteredNotices.length}개의 공지사항</p>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* 검색 타입 드롭다운 */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-between w-24 px-3 py-2 text-sm border border-border/60 rounded-lg bg-card hover:border-primary/30 transition-colors"
                >
                  <span className="text-foreground">{searchOptions.find(opt => opt.value === searchType)?.label}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-card border border-border/60 rounded-lg shadow-lg z-10">
                    {searchOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSearchType(option.value);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-sm text-left hover:bg-muted first:rounded-t-lg last:rounded-b-lg ${
                          searchType === option.value ? 'bg-primary/10 text-primary' : 'text-foreground'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 검색 입력 */}
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="검색어를 입력해 주세요."
                  className="w-full sm:w-64 pl-10"
                />
              </div>
            </div>
          </div>

          {/* 테이블 */}
          <div className="bg-card rounded-xl border border-border/60 overflow-hidden">
            {/* 테이블 헤더 */}
            <div className="hidden md:grid grid-cols-12 gap-4 py-3 px-4 border-b border-border/60 bg-muted/30">
              <div className="col-span-1 text-center text-sm font-medium text-muted-foreground">번호</div>
              <div className="col-span-7 text-sm font-medium text-muted-foreground">제목</div>
              <div className="col-span-2 text-center text-sm font-medium text-muted-foreground">작성자</div>
              <div className="col-span-2 text-center text-sm font-medium text-muted-foreground">작성일</div>
            </div>

            {/* 테이블 바디 */}
            <div className="divide-y divide-border/40">
              {paginatedNotices.map((notice, index) => (
                <motion.div
                  key={notice.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => setSelectedNotice(notice)}
                  className="grid grid-cols-12 gap-2 md:gap-4 py-4 px-4 hover:bg-muted/30 cursor-pointer transition-colors"
                >
                  {/* 번호 */}
                  <div className="col-span-2 md:col-span-1 text-center text-sm text-muted-foreground">
                    {notice.id}
                  </div>

                  {/* 제목 */}
                  <div className="col-span-10 md:col-span-7 flex items-center gap-2">
                    <span className="text-sm text-foreground hover:text-primary transition-colors line-clamp-1">
                      {notice.title}
                    </span>
                    {notice.isHot && (
                      <span className="shrink-0 px-1.5 py-0.5 text-[10px] font-bold text-white bg-red-500 rounded">
                        HOT
                      </span>
                    )}
                  </div>

                  {/* 작성자 - 데스크탑 */}
                  <div className="hidden md:block col-span-2 text-center text-sm text-muted-foreground">
                    {notice.author}
                  </div>

                  {/* 작성일 - 데스크탑 */}
                  <div className="hidden md:block col-span-2 text-center text-sm text-muted-foreground">
                    {notice.date}
                  </div>

                  {/* 모바일: 작성자 + 작성일 */}
                  <div className="col-span-12 md:hidden pl-8 text-xs text-muted-foreground">
                    {notice.author} · {notice.date}
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredNotices.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>검색 결과가 없습니다.</p>
              </div>
            )}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 mt-6">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed rounded-lg hover:bg-muted/50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 text-sm rounded-lg transition-colors ${
                    page === currentPage
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted/50'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed rounded-lg hover:bg-muted/50 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* 안내 문구 */}
          <div className="mt-6 p-4 bg-muted/50 rounded-xl">
            <h4 className="text-sm font-medium text-foreground mb-2">더 궁금한 점이 있으신가요?</h4>
            <p className="text-xs text-muted-foreground">
              '고객의 소리'를 통해 문의해 주시면 빠르게 답변드리겠습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
