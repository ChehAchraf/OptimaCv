
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { updateCV } from '@/app/actions/cv';
import { CVData } from '@/types/cv';

// --- Hook: useAutoSaveCv ---
export function useAutoSaveCv() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newData: Partial<CVData> & { id: string }) => {
            return await updateCV(newData.id, newData);
        },

        onMutate: async (newData) => {
            await queryClient.cancelQueries({ queryKey: ['cv', newData.id] });

            const previousCv = queryClient.getQueryData(['cv', newData.id]);

            queryClient.setQueryData(['cv', newData.id], (old: CVData | undefined) => {
                if (!old) return old;
                return { ...old, ...newData };
            });

            return { previousCv };
        },

        onError: (err, newData, context) => {
            toast({
                variant: "destructive",
                title: "Auto-save failed",
                description: "Retrying...",
            });
            if (context?.previousCv) {
                queryClient.setQueryData(['cv', newData.id], context.previousCv);
            }
        },
        onSettled: (data, error, variables) => {
            queryClient.invalidateQueries({ queryKey: ['cv', variables.id] });

            if (!error) {
                toast({
                    variant: "default",
                    title: "Auto-save successful",
                    description: "Your changes have been saved.",
                });
            }
        },
    });
}
