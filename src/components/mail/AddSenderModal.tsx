import { useState } from "react";
import { Send, User, Phone, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AddSenderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (sender: {
    name: string;
    phone: string;
    address: string;
  }) => void;
}

export function AddSenderModal({ open, onOpenChange, onAdd }: AddSenderModalProps) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"남" | "여" | "">("");
  const [phone, setPhone] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim() || !address.trim()) return;

    const fullAddress = addressDetail.trim()
      ? `${address.trim()} ${addressDetail.trim()}`
      : address.trim();

    onAdd({
      name: name.trim(),
      phone: phone.trim(),
      address: fullAddress,
    });

    // Reset form
    setName("");
    setGender("");
    setPhone("");
    setZipCode("");
    setAddress("");
    setAddressDetail("");
    onOpenChange(false);
  };

  const handleAddressSearch = () => {
    // 주소 검색 API 연동 (예: 다음 우편번호 서비스)
    // 임시로 alert 표시
    alert("주소 검색 기능은 추후 구현 예정입니다.");
  };

  const isValid = name.trim() && phone.trim() && address.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 gap-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b border-gray-100">
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <Send className="w-5 h-5 text-orange-500" />
            </div>
            <span className="text-lg font-semibold">보내는 사람 추가</span>
          </DialogTitle>
        </DialogHeader>

        {/* Form */}
        <div className="p-6 space-y-5">
          {/* 이름 */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-medium text-foreground">이름</span>
              <span className="text-orange-500">*</span>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="보내는 분 이름을 입력하세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 h-12 text-base border-gray-200"
              />
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setGender("남")}
                  className={`w-12 h-12 rounded-lg border text-sm font-medium transition-colors ${
                    gender === "남"
                      ? "border-orange-500 bg-orange-50 text-orange-600"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  남
                </button>
                <button
                  type="button"
                  onClick={() => setGender("여")}
                  className={`w-12 h-12 rounded-lg border text-sm font-medium transition-colors ${
                    gender === "여"
                      ? "border-orange-500 bg-orange-50 text-orange-600"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  여
                </button>
              </div>
            </div>
          </div>

          {/* 연락처 */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-medium text-foreground">연락처</span>
              <span className="text-orange-500">*</span>
            </div>
            <Input
              placeholder="연락처를 입력하세요"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-12 text-base border-gray-200"
            />
          </div>

          {/* 주소 */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-medium text-foreground">주소</span>
              <span className="text-orange-500">*</span>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="우편번호"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="flex-1 h-12 text-base border-gray-200"
                readOnly
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddressSearch}
                className="h-12 px-4 border-gray-200 hover:bg-gray-50"
              >
                <Search className="w-4 h-4 mr-1.5" />
                주소검색
              </Button>
            </div>
            <Input
              placeholder="주소를 입력하세요"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="h-12 text-base border-gray-200"
            />
            <Input
              placeholder="상세주소를 입력하세요 (선택)"
              value={addressDetail}
              onChange={(e) => setAddressDetail(e.target.value)}
              className="h-12 text-base border-gray-200"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 p-6 pt-2">
          <Button
            variant="outline"
            className="flex-1 h-12 text-base border-gray-200"
            onClick={() => onOpenChange(false)}
          >
            취소
          </Button>
          <Button
            className="flex-1 h-12 text-base bg-orange-400 hover:bg-orange-500 text-white"
            onClick={handleSubmit}
            disabled={!isValid}
          >
            추가하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
