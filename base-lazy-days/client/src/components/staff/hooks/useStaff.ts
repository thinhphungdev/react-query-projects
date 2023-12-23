import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";

import type { Staff } from "@shared/types";

import { filterByTreatment } from "../utils";

import { axiosInstance } from "@/axiosInstance";
import { queryKeys } from "@/react-query/constants";


// for when we need a query function for useQuery
async function getStaff(): Promise<Staff[]> {
  const { data } = await axiosInstance.get('/staff');
  return data;
}

interface UseStaff {
  staff: Staff[];
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
}

export function useStaff(): UseStaff {

  const [filter, setFilter] = useState("all");
  const falllback = [];

  const { data: staff = falllback } = useQuery({
    queryKey: queryKeys.staff,
    queryFn: getStaff,
  });

  return { staff, filter, setFilter };
}
