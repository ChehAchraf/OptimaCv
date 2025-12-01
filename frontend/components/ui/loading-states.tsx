import { cn } from "@/lib/utils";

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

/**
 * Accessible loading spinner with ARIA labels
 */
export function Spinner({ size = 'md', className }: SpinnerProps) {
    const sizeClasses = {
        sm: 'h-4 w-4 border-2',
        md: 'h-8 w-8 border-2',
        lg: 'h-12 w-12 border-3',
        xl: 'h-16 w-16 border-4',
    };

    return (
        <div
            className={cn(
                'inline-block animate-spin rounded-full border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]',
                sizeClasses[size],
                className
            )}
            role="status"
            aria-label="Loading"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
}

interface LoadingProps {
    text?: string;
    fullScreen?: boolean;
    className?: string;
}

/**
 * Loading component with optional full-screen overlay
 */
export function Loading({ text = 'Loading...', fullScreen = false, className }: LoadingProps) {
    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-4">
                    <Spinner size="lg" className="text-primary" />
                    <p className="text-sm font-medium text-muted-foreground">{text}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={cn('flex items-center justify-center p-8', className)}>
            <div className="flex flex-col items-center gap-4">
                <Spinner size="md" className="text-primary" />
                <p className="text-sm font-medium text-muted-foreground">{text}</p>
            </div>
        </div>
    );
}

interface SkeletonProps {
    className?: string;
    count?: number;
}

/**
 * Skeleton loader for content placeholders
 */
export function Skeleton({ className, count = 1 }: SkeletonProps) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className={cn(
                        'animate-pulse rounded-md bg-muted',
                        className
                    )}
                    role="status"
                    aria-label="Loading content"
                />
            ))}
        </>
    );
}

/**
 * Card skeleton for loading states
 */
export function CardSkeleton() {
    return (
        <div className="rounded-lg border bg-card p-6 shadow-sm">
            <Skeleton className="h-6 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-2" />
            <Skeleton className="h-4 w-4/6 mb-4" />
            <Skeleton className="h-10 w-full" />
        </div>
    );
}

/**
 * Table skeleton for loading states
 */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex gap-4">
                    <Skeleton className="h-12 flex-1" />
                    <Skeleton className="h-12 flex-1" />
                    <Skeleton className="h-12 flex-1" />
                    <Skeleton className="h-12 w-24" />
                </div>
            ))}
        </div>
    );
}

interface ProgressBarProps {
    value: number; // 0-100
    className?: string;
    showLabel?: boolean;
    label?: string;
}

/**
 * Accessible progress bar
 */
export function ProgressBar({ value, className, showLabel = true, label }: ProgressBarProps) {
    const percentage = Math.min(Math.max(value, 0), 100);

    return (
        <div className={cn('w-full', className)}>
            {showLabel && (
                <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">{label || 'Progress'}</span>
                    <span className="text-sm font-medium">{percentage}%</span>
                </div>
            )}
            <div
                className="w-full bg-muted rounded-full h-2 overflow-hidden"
                role="progressbar"
                aria-valuenow={percentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={label || 'Progress'}
            >
                <div
                    className="h-full bg-primary transition-all duration-300 ease-in-out"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

interface PulseLoaderProps {
    className?: string;
}

/**
 * Pulse loader for subtle loading states
 */
export function PulseLoader({ className }: PulseLoaderProps) {
    return (
        <div className={cn('flex items-center gap-1', className)} role="status" aria-label="Loading">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0ms' }} />
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '150ms' }} />
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '300ms' }} />
            <span className="sr-only">Loading...</span>
        </div>
    );
}

interface DotsLoaderProps {
    className?: string;
}

/**
 * Dots loader animation
 */
export function DotsLoader({ className }: DotsLoaderProps) {
    return (
        <div className={cn('flex items-center gap-1', className)} role="status" aria-label="Loading">
            <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
            <span className="sr-only">Loading...</span>
        </div>
    );
}

interface LoadingButtonProps {
    isLoading: boolean;
    children: React.ReactNode;
    loadingText?: string;
    className?: string;
    disabled?: boolean;
}

/**
 * Button with loading state
 */
export function LoadingButton({
    isLoading,
    children,
    loadingText = 'Loading...',
    className,
    disabled,
    ...props
}: LoadingButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={cn(
                'inline-flex items-center justify-center gap-2',
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <>
                    <Spinner size="sm" />
                    <span>{loadingText}</span>
                </>
            ) : (
                children
            )}
        </button>
    );
}
