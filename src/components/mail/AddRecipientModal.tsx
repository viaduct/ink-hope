import { useState, useMemo } from "react";
import { Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { facilities, regions, type Region } from "@/data/facilities";

interface AddRecipientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const relations = ["아들", "딸", "남편", "아내", "아버지", "어머니", "형제", "자매", "친구", "기타"];

const facilityTypes = ["교도소", "구치소"];

export function AddRecipientModal({ open, onOpenChange, onSuccess }: AddRecipientModalProps) {
  const [name, setName] = useState("");
  const [prisonerNumber, setPrisonerNumber] = useState("");
  const [relation, setRelation] = useState("");
  const [facilityType, setFacilityType] = useState("");
  const [region, setRegion] = useState<Region | "">("");
  const [selectedFacility, setSelectedFacility] = useState("");

  const { createFamilyMember, isCreating } = useFamilyMembers();

  // 선택된 지역과 시설 유형에 맞는 시설 목록
  const availableFacilities = useMemo(() => {
    if (!region || !facilityType) return [];

    const regionFacilities = facilities[region as Region];
    if (!regionFacilities) return [];

    // 시설 유형에 따라 필터링
    if (facilityType === "교도소") {
      return regionFacilities.교도소 || [];
    } else if (facilityType === "구치소") {
      return regionFacilities.구치소 || [];
    }
    return [];
  }, [region, facilityType]);

  // 지역이나 시설 유형이 바뀌면 선택된 시설 초기화
  const handleRegionChange = (value: string) => {
    setRegion(value as Region);
    setSelectedFacility("");
  };

  const handleFacilityTypeChange = (value: string) => {
    setFacilityType(value);
    setSelectedFacility("");
  };

  const handleSubmit = () => {
    if (!name.trim() || !relation || !facilityType || !region) return;

    const facility = selectedFacility || `${region}${facilityType}`;

    createFamilyMember({
      name: name.trim(),
      relation,
      facility,
      prisoner_number: prisonerNumber.trim() || null,
      color: "bg-orange-100 text-orange-600",
    });

    // Reset form
    setName("");
    setPrisonerNumber("");
    setRelation("");
    setFacilityType("");
    setRegion("");
    setSelectedFacility("");
    onOpenChange(false);
    onSuccess?.();
  };

  const isValid = name.trim() && relation && facilityType && region;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-6">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg font-semibold">수신자 등록</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 수용자이름 */}
          <Input
            placeholder="수용자이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 text-base border-gray-200"
          />

          {/* 수용자번호 */}
          <Input
            placeholder="수용자번호 (예: 2024-12345)"
            value={prisonerNumber}
            onChange={(e) => setPrisonerNumber(e.target.value)}
            className="h-12 text-base border-gray-200"
          />

          {/* 관계선택 */}
          <Select value={relation} onValueChange={setRelation}>
            <SelectTrigger className="h-12 text-base border-gray-200">
              <SelectValue placeholder="관계선택" />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              {relations.map((rel) => (
                <SelectItem key={rel} value={rel}>
                  {rel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* 받는 곳 + 지역선택 (나란히) */}
          <div className="flex gap-3">
            <Select value={facilityType} onValueChange={handleFacilityTypeChange}>
              <SelectTrigger className="flex-1 h-12 text-base border-gray-200">
                <SelectValue placeholder="받는 곳" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                {facilityTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={region} onValueChange={handleRegionChange}>
              <SelectTrigger className="flex-1 h-12 text-base border-gray-200">
                <SelectValue placeholder="지역선택" />
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

          {/* 시설선택 - 지역과 받는 곳 선택 후 표시 */}
          {region && facilityType && availableFacilities.length > 0 && (
            <Select value={selectedFacility} onValueChange={setSelectedFacility}>
              <SelectTrigger className="h-12 text-base border-gray-200">
                <SelectValue placeholder="시설선택" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                {availableFacilities.map((fac) => (
                  <SelectItem key={fac.name} value={fac.name}>
                    {fac.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isCreating}
            className="px-6 border-gray-300"
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
                등록 중...
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
