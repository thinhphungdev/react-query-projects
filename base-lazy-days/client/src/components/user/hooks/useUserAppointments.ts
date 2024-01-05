import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

import type { Appointment } from "@shared/types";

import { axiosInstance, getJWTHeader } from "../../../axiosInstance";

import { useLoginData } from "@/auth/AuthContext";
import { queryKeys } from "@/react-query/constants";

async function getUserAppointments(
  userId: number,
  userToken: string
): Promise<Appointment[] | null> {
  if (!userId) return null;

  const { data } = await axiosInstance.get(`/user/${userId}/appointments`, {
    headers: getJWTHeader(userToken),
  });

  return data.appointments;
}

export function useUserAppointments(): Appointment[] {
  const { userId, userToken } = useLoginData();

  const { data: userAppointments = [] } = useQuery({
    queryKey: [queryKeys.appointments, queryKeys.user, userId],
    queryFn: () => getUserAppointments(userId, userToken),
    enabled: userId ? true : false,
  });

  return userAppointments;
}
