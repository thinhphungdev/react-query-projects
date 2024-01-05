import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Appointment } from "@shared/types";

import { axiosInstance } from "@/axiosInstance";
import { useCustomToast } from "@/components/app/hooks/useCustomToast";
import { queryKeys } from "@/react-query/constants";

// for when server call is needed
async function removeAppointmentUser(appointment: Appointment): Promise<void> {
  const patchData = [{ op: 'remove', path: '/userId' }];
  await axiosInstance.patch(`/appointment/${appointment.id}`, {
    data: patchData,
  });
}

// TODO: update return type
export function useCancelAppointment(): (appointment: Appointment) => void {
  const toast = useCustomToast();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (appointment: Appointment) => removeAppointmentUser(appointment),
    onSuccess: () => {
      queryClient.invalidateQueries([queryKeys.appointments]);
      toast({
        title: 'You have cancelled your appointment',
        status: 'warning'
      });
    }
  });

  return mutate;
}
