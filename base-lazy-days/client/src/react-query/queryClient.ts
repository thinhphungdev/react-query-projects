import { QueryClient } from "@tanstack/react-query";

import { toast } from "@/components/app/toast";

function errorHandler(type: "query" | "mutation", errorMsg: string) {
    const id = "react-query-toast";

    if (!toast.isActive(id)) {
        const action = type === "query" ? "load" : "update";
        const title = `could not ${action} data: ${errorMsg ?? "error connecting to server"
            }`;
        toast({ id, title, status: "error", variant: "subtle", isClosable: true });
    }
}

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 600000,
            gcTime: 900000,
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            onError: errorHandler,
        }
    }
});
