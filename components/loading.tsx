interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export function Loading({ size = "md", text }: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className={`animate-spin rounded-full border-2 border-slate-300 border-t-slate-900 ${sizeClasses[size]}`} />
      {text && (
        <p className="mt-2 text-sm text-slate-600">{text}</p>
      )}
    </div>
  );
}

export function LoadingPage({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <Loading size="lg" text={text} />
    </div>
  );
}