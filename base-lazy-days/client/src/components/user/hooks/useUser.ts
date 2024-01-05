import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import type { User } from "@shared/types";

import { axiosInstance, getJWTHeader } from "../../../axiosInstance";
import {
  clearStoredUser,
  getStoredUser,
  setStoredUser,
} from "../../../user-storage";

import { queryKeys } from "@/react-query/constants";

async function getUser(userId: number, userToken: string, signal: AbortSignal) {
  const { data }: AxiosResponse<{ user: User }> = await axiosInstance.get(
    `/user/${userId}`,
    {
      signal, // abortSignal from React Query
      headers: getJWTHeader(userToken),
    }
  );

  return data.user;
}

interface UseUser {
  user: User | null;
  updateUser: (user: User) => void;
  clearUser: () => void;
}

export function useUser(): UseUser {
  const { data: user } = useQuery({
    queryKey: queryKeys.user,
    queryFn: ({ signal }) => getUser(user.id, user.token, signal),
    initialData: getStoredUser,
    onSuccess: (received: User | null) => {
      if (!received) clearStoredUser()
      else setStoredUser(received)
    }
  });

  const queryClient = useQueryClient();

  // meant to be called from useAuth
  function updateUser(newUser: User): void {
    queryClient.setQueryData(queryKeys.user, newUser);
  }

  function clearUser() {
    queryClient.setQueryData(queryKeys.user, null);
    // remove dependent query
    queryClient.removeQueries([queryKeys.appointments, queryKeys.user]);
  }

  return { user, updateUser, clearUser };
}
