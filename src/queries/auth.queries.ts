import authClientServices from "@/services/authClient.services"
import { useMutation } from "@tanstack/react-query"

export const useLoginMutation = () => {
    return useMutation({
        mutationFn: authClientServices.login,
    })
}