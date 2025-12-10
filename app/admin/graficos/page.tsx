"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { RouteGuard } from "@/components/auth/RouteGuard"
import { ArrowLeft, BarChart3, Users } from "lucide-react"

export default function GraficosPage() {
  const router = useRouter()

  return (
    <RouteGuard allowedRoles={['ADMIN']}>
      <div className="min-h-screen bg-background p-3 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6">
          <Button
            variant="primary"
            size="sm"
            onClick={() => router.push('/admin/dashboard')}
            className="w-full sm:w-auto"
          >
            <span className="sm:inline">Voltar para Dashboard</span>
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold">Gráficos e Estatísticas</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push('/admin/graficos/atividades')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Análise de Atividades
              </CardTitle>
              <CardDescription>
                Visualize o volume de atividades pedagógicas por campo de experiência e turma.
              </CardDescription>
            </CardHeader>
            <CardContent>
               <Button variant="ghost" className="w-full justify-start pl-0 text-blue-600 hover:text-blue-800">
                  Ver Gráficos &rarr;
               </Button>
            </CardContent>
          </Card>

          <Card 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push('/admin/graficos/alunos')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Estatísticas de Alunos
              </CardTitle>
              <CardDescription>
                Acompanhe a quantidade de alunos matriculados por turma.
              </CardDescription>
            </CardHeader>
            <CardContent>
               <Button variant="ghost" className="w-full justify-start pl-0 text-blue-600 hover:text-blue-800">
                  Ver Gráficos &rarr;
               </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </RouteGuard>
  )
}
