import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { TimeCapsuleContent } from "@/components/mail/TimeCapsuleContent";
import { AppLayout } from "@/components/layout/AppLayout";

export default function TimeCapsuleMain() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <Helmet>
        <title>타임캡슐 - Orange Mail</title>
        <meta
          name="description"
          content="여러 사람의 마음을 모아 특별한 날에 전하는 타임캡슐을 만들고 관리하세요."
        />
        <link rel="canonical" href={`${window.location.origin}/time-capsule`} />
      </Helmet>

      <div className="h-full overflow-auto">
        <TimeCapsuleContent onClose={() => navigate("/")} />
      </div>
    </AppLayout>
  );
}
