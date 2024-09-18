import http from 'node:http';
import { Server } from 'socket.io';

function isBarbeiroDisponivel(barbeiro) {
    return barbeiro ? true : false; 
}

class Barbeiro {
    constructor() {
        this.ocupado = false;
    }

    async executarServico(servico) {
        const tempoEspera = this.getTempoServico(servico); 
        if (servico === 'cabelo') {
            console.log("Cortando cabelo...");
            await new Promise(resolve => setTimeout(resolve, tempoEspera));
            console.log("Corte de cabelo concluído!");
        } else if (servico === 'barba') {
            console.log("Cortando barba...");
            await new Promise(resolve => setTimeout(resolve, tempoEspera));
            console.log("Corte de barba concluído!");
        } else if (servico === 'bigode') {
            console.log("Cortando bigode...");
            await new Promise(resolve => setTimeout(resolve, tempoEspera));
            console.log("Corte de bigode concluído!");
        } else {
            console.log("Serviço desconhecido.");
        }
    }

    getTempoServico(servico) {
        let tempoEspera;
        if (servico === 'cabelo') {
            tempoEspera = 3000;
        } else if (servico === 'barba') {
            tempoEspera = 4000;
        } else if (servico === 'bigode') {
            tempoEspera = 5000;
        } else {
            tempoEspera = 1000; 
        }
        return tempoEspera; 
    }
}

const barbeiro = new Barbeiro();
const server = http.createServer();
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('Cliente conectado', socket.id);

    function gerenciarBarbeiro(barbeiro, servico) {
        if (!isBarbeiroDisponivel(barbeiro) || barbeiro.ocupado) {
            return 'O barbeiro está ocupado. Tente novamente.';
        } else {
            barbeiro.ocupado = true;
            return 'Barbeiro está livre e executando serviço.';
        }
    }

    socket.on('solicitarServico', async (servico) => {
        let resposta = gerenciarBarbeiro(barbeiro, servico);

        if (resposta.includes('ocupado')) {
            socket.emit('resposta', resposta);
        } else {
            await barbeiro.executarServico(servico);
            barbeiro.ocupado = false;
            socket.emit('resposta', 'Serviço concluído!');
        }
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado', socket.id);
    });
});

server.listen(3000, () => {
    console.log('Servidor do barbeiro rodando na porta 3000.');
});
