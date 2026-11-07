
CREATE TABLE clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    telefone TEXT NOT NULL UNIQUE,
    data_nascimento TEXT NOT NULL,
    cpf TEXT NOT NULL
);