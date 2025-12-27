import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

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

export function useFamilyMembers() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["family_members", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("family_members")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as FamilyMemberDB[];
    },
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: async (input: CreateFamilyMemberInput) => {
      if (!user) throw new Error("로그인이 필요합니다");

      // 아바타 색상: 직접 지정하거나 랜덤 선택
      const colors = [
        "bg-orange-100 text-orange-600",
        "bg-blue-100 text-blue-600",
        "bg-green-100 text-green-600",
        "bg-purple-100 text-purple-600",
        "bg-pink-100 text-pink-600",
      ];
      const selectedColor = input.color || colors[Math.floor(Math.random() * colors.length)];

      const { data, error } = await supabase
        .from("family_members")
        .insert({
          user_id: user.id,
          name: input.name,
          relation: input.relation,
          facility: input.facility,
          facility_address: input.facility_address || null,
          prisoner_number: input.prisoner_number || null,
          avatar: input.name.charAt(0),
          color: selectedColor,
        })
        .select()
        .single();

      if (error) throw error;
      return data as FamilyMemberDB;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["family_members"] });
      queryClient.invalidateQueries({ queryKey: ["orange_trees"] });
      toast.success("소중한 사람이 추가되었습니다. 오렌지나무도 함께 생겼어요!");
    },
    onError: (error) => {
      toast.error("추가 실패: " + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<FamilyMemberDB> & { id: string }) => {
      const { data, error } = await supabase
        .from("family_members")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as FamilyMemberDB;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["family_members"] });
      toast.success("정보가 수정되었습니다");
    },
    onError: (error) => {
      toast.error("수정 실패: " + error.message);
    },
  });

  // 소프트 삭제 (is_active = false)
  const deactivateMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("family_members")
        .update({ is_active: false })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["family_members"] });
      toast.success("수신자가 비활성화되었습니다");
    },
    onError: (error) => {
      toast.error("비활성화 실패: " + error.message);
    },
  });

  return {
    familyMembers: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    createFamilyMember: createMutation.mutate,
    updateFamilyMember: updateMutation.mutate,
    deactivateFamilyMember: deactivateMutation.mutate,
    isCreating: createMutation.isPending,
  };
}
