import { SkeletonBlock } from "@/components/ui/StateMessage";

export default function Loading() {
  return (
    <div className="container-page py-14" role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">লোড হচ্ছে…</span>
      <SkeletonBlock className="h-8 w-2/3 max-w-md" />
      <SkeletonBlock className="mt-4 h-4 w-full max-w-2xl" />
      <SkeletonBlock className="mt-2 h-4 w-5/6 max-w-xl" />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-40" />
        ))}
      </div>
    </div>
  );
}
