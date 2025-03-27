export function StickyFooter({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div
      className="sticky bottom-0 z-50 w-full bg-background py-6"
      style={{
        background: `linear-gradient(to top, rgb(var(--background) / 1) 0%, rgb(var(--background) / 1) 70%, transparent 100%)`,
      }}
    >
      {children}
    </div>
  );
}
