
export default class CameraService {

    static async listCamera() {

        await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        })

        if (!navigator.mediaDevices?.enumerateDevices) {
            console.log("enumerateDevices() not supported.");
        } else {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices()
                return devices.filter(device => device.kind === "videoinput");
            } catch (err: any) {
                console.error(`${err.name}: ${err.message}`);
                throw err;
            }
        }
    }

    static getStream(deviceId: string) {
        return navigator.mediaDevices.getUserMedia({
            video: {
                deviceId,
                width: 1920,
                height: 1080,
                frameRate: {
                    min: 24,
                    ideal: 30,
                    max: 60,
                },
            },
            audio: true,
        })
    }

}