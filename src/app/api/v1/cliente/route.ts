import { ErroAplicacao } from "@/erro/aplicacao";
import { tratarErros } from "@/erro/tratar-erros";
import { ClienteDTO, ClienteModel } from "@/models/Cliente";

export const POST = tratarErros(async (request: Request) => {
  const body = await request.json();
  const clienteCadastrado = ClienteModel.obterPorTelefone(body.telefone);
  if (clienteCadastrado)
    throw new ErroAplicacao("Cliente já cadastrado com esse telefone");
  const clienteModel = new ClienteModel(body);
  clienteModel.salvar();
  return Response.json(clienteModel.json(), { status: 201 });
});
