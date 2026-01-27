import { motion } from "framer-motion";

interface OrangeTreeContentProps {
  onClose: () => void;
  onCompose?: () => void;
}

export function OrangeTreeContent({ onClose }: OrangeTreeContentProps) {
  // 애니메이션 설정
  const animationDelay = 1;
  const animationDuration = 1.5;

  // viewBox: 0 0 208 302 고정, 뒷면 사각형은 (0,33)~(181,302) 고정
  // 앞면 닫힌 상태: 뒷면과 동일하게 덮음
  const closedPath = "M181 302 L0 302 L0 33 L181 33 Z";
  // 앞면 열린 상태: 좌측은 뒷면 좌측에 맞닿고, 우측은 원근감으로 좁아짐
  const openPath = "M151 269 L0 301 L0 34 L151 0 Z";

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#fffdf6]">
      {/* Header - 다른 화면과 동일한 스타일 */}
      <header className="h-14 border-b border-border/40 bg-white flex items-center justify-between px-4">
        <h1 className="text-lg font-bold text-foreground">오렌지 나무</h1>
        <button
          onClick={onClose}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          편지함
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto flex flex-col items-center px-4 py-[90px]">
        {/* 타이틀 영역 */}
        <div className="flex flex-col gap-6 items-center max-w-[715px] text-center mb-12">
          <h2
            className="text-[22px] text-[#4a2e1b] tracking-[-0.44px] leading-[1.4]"
            style={{ fontFamily: "'Noto Serif KR', serif" }}
          >
            오렌지 나무, 시작
          </h2>
          <div
            className="flex flex-col gap-[15px] text-[18px] text-[#4a2e1b] tracking-[-0.36px] leading-[1.8]"
            style={{ fontFamily: "'Noto Serif KR', serif" }}
          >
            <p>
              오렌지나무는 한 사람을 기다리는 시간을<br />
              '기록'으로 남깁니다.
            </p>
            <p>
              편지를 쓰는 순간마다 잎이 하나씩 쌓이고,<br />
              시간이 지나며 나무는 조금씩 자라납니다.
            </p>
          </div>
        </div>

        {/* 오렌지나무 이미지 - 책 열림 애니메이션 */}
        <div className="relative w-[208px] h-[302px] mb-auto">
          <svg
            viewBox="0 0 208 302"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            style={{ overflow: "visible" }}
          >
            <defs>
              {/* 나뭇잎 그라데이션 */}
              <radialGradient id="leaf1Gradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(117.498 245.5) rotate(-50.4836) scale(88.7947 22.2278)">
                <stop offset="0.41" stopColor="#12491D"/>
                <stop offset="0.64" stopColor="#237D26"/>
                <stop offset="0.98" stopColor="#539F00"/>
              </radialGradient>
              <radialGradient id="leaf2Gradient" cx="0" cy="0" r="1" gradientTransform="matrix(16.8096 -37.3977 -37.7427 -17.5954 273.438 -7.89539)" gradientUnits="userSpaceOnUse">
                <stop offset="0.0288462" stopColor="#12491D"/>
                <stop offset="0.413462" stopColor="#237D26"/>
                <stop offset="0.870192" stopColor="#539F00"/>
              </radialGradient>
              <radialGradient id="leaf3Gradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(153.998 234.5) rotate(39.44) scale(40.1404 15.1055)">
                <stop offset="0.41" stopColor="#12491D"/>
                <stop offset="0.64" stopColor="#237D26"/>
                <stop offset="0.98" stopColor="#539F00"/>
              </radialGradient>
              {/* 앞면 그라데이션 */}
              <linearGradient id="frontGradient" x1="0" y1="150" x2="181" y2="150" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFFDF6"/>
                <stop offset="1" stopColor="#FAF6E6"/>
              </linearGradient>
            </defs>

            {/* 뒷면 사각형 - 고정 (0,33)~(181,302) */}
            <rect x="0" y="33" width="181" height="269" fill="#D7D3C2"/>

            {/* 나뭇잎 그룹 - x축 이동 애니메이션 */}
            <motion.g
              initial={{ x: -80 }}
              animate={{ x: 0 }}
              transition={{ delay: animationDelay, duration: animationDuration, ease: "easeInOut" }}
            >
              {/* 나뭇잎 1 */}
              <path d="M172.446 212.214C170.773 214.111 166.616 215.868 164.078 216.998C159.308 219.118 153.408 216.021 153.268 215.045C153.129 214.083 150.967 214.041 150.702 213.176C149.739 210.052 152.654 205.407 152.529 200.609C152.403 195.783 156.518 191.892 157.955 190.204C158.485 189.59 161.232 183.914 165.277 182.101C169.475 180.218 171.316 175.266 171.4 174.792C171.526 174.067 176.645 175.587 178.667 182.059C179.253 183.956 181.596 187.191 181.819 189.869C182.168 194.096 182.447 193.747 180.815 199.549C180.006 202.436 179.922 204.012 177.997 206.927C176.937 208.545 174.413 209.954 172.46 212.158L172.446 212.214Z" fill="url(#leaf1Gradient)"/>
              <path d="M169.992 189.73C169.113 192.408 167.146 197.918 163.562 202.911C159.196 208.992 155.974 212.8 152.557 215.673C150.646 217.291 141.566 222.591 139.837 223.442C138.121 224.293 138.289 222.284 139.195 221.768C140.102 221.252 150.005 215.799 151.009 214.822C152.013 213.846 155.458 211.6 159.629 206.119C164.413 199.829 168.123 192.032 168.723 190.149C169.183 188.684 170.508 185.058 171.233 181.557C171.889 178.377 171.986 176.215 171.986 176.215C172.154 176.536 172.447 178.963 171.93 181.878C171.512 184.235 170.884 186.997 169.992 189.73Z" fill="#5CA708"/>

              {/* 나뭇잎 2 */}
              <path d="M188.479 227.739C186.541 228.478 182.936 228.369 180.692 228.329C176.497 228.262 173.617 224.476 173.908 223.804C174.199 223.132 172.703 222.464 172.852 221.811C173.432 219.485 177.336 217.346 179.166 214.188C181.006 211.015 185.452 209.73 187.134 209.054C187.749 208.808 191.953 205.955 195.507 205.989C199.209 206.03 202.483 203.359 202.724 203.084C203.102 202.655 206.074 205.191 204.884 210.009C204.537 211.429 204.871 214.234 203.954 216.042C202.506 218.891 202.844 218.751 199.364 222.042C197.642 223.678 196.945 224.675 194.424 225.991C193.028 226.722 190.706 226.881 188.451 227.73L188.479 227.739Z" fill="url(#leaf2Gradient)"/>
              <path d="M196.028 212.128C194.309 213.607 190.663 216.619 186.082 218.803C180.504 221.461 176.652 222.977 173.057 223.824C171.038 224.305 162.424 225.034 160.854 225.062C159.285 225.089 160.229 223.839 161.08 223.776C161.932 223.712 171.187 223.137 172.296 222.796C173.406 222.454 176.777 222.029 181.97 219.707C187.937 217.036 193.752 213.077 194.938 212.022C195.859 211.194 198.291 209.226 200.226 207.164C201.998 205.287 202.936 203.903 202.936 203.903C202.932 204.16 202.14 205.834 200.58 207.588C199.323 209.002 197.757 210.622 196.002 212.132L196.028 212.128Z" fill="#89C237"/>

              {/* 나뭇잎 3 */}
              <path d="M150.998 224.5C148.879 224.725 160.78 232.713 160.415 231.293C160.262 230.699 170.316 248.151 174.079 255.342C179.516 265.697 179.163 266.413 179.421 266.964C179.489 267.098 184.31 259.892 183.933 256.223C183.484 251.983 186.108 246.354 184.016 241.399C182.32 237.362 178.648 233.651 176.425 229.678C172.14 222.031 161.032 222.827 152.823 223.701L150.998 224.5Z" fill="url(#leaf3Gradient)"/>
              <path d="M168.378 247.907C167.143 245.54 164.835 239.815 160.661 235.594C155.584 230.466 152.473 225.81 148.129 225.011C145.518 224.531 141.26 223.012 139.479 222.406C137.695 221.814 137.892 223.692 138.844 224.072C139.796 224.452 144.945 225.685 146.199 226.242C147.997 227.06 152.607 228.453 156.565 233.659C161.156 239.685 162.063 243.15 165.455 247.685C166.691 249.335 170.799 253.281 172.656 256.199C174.669 259.347 177.892 264.704 177.892 264.704C178.013 264.395 175.046 258.774 174.138 256.137C173.409 254.013 169.634 250.332 168.39 247.923L168.378 247.907Z" fill="#6E9337"/>
              <path d="M156.474 223.162C155.297 222.777 146.889 222.937 146.509 226.123C146.372 227.27 146.248 227.585 147.723 228.005C149.198 228.425 156.135 232.95 160.033 238.872C161.263 240.742 163.518 246.538 168.743 252.676C175.659 260.796 179.116 267.349 179.382 267.41C179.55 267.444 178.056 263.331 177.826 257.172C177.725 254.647 174.673 249.716 174.525 245.649C174.389 241.842 169.39 235.746 166.701 230.786C164.626 226.949 160.504 224.475 156.472 223.176L156.474 223.162Z" fill="#97C653"/>
            </motion.g>

            {/* 앞면 사각형 - path 애니메이션 */}
            <motion.path
              initial={{ d: closedPath }}
              animate={{ d: openPath }}
              transition={{ delay: animationDelay, duration: animationDuration, ease: "easeInOut" }}
              fill="url(#frontGradient)"
            />
          </svg>
        </div>

        {/* 입장하기 버튼 */}
        <button
          className="border border-[#d7d3c2] px-[30px] py-[9px] text-[18px] text-[#875e42] tracking-[-0.36px] leading-[1.8] font-semibold mt-auto mb-10"
          style={{ fontFamily: "'Noto Serif KR', serif" }}
        >
          + 오렌지나무 입장하기
        </button>
      </div>
    </div>
  );
}
