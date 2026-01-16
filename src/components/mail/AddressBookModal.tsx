import { useState, useEffect } from "react";
import { X, Plus, Pencil, Trash2, Check, User, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FamilyMember } from "@/types/mail";
import { 
  facilities, 
  regions, 
  relationTypes, 
  facilityTypeValues,
  type FacilityType,
  type Region,
  type SavedAddress 
} from "@/data/facilities";

interface AddressBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  familyMembers: FamilyMember[];
  onUpdateMembers: (members: FamilyMember[]) => void;
}

type TabType = "recipients" | "senders";

export function AddressBookModal({
  isOpen,
  onClose,
  familyMembers,
  onUpdateMembers,
}: AddressBookModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("recipients");
  const [members, setMembers] = useState<FamilyMember[]>(familyMembers);
  const [senders, setSenders] = useState<SavedAddress[]>(() => {
    const saved = localStorage.getItem("savedSenderAddresses");
    return saved ? JSON.parse(saved) : [
      { id: "1", name: "홍길동", phone: "010-1234-5678", address: "서울시 강남구 테헤란로 123" },
    ];
  });
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<FamilyMember>>({});
  const [senderEditForm, setSenderEditForm] = useState<Partial<SavedAddress>>({});
  
  // 받는사람 추가용 상태
  const [selectedFacilityType, setSelectedFacilityType] = useState<FacilityType | "">("");
  const [selectedRegion, setSelectedRegion] = useState<Region | "">("");

  useEffect(() => {
    setMembers(familyMembers);
  }, [familyMembers]);

  // 필터된 시설 목록
  const filteredFacilities = facilities.filter(f => {
    if (selectedFacilityType && f.type !== selectedFacilityType) return false;
    if (selectedRegion && f.region !== selectedRegion) return false;
    return true;
  });

  // 받는사람 관련 함수들
  const handleEditMember = (member: FamilyMember) => {
    setEditingId(member.id);
    setEditForm(member);
    // 해당 시설 정보로 필터 설정
    const facility = facilities.find(f => f.name === member.facility);
    if (facility) {
      setSelectedFacilityType(facility.type);
      setSelectedRegion(facility.region);
    }
  };

  const handleSaveMemberEdit = () => {
    if (editingId && editForm.name && editForm.relation && editForm.facility) {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === editingId
            ? {
                ...m,
                name: editForm.name!,
                relation: editForm.relation!,
                facility: editForm.facility!,
                facilityAddress: editForm.facilityAddress,
                prisonerNumber: editForm.prisonerNumber,
                avatar: editForm.name!.charAt(0),
                color: editForm.color || m.color,
              }
            : m
        )
      );
      setEditingId(null);
      setEditForm({});
      setSelectedFacilityType("");
      setSelectedRegion("");
    }
  };

  const handleDeleteMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const handleAddNewMember = () => {
    const newMember: FamilyMember = {
      id: `member-${Date.now()}`,
      name: "",
      relation: "",
      facility: "",
      facilityAddress: "",
      prisonerNumber: "",
      avatar: "",
      color: "bg-gray-100 text-gray-600",
    };
    setMembers((prev) => [...prev, newMember]);
    setEditingId(newMember.id);
    setEditForm(newMember);
    setSelectedFacilityType("");
    setSelectedRegion("");
  };

  // 보내는사람 관련 함수들
  const handleEditSender = (sender: SavedAddress) => {
    setEditingId(sender.id);
    setSenderEditForm(sender);
  };

  const handleSaveSenderEdit = () => {
    if (editingId && senderEditForm.name && senderEditForm.phone && senderEditForm.address) {
      setSenders((prev) =>
        prev.map((s) =>
          s.id === editingId
            ? {
                ...s,
                name: senderEditForm.name!,
                phone: senderEditForm.phone!,
                address: senderEditForm.address!,
              }
            : s
        )
      );
      setEditingId(null);
      setSenderEditForm({});
    }
  };

  const handleDeleteSender = (id: string) => {
    setSenders((prev) => prev.filter((s) => s.id !== id));
  };

  const handleAddNewSender = () => {
    const newSender: SavedAddress = {
      id: `sender-${Date.now()}`,
      name: "",
      phone: "",
      address: "",
    };
    setSenders((prev) => [...prev, newSender]);
    setEditingId(newSender.id);
    setSenderEditForm(newSender);
  };

  const handleSaveAll = () => {
    // 받는사람 저장
    const validMembers = members.filter(
      (m) => m.name && m.relation && m.facility
    );
    onUpdateMembers(validMembers);
    
    // 보내는사람 저장
    const validSenders = senders.filter(
      (s) => s.name && s.phone && s.address
    );
    localStorage.setItem("savedSenderAddresses", JSON.stringify(validSenders));
    
    onClose();
  };

  const handleCancel = () => {
    setMembers(familyMembers);
    const saved = localStorage.getItem("savedSenderAddresses");
    setSenders(saved ? JSON.parse(saved) : []);
    setEditingId(null);
    setEditForm({});
    setSenderEditForm({});
    setSelectedFacilityType("");
    setSelectedRegion("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        onClick={handleCancel}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-card rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">주소록 관리</h2>
            <button
              onClick={handleCancel}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border">
            <button
              onClick={() => {
                setActiveTab("recipients");
                setEditingId(null);
              }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors border-b-2",
                activeTab === "recipients"
                  ? "text-primary border-primary bg-primary/5"
                  : "text-muted-foreground border-transparent hover:text-foreground"
              )}
            >
              <Users className="w-4 h-4" />
              받는사람 ({members.length})
            </button>
            <button
              onClick={() => {
                setActiveTab("senders");
                setEditingId(null);
              }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors border-b-2",
                activeTab === "senders"
                  ? "text-primary border-primary bg-primary/5"
                  : "text-muted-foreground border-transparent hover:text-foreground"
              )}
            >
              <User className="w-4 h-4" />
              보내는사람 ({senders.length})
            </button>
          </div>

          {/* Content */}
          <div className="p-4 overflow-y-auto max-h-[50vh] space-y-3">
            {activeTab === "recipients" ? (
              // 받는사람 목록
              <>
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="p-4 bg-secondary/50 rounded-xl border border-border/50"
                  >
                    {editingId === member.id ? (
                      <div className="space-y-3">
                        <Input
                          value={editForm.name || ""}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          placeholder="수용자 이름"
                        />

                        {/* 관계 선택 */}
                        <Select
                          value={editForm.relation || ""}
                          onValueChange={(value) => setEditForm({ ...editForm, relation: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="관계 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {relationTypes.map((relation) => (
                              <SelectItem key={relation} value={relation}>
                                {relation}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* 시설 유형 선택 */}
                        <div className="grid grid-cols-2 gap-2">
                          <Select
                            value={selectedFacilityType}
                            onValueChange={(value) => {
                              setSelectedFacilityType(value as FacilityType);
                              setEditForm({ ...editForm, facility: "", facilityAddress: "" });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="시설 유형" />
                            </SelectTrigger>
                            <SelectContent>
                              {facilityTypeValues.filter(t => t !== "일반 주소").map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Select
                            value={selectedRegion}
                            onValueChange={(value) => {
                              setSelectedRegion(value as Region);
                              setEditForm({ ...editForm, facility: "", facilityAddress: "" });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="지역 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              {regions.map((region) => (
                                <SelectItem key={region} value={region}>
                                  {region}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* 시설 선택 */}
                        {(selectedFacilityType || selectedRegion) && (
                          <Select
                            value={editForm.facility || ""}
                            onValueChange={(value) => {
                              const facility = facilities.find(f => f.name === value);
                              setEditForm({
                                ...editForm,
                                facility: value,
                                facilityAddress: facility?.address || ""
                              });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="시설 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              {filteredFacilities.map((facility) => (
                                <SelectItem key={facility.id} value={facility.name}>
                                  {facility.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}

                        {/* 수용자 번호 */}
                        <Input
                          value={editForm.prisonerNumber || ""}
                          onChange={(e) =>
                            setEditForm({ ...editForm, prisonerNumber: e.target.value })
                          }
                          placeholder="수용자 번호 (예: 2024-12345)"
                        />

                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSaveMemberEdit}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
                          >
                            추가
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {member.name}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {member.relation} · {member.facility}
                          </p>
                          {member.prisonerNumber && (
                            <p className="text-xs text-muted-foreground/70">
                              수용자번호: {member.prisonerNumber}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEditMember(member)}
                            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteMember(member.id)}
                            className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </>
            ) : (
              // 보내는사람 목록
              <>
                {senders.map((sender) => (
                  <div
                    key={sender.id}
                    className="p-4 bg-secondary/50 rounded-xl border border-border/50"
                  >
                    {editingId === sender.id ? (
                      <div className="space-y-3">
                        <Input
                          value={senderEditForm.name || ""}
                          onChange={(e) =>
                            setSenderEditForm({ ...senderEditForm, name: e.target.value })
                          }
                          placeholder="이름"
                        />
                        <Input
                          value={senderEditForm.phone || ""}
                          onChange={(e) =>
                            setSenderEditForm({ ...senderEditForm, phone: e.target.value })
                          }
                          placeholder="전화번호 (예: 010-1234-5678)"
                        />
                        <Input
                          value={senderEditForm.address || ""}
                          onChange={(e) =>
                            setSenderEditForm({ ...senderEditForm, address: e.target.value })
                          }
                          placeholder="주소"
                        />
                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSaveSenderEdit}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
                          >
                            추가
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {sender.name}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {sender.phone}
                          </p>
                          <p className="text-xs text-muted-foreground/70 truncate">
                            {sender.address}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEditSender(sender)}
                            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSender(sender.id)}
                            className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border flex items-center justify-between">
            <Button
              variant="outline"
              onClick={activeTab === "recipients" ? handleAddNewMember : handleAddNewSender}
            >
              <Plus className="w-4 h-4 mr-2" />
              {activeTab === "recipients" ? "받는사람 추가" : "보내는사람 추가"}
            </Button>
            <Button onClick={handleSaveAll} className="bg-orange-500 hover:bg-orange-600">
              저장하기
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
