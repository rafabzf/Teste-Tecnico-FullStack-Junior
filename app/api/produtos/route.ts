import { NextResponse } from 'next/server';
import * as service from '@/services/produtos.service';

export async function GET() {
  try {
    const produtos = await service.getAllProdutos();

    const produtosSerialized = JSON.parse(
      JSON.stringify(produtos, (key, value) => 
        typeof value === 'bigint' ? value.toString(): value
      )
    );

    return NextResponse.json(produtosSerialized, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Falha ao listar produtos' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sku, nome, categoria_id, estoque_minimo, marca } = body;

    if (!sku || !nome) {
      return NextResponse.json({ error: 'SKU e Nome são obrigatórios' }, { status: 400 });
    }

    const newProduto = await service.createProduto({
      sku,
      nome,
      categoria_id: categoria_id ? BigInt(categoria_id) : null,
      estoque_minimo,
      marca,
    });
    const newProdutoSerialized = JSON.parse(
      JSON.stringify(newProduto, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );
    return NextResponse.json(newProdutoSerialized, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Falha ao criar produto' }, { status: 500 });
  }
}
