import prisma from "@/lib/db";
import { estoque_movimentacoes } from "@/generated/prisma/client";

export const findAll = async (): Promise<estoque_movimentacoes[]> => {
    return prisma.estoque_movimentacoes.findMany({
        orderBy: { criado_em: 'desc' },
        include: { produtos: true },
    });
};

export const findByProdutoId = async (produto_id: bigint) => {
  return prisma.estoque_movimentacoes.findMany({
    where: { produto_id },
    orderBy: { criado_em: 'desc' },
  });
};

export const create = async (data: Omit<estoque_movimentacoes, 'id' | 'criado_em'>): Promise<estoque_movimentacoes> => {
    return prisma.estoque_movimentacoes.create({
        data,
    });
};