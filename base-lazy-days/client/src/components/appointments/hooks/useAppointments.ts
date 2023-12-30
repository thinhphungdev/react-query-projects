import { useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";

import { AppointmentDateMap } from "../types";
import { getAvailableAppointments } from "../utils";
import { getMonthYearDetails, getNewMonthYear, MonthYear } from "./monthYear";

import { useLoginData } from "@/auth/AuthContext";
import { axiosInstance } from "@/axiosInstance";
import { queryKeys } from "@/react-query/constants";

// for useQuery call
async function getAppointments(
  year: string,
  month: string
): Promise<AppointmentDateMap> {
  const { data } = await axiosInstance.get(`/appointments/${year}/${month}`);
  return data;
}

// types for hook return object
interface UseAppointments {
  appointments: AppointmentDateMap;
  monthYear: MonthYear;
  updateMonthYear: (monthIncrement: number) => void;
  showAll: boolean;
  setShowAll: Dispatch<SetStateAction<boolean>>;
}

export function useAppointments(): UseAppointments {
  const currentMonthYear = getMonthYearDetails(dayjs());

  const queryClient = useQueryClient()
  const [monthYear, setMonthYear] = useState(currentMonthYear);
  const [showAll, setShowAll] = useState(false);

  const { userId } = useLoginData();

  function updateMonthYear(monthIncrement: number): void {
    setMonthYear((prevData) => getNewMonthYear(prevData, monthIncrement));
  }

  const selectFn = useCallback((data) => getAvailableAppointments(data, userId), [userId])

  useEffect(() => {
    const nextMonthYear = getNewMonthYear(monthYear, 1);

    queryClient.prefetchQuery({
      queryKey: [queryKeys.appointments, nextMonthYear.year, nextMonthYear.month],
      queryFn: () => getAppointments(nextMonthYear.year, nextMonthYear.month),
      staleTime: 0,
      gcTime: 300000,
    })
  }, [monthYear, queryClient])

  const { data: appointments = {} } = useQuery({
    queryKey: [queryKeys.appointments, monthYear.year, monthYear.month],
    queryFn: () => getAppointments(monthYear.year, monthYear.month),
    select: showAll ? undefined : selectFn,
    staleTime: 0,
    gcTime: 300000,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    refetchInterval: 60000,
  })

  return { appointments, monthYear, updateMonthYear, showAll, setShowAll };
}
