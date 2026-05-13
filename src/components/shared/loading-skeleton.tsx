export function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#fbf8f4] pt-36">
      <div className="luxury-shell grid gap-5">
        <div className="h-10 w-48 rounded-full bg-stone-200/80" />
        <div className="h-24 max-w-2xl rounded-[2rem] bg-stone-200/80" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-64 rounded-[2rem] bg-stone-200/80" />
          <div className="h-64 rounded-[2rem] bg-stone-200/80" />
          <div className="h-64 rounded-[2rem] bg-stone-200/80" />
        </div>
      </div>
    </div>
  )
}
