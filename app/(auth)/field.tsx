export function Field({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

export function FieldError({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-[#f1464d] bg-opacity-10 p-2 text-[0.8rem] font-medium text-[#f1464d]">
      {children}
    </div>
  );
}
