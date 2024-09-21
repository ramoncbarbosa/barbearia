const express = require("express")
const http = require("http")
const { Server: io } = require('socket.io')

const app = express()
const server = http.createServer(app)
const ioServer = new io(server)

let ticket = 0
let cycles = 0
let clients = []
let currentClient = null

const barber_services_dictionary = {
    cut_hair: 3000,
    beard_shave: 4000,
    mustache_cut: 5000
}

async function closeBarber(){
    for(let client of clients){
        console.log(client)
        ioServer.to(client).emit("dispensed")
    }
    console.log("Barber is tired, closing shop")
    clients = []
    currentClient = null
}

function doWork(client, service, cb) {
    console.log(`${client} doing ${service}`)

    if(cycles>=2){
        closeBarber()
        return process.exit(0)
    }

    cycles++

    setTimeout(() => {
        console.log(`${client} completed ${service}`)
        cb()
    }, barber_services_dictionary[service]);
}

function callNextClient() {
    function functionCallNext(){
        if (clients.length === 0) return

        const nextClientId = clients[ticket]

        currentClient = nextClientId
        ioServer.to(nextClientId).emit("ticket", nextClientId)
    }
    
    ticket = (ticket + 1) % clients.length;

    if(clients.length === 0){
        console.log("Aguardando clientes")
        setTimeout(() => {
            functionCallNext()
        }, 200);
    }else{
        functionCallNext()
    }

}

ioServer.on("connection", (socket) => {
    console.log('Novo cliente entrou na loja: ', socket.id)
    clients.push(socket.id)

    if (!currentClient) {
        callNextClient()
    }

    socket.on("action", (service) => {
        if (socket.id === currentClient) {
            doWork(currentClient, service, () => {
                currentClient = null
                callNextClient()
            })
        }
    })

    socket.on("disconnect", () => {
        console.log(`cliente ${socket.id} desconectado`)

        const socketIndex = clients.indexOf(socket.id)
        if (socketIndex !== -1) clients.splice(socketIndex, 1)

        if (socket.id === currentClient) {
            currentClient = null
            callNextClient()
        }
    })
})

server.listen(3000, () => {
    console.log('server barbeiro on')
})
