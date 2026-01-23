import { NextResponse } from 'next/server';
import * as estoqueService from '@/services/estoque.service';
import * as movimentacoesRepository from '@/repositories/estoqueMovimentacoes.repository';

export async function GET() {
    try {
        const movements = await movimentacoesRepository.findAll();

        const serialized = JSON.parse(
            JSON.stringify(movements, (key, value) => typeof value === 'bigint' ? value.toString() : value)
        );

        return NextResponse.json(serialized, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json( { error: 'Falha ao listar movimentações de estoque' }, { status:500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { produto_id, tipo, quantidade } = body;

        if (!produto_id || !tipo || !quantidade) {
            return NextResponse.json({ error: 'produto_id, tipo e quantidade são obrigatórios' }, { status: 400 });
        }

        if (!['entrada', 'saida'].includes(tipo)) {
            return NextResponse.json({ error: 'Tipo de movimentação inválido' }, { status: 400 });
        }

        const result = await estoqueService.createStockMovement({
            produto_id: BigInt(produto_id),
            tipo,
            quantidade,
        });

        const serialized = JSON.parse(
            JSON.stringify(result, (key, value) => typeof value === 'bigint' ? value.toString() : value)
        );

        return NextResponse.json(serialized, { status: 201 });
    } catch (error) {
        console.error(error);

        return NextResponse.json({
            error: 
                error instanceof Error ? error.message : 'Erro ao criar movimentação de estoque' }, { status: 500 });
    }
}