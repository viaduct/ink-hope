import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

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

export function useSpecialDays(treeId?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["special_days", user?.id, treeId],
    queryFn: async () => {
      if (!user) return [];
      
      let queryBuilder = supabase
        .from("special_days")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: true });

      if (treeId) {
        queryBuilder = queryBuilder.eq("tree_id", treeId);
      }

      const { data, error } = await queryBuilder;

      if (error) throw error;
      return data as SpecialDayDB[];
    },
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: async (input: CreateSpecialDayInput) => {
      if (!user) throw new Error("로그인이 필요합니다");

      const { data, error } = await supabase
        .from("special_days")
        .insert({
          user_id: user.id,
          tree_id: input.tree_id,
          title: input.title,
          date: input.date,
          type: input.type,
          description: input.description || null,
          is_golden: input.is_golden || false,
        })
        .select()
        .single();

      if (error) throw error;
      return data as SpecialDayDB;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["special_days"] });
      toast.success("소중한 날이 등록되었습니다");
    },
    onError: (error) => {
      toast.error("등록 실패: " + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("special_days")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["special_days"] });
      toast.success("삭제되었습니다");
    },
    onError: (error) => {
      toast.error("삭제 실패: " + error.message);
    },
  });

  return {
    specialDays: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    createSpecialDay: createMutation.mutate,
    deleteSpecialDay: deleteMutation.mutate,
    isCreating: createMutation.isPending,
  };
}
