interface PageWrapperProps {
  children: React.ReactNode
  header?: React.ReactNode
}

export function PageWrapper({ children, header }: PageWrapperProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {header && (
        <header className="sticky top-0 z-30 bg-background border-b">
          {header}
        </header>
      )}
      <main className="flex-1 container p-4 overflow-y-auto pb-20 lg:pb-6">
        {children}
      </main>
    </div>
  )
}