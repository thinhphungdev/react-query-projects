import { UseMutateFunction, useMutation, useQueryClient } from "@tanstack/react-query";
import jsonpatch from "fast-json-patch";

import type { User } from "@shared/types";

import { axiosInstance, getJWTHeader } from "../../../axiosInstance";
import { useUser } from "./useUser";

import { useCustomToast } from "@/components/app/hooks/useCustomToast";
import { queryKeys } from "@/react-query/constants";

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

export function usePatchUser(): UseMutateFunction<User, unknown, void, unknown> {
  const { user, updateUser } = useUser();
  const toast = useCustomToast()
  const queryClient = useQueryClient();

  const { mutate: patchUser } = useMutation({
    mutationFn: (newUserData: User) => patchUserOnServer(newUserData, user),
    onSuccess: () => {
      toast({
        title: 'User updated',
        status: 'success'
      })
    },
    onMutate: async (newUserData: User | null) => {
      // cancel any outgoing query for User data, so old server data doesnt overwrite our optimistic update
      queryClient.cancelQueries(queryKeys.user);

      // snapsot of previous userData
      const previousUserData: User = queryClient.getQueryData(queryKeys.user);

      // optimistic update the cache with new value
      updateUser(newUserData);

      // return context object with snapshotted value
      return { previousUserData }
    },
    onError: (error, newData, context) => {
      // rollback the cache to saved value if have any error from the server
      // here just some dummy condition
      if (context.previousUserData) {
        toast({ title: 'Updated failed: restoring previous values', status: 'error' })
        updateUser(context.previousUserData)
      }
    },
    onSettled: () => {
      // invalidate user query to make sure we're in sync with server data (best practice)
      queryClient.invalidateQueries(queryKeys.user)
    }
  });

  return patchUser;
}
