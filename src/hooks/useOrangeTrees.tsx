import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

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

export function useOrangeTrees() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["orange_trees", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("orange_trees")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_archived", false)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as OrangeTreeDB[];
    },
    enabled: !!user,
  });

  // 편지 수 증가
  const incrementLettersMutation = useMutation({
    mutationFn: async ({ treeId, type }: { treeId: string; type: "sent" | "received" }) => {
      const tree = query.data?.find((t) => t.id === treeId);
      if (!tree) throw new Error("나무를 찾을 수 없습니다");

      const updates = type === "sent"
        ? { sent_letters: tree.sent_letters + 1 }
        : { received_letters: tree.received_letters + 1 };

      const { data, error } = await supabase
        .from("orange_trees")
        .update(updates)
        .eq("id", treeId)
        .select()
        .single();

      if (error) throw error;
      return data as OrangeTreeDB;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orange_trees"] });
    },
  });

  return {
    orangeTrees: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    incrementLetters: incrementLettersMutation.mutate,
  };
}
