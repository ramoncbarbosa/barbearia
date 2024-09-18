import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

function isServicoValido(servico) {
    const servicosValidos = ['cabelo', 'barba', 'bigode']; 
    return servicosValidos.includes(servico); 
}

function solicitarServico(servico) {
    if (isServicoValido(servico)) {
        socket.emit('solicitarServico', servico);
    } else {
        console.log("Serviço inválido, nada foi enviado.");
    }

    socket.on('resposta', (msg) => {
        console.log(`Resposta do servidor: ${msg}`);
        return msg; 
    });
}

async function cicloCliente(clienteId, ciclos) {
    let servicos = ['cabelo', 'barba', 'bigode']; 
    for (let i = 0; i < ciclos; i++) {
        for (let j = 0; j < servicos.length; j++) {
            let servicoAtual = servicos[j]; 
            console.log(`Cliente ${clienteId} ciclo ${i + 1}: solicitando corte de ${servicoAtual}`);
            await solicitarServico(servicoAtual); 
        }
    }
    return `Cliente ${clienteId} completou os ${ciclos} ciclos`; 
}

for (let i = 0; i < 5; i++) {
    cicloCliente(i + 1, 20).then((msg) => {
        console.log(msg); 
    });
}
