import prisma from "@/lib/db";
import * as estoqueRepository from '@/repositories/estoque.repository';

type CreateStockMovementInput = {
  produto_id: bigint;
  tipo: 'entrada' | 'saida';
  quantidade: number;
};

export const createStockMovement = async (data: CreateStockMovementInput) => {
    const { produto_id, tipo, quantidade } = data;

    if (quantidade <= 0) {
        throw new Error('Quantidade deve ser maior que zero');
    }

    return prisma.$transaction(async (tx) => {
        let estoque = await estoqueRepository.findByProdutoId(produto_id);

        if (!estoque) {
            
            estoque = await tx.estoque.create({
                data: {
                    produto_id,
                    quantidade: 0,
                },
            });
        }

        let newQuantity = estoque.quantidade;

        if (tipo === 'entrada') {
            newQuantity += quantidade;
        }

        if (tipo === 'saida') {
            newQuantity -= quantidade;

            if (newQuantity < 0) {
                throw new Error('Estoque não pode ficar negativo');
            }
        }

        const updatedEstoque = await tx.estoque.update({
            where: { produto_id },
            data: { quantidade: newQuantity },
        });

        const stockMovement = await tx.estoque_movimentacoes.create({
            data: {
                produto_id,
                tipo,
                quantidade,
            },
        });

        return {
            estoque: updatedEstoque,
            stockMovement,
        };
    });
};