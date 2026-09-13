require('dotenv').config();

const {
    REST,
    Routes,
    SlashCommandBuilder
} = require('discord.js');

const commands = [

    // /roll
    new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Rola dados de RPG')
        .addStringOption(option =>
            option
                .setName('expressao')
                .setDescription('Ex: 1d20, 2d6+3, 2d20 vantagem')
                .setRequired(true)
        ),

    // /salvar-ataque
    new SlashCommandBuilder()
        .setName('salvar-ataque')
        .setDescription('Salva um ataque para usar depois')
        .addStringOption(option =>
            option
                .setName('nome')
                .setDescription('Nome do ataque ou arma')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('ataque')
                .setDescription('Rolagem de ataque. Ex: 1d20+5')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('dano')
                .setDescription('Rolagem de dano. Ex: 1d10+3')
                .setRequired(true)
        ),

    // /ataque
    new SlashCommandBuilder()
        .setName('ataque')
        .setDescription('Usa um ataque salvo')
        .addStringOption(option =>
            option
                .setName('nome')
                .setDescription('Nome do ataque salvo')
                .setRequired(true)
                .setAutocomplete(true)
        )
        .addStringOption(option =>
            option
                .setName('modo')
                .setDescription('Rolagem normal, vantagem ou desvantagem')
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

        // /listar-ataques
    new SlashCommandBuilder()
        .setName('listar-ataques')
        .setDescription('Mostra todos os seus ataques salvos'),


    // /remover-ataque
    new SlashCommandBuilder()
        .setName('remover-ataque')
        .setDescription('Remove um ataque salvo')
        .addStringOption(option =>
            option
                .setName('nome')
                .setDescription('Nome do ataque que deseja remover')
                .setRequired(true)
                .setAutocomplete(true)
        ),

].map(command => command.toJSON());

const rest = new REST({
    version: '10'
}).setToken(process.env.DISCORD_TOKEN);


// COLOQUE OS MESMOS IDs QUE VOCÊ JÁ ESTAVA USANDO
const APPLICATION_ID = '1544531759570485260';


rest.put(
    Routes.applicationCommands(
        APPLICATION_ID
    ),
    {
        body: commands
    }
)

.then(() => {
    console.log('Comandos atualizados!');
})
.catch(console.error);