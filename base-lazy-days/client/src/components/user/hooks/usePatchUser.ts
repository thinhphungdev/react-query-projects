import { UseMutateFunction, useMutation } from "@tanstack/react-query";
import jsonpatch from "fast-json-patch";

import type { User } from "@shared/types";

import { axiosInstance, getJWTHeader } from "../../../axiosInstance";
import { useUser } from "./useUser";

import { useCustomToast } from "@/components/app/hooks/useCustomToast";

// for when we need a server function
async function patchUserOnServer(
  newData: User | null,
  originalData: User | null,
): Promise<User | null> {
  if (!newData || !originalData) return null;
  // create a patch for the difference between newData and originalData
  const patch = jsonpatch.compare(originalData, newData);

  // send patched data to the server
  const { data } = await axiosInstance.patch(
    `/user/${originalData.id}`,
    { patch },
    {
      headers: getJWTHeader(originalData),
    },
  );
  return data.user;
}

// TODO: update type to UseMutateFunction type
export function usePatchUser(): UseMutateFunction<User, unknown, void, unknown> {
  const { user, updateUser } = useUser();
  const toast = useCustomToast()

  const { mutate: patchUser } = useMutation({
    mutationFn: (newUserData: User) => patchUserOnServer(newUserData, user),
    onSuccess: (userData: User | null) => {
      if (!userData) return;

      updateUser(userData);
      toast({
        title: 'User updated',
        status: 'success'
      })
    }
  });

  return patchUser;
}
