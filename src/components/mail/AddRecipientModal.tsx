import { useState, useMemo } from "react";
import { Loader2, User, Users, Building2, MapPin, Hash } from "lucide-react";
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
      <DialogContent className="sm:max-w-lg p-0 gap-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b border-gray-100">
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <User className="w-5 h-5 text-orange-500" />
            </div>
            <span className="text-lg font-semibold">받는 사람 추가</span>
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
            <Input
              placeholder="받는 분 이름을 입력하세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 text-base border-gray-200"
            />
          </div>

          {/* 관계 */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-medium text-foreground">관계</span>
              <span className="text-orange-500">*</span>
            </div>
            <Select value={relation} onValueChange={setRelation}>
              <SelectTrigger className="h-12 text-base border-gray-200">
                <SelectValue placeholder="관계를 선택하세요" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                {relations.map((rel) => (
                  <SelectItem key={rel} value={rel}>
                    {rel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 시설 정보 */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-medium text-foreground">시설 종류</span>
              <span className="text-orange-500">*</span>
            </div>
            <div className="flex gap-2">
              <Select value={facilityType} onValueChange={handleFacilityTypeChange}>
                <SelectTrigger className="flex-1 h-12 text-base border-gray-200">
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

              <Select value={region} onValueChange={handleRegionChange}>
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
          </div>

          {/* 시설선택 - 지역과 받는 곳 선택 후 표시 */}
          {region && facilityType && availableFacilities.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-medium text-foreground">시설 선택</span>
              </div>
              <Select value={selectedFacility} onValueChange={setSelectedFacility}>
                <SelectTrigger className="h-12 text-base border-gray-200">
                  <SelectValue placeholder="시설을 선택하세요" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  {availableFacilities.map((fac) => (
                    <SelectItem key={fac.name} value={fac.name}>
                      {fac.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* 수용자번호 */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Hash className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-medium text-foreground">수용자번호</span>
            </div>
            <Input
              placeholder="수용자번호를 입력하세요 (예: 2024-12345)"
              value={prisonerNumber}
              onChange={(e) => setPrisonerNumber(e.target.value)}
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
            disabled={isCreating}
          >
            취소
          </Button>
          <Button
            className="flex-1 h-12 text-base bg-orange-400 hover:bg-orange-500 text-white"
            onClick={handleSubmit}
            disabled={!isValid || isCreating}
          >
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                등록 중...
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
