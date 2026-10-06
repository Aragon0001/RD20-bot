const {
    Pool
} = require('pg');


const db =
    new Pool({

        connectionString:
            process.env.DATABASE_URL,

        ssl: {
            rejectUnauthorized: false
        }

    });


// ==================================================
// ATAQUES
// ==================================================

async function salvarAtaque(
    usuarioId,
    nome,
    ataque,
    dano
) {

    const nomeChave =
        nome.toLowerCase().trim();


    await db.query(
        `
        INSERT INTO ataques (
            usuario_id,
            nome_chave,
            nome,
            ataque,
            dano
        )

        VALUES (
            $1,
            $2,
            $3,
            $4,
            $5
        )

        ON CONFLICT (
            usuario_id,
            nome_chave
        )

        DO UPDATE SET
            nome = EXCLUDED.nome,
            ataque = EXCLUDED.ataque,
            dano = EXCLUDED.dano
        `,
        [
            usuarioId,
            nomeChave,
            nome,
            ataque,
            dano
        ]
    );

}


async function buscarAtaque(
    usuarioId,
    nome
) {

    const nomeChave =
        nome.toLowerCase().trim();


    const resultado =
        await db.query(
            `
            SELECT
                usuario_id,
                nome_chave,
                nome,
                ataque,
                dano

            FROM ataques

            WHERE usuario_id = $1
            AND nome_chave = $2
            `,
            [
                usuarioId,
                nomeChave
            ]
        );


    return resultado.rows[0];

}


async function listarAtaques(
    usuarioId
) {

    const resultado =
        await db.query(
            `
            SELECT
                usuario_id,
                nome_chave,
                nome,
                ataque,
                dano

            FROM ataques

            WHERE usuario_id = $1

            ORDER BY nome
            `,
            [
                usuarioId
            ]
        );


    return resultado.rows;

}


async function removerAtaque(
    usuarioId,
    nome
) {

    const nomeChave =
        nome.toLowerCase().trim();


    const resultado =
        await db.query(
            `
            DELETE FROM ataques

            WHERE usuario_id = $1
            AND nome_chave = $2
            `,
            [
                usuarioId,
                nomeChave
            ]
        );


    return resultado;

}


// ==================================================
// ROLAGENS
// ==================================================

async function salvarRolagem(
    usuarioId,
    nome,
    rolagem
) {

    const nomeChave =
        nome.toLowerCase().trim();


    await db.query(
        `
        INSERT INTO rolagens (
            usuario_id,
            nome_chave,
            nome,
            rolagem
        )

        VALUES (
            $1,
            $2,
            $3,
            $4
        )

        ON CONFLICT (
            usuario_id,
            nome_chave
        )

        DO UPDATE SET
            nome = EXCLUDED.nome,
            rolagem = EXCLUDED.rolagem
        `,
        [
            usuarioId,
            nomeChave,
            nome,
            rolagem
        ]
    );

}


async function buscarRolagem(
    usuarioId,
    nome
) {

    const nomeChave =
        nome.toLowerCase().trim();


    const resultado =
        await db.query(
            `
            SELECT
                usuario_id,
                nome_chave,
                nome,
                rolagem

            FROM rolagens

            WHERE usuario_id = $1
            AND nome_chave = $2
            `,
            [
                usuarioId,
                nomeChave
            ]
        );


    return resultado.rows[0];

}


async function listarRolagens(
    usuarioId
) {

    const resultado =
        await db.query(
            `
            SELECT
                usuario_id,
                nome_chave,
                nome,
                rolagem

            FROM rolagens

            WHERE usuario_id = $1

            ORDER BY nome
            `,
            [
                usuarioId
            ]
        );


    return resultado.rows;

}


async function removerRolagem(
    usuarioId,
    nome
) {

    const nomeChave =
        nome.toLowerCase().trim();


    const resultado =
        await db.query(
            `
            DELETE FROM rolagens

            WHERE usuario_id = $1
            AND nome_chave = $2
            `,
            [
                usuarioId,
                nomeChave
            ]
        );


    return resultado;

}

// ==================================================
// SALVAR ROLAGEM
// ==================================================

async function salvarRolagem(
    usuarioId,
    nome,
    rolagem
) {

    const nomeChave =
        nome.toLowerCase().trim();


    await db.query(
        `
        INSERT INTO rolagens (
            usuario_id,
            nome_chave,
            nome,
            rolagem
        )

        VALUES (
            $1,
            $2,
            $3,
            $4
        )

        ON CONFLICT (
            usuario_id,
            nome_chave
        )

        DO UPDATE SET
            nome = EXCLUDED.nome,
            rolagem = EXCLUDED.rolagem
        `,
        [
            usuarioId,
            nomeChave,
            nome,
            rolagem
        ]
    );

}


// ==================================================
// BUSCAR ROLAGEM
// ==================================================

async function buscarRolagem(
    usuarioId,
    nome
) {

    const nomeChave =
        nome.toLowerCase().trim();


    const resultado =
        await db.query(
            `
            SELECT
                usuario_id,
                nome_chave,
                nome,
                rolagem

            FROM rolagens

            WHERE usuario_id = $1
            AND nome_chave = $2
            `,
            [
                usuarioId,
                nomeChave
            ]
        );


    return resultado.rows[0];

}


// ==================================================
// LISTAR ROLAGENS
// ==================================================

async function listarRolagens(
    usuarioId
) {

    const resultado =
        await db.query(
            `
            SELECT
                usuario_id,
                nome_chave,
                nome,
                rolagem

            FROM rolagens

            WHERE usuario_id = $1

            ORDER BY nome
            `,
            [
                usuarioId
            ]
        );


    return resultado.rows;

}

// ==================================================
// EXPORTS
// ==================================================

module.exports = {

    salvarAtaque,
    buscarAtaque,
    listarAtaques,
    removerAtaque,

    salvarRolagem,
    buscarRolagem,
    listarRolagens,
    removerRolagem

};