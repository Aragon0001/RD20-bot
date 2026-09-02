const fs = require('fs');

const {
    salvarAtaque
} = require('./database');


const arquivo =
    './ataques.json';


if (!fs.existsSync(arquivo)) {

    console.log(
        'Nenhum ataques.json encontrado.'
    );

    process.exit();

}


const ataques =
    JSON.parse(
        fs.readFileSync(
            arquivo,
            'utf8'
        )
    );


let quantidade = 0;


for (
    const usuarioId
    in ataques
) {

    const ataquesUsuario =
        ataques[usuarioId];


    for (
        const chave
        in ataquesUsuario
    ) {

        const ataque =
            ataquesUsuario[chave];


        salvarAtaque(
            usuarioId,
            ataque.nome,
            ataque.ataque,
            ataque.dano
        );


        quantidade++;

    }

}


console.log(
    `${quantidade} ataques migrados para o SQLite!`
);