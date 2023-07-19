import { createContext, useState } from "react"

export type RecordCamera = {
    name: string
    deviceId: string
    blob?: Blob
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

    const addCamera = (newCamera: RecordCamera) => setCameras([...cameras, newCamera]);
    const removeCamera = (camId: string) => setCameras(cameras.filter(cam => cam.deviceId != camId));
    const addBlob = (camId: string, blob: Blob) => {
        const cam = cameras.map(cam =>
            cam.deviceId === camId ?
                { ...cam, blob } :
                cam
        )
        console.log(cam)
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