export class ErroDominio extends Error {
  constructor(mensagem: string) {
    super(mensagem);
  }
}
