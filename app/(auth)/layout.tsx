export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center animate-fade-in">
            <div className="mb-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                🍳
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              CooksAssistant
            </h1>
            <p className="mt-3 text-muted-foreground text-lg">
              Your personal recipe and meal planning assistant
            </p>
          </div>
          <div className="animate-slide-up">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}