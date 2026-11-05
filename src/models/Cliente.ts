import { DB } from "@/infra/database/connection";
import { ErroDominio } from "../erro/dominio";
import { throwDeprecation } from "process";

export class ClienteModel {
  private id?: number;
  private nome: string;
  private telefone: string;
  private dataNascimento: Date;

  constructor(input: ClienteDTO) {
    this.nome = input.nome.trim();
    this.telefone = input.telefone;
    this.dataNascimento = new Date(input.data_nascimento);
    if (!this.validarNome()) throw new ErroDominio("Nome inválido");
    if (!this.validarTelefone()) throw new ErroDominio("Telefone inválido");
    if (!this.validarDataNascimento())
      throw new ErroDominio("Data de nascimento inválida");
  }

  static obterPorTelefone(telefone: string): ClienteModel | undefined {
    const [row] = DB.obter(`SELECT * from clientes WHERE telefone = ?`, [
      telefone,
    ]);
    return row ? new ClienteModel(row) : undefined;
  }

  salvar(): ClienteDTO {
    const [row] = DB.obter(
      `
        INSERT INTO clientes (nome, telefone, data_nascimento)
        VALUES (?, ?, ?)
        RETURNING id
    `,
      [this.nome, this.telefone, this.dataNascimento.toISOString()],
    );
    return this.json();
  }

  private validarNome(): boolean {
    if (this.nome.length < 3) return false;
    if (!/^([a-zA-Z\s])+$/g.test(this.nome)) return false;
    return true;
  }

  private validarTelefone(): boolean {
    if (!/^\d{11}$/g.test(this.telefone)) return false;
    return true;
  }

  private validarDataNascimento(): boolean {
    if (!this.dataNascimento.toISOString()) return false;
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
      data_nascimento: this.dataNascimento.toISOString(),
    };
  }
}

export type ClienteDTO = {
  id?: number;
  nome: string;
  data_nascimento: string;
  telefone: string;
};
