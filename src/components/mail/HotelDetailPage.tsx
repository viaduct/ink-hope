import React, { useState } from 'react';
import { ChevronLeft, Heart, Share2, MapPin, Phone, Check, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface HotelInfo {
  id: string;
  name: string;
  location: string;
  distance: string;
  images: string[];
  phone: string;
  tags: string[];
  description: string;
  facilities: string[];
  serviceLanguage: string;
  facilityInfo: string[];
  totalRooms: number;
  price?: string;
}

interface HotelDetailPopupProps {
  hotel: HotelInfo | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function HotelDetailPopup({ hotel, isOpen, onClose }: HotelDetailPopupProps): React.ReactElement | null {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'intro' | 'facilities' | 'guide' | 'notice'>('intro');
  const [isLiked, setIsLiked] = useState(false);

  const tabs = [
    { key: 'intro', label: '숙소 소개' },
    { key: 'facilities', label: '시설/서비스' },
    { key: 'guide', label: '이용 안내' },
    { key: 'notice', label: '예약 공지' },
  ] as const;

  const nextImage = () => {
    if (!hotel) return;
    setCurrentImageIndex((prev) => (prev + 1) % hotel.images.length);
  };

  const prevImage = () => {
    if (!hotel) return;
    setCurrentImageIndex((prev) => (prev - 1 + hotel.images.length) % hotel.images.length);
  };

  // Reset state when hotel changes
  React.useEffect(() => {
    if (hotel) {
      setCurrentImageIndex(0);
      setActiveTab('intro');
    }
  }, [hotel?.id]);

  if (!hotel) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Popup - 반응형 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-[100px] pb-[50px] px-4"
          >
            <div className="w-full max-w-[600px] max-h-full bg-white rounded-2xl flex flex-col overflow-hidden shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">숙소 상세</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-all"
                >
                  <Heart className={`${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} size={20} />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-all">
                  <Share2 className="text-gray-500" size={20} />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-all"
                >
                  <X className="text-gray-500" size={20} />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Image Slider */}
              <div className="relative w-full aspect-[16/10] bg-gray-100">
                {hotel.images.length > 0 ? (
                  <>
                    <img
                      src={hotel.images[currentImageIndex]}
                      alt={`${hotel.name} ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {/* Navigation Arrows */}
                    {hotel.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center transition-all"
                        >
                          <ChevronLeft className="text-white" size={20} />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center transition-all"
                        >
                          <ChevronRight className="text-white" size={20} />
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/60 rounded-full text-white text-sm">
                      {String(currentImageIndex + 1).padStart(2, '0')} / {hotel.images.length}
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    이미지 없음
                  </div>
                )}
              </div>

              {/* Hotel Info */}
              <div className="px-4 py-4 border-b border-gray-100">
                <h1 className="text-xl font-bold text-gray-900 mb-2">{hotel.name}</h1>
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <MapPin size={14} />
                  <span>{hotel.location}</span>
                  <ChevronRight size={14} />
                </div>
                <p className="text-orange-500 text-sm mt-1">교정시설로부터 {hotel.distance}</p>
              </div>

              {/* Tabs */}
              <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
                <div className="flex">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex-1 py-3 text-sm font-medium transition-all relative ${
                        activeTab === tab.key
                          ? 'text-gray-900'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.label}
                      {activeTab === tab.key && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="px-4 py-5">
                {activeTab === 'intro' && (
                  <div className="space-y-6">
                    {/* 숙소 소개 */}
                    <section>
                      <h2 className="text-base font-bold text-gray-900 mb-3">숙소 소개</h2>

                      {/* Tags */}
                      {hotel.tags.length > 0 && (
                        <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 rounded-xl mb-3">
                          <span className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center text-white text-xs">i</span>
                          <span className="text-sm text-gray-700">
                            {hotel.tags.map(tag => `#${tag}`).join(' ')}
                          </span>
                        </div>
                      )}

                      {/* Description */}
                      <p className="text-gray-700 text-sm leading-relaxed">{hotel.description}</p>
                    </section>

                    {/* 시설/서비스 */}
                    <section>
                      <h2 className="text-base font-bold text-gray-900 mb-3">시설/서비스</h2>
                      <div className="grid grid-cols-2 gap-2">
                        {hotel.facilities.map((facility, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Check size={16} className="text-gray-400" />
                            <span className="text-sm text-gray-700">{facility}</span>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* 서비스 언어 */}
                    <section>
                      <h2 className="text-base font-bold text-gray-900 mb-2">서비스 언어</h2>
                      <p className="text-sm text-gray-700">{hotel.serviceLanguage}</p>
                    </section>

                    {/* 편의시설 소개 */}
                    {hotel.facilityInfo.length > 0 && (
                      <section>
                        <h2 className="text-base font-bold text-gray-900 mb-2">편의시설 소개</h2>
                        {hotel.facilityInfo.map((info, index) => (
                          <p key={index} className="text-sm text-gray-700">{info}</p>
                        ))}
                      </section>
                    )}

                    {/* 총 객실 수 */}
                    <section>
                      <h2 className="text-base font-bold text-gray-900 mb-2">총 객실 수</h2>
                      <p className="text-sm text-gray-700">{hotel.totalRooms}개</p>
                    </section>
                  </div>
                )}

                {activeTab === 'facilities' && (
                  <div className="space-y-4">
                    <h2 className="text-base font-bold text-gray-900">시설/서비스</h2>
                    <div className="space-y-3">
                      {hotel.facilities.map((facility, index) => (
                        <div key={index} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                          <Check size={16} className="text-orange-500" />
                          <span className="text-sm text-gray-700">{facility}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'guide' && (
                  <div className="space-y-4">
                    <h2 className="text-base font-bold text-gray-900">이용 안내</h2>
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <h3 className="font-semibold text-gray-800 text-sm mb-1">체크인/체크아웃</h3>
                        <p className="text-sm text-gray-600">체크인: 15:00 / 체크아웃: 11:00</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <h3 className="font-semibold text-gray-800 text-sm mb-1">취소/환불 규정</h3>
                        <p className="text-sm text-gray-600">예약 취소 시 숙소의 취소/환불 규정이 적용됩니다.</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <h3 className="font-semibold text-gray-800 text-sm mb-1">주의사항</h3>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• 반려동물 동반 불가</li>
                          <li>• 객실 내 흡연 불가</li>
                          <li>• 미성년자 단독 투숙 불가</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notice' && (
                  <div className="space-y-4">
                    <h2 className="text-base font-bold text-gray-900">예약 공지</h2>
                    <div className="p-3 bg-orange-50 rounded-xl">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        본 숙소는 교정시설 면회객을 위한 추천 숙소입니다.<br />
                        예약 시 면회 일정을 말씀해 주시면 체크인/체크아웃 시간 조정이 가능할 수 있습니다.<br />
                        자세한 사항은 숙소로 직접 문의해 주세요.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer - 예약 문의 */}
            <div className="border-t border-gray-200 px-4 py-3 bg-white">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-gray-500">예약문의</p>
                  <p className="text-base font-bold text-gray-900">{hotel.phone}</p>
                </div>
                <a
                  href={`tel:${hotel.phone.replace(/-/g, '')}`}
                  className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-full font-semibold text-sm hover:bg-orange-600 transition-all"
                >
                  <Phone size={16} />
                  전화하기
                </a>
              </div>
            </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
