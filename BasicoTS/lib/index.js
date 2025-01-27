"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// console.log("Hello, World!!")
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const fs = __importStar(require("fs"));
const prompt = (0, prompt_sync_1.default)();
console.log("--- Agenda de tarefas ---");
function hashid(palavra) {
    var hash = 0, i, chr;
    if (palavra.length === 0)
        return hash;
    for (i = 0; i < palavra.length; i++) {
        chr = palavra.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return hash;
}
function pegaTarefa(tarefa) {
    var _a;
    tarefa.nome = tarefa.nome.trim();
    tarefa.descricao = (_a = tarefa.descricao) === null || _a === void 0 ? void 0 : _a.trim();
    return `${tarefa.id},${tarefa.nome},${tarefa.descricao},${tarefa.data}\n`;
}
function gravaTarefa(nomearquivo, tarefa, rescreve) {
    if (rescreve) {
        fs.appendFileSync(nomearquivo, tarefa, { encoding: "utf8", flag: "w" });
    }
    else {
        fs.appendFileSync(nomearquivo, tarefa);
    }
}
function acessaTarefa(nomearquivo) {
    const dados = fs.readFileSync(nomearquivo, { encoding: 'utf-8' });
    return dados;
}
let codigo = '';
while (codigo != '9') {
    codigo = prompt(`O que desaja fazer:
        1: Agendar tarefa;
        2: Acessar tarefa;
        3: Concluir tarefa;
        9: Terminar
        `);
    if (codigo === '1') {
        const tarefa = {
            nome: "",
            id: 0,
            data: new Date(),
            descricao: ""
        };
        tarefa.nome = prompt(`Nome da terafa: `);
        tarefa.id = hashid(tarefa.nome); // fazer o id com chave hash, assim a mesma tarefa (mesmo nome) teria o mesmo id, ou ler o ultimo id
        let opcao = prompt(`Deseja adicinar descrição? S/N `);
        if (opcao == 'S' || opcao == 's') {
            tarefa.descricao = prompt(`Descrição de ${tarefa.nome}: `);
        }
        opcao = prompt(`Deseja adicinar data de termino? S/N `);
        if (opcao == 'S' || opcao == 's') {
            let data = prompt(`Mês/dia/ano para realizar tarefa ${tarefa.nome}: `);
            tarefa.data = new Date(data);
        }
        const stringTarefa = pegaTarefa(tarefa);
        console.log(stringTarefa);
        gravaTarefa('tarefas.csv', stringTarefa);
    }
    if (codigo === '2') {
        console.log('--- Tarefas Registradas ---');
        const atuais = acessaTarefa('tarefas.csv');
        console.log(atuais);
    }
    if (codigo === '3') {
        const tarefa = {
            nome: "",
            id: 0,
            data: new Date(),
            descricao: ""
        };
        console.log('--- Terminar Tarefas ---');
        console.log('Tarefas presentes: ');
        const dadosatuais = acessaTarefa('tarefas.csv');
        console.log(dadosatuais);
        const arreydadosatuais = dadosatuais.split('\n').map((row) => {
            return row.split(',');
        });
        let excluirCodigos = [];
        while (true) {
            excluirCodigos.push(prompt(`Digite o código da tarefa que deseja excluir: `));
            let continua = prompt(`Deseja excluir mais algum? S/N `);
            if (continua === 'N' || continua === 'n') {
                break;
            }
        }
        gravaTarefa('tarefas.csv', '', true);
        const arreytarefasRefatoradas = [''];
        for (let i = 0; i < arreydadosatuais.length; i = i + 1) {
            if (excluirCodigos.includes(arreydadosatuais[i][0])) {
                tarefa.nome = arreydadosatuais[i][1],
                    tarefa.id = parseInt(arreydadosatuais[i][0]),
                    tarefa.data = new Date(arreydadosatuais[i][3]),
                    tarefa.descricao = arreydadosatuais[i][2];
                const stringtarefa = pegaTarefa(tarefa);
                const date = new Date();
                gravaTarefa(`tarefasConcuidas${date.getDate()}0${date.getMonth() + 1}.csv`, stringtarefa, false);
            }
            if (!excluirCodigos.includes(arreydadosatuais[i][0]) && arreydadosatuais[i][0] != '') {
                tarefa.nome = arreydadosatuais[i][1],
                    tarefa.id = parseInt(arreydadosatuais[i][0]),
                    tarefa.data = new Date(arreydadosatuais[i][3]),
                    tarefa.descricao = arreydadosatuais[i][2];
                gravaTarefa('tarefas.csv', pegaTarefa(tarefa), false);
            }
        }
    }
}
//# sourceMappingURL=index.js.map