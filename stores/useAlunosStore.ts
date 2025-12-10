import { create } from 'zustand';
import config from '@/config';
import { useAuthStore } from './useAuthStore';

export interface Aluno {
  id: number;
  nome: string;
  email: string;
  matricula: string;
  turma?: {
    id: number;
    nome: string;
  };
}

export interface CreateAlunoData {
  nome: string;
  dataNasc: string;
  turmaId: number;
  mensalidade?: number;
}

export interface AlunoDetalhes {
  id: number;
  nome: string;
  dataNasc: string;
  turmaId: number;
  isAtivo: boolean;
  mensalidade: number;
  turma: {
    id: number;
    nome: string;
    turno: string;
  };
  responsaveis: Array<{
    id: number;
    alunoId: number;
    usuarioId: number;
    usuario: {
      id: number;
      nome: string;
      email: string;
    };
  }>;
  diario: any[]; // uso any[] temporáriamente até aplicar a tipagem correta
}

export interface VerificaDiarioResult {
  alunoId: number;
  data: string;
  temDiario: boolean;
  diario: { id: number } | null;
}

interface AlunosState {
  alunos: Aluno[];
  alunosPorTurma: Record<number, Aluno[]>;
  currentAluno: AlunoDetalhes | null;
  isLoading: boolean;
  error: string | null;

  fetchAlunos: () => Promise<void>;
  fetchAlunosByTurma: (turmaId: number) => Promise<Aluno[]>;
  createAluno: (data: CreateAlunoData) => Promise<{ success: boolean; message: string; data?: Aluno }>;
  getAlunoDetalhes: (id: number) => Promise<AlunoDetalhes | null>;
  verificarRegistroDiarioAluno: (alunoId: number, data?: string) => Promise<VerificaDiarioResult | null>;
  adicionarResponsavelAluno: (alunoId: number, usuarioId: number) => Promise<{ success: boolean; message: string }>;
  limparCache: () => void;
}

export const useAlunosStore = create<AlunosState>((set, get) => ({
  alunos: [],
  alunosPorTurma: {},
  currentAluno: null,
  isLoading: false,
  error: null,

  fetchAlunos: async () => {
    set({ isLoading: true, error: null });
    try {
      const authState = useAuthStore.getState();
      const token = authState.token;
      
      const response = await fetch(`${config.API_URL}/alunos`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            set({ isLoading: false });
            return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      set({ alunos: data, isLoading: false, error: null });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error fetching alunos';
      set({ isLoading: false, error: message });
      console.error('Error fetching alunos:', error);
    }
  },

  fetchAlunosByTurma: async (turmaId: number) => {
    set({ isLoading: true, error: null });
    try {
      const authState = useAuthStore.getState();
      const token = authState.token;

      const response = await fetch(`${config.API_URL}/turmas/${turmaId}/alunos`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          console.error('Unauthorized access');
          set({ isLoading: false });
          return [];
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      set((state) => ({
        alunosPorTurma: { ...state.alunosPorTurma, [turmaId]: data },
        isLoading: false,
        error: null
      }));
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error fetching alunos by turma';
      set({ isLoading: false, error: message });
      console.error('Error fetching alunos by turma:', error);
      return [];
    }
  },

  createAluno: async (data: CreateAlunoData) => {
    set({ isLoading: true, error: null });
    try {
      const authState = useAuthStore.getState();
      const token = authState.token;

      const response = await fetch(`${config.API_URL}/alunos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            set({ isLoading: false });
            return { success: false, message: 'Não autorizado' };
        }
        
        const errorData = await response.json().catch(() => null);
        const message = errorData?.message || `Erro ao cadastrar aluno: ${response.status}`;
        set({ isLoading: false, error: message });
        return { success: false, message };
      }

      const responseData = await response.json();
      set({ isLoading: false, error: null });
      return { success: true, message: 'Aluno cadastrado com sucesso', data: responseData };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao cadastrar aluno';
      set({ isLoading: false, error: message });
      console.error('Error creating aluno:', error);
      return { success: false, message: 'Erro ao cadastrar aluno' };
    }
  },

  getAlunoDetalhes: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const authState = useAuthStore.getState();
      const token = authState.token;

      const response = await fetch(`${config.API_URL}/alunos/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
         set({ isLoading: false });
         if (response.status === 404) console.error('Aluno não encontrado');
         return null;
      }

      const data = await response.json();
      set({ currentAluno: data, isLoading: false, error: null });
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao buscar detalhes do aluno';
      set({ isLoading: false, error: message });
      console.error('Erro ao buscar detalhes do aluno:', error);
      return null;
    }
  },

  verificarRegistroDiarioAluno: async (alunoId: number, data?: string) => {
    try {
      const authState = useAuthStore.getState();
      const token = authState.token;
      
      const url = new URL(`${config.API_URL}/alunos/${alunoId}/possui-registro-diario`);
      if (data) {
        url.searchParams.append('data', data);
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) return null;

      const responseData = await response.json();
      return responseData as VerificaDiarioResult;
    } catch (error) {
      console.error('Error verificando registro de diário:', error);
      return null;
    }
  },

  adicionarResponsavelAluno: async (alunoId: number, usuarioId: number) => {
    set({ isLoading: true, error: null });
    try {
        const authState = useAuthStore.getState();
        const token = authState.token;

        const response = await fetch(`${config.API_URL}/usuarios/${usuarioId}/responsavel`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ alunoId }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            set({ isLoading: false });
            return { 
                success: false, 
                message: errorData?.erro || 'Erro ao adicionar responsável' 
            };
        }

        const data = await response.json();
        set({ isLoading: false });
        return { success: true, message: 'Responsável adicionado com sucesso', data };
    } catch (error) {
        set({ isLoading: false, error: 'Erro ao adicionar responsável' });
        return { success: false, message: 'Erro ao adicionar responsável' };
    }
  },

  limparCache: () => {
    set({ alunos: [], alunosPorTurma: {}, currentAluno: null, error: null });
  }
}));
