import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, MapPin, Shield, Clock, Mail, Star, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface MailboxPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  isPopular?: boolean;
}

const mailboxPlans: MailboxPlan[] = [
  {
    id: "basic",
    name: "베이직",
    price: 5000,
    period: "1개월",
    features: [
      "개인 사서함 주소 제공",
      "월 10통 수신 가능",
      "7일간 보관",
      "SMS 알림",
    ],
  },
  {
    id: "standard",
    name: "스탠다드",
    price: 12000,
    period: "3개월",
    isPopular: true,
    features: [
      "개인 사서함 주소 제공",
      "무제한 수신",
      "30일간 보관",
      "SMS + 카카오톡 알림",
      "편지 스캔 서비스",
    ],
  },
  {
    id: "premium",
    name: "프리미엄",
    price: 30000,
    period: "6개월",
    features: [
      "개인 사서함 주소 제공",
      "무제한 수신",
      "90일간 보관",
      "SMS + 카카오톡 알림",
      "편지 스캔 서비스",
      "우선 배송 처리",
      "전용 고객 지원",
    ],
  },
];

const benefits = [
  {
    icon: MapPin,
    title: "전용 주소 제공",
    description: "가족에게 알려줄 수 있는 고정된 수신 주소를 제공합니다.",
  },
  {
    icon: Shield,
    title: "안전한 보관",
    description: "도착한 편지를 안전하게 보관하고 알림을 보내드립니다.",
  },
  {
    icon: Clock,
    title: "빠른 전달",
    description: "수신된 편지를 빠르게 스캔하여 앱으로 전달합니다.",
  },
  {
    icon: Mail,
    title: "편지 관리",
    description: "받은 편지를 한 곳에서 편리하게 관리할 수 있습니다.",
  },
];

export function MailboxServiceContent() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>("standard");

  const handleSubscribe = (planId: string) => {
    const plan = mailboxPlans.find(p => p.id === planId);
    if (plan) {
      toast.success(`${plan.name} 플랜 구독 신청이 완료되었습니다.`);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-amber-50/30 to-orange-50/30">
      {/* Header */}
      <div className="px-8 py-6 border-b border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">사서함서비스</h1>
            <p className="text-sm text-muted-foreground">전용 사서함 주소로 편지를 받아보세요</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            사서함서비스 혜택
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-border/60 hover:border-primary/30 transition-colors">
                  <CardContent className="p-5">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center mb-3">
                      <benefit.icon className="w-5 h-5 text-amber-600" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Current Mailbox Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <Card className="border-primary/30 bg-gradient-to-r from-amber-50 to-orange-50">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-primary text-primary-foreground">현재 사용중</Badge>
                    <Badge variant="outline">스탠다드 플랜</Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">나의 사서함 주소</h3>
                  <p className="text-2xl font-bold text-primary mb-2">서울시 강남구 테헤란로 123, 오렌지레터 사서함 #2847</p>
                  <p className="text-sm text-muted-foreground">이 주소로 가족에게 편지를 보내달라고 안내해주세요.</p>
                </div>
                <Button 
                  variant="outline" 
                  className="shrink-0"
                  onClick={() => {
                    navigator.clipboard.writeText("서울시 강남구 테헤란로 123, 오렌지레터 사서함 #2847");
                    toast.success("주소가 복사되었습니다.");
                  }}
                >
                  주소 복사
                </Button>
              </div>
              <div className="mt-4 pt-4 border-t border-border/40 flex items-center gap-6 text-sm">
                <div>
                  <span className="text-muted-foreground">남은 기간: </span>
                  <span className="font-semibold text-foreground">45일</span>
                </div>
                <div>
                  <span className="text-muted-foreground">이번 달 수신: </span>
                  <span className="font-semibold text-foreground">3통</span>
                </div>
                <div>
                  <span className="text-muted-foreground">보관중인 편지: </span>
                  <span className="font-semibold text-foreground">2통</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pricing Plans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" />
            요금제 안내
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mailboxPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Card 
                  className={`relative h-full cursor-pointer transition-all ${
                    selectedPlan === plan.id 
                      ? "border-primary ring-2 ring-primary/20" 
                      : "border-border/60 hover:border-primary/30"
                  } ${plan.isPopular ? "shadow-lg" : ""}`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0">
                        인기
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <CardDescription>{plan.period} 이용권</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <span className="text-3xl font-bold text-foreground">
                        {plan.price.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground">원</span>
                    </div>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                          <span className="text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${
                        plan.isPopular 
                          ? "bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600" 
                          : ""
                      }`}
                      variant={plan.isPopular ? "default" : "outline"}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSubscribe(plan.id);
                      }}
                    >
                      {plan.isPopular ? "지금 구독하기" : "선택하기"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-10"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">자주 묻는 질문</h2>
          <div className="space-y-3">
            {[
              { q: "사서함 주소는 언제 받을 수 있나요?", a: "결제 완료 후 즉시 사서함 주소가 발급됩니다." },
              { q: "편지가 도착하면 어떻게 알 수 있나요?", a: "SMS 또는 카카오톡으로 알림을 보내드립니다." },
              { q: "보관 기간이 지나면 어떻게 되나요?", a: "보관 기간 만료 전 알림을 보내드리며, 연장하지 않으면 자동 폐기됩니다." },
            ].map((faq) => (
              <Card key={faq.q} className="border-border/60">
                <CardContent className="p-4">
                  <h4 className="font-medium text-foreground mb-1">{faq.q}</h4>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}