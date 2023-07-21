import JSZip from "jszip"
import { createContext, useEffect, useState } from "react"

export type RecordCamera = {
    name: string
    deviceId: string
    blob?: Blob
}

export type AppConfig = {
    takeName: string
    videoPattern: string
}

export interface IGlobalContext {
    cameraList: RecordCamera[]
    addCamera: (newCamera: RecordCamera) => void
    removeCamera: (camId: string) => void
    addBlob: (camId: string, blob: Blob) => void
    toggleRecord: () => void
    isRecording: boolean
}

export const GlobalStateContext = createContext<IGlobalContext>({} as IGlobalContext);

type Props = {
    children: JSX.Element
}

function GlobalContext({ children }: Props) {
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [cameras, setCameras] = useState<RecordCamera[]>([]);
    const [config, setConfig] = useState<AppConfig>({
        takeName: "teste",
        videoPattern: 'cam{index}_{takeName}.mkv'
    });

    const addCamera = (newCamera: RecordCamera) => setCameras([...cameras, newCamera]);
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

    useEffect(() => {
        prepareDownloadFile();
    }, [cameras])

    const prepareDownloadFile = async () => {
        if (allCamHasBlob()) {
            var zip = new JSZip();
            cameras.forEach((cam, index) => {
                zip.file(handleFilename(index), cam.blob);
            })

            const base64 = await zip.generateAsync({ type: "base64" });
            const uri = "data:application/zip;base64," + base64;

            var link = document.createElement('a');
            if (typeof link.download === 'string') {
                document.body.appendChild(link); // Firefox requires the link to be in the body
                link.download = `${config.takeName}.zip`;
                link.href = uri;
                link.click();
                document.body.removeChild(link); // remove the link when done
            } else {
                location.replace(uri);
            }

            resetCameras();

        }
    }

    const handleFilename = (index: number) => {
        return config.videoPattern
            .replace('{index}', index.toString())
            .replace('{takeName}', config.takeName)
    }

    const toggleRecord = () => {
        if (!isRecording)
            startRecord()
        else
            stopRecord()
    }

    const startRecord = () => {
        document.dispatchEvent(new Event("startRecord"))
        setIsRecording(true);
    }

    const stopRecord = () => {
        document.dispatchEvent(new Event("stopRecord"))
        setIsRecording(false);
    }

    return <GlobalStateContext.Provider value={{
        cameraList: cameras,
        isRecording,
        addCamera,
        removeCamera,
        toggleRecord,
        addBlob
    }}>
        {children}
    </GlobalStateContext.Provider>
}

export default GlobalContext;