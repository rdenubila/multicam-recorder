import { useContext, useEffect, useRef, useState } from "react"
import CameraService from "../services/camera.service";
import { GlobalStateContext, RecordCamera } from "../wrapper/GlobalContext";
import { Button, Card } from "antd";
import { RiDeleteBinFill } from "react-icons/ri";
import { useEventListener } from "usehooks-ts";

interface Props {
    cameraInfo: RecordCamera
}

function Camera({ cameraInfo }: Props) {
    const { removeCamera, addBlob } = useContext(GlobalStateContext);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | undefined>();
    const videoLive = useRef<HTMLVideoElement>(null);
    const documentRef = useRef<Document>(document)

    const startRecord = () => mediaRecorder?.start()
    const stopRecord = () => mediaRecorder?.stop()

    const initLiveCam = async () => {
        if (videoLive.current) {
            const stream = await CameraService.getStream(cameraInfo.deviceId);
            videoLive.current.srcObject = stream

            const newMediaRecorder = new MediaRecorder(stream)

            newMediaRecorder.addEventListener('dataavailable', async event => {
                addBlob(cameraInfo.deviceId, event.data)
            })

            setMediaRecorder(newMediaRecorder);
        }
    }

    useEventListener('resetCamera', initLiveCam, documentRef)
    useEventListener('startRecord', startRecord, documentRef)
    useEventListener('stopRecord', stopRecord, documentRef)

    useEffect(() => {
        initLiveCam();
    }, [videoLive])

    const removeCam = () => removeCamera(cameraInfo.deviceId)

    const cardButtons = () => {
        return <Button
            onClick={removeCam}
            danger
            type="link"
            icon={<RiDeleteBinFill />}
        />
    }

    return (
        <>
            <Card
                title={cameraInfo.name}
                size="small"
                extra={cardButtons()}
            >
                <video ref={videoLive} autoPlay muted playsInline width="100%" ></video>
            </Card>
        </>
    )
}

export default Camera
