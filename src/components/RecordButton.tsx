import { Button } from "antd"
import { useContext } from "react"
import { RiRecordCircleFill, RiStopFill, } from "react-icons/ri"
import { GlobalStateContext } from "../wrapper/GlobalContext"


function RecordButton() {
    const { isRecording, toggleRecord } = useContext(GlobalStateContext)

    return (
        <>
            {isRecording ?
                <Button
                    icon={<RiStopFill />}
                    onClick={toggleRecord}
                >
                    Stop Record
                </Button>
                :
                <Button
                    icon={<RiRecordCircleFill />}
                    onClick={toggleRecord}
                >
                    Start Record
                </Button>
            }

        </>
    )
}

export default RecordButton
