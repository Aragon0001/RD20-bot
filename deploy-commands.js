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


    // ==================================================
    // /LISTAR-ATAQUES
    // ==================================================

    new SlashCommandBuilder()

        .setName('listar-ataques')

        .setDescription(
            'Mostra todos os seus ataques salvos'
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
    '1544531759570485260';


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