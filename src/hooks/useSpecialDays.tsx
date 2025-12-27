import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { toast } from "sonner";
import { specialDays as initialSpecialDays } from "@/data/mockData";

const STORAGE_KEY = "ink-hope-special-days";

export interface SpecialDayDB {
  id: string;
  user_id: string;
  tree_id: string;
  title: string;
  date: string;
  type: string;
  description: string | null;
  is_golden: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateSpecialDayInput {
  tree_id: string;
  title: string;
  date: string;
  type: string;
  description?: string;
  is_golden?: boolean;
}

function loadFromStorage(userId: string, treeId?: string): SpecialDayDB[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed: SpecialDayDB[] = JSON.parse(stored);
      let filtered = parsed.filter((s) => s.user_id === userId);
      if (treeId) {
        filtered = filtered.filter((s) => s.tree_id === treeId);
      }
      return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } catch {
      return [];
    }
  }
  // Initialize with mock data on first load
  const initial: SpecialDayDB[] = initialSpecialDays.map((s) => ({
    id: s.id,
    user_id: userId,
    tree_id: s.treeId,
    title: s.title,
    date: s.date,
    type: s.type,
    description: s.description || null,
    is_golden: s.isGolden || false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));

  let filtered = initial;
  if (treeId) {
    filtered = initial.filter((s) => s.tree_id === treeId);
  }
  return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

function saveToStorage(days: SpecialDayDB[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(days));
}

export function useSpecialDays(treeId?: string) {
  const { user } = useAuth();
  const [specialDays, setSpecialDays] = useState<SpecialDayDB[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (user) {
      const days = loadFromStorage(user.id, treeId);
      setSpecialDays(days);
      setIsLoading(false);
    } else {
      setSpecialDays([]);
      setIsLoading(false);
    }
  }, [user, treeId]);

  const createSpecialDay = useCallback(
    (input: CreateSpecialDayInput) => {
      if (!user) {
        toast.error("로그인이 필요합니다");
        return;
      }

      setIsCreating(true);

      const newDay: SpecialDayDB = {
        id: `sd-${Date.now()}`,
        user_id: user.id,
        tree_id: input.tree_id,
        title: input.title,
        date: input.date,
        type: input.type,
        description: input.description || null,
        is_golden: input.is_golden || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const stored = localStorage.getItem(STORAGE_KEY);
      const all: SpecialDayDB[] = stored ? JSON.parse(stored) : [];
      all.push(newDay);
      saveToStorage(all);

      // Update state with sorted days
      setSpecialDays((prev) => {
        const updated = [...prev, newDay];
        return updated.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      });

      setIsCreating(false);
      toast.success("소중한 날이 등록되었습니다");
    },
    [user]
  );

  const deleteSpecialDay = useCallback((id: string) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const all: SpecialDayDB[] = stored ? JSON.parse(stored) : [];
    const filtered = all.filter((s) => s.id !== id);
    saveToStorage(filtered);

    setSpecialDays((prev) => prev.filter((s) => s.id !== id));
    toast.success("삭제되었습니다");
  }, []);

  return {
    specialDays,
    isLoading,
    error,
    createSpecialDay,
    deleteSpecialDay,
    isCreating,
  };
}
