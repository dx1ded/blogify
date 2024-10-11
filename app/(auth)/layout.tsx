import { Container } from "~/shared/ui/Container"
import { Logo } from "~/shared/ui/Logo"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 top-1/4 h-[50vh] w-[100vw] rotate-12 transform rounded-full bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 opacity-20 blur-3xl" />
      </div>
      <Container className="z-10 flex w-full flex-1 flex-col items-start justify-between py-4">
        <header>
          <Logo />
        </header>
        <main className="flex w-full justify-center">{children}</main>
        {/* Empty container to center the <main> */}
        <div className="h-9" />
      </Container>
    </div>
  )
}
