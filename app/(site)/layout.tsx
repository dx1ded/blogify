import { Container } from "~/shared/ui/Container"
import { Header } from "~/shared/ui/Header"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Container>
      <Header />
      {children}
    </Container>
  )
}
