import Peer, { DataConnection, MediaConnection } from "peerjs";
import random from "random-string-generator";

export type Message = {
    type: "register-device" | "message"
    message?: string
    stream?: MediaStream
}

export type Observer = (message: Message) => void;

export default class ServerService {

    private _observers: Array<Observer> = []
    private _peer: Peer;
    private _conn: DataConnection[] = [];
    private _id: string;

    constructor() {
        this._id = `MCR-${random(3, "numeric")}-${random(3, "numeric")}`
        this._peer = new Peer(this._id);
        this._peer.on('open', (id: string) => this.openConnection(id));
        this._peer.on('connection', (conn: DataConnection) => this.handleConnection(conn));
        this._peer.on('call', (call: MediaConnection) => this.handleCall(call));
    }

    attach(observer: Observer) {
        this._observers.push(observer);
    }

    private notify(message: Message) {
        for (const obs of this._observers) {
            obs(message)
        }
    }

    private openConnection(id?: string) {
        console.info('My peer ID is: ' + id);
    }

    private handleConnection(conn: DataConnection) {
        console.info(conn);
        this._conn.push(conn)
    }

    private handleCall(call: MediaConnection) {
        console.info("Receiving call");
        call.on("stream", stream => this.registerDevice(call, stream))
        call.answer()

    }

    private registerDevice(call: MediaConnection, stream: MediaStream) {
        console.log(call, stream);
    
        this.notify({
            type: "register-device",
            message: JSON.stringify({
                data: call.connectionId
            }),
            stream
        })
    }

    get id() {
        return this._id
    }

}