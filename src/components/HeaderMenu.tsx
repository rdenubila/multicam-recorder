import { Button } from "antd"
import { useState } from "react"
import { RiAddCircleFill, RiSettings3Fill } from "react-icons/ri"
import AddCameraModal from "./AddCameraModal";
import RecordButton from "./RecordButton";
import ConfigModal from "./ConfigModal";


function HeaderMenu() {
    const [showAddCameraModal, setShowAddCameraModal] = useState<boolean>(false);
    const [showConfigModal, setShowConfigModal] = useState<boolean>(false);

    return (
        <>
            <Button
                type="link"
                onClick={() => setShowConfigModal(true)}
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

            <ConfigModal
                isModalOpen={showConfigModal}
                onCloseModal={() => setShowConfigModal(false)}
            />
        </>
    )
}

export default HeaderMenu
