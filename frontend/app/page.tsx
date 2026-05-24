import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBasket } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-8 text-center px-4">
        <ShoppingBasket className="w-20 h-20 text-primary" strokeWidth={1.5} />

        <div className="space-y-3">
          <h1 className="text-5xl font-bold tracking-tight">Cesta Inteligente</h1>
          <p className="text-muted-foreground text-lg max-w-sm">
            Monte sua lista de compras e encontre os melhores preços do mercado.
          </p>
        </div>

        <Button asChild size="lg" className="px-12 text-base">
          <Link href="/supermercados">Iniciar</Link>
        </Button>
      </div>
    </main>
  );
}
