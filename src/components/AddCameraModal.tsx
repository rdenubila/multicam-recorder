
import { Form, Input, Modal, Select } from "antd";
import CameraService from "../services/camera.service";
import { useContext, useEffect, useState } from "react";
import { GlobalStateContext } from "../wrapper/GlobalContext";

interface Props {
    isModalOpen: boolean,
    onCloseModal: () => void
}

export default function AddCameraModal({ isModalOpen, onCloseModal }: Props) {
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const { addCamera } = useContext(GlobalStateContext)

    const loadDevices = async () => {
        const deviceList = await CameraService.listCamera();
        if (deviceList) setDevices(deviceList)
    }

    useEffect(() => {
        loadDevices();
    }, [])

    const handleOk = async () => {
        try {
            await form.validateFields()
            addCamera(form.getFieldsValue())
            form.resetFields();
            onCloseModal()
        } catch (e) {
            console.log(e);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onCloseModal()
    };

    const [form] = Form.useForm();

    return (
        <>
            <Modal title="Add Camera" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>

                <Form
                    form={form}
                    name="addCameraForm"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Camera"
                        name="deviceId"
                        rules={[{ required: true }]}
                    >
                        <Select
                            options={devices.map(device => ({
                                value: device.deviceId,
                                label: `${device.label} (${device.deviceId})`,
                            }))}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}
