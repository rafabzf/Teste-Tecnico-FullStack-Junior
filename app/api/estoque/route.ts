import { NextResponse } from "next/server";
import * as estoqueRepository from '@/repositories/estoque.repository';

export async function GET() {
    try {
        const stock = await estoqueRepository.findAll();

        const serialized = JSON.parse(
            JSON.stringify(stock, (key, value) => typeof value === 'bigint' ? value.toString() : value));

        return NextResponse.json(serialized, { status: 200 });
    } catch (error) {
        console.error(error);

        return NextResponse.json({ error: 'Falha ao listar estado do estoque' }, { status: 500 });
    }
}