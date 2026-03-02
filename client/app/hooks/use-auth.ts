// Step 27 - 
import { postData } from "@/lib/fetch-utils";
import type { SignUpFormData } from "@/routes/auth/sign-up";
import { useMutation } from "@tanstack/react-query";

export const useSignUpMutation = () => {
    return useMutation({
        mutationFn: (data: SignUpFormData) => postData("/auth/register", data)     // after step 28 - 28.1 - change the path to match the backend route for sign-up
    });
};
