require('dotenv').config();

const {
    REST,
    Routes,
    SlashCommandBuilder
} = require('discord.js');


// ==================================================
// COMANDOS
// ==================================================

const commands = [


    // ==================================================
    // /ROLL
    // ==================================================

    new SlashCommandBuilder()

        .setName('roll')

        .setDescription('Rola dados de RPG')

        .addStringOption(option =>

            option

                .setName('expressao')

                .setDescription(
                    'Ex: 1d20, 2d6+3, 2d20 vantagem'
                )

                .setRequired(true)

        ),


    // ==================================================
    // /SALVAR-ATAQUE
    // ==================================================

    new SlashCommandBuilder()

        .setName('salvar-ataque')

        .setDescription(
            'Salva um ataque para usar depois'
        )

        .addStringOption(option =>

            option

                .setName('nome')

                .setDescription(
                    'Nome do ataque ou arma'
                )

                .setRequired(true)

        )

        .addStringOption(option =>

            option

                .setName('ataque')

                .setDescription(
                    'Rolagem de ataque. Ex: 1d20+5 ou 3d20+5'
                )

                .setRequired(true)

        )

        .addStringOption(option =>

            option

                .setName('dano')

                .setDescription(
                    'Rolagem de dano. Ex: 1d10+3'
                )

                .setRequired(true)

        ),


    // ==================================================
    // /ATAQUE
    // ==================================================

    new SlashCommandBuilder()

        .setName('ataque')

        .setDescription(
            'Usa um ataque salvo'
        )

        .addStringOption(option =>

            option

                .setName('nome')

                .setDescription(
                    'Nome do ataque salvo'
                )

                .setRequired(true)

                .setAutocomplete(true)

        )

        .addStringOption(option =>

            option

                .setName('modo')

                .setDescription(
                    'Modo da rolagem'
                )

                .addChoices(

                    {
                        name: 'Normal',
                        value: 'normal'
                    },

                    {
                        name: 'Vantagem',
                        value: 'vantagem'
                    },

                    {
                        name: 'Desvantagem',
                        value: 'desvantagem'
                    }

                )

        ),


        new SlashCommandBuilder()

            .setName('salvar-rolagem')

            .setDescription(
                'Salva uma rolagem para usar depois'
            )

            .addStringOption(option =>

                option
                    .setName('nome')
                    .setDescription(
                        'Nome da rolagem. Ex: Iniciativa'
                    )
                    .setRequired(true)

            )

            .addStringOption(option =>

                option
                    .setName('rolagem')
                    .setDescription(
                        'Ex: 1d20+5 ou 3d20+10'
                    )
                    .setRequired(true)

            ),


        new SlashCommandBuilder()

            .setName('rolagem')

            .setDescription(
                'Executa uma rolagem salva'
            )

            .addStringOption(option =>

                option
                    .setName('nome')
                    .setDescription(
                        'Rolagem que deseja executar'
                    )
                    .setRequired(true)
                    .setAutocomplete(true)

            ),

    // ==================================================
    // /LISTAR-ATAQUES
    // ==================================================

    new SlashCommandBuilder()

        .setName('listar-ataques')

        .setDescription(
            'Mostra todos os seus ataques salvos'
        ),

    new SlashCommandBuilder()

        .setName('editar-ataque')

        .setDescription(
            'Edita um ataque salvo'
        )

        .addStringOption(option =>

            option
                .setName('nome')
                .setDescription(
                    'Ataque que deseja editar'
                )
                .setRequired(true)
                .setAutocomplete(true)

        )

        .addStringOption(option =>

            option
                .setName('novo-nome')
                .setDescription(
                    'Novo nome do ataque'
                )

        )

        .addStringOption(option =>

            option
                .setName('ataque')
                .setDescription(
                    'Nova rolagem de ataque. Ex: 3d20+5'
                )

        )

        .addStringOption(option =>

            option
                .setName('dano')
                .setDescription(
                    'Nova rolagem de dano. Ex: 1d10+3'
                )

        ),

    // ==================================================
    // /REMOVER-ATAQUE
    // ==================================================

    new SlashCommandBuilder()

        .setName('remover-ataque')

        .setDescription(
            'Remove um ataque salvo'
        )

        .addStringOption(option =>

            option

                .setName('nome')

                .setDescription(
                    'Nome do ataque que deseja remover'
                )

                .setRequired(true)

                .setAutocomplete(true)

        )



].map(command => command.toJSON());


// ==================================================
// CONFIGURAÇÃO
// ==================================================

const APPLICATION_ID =
    process.env.APPLICATION_ID;


const rest =
    new REST({
        version: '10'
    })
    .setToken(
        process.env.DISCORD_TOKEN
    );


// ==================================================
// REGISTRAR COMANDOS GLOBALMENTE
// ==================================================

(async () => {

    try {

        console.log(
            'Registrando comandos globais do RD20...'
        );


        await rest.put(

            Routes.applicationCommands(
                APPLICATION_ID
            ),

            {
                body: commands
            }

        );


        console.log(
            '✅ Comandos globais registrados com sucesso!'
        );

    }

    catch (erro) {

        console.error(
            '❌ Erro ao registrar comandos:'
        );

        console.error(
            erro
        );

    }

})();