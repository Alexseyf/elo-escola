"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RouteGuard } from "@/components/auth/RouteGuard"
import { ArrowLeft } from "lucide-react"
import AlunosChart from "@/app/admin/components/AlunosChart"

export default function AlunosGraficosPage() {
  const router = useRouter()

  return (
    <RouteGuard allowedRoles={['ADMIN']}>
      <div className="min-h-screen bg-background p-3 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6">
          <Button
            variant="primary"
            size="sm"
            onClick={() => router.back()} 
            className="w-full sm:w-auto"
          >
            <span className="sm:inline">Voltar</span>
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold">Estatísticas de Alunos</h1>
        </div>

        <Card className="mb-6 w-full">
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Quantidade de Alunos por Turma</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <AlunosChart />
          </CardContent>
        </Card>
      </div>
    </RouteGuard>
  )
}
