// console.log("Hello, World!!")
import promptSync from 'prompt-sync';
import * as fs from 'fs';

const prompt = promptSync();

type conjTarefa = {
    nome: string,
    id: number,
    data?: Date,
    descricao?: string

}

console.log("--- Agenda de tarefas ---")

function hashid(palavra: string) {
    var hash = 0,
        i, chr;

    if (palavra.length === 0) return hash;
    for (i = 0; i < palavra.length; i++) {
        chr = palavra.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return hash;
}

function pegaTarefa(tarefa: conjTarefa): string {
    tarefa.nome = tarefa.nome.trim()
    tarefa.descricao = tarefa.descricao?.trim()
    return `${tarefa.id},${tarefa.nome},${tarefa.descricao},${tarefa.data}\n`
}

function gravaTarefa(nomearquivo: string, tarefa: string, rescreve?: boolean) {    
    if (rescreve) {
        fs.appendFileSync(`./dados/${nomearquivo}`, tarefa, { encoding: "utf8", flag: "w" })
    }
    else { fs.appendFileSync(`./dados/${nomearquivo}`, tarefa) }

}

function acessaTarefa(nomearquivo: string) {
    const dados = fs.readFileSync(`./dados/${nomearquivo}`, { encoding: 'utf-8' })
    return dados;
}

let codigo: '0' | '1' | '2' | '3' | '9' | (string & {}) = '';
while (codigo != '9') {

    codigo = prompt(`O que desaja fazer:
        1: Agendar tarefa;
        2: Acessar tarefa;
        3: Concluir tarefa;
        9: Terminar
        `)

    if (codigo === '1') {
        const tarefa: conjTarefa = {
            nome: "",
            id: 0,
            data: new Date(),
            descricao: ""
        }

        tarefa.nome = prompt(`Nome da terafa: `);
        tarefa.id = hashid(tarefa.nome);      // fazer o id com chave hash, assim a mesma tarefa (mesmo nome) teria o mesmo id, ou ler o ultimo id
        let opcao = prompt(`Deseja adicinar descrição? S/N `)

        if (opcao == 'S' || opcao == 's') {
            tarefa.descricao = prompt(`Descrição de ${tarefa.nome}: `)
        }
        opcao = prompt(`Deseja adicinar data de termino? S/N `)

        if (opcao == 'S' || opcao == 's') {
            let data: string = prompt(`Mês/dia/ano para realizar tarefa ${tarefa.nome}: `)
            tarefa.data = new Date(data)
        }

        const stringTarefa: string = pegaTarefa(tarefa)
        console.log(stringTarefa)
        gravaTarefa('tarefas.csv', stringTarefa)
    }

    if (codigo === '2') {
        console.log('--- Tarefas Registradas ---')
        const atuais: string = acessaTarefa('tarefas.csv')
        console.log(atuais)
    }

    if (codigo === '3') {

        const tarefa: conjTarefa = {
            nome: "",
            id: 0,
            data: new Date(),
            descricao: ""
        }

        console.log('--- Terminar Tarefas ---')
        console.log('Tarefas presentes: ')

        const dadosatuais = acessaTarefa('tarefas.csv')
        console.log(dadosatuais)
        const arreydadosatuais: string[][] = dadosatuais.split('\n').map((row: string): string[] => {
            return row.split(',')
        })

        let excluirCodigos: string[] = []
        while (true) {

            excluirCodigos.push(prompt(`Digite o código da tarefa que deseja excluir: `))
            let continua = prompt(`Deseja excluir mais algum? S/N `)
            if (continua === 'N' || continua === 'n') { break; }

        }

        gravaTarefa('tarefas.csv','',true)

        for (let i: number = 0; i < arreydadosatuais.length; i = i + 1) {

            if (excluirCodigos.includes(arreydadosatuais[i][0])) {
                tarefa.nome = arreydadosatuais[i][1],
                tarefa.id = parseInt(arreydadosatuais[i][0]),
                tarefa.data = new Date(arreydadosatuais[i][3]),
                tarefa.descricao = arreydadosatuais[i][2]
                const stringtarefa: string = pegaTarefa(tarefa)
                const date = new Date()
                gravaTarefa(`tarefasConcuidas${date.getDate()}0${date.getMonth() + 1}.csv`, stringtarefa, false)
            }

            if(!excluirCodigos.includes(arreydadosatuais[i][0]) && arreydadosatuais[i][0] != '') {
                tarefa.nome = arreydadosatuais[i][1],
                tarefa.id = parseInt(arreydadosatuais[i][0]),
                tarefa.data = new Date(arreydadosatuais[i][3]),
                tarefa.descricao = arreydadosatuais[i][2]
                gravaTarefa('tarefas.csv',pegaTarefa(tarefa), false)
            }   
        }
    }
}