require('dotenv').config();

const {
    Client,
    GatewayIntentBits,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

const {
    salvarAtaque,
    buscarAtaque,
    listarAtaques,
    removerAtaque
} = require('./database');


// ==================================================
// CLIENTE DO DISCORD
// ==================================================

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});


// ==================================================
// ANALISAR EXPRESSÃO
// ==================================================

function analisarExpressao(expressao) {

    expressao = expressao
        .trim()
        .replace(/\s+/g, '');

    const regex =
        /^(\d+)d(\d+)(kh1|kl1)?([+-]\d+)?$/i;

    const resultado =
        expressao.match(regex);


    if (!resultado) {

        return null;

    }


    return {

        quantidade:
            parseInt(resultado[1]),

        faces:
            parseInt(resultado[2]),

        manter:
            resultado[3]
                ? resultado[3].toLowerCase()
                : null,

        modificador:
            parseInt(resultado[4]) || 0

    };

}


// ==================================================
// VALIDAR EXPRESSÃO
// ==================================================

function validarExpressao(info) {

    if (!info) {

        return '❌ Formato de rolagem inválido.';

    }


    if (
        info.quantidade < 1 ||
        info.quantidade > 100
    ) {

        return '❌ A quantidade de dados deve estar entre **1 e 100**.';

    }


    if (
        info.faces < 2 ||
        info.faces > 1000
    ) {

        return '❌ O dado deve ter entre **2 e 1000 faces**.';

    }


    if (
        info.modificador < -10000 ||
        info.modificador > 10000
    ) {

        return '❌ O modificador deve estar entre **-10000 e +10000**.';

    }


    if (
        info.manter &&
        info.quantidade < 2
    ) {

        return '❌ `kh1` e `kl1` precisam de pelo menos **2 dados**.';

    }


    return null;

}


// ==================================================
// ROLAR DADOS
// ==================================================

function rolarDados(
    quantidade,
    faces
) {

    let dados = [];


    for (
        let i = 0;
        i < quantidade;
        i++
    ) {

        const dado =
            Math.floor(
                Math.random() * faces
            ) + 1;


        dados.push(dado);

    }


    return dados;

}


// ==================================================
// FORMATAR DADO
// ==================================================

function formatarDado(
    dado,
    faces,
    selecionado = true
) {

    let texto = `${dado}`;


    // Crítico / falha crítica
    if (
        selecionado &&
        faces === 20
    ) {

        if (dado === 20) {

            texto =
                `⭐ ${dado}`;

        }


        if (dado === 1) {

            texto =
                `💀 ${dado}`;

        }

    }


    // Dado usado fica em negrito
    if (selecionado) {

        return `**${texto}**`;

    }


    // Dado descartado fica normal
    return texto;

}


// ==================================================
// EXECUTAR ROLAGEM
// ==================================================

function executarRolagem(
    expressao,
    modo = 'normal',
    maiorD20Automatico = false
) {

    const info =
        analisarExpressao(
            expressao
        );


    const erro =
        validarExpressao(
            info
        );


    if (erro) {

        return {
            erro
        };

    }


    let quantidade =
        info.quantidade;


    const faces =
        info.faces;


    const modificador =
        info.modificador;


    let tipoSelecao =
        null;


    // =========================
    // KH1
    // =========================

    if (
        info.manter === 'kh1'
    ) {

        tipoSelecao =
            'maior';

    }


    // =========================
    // KL1
    // =========================

    if (
        info.manter === 'kl1'
    ) {

        tipoSelecao =
            'menor';

    }

    // =========================
    // MAIOR D20 AUTOMÁTICO EM ATAQUES
    // =========================

    if (
        maiorD20Automatico &&
        faces === 20 &&
        quantidade > 1 &&
        !info.manter
    ) {

        tipoSelecao = 'maior';

    }


    // =========================
    // VANTAGEM
    // =========================

    if (
        modo === 'vantagem'
    ) {

        tipoSelecao =
            'maior';


        // Um d20 vira dois d20
        if (
            quantidade === 1 &&
            faces === 20
        ) {

            quantidade = 2;

        }

    }


    // =========================
    // DESVANTAGEM
    // =========================

    if (
        modo === 'desvantagem'
    ) {

        tipoSelecao =
            'menor';


        if (
            quantidade === 1 &&
            faces === 20
        ) {

            quantidade = 2;

        }

    }


    // =========================
    // ROLAGEM
    // =========================

    const dados =
        rolarDados(
            quantidade,
            faces
        );


    let indiceEscolhido =
        null;


    let valorEscolhido =
        null;


    // Maior resultado
    if (
        tipoSelecao === 'maior'
    ) {

        valorEscolhido =
            Math.max(
                ...dados
            );


        indiceEscolhido =
            dados.indexOf(
                valorEscolhido
            );

    }


    // Menor resultado
    if (
        tipoSelecao === 'menor'
    ) {

        valorEscolhido =
            Math.min(
                ...dados
            );


        indiceEscolhido =
            dados.indexOf(
                valorEscolhido
            );

    }


    // =========================
    // TOTAL
    // =========================

    let total = 0;


    if (tipoSelecao) {

        total =
            valorEscolhido +
            modificador;

    }

    else {

        total =
            dados.reduce(
                (soma, dado) =>
                    soma + dado,
                0
            )
            +
            modificador;

    }


    // =========================
    // FORMATAR DADOS
    // =========================

    const dadosFormatados =
        dados.map(
            (dado, indice) => {


                // Rolagem normal
                if (!tipoSelecao) {

                    return formatarDado(
                        dado,
                        faces,
                        true
                    );

                }


                // Dado escolhido
                if (
                    indice ===
                    indiceEscolhido
                ) {

                    return formatarDado(
                        dado,
                        faces,
                        true
                    );

                }


                // Dado descartado
                return formatarDado(
                    dado,
                    faces,
                    false
                );

            }
        );


    // =========================
    // CRÍTICOS
    // =========================

    let critico =
        false;


    let falhaCritica =
        false;


    if (
        faces === 20
    ) {


        // Vantagem / desvantagem
        if (tipoSelecao) {

            if (
                valorEscolhido === 20
            ) {

                critico =
                    true;

            }


            if (
                valorEscolhido === 1
            ) {

                falhaCritica =
                    true;

            }

        }


        // Rolagem normal
        else {

            if (
                dados.includes(20)
            ) {

                critico =
                    true;

            }


            if (
                dados.includes(1)
            ) {

                falhaCritica =
                    true;

            }

        }

    }


    return {

        dados,

        dadosFormatados,

        total,

        faces,

        quantidade,

        modificador,

        tipoSelecao,

        critico,

        falhaCritica

    };

}


// ==================================================
// ATAQUES PENDENTES
// ==================================================

const ataquesPendentes =
    new Map();


// ==================================================
// BOT ONLINE
// ==================================================

client.once(
    'clientReady',
    () => {

        console.log(
            `RD20 está online como ${client.user.tag}!`
        );

    }
);


// ==================================================
// INTERAÇÕES
// ==================================================

client.on(
    'interactionCreate',
    async interaction => {


        // ==================================================
        // AUTOCOMPLETE
        // ==================================================

        if (
            interaction.isAutocomplete()
        ) {


            if (
                interaction.commandName === 'ataque' ||
                interaction.commandName === 'remover-ataque'
            ) {

                const usuario =
                    interaction.user.id;


                const ataquesUsuario =
                    listarAtaques(
                        usuario
                    );


                const digitado =
                    interaction.options
                        .getFocused()
                        .toLowerCase();


                const sugestoes =
                    ataquesUsuario
                        .filter(
                            ataque =>
                                ataque.nome
                                    .toLowerCase()
                                    .includes(
                                        digitado
                                    )
                        )
                        .slice(
                            0,
                            25
                        )
                        .map(
                            ataque => ({

                                name:
                                    ataque.nome,

                                value:
                                    ataque.nome

                            })
                        );


                await interaction.respond(
                    sugestoes
                );


                return;

            }


            return;

        }


        // ==================================================
        // BOTÕES
        // ==================================================

        if (
            interaction.isButton()
        ) {

            const pendente =
                ataquesPendentes.get(
                    interaction.customId
                );


            if (!pendente) {

                await interaction.reply({

                    content:
                        '❌ Essa rolagem expirou.',

                    ephemeral:
                        true

                });


                return;

            }


            // Somente o dono do ataque
            // pode clicar
            if (
                interaction.user.id !==
                pendente.usuario
            ) {

                await interaction.reply({

                    content:
                        '❌ Esse ataque pertence a outro jogador.',

                    ephemeral:
                        true

                });


                return;

            }


            // ==================================================
            // CANCELAR
            // ==================================================

            if (
                pendente.acao ===
                'cancelar'
            ) {

                ataquesPendentes.delete(
                    pendente.idRolar
                );


                ataquesPendentes.delete(
                    pendente.idCancelar
                );


                await interaction.update({

                    content:
                        '❌ Rolagem cancelada.',

                    components:
                        []

                });


                return;

            }


            // ==================================================
            // ROLAR ATAQUE
            // ==================================================

            if (
                pendente.acao ===
                'rolar'
            ) {

                const ataque =
                    executarRolagem(
                        pendente.ataque,
                        pendente.modo,
                        true
                    );


                const dano =
                    executarRolagem(
                        pendente.dano
                    );


                if (
                    ataque.erro ||
                    dano.erro
                ) {

                    await interaction.update({

                        content:
                            '❌ Erro ao interpretar os dados do ataque.',

                        components:
                            []

                    });


                    return;

                }


                let resposta =
                    `⚔️ **${pendente.nome.toUpperCase()}**\n\n`;


                // ==================================================
                // ATAQUE
                // ==================================================

                resposta +=
                    `🎯 **Ataque — ${pendente.ataque.toUpperCase()}**\n`;


                if (
                    ataque.quantidade === 1
                ) {

                    resposta +=
                        `Dado: ${ataque.dadosFormatados[0]}\n`;

                }

                else {

                    resposta +=
                        `Dados: [${ataque.dadosFormatados.join(', ')}]\n`;

                }


                if (
                    ataque.modificador !== 0
                ) {

                    resposta +=
                        `Bônus: **${ataque.modificador > 0 ? '+' : ''}${ataque.modificador}**\n`;

                }


                resposta +=
                    `**Resultado: ${ataque.total}**\n`;


                if (
                    ataque.critico
                ) {

                    resposta +=
                        '🔥 **CRÍTICO NATURAL!**\n';

                }


                if (
                    ataque.falhaCritica
                ) {

                    resposta +=
                        '💀 **FALHA CRÍTICA!**\n';

                }


                // ==================================================
                // DANO
                // ==================================================

                resposta +=
                    `\n🩸 **Dano — ${pendente.dano.toUpperCase()}**\n`;


                if (
                    dano.quantidade === 1
                ) {

                    resposta +=
                        `Dado: ${dano.dadosFormatados[0]}\n`;

                }

                else {

                    resposta +=
                        `Dados: [${dano.dadosFormatados.join(', ')}]\n`;

                }


                if (
                    dano.modificador !== 0
                ) {

                    resposta +=
                        `Bônus: **${dano.modificador > 0 ? '+' : ''}${dano.modificador}**\n`;

                }


                resposta +=
                    `**Resultado: ${dano.total}**`;


                // Apaga os botões pendentes
                ataquesPendentes.delete(
                    pendente.idRolar
                );


                ataquesPendentes.delete(
                    pendente.idCancelar
                );


                await interaction.update({

                    content:
                        resposta,

                    components:
                        []

                });


                return;

            }

        }


        // ==================================================
        // SLASH COMMANDS
        // ==================================================

        if (
            !interaction.isChatInputCommand()
        ) {

            return;

        }


        // ==================================================
        // /SALVAR-ATAQUE
        // ==================================================

        if (
            interaction.commandName ===
            'salvar-ataque'
        ) {

            const nome =
                interaction.options
                    .getString('nome')
                    .trim();


            const ataque =
                interaction.options
                    .getString('ataque')
                    .trim();


            const dano =
                interaction.options
                    .getString('dano')
                    .trim();


            // =========================
            // VALIDA ATAQUE
            // =========================

            const infoAtaque =
                analisarExpressao(
                    ataque
                );


            const erroAtaque =
                validarExpressao(
                    infoAtaque
                );


            if (
                erroAtaque
            ) {

                await interaction.reply(
                    `❌ Ataque inválido.\n${erroAtaque}\nExemplo: \`1d20+5\`.`
                );


                return;

            }


            // =========================
            // VALIDA DANO
            // =========================

            const infoDano =
                analisarExpressao(
                    dano
                );


            const erroDano =
                validarExpressao(
                    infoDano
                );


            if (
                erroDano
            ) {

                await interaction.reply(
                    `❌ Dano inválido.\n${erroDano}\nExemplo: \`1d10+3\`.`
                );


                return;

            }


            const usuario =
                interaction.user.id;


            // =========================
            // SALVA NO SQLITE
            // =========================

            salvarAtaque(
                usuario,
                nome,
                ataque,
                dano
            );


            await interaction.reply(

                `✅ **${nome}** foi salvo!\n\n` +

                `🎯 Ataque: \`${ataque}\`\n` +

                `🩸 Dano: \`${dano}\``

            );


            return;

        }


        // ==================================================
        // /LISTAR-ATAQUES
        // ==================================================

        if (
            interaction.commandName ===
            'listar-ataques'
        ) {

            const usuario =
                interaction.user.id;


            const ataquesUsuario =
                listarAtaques(
                    usuario
                );


            if (
                ataquesUsuario.length === 0
            ) {

                await interaction.reply(
                    '📭 Você ainda não possui nenhum ataque salvo.'
                );


                return;

            }


            let resposta =
                '⚔️ **Seus ataques salvos**\n\n';


            let numero =
                1;


            for (
                const ataque
                of ataquesUsuario
            ) {

                resposta +=
                    `**${numero}. ${ataque.nome}**\n`;


                resposta +=
                    `🎯 Ataque: \`${ataque.ataque}\`\n`;


                resposta +=
                    `🩸 Dano: \`${ataque.dano}\`\n\n`;


                numero++;

            }


            await interaction.reply(
                resposta
            );


            return;

        }


        // ==================================================
        // /REMOVER-ATAQUE
        // ==================================================

        if (
            interaction.commandName ===
            'remover-ataque'
        ) {

            const nome =
                interaction.options
                    .getString('nome')
                    .trim();


            const usuario =
                interaction.user.id;


            const ataqueSalvo =
                buscarAtaque(
                    usuario,
                    nome
                );


            if (
                !ataqueSalvo
            ) {

                await interaction.reply(
                    `❌ Você não possui um ataque chamado **${nome}**.`
                );


                return;

            }


            removerAtaque(
                usuario,
                nome
            );


            await interaction.reply(
                `🗑️ **${ataqueSalvo.nome}** foi removido dos seus ataques.`
            );


            return;

        }


        // ==================================================
        // /ATAQUE
        // ==================================================

        if (
            interaction.commandName ===
            'ataque'
        ) {

            const nome =
                interaction.options
                    .getString('nome')
                    .trim();


            const modo =
                interaction.options
                    .getString('modo')
                || 'normal';


            const usuario =
                interaction.user.id;


            // =========================
            // BUSCA NO SQLITE
            // =========================

            const ataqueSalvo =
                buscarAtaque(
                    usuario,
                    nome
                );


            if (
                !ataqueSalvo
            ) {

                await interaction.reply(
                    `❌ Você não possui um ataque chamado **${nome}**.`
                );


                return;

            }


            // ==================================================
            // PREVIEW
            // ==================================================

            let ataquePreview =
                ataqueSalvo.ataque;


            const infoAtaque =
                analisarExpressao(
                    ataqueSalvo.ataque
                );


            // Mostra 2d20 na prévia
            // quando houver vantagem ou desvantagem
            if (
                infoAtaque &&
                infoAtaque.quantidade === 1 &&
                infoAtaque.faces === 20 &&
                (
                    modo === 'vantagem' ||
                    modo === 'desvantagem'
                )
            ) {

                ataquePreview =
                    `2d20${

                        infoAtaque.modificador !== 0

                            ? (
                                infoAtaque.modificador > 0
                                    ? '+'
                                    : ''
                            ) +
                            infoAtaque.modificador

                            : ''

                    }`;

            }


            const idRolar =
                `rolar_${interaction.id}`;


            const idCancelar =
                `cancelar_${interaction.id}`;


            // ==================================================
            // BOTÃO ROLAR
            // ==================================================

            ataquesPendentes.set(
                idRolar,
                {

                    acao:
                        'rolar',

                    usuario,

                    nome:
                        ataqueSalvo.nome,

                    ataque:
                        ataqueSalvo.ataque,

                    dano:
                        ataqueSalvo.dano,

                    modo,

                    idRolar,

                    idCancelar

                }
            );


            // ==================================================
            // BOTÃO CANCELAR
            // ==================================================

            ataquesPendentes.set(
                idCancelar,
                {

                    acao:
                        'cancelar',

                    usuario,

                    idRolar,

                    idCancelar

                }
            );


            const botaoRolar =
                new ButtonBuilder()

                    .setCustomId(
                        idRolar
                    )

                    .setLabel(
                        'Rolar'
                    )

                    .setEmoji(
                        '🎲'
                    )

                    .setStyle(
                        ButtonStyle.Primary
                    );


            const botaoCancelar =
                new ButtonBuilder()

                    .setCustomId(
                        idCancelar
                    )

                    .setLabel(
                        'Cancelar'
                    )

                    .setStyle(
                        ButtonStyle.Secondary
                    );


            const botoes =
                new ActionRowBuilder()

                    .addComponents(
                        botaoRolar,
                        botaoCancelar
                    );


            let resposta =
                `⚔️ **${ataqueSalvo.nome}**\n\n`;


            resposta +=
                `🎯 Ataque: \`${ataquePreview}\``;


            if (
                modo === 'vantagem'
            ) {

                resposta +=
                    ' — **Vantagem**';

            }


            if (
                modo === 'desvantagem'
            ) {

                resposta +=
                    ' — **Desvantagem**';

            }


            resposta +=
                `\n🩸 Dano: \`${ataqueSalvo.dano}\`\n\n`;


            resposta +=
                'Confirmar rolagem?';


            await interaction.reply({

                content:
                    resposta,

                components:
                    [botoes]

            });


            return;

        }


        // ==================================================
        // /ROLL
        // ==================================================

        if (
            interaction.commandName ===
            'roll'
        ) {

            let expressao =
                interaction.options
                    .getString('expressao')
                    .trim();


            let modo =
                'normal';


            // =========================
            // VANTAGEM
            // =========================

            if (
                /\s+vantagem$/i
                    .test(expressao)
            ) {

                modo =
                    'vantagem';


                expressao =
                    expressao.replace(
                        /\s+vantagem$/i,
                        ''
                    );

            }


            // =========================
            // DESVANTAGEM
            // =========================

            if (
                /\s+desvantagem$/i
                    .test(expressao)
            ) {

                modo =
                    'desvantagem';


                expressao =
                    expressao.replace(
                        /\s+desvantagem$/i,
                        ''
                    );

            }


            // =========================
            // ADV
            // =========================

            if (
                /\s+adv$/i
                    .test(expressao)
            ) {

                modo =
                    'vantagem';


                expressao =
                    expressao.replace(
                        /\s+adv$/i,
                        ''
                    );

            }


            // =========================
            // DIS
            // =========================

            if (
                /\s+dis$/i
                    .test(expressao)
            ) {

                modo =
                    'desvantagem';


                expressao =
                    expressao.replace(
                        /\s+dis$/i,
                        ''
                    );

            }


            const resultado =
                executarRolagem(
                    expressao,
                    modo
                );


            if (
                resultado.erro
            ) {

                await interaction.reply(

                    resultado.erro +

                    '\nExemplos: `1d20`, `2d6+3`, `2d20 vantagem`.'

                );


                return;

            }


            // =========================
            // TÍTULO
            // =========================

            let titulo =
                expressao.toUpperCase();


            if (
                modo === 'vantagem'
            ) {

                titulo +=
                    ' — VANTAGEM';

            }


            if (
                modo === 'desvantagem'
            ) {

                titulo +=
                    ' — DESVANTAGEM';

            }


            // =========================
            // RESPOSTA
            // =========================

            let resposta =
                `🎲 **${titulo}**\n`;


            if (
                resultado.quantidade === 1
            ) {

                resposta +=
                    `Dado: ${resultado.dadosFormatados[0]}\n`;

            }

            else {

                resposta +=
                    `Dados: [${resultado.dadosFormatados.join(', ')}]\n`;

            }


            if (
                resultado.modificador !== 0
            ) {

                resposta +=
                    `Modificador: **${resultado.modificador > 0 ? '+' : ''}${resultado.modificador}**\n`;

            }


            resposta +=
                `\n**Resultado: ${resultado.total}**`;


            if (
                resultado.critico
            ) {

                resposta +=
                    '\n🔥 **CRÍTICO NATURAL!**';

            }


            if (
                resultado.falhaCritica
            ) {

                resposta +=
                    '\n💀 **FALHA CRÍTICA!**';

            }


            await interaction.reply(
                resposta
            );


            return;

        }

    }
);


// ==================================================
// LOGIN
// ==================================================

client.login(
    process.env.DISCORD_TOKEN
);