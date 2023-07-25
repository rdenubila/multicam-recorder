import { Button } from "antd"
import { useContext, useEffect, useState } from "react"
import { GlobalStateContext } from "../wrapper/GlobalContext"
import clickAudio from "../assets/audios/click.wav"
import { RiRecordCircleFill, RiStopFill, RiTimeFill } from "react-icons/ri"


function RecordButton() {
    const { currentConfig, isRecording, stopRecord, startRecord } = useContext(GlobalStateContext)
    const [delay, setDelay] = useState<number>(0)

    const onStopRecord = () => {
        stopRecord();
    }


    const onStartRecord = () => {
        if (currentConfig.startDelay > 0) {
            setDelay(currentConfig.startDelay)
        } else {
            startNewRecord()
        }
    }

    const startNewRecord = () => {
        startRecord()
        stopOverTime();
    }

    const continueDelay = () => {
        setTimeout(() => {
            if (delay === 1) startNewRecord()
            playAudio();
            setDelay(delay - 1)
        }, 1000)
    }

    const stopOverTime = () => {
        if (currentConfig.recordDuration > 0) {
            setTimeout(() => {
                stopRecord()
            }, currentConfig.recordDuration * 1000)
        }
    }

    const playAudio = () => {
        const audio = new Audio(clickAudio);
        audio.play()
    }

    useEffect(() => {
        if (delay > 0) {
            continueDelay()
        }
    }, [delay])


    if (delay > 0) {
        return <Button
            icon={<RiTimeFill />}
        >
            Starting record in {delay} seconds
        </Button>
    }

    return (
        <>
            {isRecording ?
                <Button
                    icon={<RiStopFill />}
                    onClick={onStopRecord}
                >
                    Stop Record
                </Button>
                :
                <Button
                    icon={<RiRecordCircleFill />}
                    onClick={onStartRecord}
                >
                    Start Record
                </Button>
            }

        </>
    )
}

export default RecordButton
