export type PaginacaoDTO = {
  pagina: number;
  porPagina: number;
  totalItens: number;
};

export type ItensPaginados<TDados> = {
  dados: TDados[];
  paginacao: PaginacaoDTO;
};
