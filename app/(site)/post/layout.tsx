import { TooltipProvider } from "~/shared/ui-kit/tooltip"

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <main className="py-10">{children}</main>
    </TooltipProvider>
  )
}
