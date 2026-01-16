import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AppLayout } from "@/components/layout/AppLayout";
import { useState, useEffect } from "react";

// 목업 데이터
const mockTreeData: Record<string, {
  recipientName: string;
  location: string;
  weatherHigh: number;
  weatherLow: number;
  events: Array<{
    id: number;
    dDay: string;
    label: string;
    isHighlight?: boolean;
  }>;
}> = {
  "1": {
    recipientName: "서은우",
    location: "서은우님이 있는 곳은 따뜻해요",
    weatherHigh: 23,
    weatherLow: 10,
    events: [
      { id: 1, dDay: "D+7", label: "일반접견", isHighlight: true },
      { id: 2, dDay: "D+140", label: "출소일" },
      { id: 3, dDay: "D+12", label: "재판일" },
    ],
  },
};

export default function MyOrangeTree() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [countdown, setCountdown] = useState("01:38:13");

  const treeData = mockTreeData[id || "1"];

  // 카운트다운 타이머 (목업)
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        const [h, m, s] = prev.split(':').map(Number);
        let totalSec = h * 3600 + m * 60 + s - 1;
        if (totalSec < 0) totalSec = 0;
        const newH = Math.floor(totalSec / 3600);
        const newM = Math.floor((totalSec % 3600) / 60);
        const newS = totalSec % 60;
        return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}:${String(newS).padStart(2, '0')}`;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!treeData) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">오렌지 나무를 찾을 수 없습니다</p>
            <button
              onClick={() => navigate("/")}
              className="text-[#ff7430] hover:underline"
            >
              돌아가기
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Helmet>
        <title>나의 {treeData.recipientName} 오렌지 나무 - Orange Mail</title>
      </Helmet>

      {/* 제주명조 폰트 로드 */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nanum+Myeongjo&display=swap');
        .font-jeju {
          font-family: 'Nanum Myeongjo', serif;
        }
      `}</style>

      <div className="h-full flex flex-col bg-[#FFFDF6]">
        {/* Header with weather */}
        <header className="h-14 border-b border-border/40 bg-white/80 backdrop-blur-sm flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <span className="text-[#ff7430] text-lg font-bold">오렌지나무</span>
            <span className="text-sm text-gray-600">{treeData.location} 🌤️</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-[#ff7430] font-medium">오늘의 날씨</span>
            <span className="text-red-500 font-bold">{treeData.weatherHigh}°(최고)</span>
            <span className="text-blue-500 font-bold">{treeData.weatherLow}°(최저)</span>
            <span className="text-gray-400">☁️</span>
          </div>
        </header>

        {/* 메인 컨텐츠 */}
        <div className="flex-1 overflow-auto relative">
          {/* 구름 배경 */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <img src="/cloud1.svg" alt="" className="absolute left-[44px] top-[34px] w-[159px] h-[96px]" />
            <img src="/cloud2.svg" alt="" className="absolute right-[100px] top-[287px] w-[125px] h-[82px]" />
            <img src="/cloud3.svg" alt="" className="absolute left-[190px] top-[264px] w-[98px] h-[61px]" />
            <img src="/cloud4.svg" alt="" className="absolute right-[250px] top-[170px] w-[70px] h-[43px]" />
            <img src="/cloud5.svg" alt="" className="absolute right-[50px] top-[294px] w-[310px] h-[159px]" />
            <img src="/cloud6.svg" alt="" className="absolute right-[150px] top-[39px] w-[78px] h-[50px]" />
            <img src="/cloud7.svg" alt="" className="absolute left-[391px] top-[324px] w-[194px] h-[100px]" />
          </div>

          {/* 바람 라인 */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <img src="/wind_line.svg" alt="" className="absolute left-[200px] top-[350px] w-[155px] h-[72px]" />
            <img src="/wind_line.svg" alt="" className="absolute left-[250px] top-[355px] w-[155px] h-[72px]" />
            <img src="/wind_line.svg" alt="" className="absolute right-[200px] top-[350px] w-[155px] h-[72px] scale-x-[-1]" />
            <img src="/wind_line.svg" alt="" className="absolute right-[250px] top-[355px] w-[155px] h-[72px] scale-x-[-1]" />
          </div>

          {/* 타이틀 영역 */}
          <div className="relative z-10 px-6 pt-12 pb-8">
            {/* 타이틀 */}
            <div className="flex justify-center items-center gap-[6px] mb-6">
              <span className="font-jeju text-[24px] text-[#4A2E1B] tracking-[-0.48px]">나의</span>
              <span className="inline-flex items-center justify-center px-[14px] py-1 border-2 border-[#b07946] bg-white rounded-[2px] min-w-[111px] h-[42px]">
                <span className="font-jeju text-[22px] text-[#4A2E1B] tracking-[-0.44px]">{treeData.recipientName}</span>
              </span>
              <span className="font-jeju text-[24px] text-[#4A2E1B] tracking-[-0.48px]">오렌지 나무</span>
            </div>

            {/* 설명 텍스트 */}
            <div className="text-center space-y-2">
              <p className="font-jeju text-[16px] text-[#4A2E1B] leading-[1.8] tracking-[-0.32px]">
                "이 나무는 한 사람을 기다리는 마음에서 시작되었습니다."
              </p>
              <p className="font-jeju text-[16px] text-[#4A2E1B] leading-[1.8] tracking-[-0.32px]">
                꽃에 물을 주듯 마음을 전하면,
                <br />
                그 온기는 누군가의 하루를 지탱하는 힘이 됩니다.
              </p>
              <p className="font-jeju text-[16px] text-[#4A2E1B] leading-[1.8] tracking-[-0.32px]">
                오렌지 나무는 주고받은 마음이 이어져 온
                <br />
                시간과 흔적을 조용히 남깁니다.
              </p>
            </div>
          </div>

          {/* 새싹 영역 */}
          <div className="relative z-10 flex justify-center mt-16 mb-8">
            <div className="relative w-[183px] h-[225px]">
              {/* 새싹 이미지들 */}
              <img src="/leaf1.svg" alt="" className="absolute left-1/2 -translate-x-1/2 top-[35px] w-[27px] h-[44px]" style={{ transform: 'translateX(-50%) scaleY(-1)' }} />
              <img src="/leaf2.svg" alt="" className="absolute left-1/2 -translate-x-1/2 top-[42px] w-[27px] h-[44px]" style={{ transform: 'translateX(-50%) scaleY(-1)' }} />
              <img src="/stem.svg" alt="" className="absolute left-1/2 -translate-x-1/2 top-[115px] w-[21px] h-[82px]" style={{ transform: 'translateX(-50%) scaleY(-1)' }} />
              <img src="/leaf3.png" alt="" className="absolute left-[20px] top-[54px] w-[74px] h-[73px]" style={{ transform: 'scaleY(-1)' }} />
              <img src="/stem2.svg" alt="" className="absolute left-1/2 -translate-x-1/2 top-[46px] w-[5px] h-[81px]" style={{ transform: 'translateX(-50%) scaleY(-1)' }} />
              <img src="/leaf4.png" alt="" className="absolute right-[20px] top-[48px] w-[77px] h-[80px]" style={{ transform: 'scaleY(-1)' }} />
              {/* 흙 */}
              <img src="/sprout_soil.svg" alt="" className="absolute left-[23px] top-[175px] w-[138px] h-[50px]" />
            </div>

            {/* 팻말 */}
            <div className="absolute right-[calc(50%-200px)] top-[100px]">
              <div className="relative">
                <div className="bg-[#da9658] rounded-[3px] w-[121px] h-[55px] overflow-hidden">
                  <div className="absolute inset-[9%_5%] bg-white rounded-[3px] flex items-center justify-center">
                    <span className="text-[#997257] text-[24px] font-semibold tracking-[-0.48px]">{treeData.recipientName}</span>
                  </div>
                </div>
                {/* 팻말 기둥 */}
                <div className="absolute left-1/2 -translate-x-1/2 top-[52px] w-[17px] h-[37px] bg-gradient-to-b from-[#d69657] to-[#fff3e6]" />
                {/* 팻말 흙 */}
                <img src="/soil_sign.svg" alt="" className="absolute left-[13px] top-[77px] w-[93px] h-[20px]" />
              </div>
            </div>
          </div>

          {/* 하단 피치색 영역 - 1404x385 */}
          <div className="relative w-full max-w-[1404px] h-[385px] mx-auto overflow-hidden">
            {/* 타원형 배경 */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-[40px] w-[2420px] h-[669px]">
              <img src="/bottom_fill.svg" alt="" className="w-full h-full object-cover" />
            </div>

            {/* 바닥 흙 장식 */}
            <div className="absolute left-[418px] top-[17px]">
              <img src="/soil1.svg" alt="" className="w-[84px] h-[31px]" />
            </div>
            <div className="absolute left-[571px] top-[7px]">
              <img src="/soil2.svg" alt="" className="w-[54px] h-[20px]" />
            </div>

            {/* 하단 컨텐츠 */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full pt-16">
              {/* 안내 메시지 */}
              <div className="text-center mb-10">
                <p className="text-[15px] text-black leading-[1.87]">
                  일반접견일이 7일밖에 남지 않았어요. OOO교도소 장소를 가기위해서
                </p>
                <p className="text-[15px] text-black leading-[1.87]">
                  해당 부분을 미리 읽어보면 좋아요~^^
                </p>
              </div>

              {/* D-day 태그들 */}
              <div className="flex justify-center gap-4 flex-wrap">
                {treeData.events.map((event) => (
                  <div
                    key={event.id}
                    className={`bg-white rounded-[46px] px-[22px] py-3 flex items-center gap-2 ${
                      event.isHighlight
                        ? 'border-2 border-[#ff8000] shadow-[inset_0px_0px_8px_0px_#ff8000]'
                        : ''
                    }`}
                  >
                    <span className="text-[#FF8000] font-bold text-[15px] tracking-[-0.3px]">{event.dDay}</span>
                    <span className="text-[#6C6C6C] font-medium text-[15px] tracking-[-0.3px]">{event.label}</span>
                  </div>
                ))}
                {/* 일정 등록 버튼 */}
                <button className="bg-white rounded-[46px] px-[22px] py-3 flex items-center">
                  <span className="text-[#6C6C6C] font-medium text-[15px] tracking-[-0.3px]">+ 일정 등록</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <footer className="h-10 bg-[#111827] flex items-center justify-center">
          <p className="text-[12px] text-[#d9d9d9]">
            편지 마감까지 <span className="text-[#ff7430] text-[14px] font-semibold">{countdown}</span>  | <span className="text-[#939393]">오늘 17시 우체국 접수</span>
          </p>
        </footer>
      </div>
    </AppLayout>
  );
}
