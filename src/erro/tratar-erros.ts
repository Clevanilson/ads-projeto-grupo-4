import { ErroAplicacao } from "./aplicacao";
import { ErroDominio } from "./dominio";

type Handler = (request: Request) => Promise<Response>;

export function tratarErros(callback: Handler): Handler {
  return async (request: Request) => {
    try {
      return await callback(request);
    } catch (e) {
      if (e instanceof ErroDominio) {
        return Response.json({ mensagem: e.message }, { status: 400 });
      }
      if (e instanceof ErroAplicacao) {
        return Response.json({ mensagem: e.message }, { status: 400 });
      } else {
        return Response.json(
          { mensagem: "Erro inesperado, tente novamente" },
          { status: 500 },
        );
      }
    }
  };
}
