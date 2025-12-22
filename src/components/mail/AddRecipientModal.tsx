import { useState } from "react";
import { User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFamilyMembers } from "@/hooks/useFamilyMembers";

interface AddRecipientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const relations = ["아들", "딸", "남편", "아내", "아버지", "어머니", "형제", "자매", "친구", "기타"];

const facilities = [
  "서울남부교도소",
  "서울동부구치소", 
  "수원구치소",
  "대전교도소",
  "대구교도소",
  "부산교도소",
  "광주교도소",
  "인천구치소",
];

export function AddRecipientModal({ open, onOpenChange, onSuccess }: AddRecipientModalProps) {
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [facility, setFacility] = useState("");
  const [address, setAddress] = useState("");
  const [prisonerNumber, setPrisonerNumber] = useState("");

  const { createFamilyMember, isCreating } = useFamilyMembers();

  const handleSubmit = () => {
    if (!name.trim() || !relation || !facility) return;
    
    createFamilyMember(
      {
        name: name.trim(),
        relation,
        facility,
        facility_address: address.trim(),
        prisoner_number: prisonerNumber.trim(),
      },
      {
        onSuccess: () => {
          // Reset form
          setName("");
          setRelation("");
          setFacility("");
          setAddress("");
          setPrisonerNumber("");
          onOpenChange(false);
          onSuccess?.();
        },
      }
    );
  };

  const isValid = name.trim() && relation && facility;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            새 수신자 추가
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">이름 *</Label>
            <Input
              id="name"
              placeholder="수신자 이름을 입력하세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="relation">관계 *</Label>
            <Select value={relation} onValueChange={setRelation}>
              <SelectTrigger>
                <SelectValue placeholder="관계를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {relations.map((rel) => (
                  <SelectItem key={rel} value={rel}>
                    {rel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="facility">수용 시설 *</Label>
            <Select value={facility} onValueChange={setFacility}>
              <SelectTrigger>
                <SelectValue placeholder="시설을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {facilities.map((fac) => (
                  <SelectItem key={fac} value={fac}>
                    {fac}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">주소</Label>
            <Input
              id="address"
              placeholder="시설 주소 (자동 입력됩니다)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prisonerNumber">수용번호</Label>
            <Input
              id="prisonerNumber"
              placeholder="수용번호를 입력하세요 (선택)"
              value={prisonerNumber}
              onChange={(e) => setPrisonerNumber(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
            disabled={isCreating}
          >
            취소
          </Button>
          <Button
            className="flex-1"
            onClick={handleSubmit}
            disabled={!isValid || isCreating}
          >
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                추가 중...
              </>
            ) : (
              "추가하기"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
