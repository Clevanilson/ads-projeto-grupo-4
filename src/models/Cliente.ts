import { DB } from "@/infra/database/connection";
import { ErroDominio } from "../erro/dominio";
import { ItensPaginados } from "@/types/paginacao";

export class ClienteModel {
  private id?: number;
  private nome: string;
  private telefone: string;
  private cpf: string;
  private dataNascimento: Date;

  constructor(input: ClienteDTO) {
    this.id = input.id;
    this.nome = input.nome.trim();
    this.telefone = input.telefone;
    this.cpf = input.cpf.replace(/\D/g, "");
    this.dataNascimento = new Date(input.data_nascimento);

    if (!this.validarNome()) throw new ErroDominio("Nome inválido");
    if (!this.validarTelefone()) throw new ErroDominio("Telefone inválido");
    if (!this.validarCPF()) throw new ErroDominio("CPF inválido");
    if (!this.validarDataNascimento())
      throw new ErroDominio("Data de nascimento inválida");
  }

  static obterPorTelefone(telefone: string): ClienteModel | undefined {
    const [row] = DB.obter(`SELECT * FROM clientes WHERE telefone = ?`, [
      telefone,
    ]);

    return row ? new ClienteModel(row) : undefined;
  }

  static obterPorCPF(cpf: string): ClienteModel | undefined {
    const [row] = DB.obter(`SELECT * FROM clientes WHERE cpf = ?`, [cpf]);

    return row ? new ClienteModel(row) : undefined;
  }

  static listar(pagina: number): ItensPaginados<ClienteDTO> {
    const porPagina = 5;

    const rows = DB.obter(`SELECT * FROM clientes LIMIT ? OFFSET ?`, [
      porPagina,
      (pagina - 1) * porPagina,
    ]);

    const [row] = DB.obter("SELECT count(*) as totalItens FROM clientes");

    const { totalItens } = row;
    const dados: ClienteDTO[] = [];

    rows.forEach((row) => {
      const model = new ClienteModel(row);
      dados.push(model.json());
    });

    return { dados, paginacao: { porPagina, pagina, totalItens } };
  }

  salvar(): ClienteDTO {
    const [row] = DB.obter(
      `
        INSERT INTO clientes (nome, telefone, cpf, data_nascimento)
        VALUES (?, ?, ?, ?)
        RETURNING id
      `,
      [this.nome, this.telefone, this.cpf, this.dataNascimento.toISOString()],
    );

    this.id = row.id;
    return this.json();
  }

  private validarNome(): boolean {
    if (this.nome.length < 3) return false;
    return /^[\p{L}\s]+$/u.test(this.nome);
  }

  private validarTelefone(): boolean {
    return /^\d{11}$/.test(this.telefone);
  }

  private validarCPF(): boolean {
    if (!/^\d{11}$/.test(this.cpf)) return false;
    if (/^(\d)\1{10}$/.test(this.cpf)) return false;

    const calcularDigito = (base: string, pesoInicial: number): number => {
      let soma = 0;

      for (let i = 0; i < base.length; i++) {
        soma += Number(base[i]) * (pesoInicial - i);
      }

      const resto = (soma * 10) % 11;
      return resto === 10 ? 0 : resto;
    };

    const primeiroDigito = calcularDigito(this.cpf.substring(0, 9), 10);
    if (primeiroDigito !== Number(this.cpf[9])) return false;
    const segundoDigito = calcularDigito(this.cpf.substring(0, 10), 11);
    return segundoDigito === Number(this.cpf[10]);
  }

  private validarDataNascimento(): boolean {
    if (Number.isNaN(this.dataNascimento.getTime())) return false;

    const hoje = new Date();

    const hojeUTC = new Date(
      Date.UTC(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()),
    );

    if (this.dataNascimento > hojeUTC) return false;

    const dataLimite = new Date(hojeUTC);
    dataLimite.setUTCFullYear(dataLimite.getUTCFullYear() - 120);

    if (this.dataNascimento < dataLimite) return false;

    return true;
  }

  json(): ClienteDTO {
    return {
      id: this.id,
      nome: this.nome,
      telefone: this.telefone,
      cpf: this.cpf,
      data_nascimento: this.dataNascimento.toISOString(),
    };
  }
}

export type ClienteDTO = {
  id?: number;
  nome: string;
  data_nascimento: string;
  telefone: string;
  cpf: string;
};
