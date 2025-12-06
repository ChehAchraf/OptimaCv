import { Skeleton, CardSkeleton, Spinner } from '@/components/ui/loading-states';

export function PageLoader() {
    return (
        <div className="min-h-screen container max-w-7xl mx-auto py-12 px-4 space-y-8">
            <div className="space-y-4">
                <Skeleton className="h-12 w-1/3" />
                <Skeleton className="h-6 w-2/3" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
            </div>
        </div>
    );
}

export function SectionLoader() {
    return (
        <div className="py-20 flex justify-center items-center w-full">
            <Spinner size="lg" className="text-primary" />
        </div>
    );
}

export function CardLoader() {
    return (
        <CardSkeleton />
    );
}
