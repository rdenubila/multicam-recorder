import { Button } from "antd"
import { useState } from "react"
import { RiAddCircleFill, RiRecordCircleFill, RiSettings3Fill } from "react-icons/ri"
import AddCameraModal from "./AddCameraModal";
import RecordButton from "./RecordButton";


function HeaderMenu() {
    const [showAddCameraModal, setShowAddCameraModal] = useState<boolean>(false);

    const startRecord = () => {
        document.dispatchEvent(new Event("startRecord"))
    }

    return (
        <>
            <Button
                type="link"

                icon={<RiSettings3Fill />}
            >
                Config
            </Button>
            <Button
                type="link"
                onClick={() => setShowAddCameraModal(true)}
                icon={<RiAddCircleFill />}
            >
                Add Camera
            </Button>

            <RecordButton />

            <AddCameraModal
                isModalOpen={showAddCameraModal}
                onCloseModal={() => setShowAddCameraModal(false)}
            />
        </>
    )
}

export default HeaderMenu
