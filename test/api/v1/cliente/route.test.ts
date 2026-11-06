import { describe, test, expect } from "vitest";

describe("POST /api/v1/cliente", () => {
  test("Com sucesso", async () => {
    const body = {
      nome: "Nome teste",
      telefone: Math.floor(Math.random() * 100000000000),
      data_nascimento: "2000-12-01T00:00:00.000Z",
    };
    const response = await fetch("http://localhost:3000/api/v1/cliente", {
      method: "POST",
      body: JSON.stringify(body),
    });
    expect(await response.json()).toEqual({ ...body, id: expect.any(Number) });
    expect(response.status).toBe(201);
  });
});
