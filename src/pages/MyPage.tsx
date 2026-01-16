import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ChevronRight, Camera } from 'lucide-react';

type TabType = 'points' | 'payments' | 'settings';

export default function MyPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<TabType>('points');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);
  const [showPointChargeModal, setShowPointChargeModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedChargeAmount, setSelectedChargeAmount] = useState<number | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // 임시 사용자 데이터
  const user = {
    name: '홍길동',
    email: 'hong@example.com',
    phone: '010-1234-5678',
    joinDate: '2024.12.01',
    sentLetters: 3,
    totalPayment: 17100,
    points: 15000,
    socialProvider: 'kakao' as 'kakao' | 'google' | 'apple' | 'email' | null, // 소셜 로그인 유형
  };

  // 소셜 로그인 아이콘
  const SocialIcon = ({ provider }: { provider: 'kakao' | 'google' | 'apple' | 'email' | null }) => {
    if (provider === 'kakao') {
      return (
        <div className="w-5 h-5 bg-[#FEE500] rounded-full flex items-center justify-center" title="카카오 계정">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="#000000">
            <path d="M12 3C6.48 3 2 6.48 2 10.8c0 2.76 1.8 5.16 4.5 6.54-.12.42-.78 2.7-.81 2.88 0 0-.02.12.06.18.08.06.18.03.18.03.24-.03 2.76-1.8 3.18-2.1.9.12 1.86.18 2.88.18 5.52 0 10-3.48 10-7.8S17.52 3 12 3z"/>
          </svg>
        </div>
      );
    }
    if (provider === 'google') {
      return (
        <div className="w-5 h-5 bg-white border border-gray-200 rounded-full flex items-center justify-center" title="구글 계정">
          <svg className="w-3 h-3" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        </div>
      );
    }
    if (provider === 'apple') {
      return (
        <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center" title="애플 계정">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
        </div>
      );
    }
    return null;
  };

  // 포인트 내역 (적립/사용)
  const pointHistory = [
    { id: 1, type: '사용', description: '편지 발송 - 김OO', amount: -2500, date: '2025.01.05', balance: 15000 },
    { id: 2, type: '사용', description: '편지 발송 - 이OO', amount: -2500, date: '2025.01.03', balance: 17500 },
    { id: 3, type: '적립', description: '포인트 충전', amount: 10000, date: '2025.01.01', balance: 20000 },
    { id: 4, type: '사용', description: '편지 발송 - 박OO', amount: -2500, date: '2024.12.28', balance: 10000 },
    { id: 5, type: '적립', description: '회원가입 보너스', amount: 5000, date: '2024.12.01', balance: 12500 },
  ];

  // 결제 내역 (실제 결제)
  const payments = [
    { id: 1, method: '카드결제', amount: 10000, points: 10000, date: '2025.01.01', status: '완료' },
    { id: 2, method: '카카오페이', amount: 5000, points: 5000, date: '2024.12.15', status: '완료' },
    { id: 3, method: '카드결제', amount: 2100, points: 2100, date: '2024.12.01', status: '완료' },
  ];

  const chargeAmounts = [10000, 30000, 50000, 100000];

  const handleSendVerificationCode = () => {
    setIsCodeSent(true);
    alert('이메일로 인증번호가 발송되었습니다.');
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (newPassword.length < 8) {
      alert('비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    alert('비밀번호가 변경되었습니다.');
    setShowPasswordModal(false);
    resetPasswordModal();
  };

  const resetPasswordModal = () => {
    setVerificationCode('');
    setIsCodeSent(false);
    setNewPassword('');
    setConfirmPassword('');
  };

  const handlePointCharge = () => {
    if (!selectedChargeAmount) {
      alert('충전 금액을 선택해주세요.');
      return;
    }
    alert(`${selectedChargeAmount.toLocaleString()}원 결제 페이지로 이동합니다.`);
    setShowPointChargeModal(false);
    setSelectedChargeAmount(null);
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* 로고 */}
          <div className="flex items-center gap-6">
            <a href="/" className="text-xl font-bold text-orange-500">to.orange</a>
            <div className="hidden md:flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-600">
              구치소/교도소
              <ChevronRight className="w-4 h-4 rotate-90" />
            </div>
          </div>

          {/* 네비게이션 */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="/" className="text-gray-600 hover:text-orange-500 transition-colors relative">
              마음전하기
              <span className="absolute -top-1 -right-2 w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
            </a>
            <a href="/customer-service" className="text-gray-600 hover:text-orange-500 transition-colors">고객센터</a>
            <a href="/mypage" className="text-orange-500 font-medium">마이페이지</a>
          </nav>

          {/* 버튼 */}
          <div className="flex items-center gap-3">
            <button className="bg-orange-500 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-orange-600 transition-colors">
              시작하기
            </button>
            <button
              onClick={() => navigate('/auth')}
              className="border border-gray-300 text-gray-700 px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              로그인
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* 페이지 타이틀 */}
        <h1 className="text-2xl font-bold text-gray-900 mb-8">마이페이지</h1>

        {/* 프로필 카드 */}
        <div className="bg-white rounded-2xl p-8 mb-6 shadow-sm">
          {/* 프로필 상단 */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-5">
              {/* 프로필 이미지 */}
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden">
                  {profileImage ? (
                    <img src={profileImage} alt="프로필" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-orange-400" />
                  )}
                </div>
                <button
                  onClick={triggerFileInput}
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center shadow-md hover:bg-orange-600 transition-colors"
                >
                  <Camera className="w-3 h-3 text-white" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="hidden"
                />
              </div>
              {/* 이름/이메일 */}
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                  {user.socialProvider && <SocialIcon provider={user.socialProvider} />}
                </div>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            {/* 정보 수정 버튼 */}
            <button
              onClick={() => setShowProfileEditModal(true)}
              className="px-5 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              정보 수정
            </button>
          </div>

          {/* 통계 정보 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-400 mb-1">연락처</p>
              <p className="font-semibold text-gray-900">{user.phone}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">가입일</p>
              <p className="font-semibold text-gray-900">{user.joinDate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">보낸 편지</p>
              <p className="font-semibold text-orange-500">{user.sentLetters}통</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">보유 포인트</p>
              <p className="font-semibold text-orange-500">{user.points.toLocaleString()}P</p>
            </div>
          </div>
        </div>

        {/* 포인트 충전 배너 */}
        <div
          onClick={() => setShowPointChargeModal(true)}
          className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-2xl p-5 mb-6 text-white shadow-lg cursor-pointer hover:from-orange-600 hover:to-orange-500 transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">보유 포인트</p>
              <p className="text-2xl font-bold">{user.points.toLocaleString()} P</p>
            </div>
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl px-5 py-2.5 font-semibold transition-colors">
              충전하기
            </button>
          </div>
        </div>

        {/* 탭 메뉴 */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveTab('points')}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'points'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            포인트 내역
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'payments'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            결제 내역
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'settings'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            설정
          </button>
        </div>

        {/* 탭 컨텐츠 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* 포인트 내역 탭 */}
          {activeTab === 'points' && (
            <div>
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">포인트 적립/사용 내역</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {pointHistory.map((item) => (
                  <div key={item.id} className="px-6 py-5 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                          item.type === '적립'
                            ? 'bg-green-50 text-green-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {item.type}
                        </span>
                        <span className="font-medium text-gray-900">{item.description}</span>
                      </div>
                      <p className="text-sm text-gray-500">{item.date}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${item.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                        {item.amount > 0 ? '+' : ''}{item.amount.toLocaleString()}P
                      </p>
                      <p className="text-xs text-gray-400">잔액 {item.balance.toLocaleString()}P</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 결제 내역 탭 */}
          {activeTab === 'payments' && (
            <div>
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">결제 내역</h3>
                <p className="text-sm text-gray-500 mt-1">포인트 충전을 위한 결제 기록입니다.</p>
              </div>
              <div className="divide-y divide-gray-100">
                {payments.map((payment) => (
                  <div key={payment.id} className="px-6 py-5 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{payment.method}</p>
                      <p className="text-sm text-gray-500">{payment.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{payment.amount.toLocaleString()}원</p>
                      <p className="text-xs text-green-600">+{payment.points.toLocaleString()}P 적립</p>
                    </div>
                  </div>
                ))}
              </div>
              {payments.length === 0 && (
                <div className="px-6 py-12 text-center text-gray-500">
                  결제 내역이 없습니다.
                </div>
              )}
            </div>
          )}

          {/* 설정 탭 */}
          {activeTab === 'settings' && (
            <div className="divide-y divide-gray-100">
              <button
                onClick={() => setShowProfileEditModal(true)}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="text-left">
                  <p className="font-medium text-gray-900">개인정보 관리</p>
                  <p className="text-sm text-gray-500">이름, 연락처, 이메일</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="text-left">
                  <p className="font-medium text-gray-900">비밀번호 변경</p>
                  <p className="text-sm text-gray-500">이메일 인증 후 변경</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
              <button className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="text-left">
                  <p className="font-medium text-gray-900">알림 설정</p>
                  <p className="text-sm text-gray-500">이메일, SMS 수신 설정</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
              <button
                onClick={() => {
                  if (confirm('로그아웃 하시겠습니까?')) {
                    navigate('/auth');
                  }
                }}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="text-left">
                  <p className="font-medium text-red-500">로그아웃</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          )}
        </div>
      </main>

      {/* 포인트 충전 모달 */}
      {showPointChargeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowPointChargeModal(false)}>
          <div
            className="bg-white w-full max-w-md rounded-2xl p-6 mx-4 animate-fade-in"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">포인트 충전</h3>
            <p className="text-sm text-gray-500 mb-6">충전할 금액을 선택해주세요</p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {chargeAmounts.map(amount => (
                <button
                  key={amount}
                  onClick={() => setSelectedChargeAmount(amount)}
                  className={`py-4 rounded-xl font-semibold transition-all ${
                    selectedChargeAmount === amount
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {amount.toLocaleString()}원
                </button>
              ))}
            </div>

            {selectedChargeAmount && (
              <div className="bg-orange-50 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">결제 금액</span>
                  <span className="font-bold text-gray-900">{selectedChargeAmount.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">충전 후 예상 포인트</span>
                  <span className="text-lg font-bold text-orange-500">
                    {(user.points + selectedChargeAmount).toLocaleString()} P
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { setShowPointChargeModal(false); setSelectedChargeAmount(null); }}
                className="flex-1 py-3 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handlePointCharge}
                disabled={!selectedChargeAmount}
                className="flex-1 py-3 rounded-xl font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                결제하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 비밀번호 변경 모달 */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => { setShowPasswordModal(false); resetPasswordModal(); }}>
          <div
            className="bg-white w-full max-w-md rounded-2xl p-6 mx-4 animate-fade-in max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">비밀번호 변경</h3>
            <p className="text-sm text-gray-500 mb-6">이메일 인증 후 비밀번호를 변경할 수 있습니다</p>

            {/* 인증번호 발송 전 */}
            {!isCodeSent && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">{user.email}</span>로 인증번호를 발송합니다.
                  </p>
                </div>
                <button
                  onClick={handleSendVerificationCode}
                  className="w-full py-3 rounded-xl font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                >
                  인증번호 발송
                </button>
              </div>
            )}

            {/* 인증번호 확인 및 비밀번호 변경 */}
            {isCodeSent && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">인증번호</label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={e => setVerificationCode(e.target.value)}
                    placeholder="6자리 인증번호 입력"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                    maxLength={6}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">새 비밀번호</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="8자 이상 입력"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">비밀번호 확인</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="비밀번호 재입력"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                  />
                </div>
                <button
                  onClick={handlePasswordChange}
                  disabled={!verificationCode || !newPassword || !confirmPassword}
                  className="w-full py-3 rounded-xl font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  비밀번호 변경
                </button>
              </div>
            )}

            <button
              onClick={() => { setShowPasswordModal(false); resetPasswordModal(); }}
              className="w-full mt-4 py-3 rounded-xl font-semibold text-gray-500 hover:bg-gray-100 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 프로필 수정 모달 */}
      {showProfileEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowProfileEditModal(false)}>
          <div
            className="bg-white w-full max-w-md rounded-2xl p-6 mx-4 animate-fade-in"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">정보 수정</h3>

            {/* 프로필 이미지 수정 */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden">
                  {profileImage ? (
                    <img src={profileImage} alt="프로필" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-orange-400" />
                  )}
                </div>
                <button
                  onClick={triggerFileInput}
                  className="absolute -bottom-1 -right-1 w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center shadow-md hover:bg-orange-600 transition-colors"
                >
                  <Camera className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
              <button
                onClick={triggerFileInput}
                className="mt-2 text-sm text-orange-500 font-medium hover:text-orange-600"
              >
                사진 변경
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
                <input
                  type="text"
                  defaultValue={user.name}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">연락처</label>
                <input
                  type="tel"
                  defaultValue={user.phone}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                <input
                  type="email"
                  defaultValue={user.email}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowProfileEditModal(false)}
                className="flex-1 py-3 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => {
                  alert('정보가 수정되었습니다.');
                  setShowProfileEditModal(false);
                }}
                className="flex-1 py-3 rounded-xl font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-colors"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
