import Peer, { DataConnection, MediaConnection } from "peerjs";
import random from "random-string-generator";

export type Message = {
    type: "receive-call" | "receive-conn" | "receive-blob" | "message"
    message?: string | any
    stream?: MediaStream,
    conn?: DataConnection | MediaConnection
}

export type SendAction = {
    action: "start-record" | "stop-record"
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

    private handleCall(call: MediaConnection) {
        console.info("Receiving call");
        call.on("stream", stream => this.registerDevice(call, stream))
        call.answer()
    }

    private handleConnection(conn: DataConnection) {
        conn.on("data", (data) => this.handleData(data))
        this._conn.push(conn)
    }

    private handleData(message: any) {
        this.notify({
            type: "receive-blob",
            message: message.message
        })
    }

    private registerDevice(call: MediaConnection, stream: MediaStream) {
        this.notify({
            type: "receive-call",
            message: JSON.stringify({
                deviceId: call.metadata.deviceId
            }),
            stream,
            conn: call
        })
    }

    get id() {
        return this._id
    }

    sendMessage(action: SendAction) {
        for (const conn of this._conn) {
            conn.send(action)
        }
    }

}