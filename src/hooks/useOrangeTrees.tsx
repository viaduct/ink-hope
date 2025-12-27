import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { orangeTrees as initialOrangeTrees } from "@/data/mockData";

const STORAGE_KEY = "ink-hope-orange-trees";

export interface OrangeTreeDB {
  id: string;
  user_id: string;
  family_member_id: string;
  person_name: string;
  relation: string;
  sent_letters: number;
  received_letters: number;
  total_letters: number | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

function loadFromStorage(userId: string): OrangeTreeDB[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return parsed.filter((t: OrangeTreeDB) => t.user_id === userId && !t.is_archived);
    } catch {
      return [];
    }
  }
  // Initialize with mock data on first load
  const initial: OrangeTreeDB[] = initialOrangeTrees.map((t) => ({
    id: t.id,
    user_id: userId,
    family_member_id: t.personId,
    person_name: t.personName,
    relation: t.relation,
    sent_letters: t.sentLetters,
    received_letters: t.receivedLetters,
    total_letters: t.totalLetters,
    is_archived: t.isArchived,
    created_at: t.createdAt,
    updated_at: new Date().toISOString(),
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

function saveToStorage(trees: OrangeTreeDB[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trees));
}

export function useOrangeTrees() {
  const { user } = useAuth();
  const [orangeTrees, setOrangeTrees] = useState<OrangeTreeDB[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (user) {
      const trees = loadFromStorage(user.id);
      setOrangeTrees(trees.filter((t) => !t.is_archived));
      setIsLoading(false);
    } else {
      setOrangeTrees([]);
      setIsLoading(false);
    }
  }, [user]);

  const incrementLetters = useCallback(
    ({ treeId, type }: { treeId: string; type: "sent" | "received" }) => {
      const stored = localStorage.getItem(STORAGE_KEY);
      const all: OrangeTreeDB[] = stored ? JSON.parse(stored) : [];
      const index = all.findIndex((t) => t.id === treeId);

      if (index !== -1) {
        if (type === "sent") {
          all[index].sent_letters += 1;
        } else {
          all[index].received_letters += 1;
        }
        all[index].total_letters = all[index].sent_letters + all[index].received_letters;
        all[index].updated_at = new Date().toISOString();

        saveToStorage(all);
        setOrangeTrees((prev) =>
          prev.map((t) =>
            t.id === treeId
              ? {
                  ...t,
                  sent_letters: all[index].sent_letters,
                  received_letters: all[index].received_letters,
                  total_letters: all[index].total_letters,
                }
              : t
          )
        );
      }
    },
    []
  );

  return {
    orangeTrees,
    isLoading,
    error,
    incrementLetters,
  };
}
