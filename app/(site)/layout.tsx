import { Container } from "~/shared/ui/Container"
import { Header } from "~/shared/ui/Header"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Container>
      <Header />
      <main className="py-10">{children}</main>
    </Container>
  )
}
