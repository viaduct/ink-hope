import { useState } from "react";
import { HelpCircle, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFamilyMembers } from "@/hooks/useFamilyMembers";
import { cn } from "@/lib/utils";

interface AddRecipientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const relations = ["아들", "딸", "남편", "아내", "아버지", "어머니", "형제", "자매", "친구", "기타"];

const facilityTypes = ["교도소", "구치소", "교정시설"];

const regions = ["서울", "경기", "인천", "대전", "대구", "부산", "광주", "울산", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];

const colorOptions = [
  { id: "orange", bg: "bg-orange-100", border: "border-orange-400" },
  { id: "blue", bg: "bg-blue-100", border: "border-blue-400" },
  { id: "cyan", bg: "bg-cyan-100", border: "border-cyan-400" },
  { id: "green", bg: "bg-green-100", border: "border-green-400" },
  { id: "yellow", bg: "bg-yellow-100", border: "border-yellow-400" },
  { id: "pink", bg: "bg-pink-100", border: "border-pink-400" },
  { id: "rose", bg: "bg-rose-100", border: "border-rose-400" },
  { id: "amber", bg: "bg-amber-100", border: "border-amber-400" },
  { id: "violet", bg: "bg-violet-100", border: "border-violet-400" },
];

export function AddRecipientModal({ open, onOpenChange, onSuccess }: AddRecipientModalProps) {
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [facilityType, setFacilityType] = useState("");
  const [region, setRegion] = useState("");
  const [prisonerNumber, setPrisonerNumber] = useState("");
  const [selectedColor, setSelectedColor] = useState("yellow");

  const { createFamilyMember, isCreating } = useFamilyMembers();

  const handleSubmit = () => {
    if (!name.trim() || !relation || !facilityType || !region) return;
    
    const facility = `${region}${facilityType}`;
    const colorClass = colorOptions.find(c => c.id === selectedColor);
    
    createFamilyMember(
      {
        name: name.trim(),
        relation,
        facility,
        prisoner_number: prisonerNumber.trim() || null,
        color: colorClass ? `${colorClass.bg} text-${selectedColor}-600` : "bg-orange-100 text-orange-600",
      },
      {
        onSuccess: () => {
          // Reset form
          setName("");
          setRelation("");
          setFacilityType("");
          setRegion("");
          setPrisonerNumber("");
          setSelectedColor("yellow");
          onOpenChange(false);
          onSuccess?.();
        },
      }
    );
  };

  const isValid = name.trim() && relation && facilityType && region;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-6">
        <div className="space-y-4">
          {/* 이름 입력 + 아이콘 */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-6 h-6 text-orange-500" />
            </div>
            <Input
              placeholder="수용자 이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 h-12 text-base border-gray-200"
            />
          </div>

          {/* 관계 선택 */}
          <Select value={relation} onValueChange={setRelation}>
            <SelectTrigger className="h-12 text-base border-gray-200">
              <SelectValue placeholder="관계 선택" />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              {relations.map((rel) => (
                <SelectItem key={rel} value={rel}>
                  {rel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* 시설 유형 + 지역 선택 (나란히) */}
          <div className="flex gap-3">
            <Select value={facilityType} onValueChange={setFacilityType}>
              <SelectTrigger className={cn(
                "flex-1 h-12 text-base",
                facilityType ? "border-gray-200" : "border-orange-400 border-2"
              )}>
                <SelectValue placeholder="시설 유형" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                {facilityTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="flex-1 h-12 text-base border-gray-200">
                <SelectValue placeholder="지역 선택" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                {regions.map((reg) => (
                  <SelectItem key={reg} value={reg}>
                    {reg}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 수용자 번호 */}
          <Input
            placeholder="수용자 번호 (예: 2024-12345)"
            value={prisonerNumber}
            onChange={(e) => setPrisonerNumber(e.target.value)}
            className="h-12 text-base border-gray-200"
          />

          {/* 색상 선택 */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">색상:</span>
            <div className="flex gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setSelectedColor(color.id)}
                  className={cn(
                    "w-8 h-8 rounded-full transition-all",
                    color.bg,
                    selectedColor === color.id 
                      ? `ring-2 ring-offset-2 ${color.border}` 
                      : "hover:scale-110"
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isCreating}
            className="px-6"
          >
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || isCreating}
            className="px-6 bg-orange-500 hover:bg-orange-600"
          >
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                추가 중...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                확인
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}