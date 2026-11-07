CREATE TABLE cupons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER NOT NULL,
    codigo TEXT UNIQUE NOT NULL,
    desconto_pix REAL DEFAULT 10.0,
    desconto_cartao REAL DEFAULT 5.0,
    data_emissao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_validade DATETIME NOT NULL,
    status TEXT DEFAULT 'ATIVO',

    FOREIGN KEY (cliente_id) REFERENCES clientes(id),

    CHECK (status IN ('ATIVO', 'UTILIZADO', 'EXPIRADO'))
);