const socketIo = require("socket.io-client")
const ioServer1 = socketIo("http://localhost:3000")
const ioServer2 = socketIo("http://localhost:3000")
const ioServer3 = socketIo("http://localhost:3000")
const ioServer4 = socketIo("http://localhost:3000")
const ioServer5 = socketIo("http://localhost:3000")

class Client {

    constructor(socket){
        this.socket= socket
        this.servicesDone = 0
        this.currentOp = 0
        this.maxServices = Math.floor(Math.random() * 6) + 1
        this.ops = ["cut_hair", "beard_shave", "mustache_cut"]
        
        this.socket.on("connect", ()=>{
            console.log(`${this.socket.id} conectado ao servidor do barbeiro!`)
        })

        this.socket.on("ticket", (ticket)=>{
            if(this.servicesDone>=this.maxServices){
                console.log(`${this.socket.id} fez o maximo de serviços`)
                this.socket.disconnect()
                return
            }

            console.log(`${this.socket.id} recebeu o ticket`)

            const op = this.ops[this.currentOp]

            console.log(`${this.socket.id} realizando ${op}`)

            socket.emit("action", op)

            this.currentOp = Math.floor(Math.random() * 3);
            this.servicesDone++
        })
    }
}

const client1 = new Client(ioServer1)
const client2 = new Client(ioServer2)
const client3 = new Client(ioServer3)
const client4 = new Client(ioServer4)
const client5 = new Client(ioServer5)