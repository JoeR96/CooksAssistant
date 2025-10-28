export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-900">CooksAssistant</h1>
            <p className="mt-2 text-slate-600">Your personal recipe and meal planning assistant</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}