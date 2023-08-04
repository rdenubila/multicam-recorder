import JSZip from "jszip"
import { createContext, useEffect, useState } from "react"
import slugify from "slugify"
import startAudio from "../assets/audios/start.wav"
import stopAudio from "../assets/audios/start2.wav"
import ServerService, { Message } from "../services/server.service"
import { DataConnection, MediaConnection } from "peerjs"

export type RecordCamera = {
    name: string
    deviceId: string
    blob?: Blob
    type: "local" | "stream"
    streamData?: {
        stream?: MediaStream
    }
}

export type AppConfig = {
    takeName: string
    videoPattern: string
    startDelay: number
    recordDuration: number
    exportConversionCommands: boolean,
    desiredFps: number
}

export interface IGlobalContext {
    cameraList: RecordCamera[]
    addCamera: (newCamera: RecordCamera) => void
    removeCamera: (camId: string) => void
    addBlob: (camId: string, blob: Blob) => void
    toggleRecord: () => void
    startRecord: () => void
    stopRecord: () => void
    isRecording: boolean
    currentConfig: AppConfig
    setCurrentConfig: (config: AppConfig) => void
    server?: ServerService
}

export const GlobalStateContext = createContext<IGlobalContext>({} as IGlobalContext);

type Props = {
    children: JSX.Element
}

const APP_CONFIG_KEY = "appConfig";

const defaultConfig: AppConfig =
    localStorage.getItem(APP_CONFIG_KEY) ?
        JSON.parse(localStorage.getItem(APP_CONFIG_KEY) || "{}") as AppConfig :
        {
            takeName: "New Take Name",
            videoPattern: 'cam{index}_{takeName}.mp4',
            recordDuration: 0,
            startDelay: 0,
            exportConversionCommands: true,
            desiredFps: 60
        }

const server = new ServerService();

function GlobalContext({ children }: Props) {
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [cameras, setCameras] = useState<RecordCamera[]>([]);
    const [config, setConfig] = useState<AppConfig>(defaultConfig);

    const addCamera = (newCamera: RecordCamera) => setCameras([
        ...cameras.filter(cam => cam.deviceId != newCamera.deviceId),
        newCamera
    ]);
    const removeCamera = (camId: string) => setCameras(cameras.filter(cam => cam.deviceId != camId));
    const allCamHasBlob = () => cameras.length > 0 && cameras.every(cam => Boolean(cam.blob))

    const addBlob = (camId: string, blob: Blob) => {
        setCameras(prev => {
            return prev.map(cam =>
                cam.deviceId === camId ?
                    { ...cam, blob } :
                    cam
            )
        })
    }

    const resetCameras = () => {
        setCameras(prev => {
            return prev.map(cam =>
                ({ ...cam, blob: undefined })
            )
        })
        document.dispatchEvent(new Event("resetCamera"))
    }

    const handleServerMessage = (message: Message) => {
        switch (message.type) {
            case "receive-call":
                const deviceId = JSON.parse(message.message || "").deviceId;
                const currentCam: RecordCamera = cameras.find(cam => cam.deviceId == deviceId) || { deviceId, name: "Stream Camera", type: "stream" };
                const streamData = currentCam.streamData || {}
                currentCam.streamData = {
                    ...streamData,
                    stream: message.stream
                }
                console.log(currentCam);
                addCamera(currentCam);
                break;
            case "receive-blob":
                addBlob(
                    message.message.deviceId,
                    message.message.blob
                )
                break;
        }

    }

    useEffect(() => {
        prepareDownloadFile();
    }, [cameras])

    useEffect(() => {
        server.attach(handleServerMessage)
    }, [])

    const prepareDownloadFile = async () => {
        if (allCamHasBlob()) {
            var zip = new JSZip();
            let txt = "";
            cameras.forEach((cam, index) => {
                const filename = handleFilename(index, cam);
                if (cam.blob) {
                    zip.file(`_${filename}`, cam.blob);
                    txt += `docker run --rm -it -v \${pwd}:/config linuxserver/ffmpeg -i /config/_${filename} -r ${config.desiredFps} -y /config/${filename}\n`
                }
            })

            if (config.exportConversionCommands)
                zip.file("ffmpeg_commands.txt", txt);

            const base64 = await zip.generateAsync({ type: "base64" });
            const uri = "data:application/zip;base64," + base64;

            var link = document.createElement('a');
            if (typeof link.download === 'string') {
                document.body.appendChild(link);
                link.download = `${config.takeName}.zip`;
                link.href = uri;
                link.click();
                document.body.removeChild(link);
            } else {
                location.replace(uri);
            }

            resetCameras();

        }
    }

    const handleFilename = (index: number, cam: RecordCamera) => {
        return config.videoPattern
            .replace('{index}', index.toString())
            .replace('{takeName}', slugify(config.takeName, { replacement: '_', lower: true }))
            .replace('{camName}', slugify(cam.name, { replacement: '_', lower: true }))
            .replace('{camId}', cam.deviceId)
    }

    const toggleRecord = () => {
        if (!isRecording)
            startRecord()
        else
            stopRecord()
    }

    const playAudio = (audioName?: string) => {
        const audio = new Audio(audioName || startAudio);
        audio.play()
    }

    const startRecord = () => {
        playAudio();
        document.dispatchEvent(new Event("startRecord"))
        server.sendMessage({ action: "start-record" })
        setIsRecording(true);
    }

    const stopRecord = () => {
        playAudio(stopAudio);
        document.dispatchEvent(new Event("stopRecord"))
        server.sendMessage({ action: "stop-record" })
        setIsRecording(false);
    }

    const saveConfig = (newConfig: AppConfig) => {
        setConfig(newConfig);
        localStorage.setItem(APP_CONFIG_KEY, JSON.stringify(newConfig))
    }

    return <GlobalStateContext.Provider value={{
        cameraList: cameras,
        isRecording,
        addCamera,
        removeCamera,
        toggleRecord,
        startRecord,
        stopRecord,
        addBlob,
        currentConfig: config,
        setCurrentConfig: saveConfig,
        server
    }}>
        {children}
    </GlobalStateContext.Provider>
}

export default GlobalContext;