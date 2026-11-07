import { ErroAplicacao } from "@/erro/aplicacao";
import { tratarErros } from "@/erro/tratar-erros";
import { ClienteModel } from "@/models/Cliente";

export const POST = tratarErros(async (request: Request) => {
  const body = await request.json();
  let clienteCadastrado = ClienteModel.obterPorTelefone(body.telefone);
  if (clienteCadastrado)
    throw new ErroAplicacao("Cliente já cadastrado com esse telefone");
  clienteCadastrado = ClienteModel.obterPorCPF(body.cpf);
  if (clienteCadastrado)
    throw new ErroAplicacao("Cliente já cadastrado com esse CPF");
  const clienteModel = new ClienteModel(body);
  clienteModel.salvar();
  return Response.json(clienteModel.json(), { status: 201 });
});

export const GET = tratarErros(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const pagina = searchParams.get("pagina");
  if (pagina && +pagina < 1) throw new ErroAplicacao("Página inválida");
  const lista = ClienteModel.listar(pagina ? +pagina : 1);
  return Response.json(lista, { status: 201 });
});
