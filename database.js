const Database = require('better-sqlite3');
const path = require('path');

const caminhoBanco =
    process.env.DB_PATH ||
    path.join(__dirname, 'rd20.db');

const db = new Database(caminhoBanco);

db.pragma('journal_mode = WAL');

db.prepare(`
    CREATE TABLE IF NOT EXISTS ataques (
        usuario_id TEXT NOT NULL,
        nome_chave TEXT NOT NULL,
        nome TEXT NOT NULL,
        ataque TEXT NOT NULL,
        dano TEXT NOT NULL,

        PRIMARY KEY (usuario_id, nome_chave)
    )
`).run();


// =============================
// SALVAR ATAQUE
// =============================

function salvarAtaque(
    usuarioId,
    nome,
    ataque,
    dano
) {

    const nomeChave =
        nome.toLowerCase();

    const comando = db.prepare(`
        INSERT INTO ataques (
            usuario_id,
            nome_chave,
            nome,
            ataque,
            dano
        )
        VALUES (?, ?, ?, ?, ?)

        ON CONFLICT(usuario_id, nome_chave)
        DO UPDATE SET
            nome = excluded.nome,
            ataque = excluded.ataque,
            dano = excluded.dano
    `);

    comando.run(
        usuarioId,
        nomeChave,
        nome,
        ataque,
        dano
    );
}


// =============================
// BUSCAR ATAQUE
// =============================

function buscarAtaque(
    usuarioId,
    nome
) {

    const nomeChave =
        nome.toLowerCase();

    return db.prepare(`
        SELECT *
        FROM ataques
        WHERE usuario_id = ?
        AND nome_chave = ?
    `).get(
        usuarioId,
        nomeChave
    );
}


// =============================
// LISTAR ATAQUES
// =============================

function listarAtaques(
    usuarioId
) {

    return db.prepare(`
        SELECT *
        FROM ataques
        WHERE usuario_id = ?
        ORDER BY nome ASC
    `).all(
        usuarioId
    );
}


// =============================
// REMOVER ATAQUE
// =============================

function removerAtaque(
    usuarioId,
    nome
) {

    const nomeChave =
        nome.toLowerCase();

    return db.prepare(`
        DELETE FROM ataques
        WHERE usuario_id = ?
        AND nome_chave = ?
    `).run(
        usuarioId,
        nomeChave
    );
}


module.exports = {
    salvarAtaque,
    buscarAtaque,
    listarAtaques,
    removerAtaque
};