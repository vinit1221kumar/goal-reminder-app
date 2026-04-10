type RouteLoadingScreenProps = {
  message: string;
};

export function RouteLoadingScreen({ message }: RouteLoadingScreenProps) {
  return (
    <main className="app-shell flex items-center justify-center">
      <div className="surface-card px-8 py-10 text-center">
        <div className="anim-pulse-soft mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-2xl dark:bg-violet-950/40">
          ⏳
        </div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{message}</p>
      </div>
    </main>
  );
}
