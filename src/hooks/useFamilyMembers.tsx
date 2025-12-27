import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { toast } from "sonner";
import { familyMembers as initialFamilyMembers } from "@/data/mockData";

const STORAGE_KEY = "ink-hope-family-members";

export interface FamilyMemberDB {
  id: string;
  user_id: string;
  name: string;
  relation: string;
  facility: string;
  facility_address: string | null;
  prisoner_number: string | null;
  avatar: string | null;
  color: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateFamilyMemberInput {
  name: string;
  relation: string;
  facility: string;
  facility_address?: string;
  prisoner_number?: string | null;
  color?: string;
}

function loadFromStorage(userId: string): FamilyMemberDB[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return parsed.filter((m: FamilyMemberDB) => m.user_id === userId && m.is_active);
    } catch {
      return [];
    }
  }
  // Initialize with mock data on first load
  const initial: FamilyMemberDB[] = initialFamilyMembers.map((m) => ({
    id: m.id,
    user_id: userId,
    name: m.name,
    relation: m.relation,
    facility: m.facility,
    facility_address: m.facilityAddress || null,
    prisoner_number: m.prisonerNumber || null,
    avatar: m.avatar,
    color: m.color,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

function saveToStorage(members: FamilyMemberDB[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
}

export function useFamilyMembers() {
  const { user } = useAuth();
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberDB[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (user) {
      const members = loadFromStorage(user.id);
      setFamilyMembers(members.filter((m) => m.is_active));
      setIsLoading(false);
    } else {
      setFamilyMembers([]);
      setIsLoading(false);
    }
  }, [user]);

  const createFamilyMember = useCallback(
    (input: CreateFamilyMemberInput) => {
      if (!user) {
        toast.error("로그인이 필요합니다");
        return;
      }

      setIsCreating(true);

      const colors = [
        "bg-orange-100 text-orange-600",
        "bg-blue-100 text-blue-600",
        "bg-green-100 text-green-600",
        "bg-purple-100 text-purple-600",
        "bg-pink-100 text-pink-600",
      ];
      const selectedColor = input.color || colors[Math.floor(Math.random() * colors.length)];

      const newMember: FamilyMemberDB = {
        id: `fm-${Date.now()}`,
        user_id: user.id,
        name: input.name,
        relation: input.relation,
        facility: input.facility,
        facility_address: input.facility_address || null,
        prisoner_number: input.prisoner_number || null,
        avatar: input.name.charAt(0),
        color: selectedColor,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const stored = localStorage.getItem(STORAGE_KEY);
      const all = stored ? JSON.parse(stored) : [];
      all.push(newMember);
      saveToStorage(all);

      setFamilyMembers((prev) => [newMember, ...prev]);
      setIsCreating(false);
      toast.success("소중한 사람이 추가되었습니다. 오렌지나무도 함께 생겼어요!");
    },
    [user]
  );

  const updateFamilyMember = useCallback(
    ({ id, ...updates }: Partial<FamilyMemberDB> & { id: string }) => {
      const stored = localStorage.getItem(STORAGE_KEY);
      const all: FamilyMemberDB[] = stored ? JSON.parse(stored) : [];
      const index = all.findIndex((m) => m.id === id);

      if (index !== -1) {
        all[index] = { ...all[index], ...updates, updated_at: new Date().toISOString() };
        saveToStorage(all);
        setFamilyMembers((prev) =>
          prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
        );
        toast.success("정보가 수정되었습니다");
      }
    },
    []
  );

  const deactivateFamilyMember = useCallback((id: string) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const all: FamilyMemberDB[] = stored ? JSON.parse(stored) : [];
    const index = all.findIndex((m) => m.id === id);

    if (index !== -1) {
      all[index] = { ...all[index], is_active: false, updated_at: new Date().toISOString() };
      saveToStorage(all);
      setFamilyMembers((prev) => prev.filter((m) => m.id !== id));
      toast.success("수신자가 비활성화되었습니다");
    }
  }, []);

  return {
    familyMembers,
    isLoading,
    error,
    createFamilyMember,
    updateFamilyMember,
    deactivateFamilyMember,
    isCreating,
  };
}
