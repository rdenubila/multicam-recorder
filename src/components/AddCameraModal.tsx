
import { Button, Form, Input, Modal, Select, Space } from "antd";
import CameraService from "../services/camera.service";
import { useContext, useEffect, useState } from "react";
import { GlobalStateContext } from "../wrapper/GlobalContext";
import { RiRefreshLine } from "react-icons/ri";

interface Props {
    isModalOpen: boolean,
    onCloseModal: () => void
}

export default function AddCameraModal({ isModalOpen, onCloseModal }: Props) {
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const { addCamera, cameraList } = useContext(GlobalStateContext)

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
            addCamera({
                ...form.getFieldsValue(),
                type: "local"
            })
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

                    <Form.Item label="Camera">
                        <Space>
                            <Form.Item
                                name="deviceId"
                                noStyle
                                rules={[{ required: true }]}
                            >
                                <Select
                                    style={{ width: 313 }}
                                    options={devices.map(device => ({
                                        disabled: cameraList.some(cam => cam.deviceId === device.deviceId),
                                        value: device.deviceId,
                                        label: `${device.label} (${device.deviceId})`,
                                    }))}
                                />
                            </Form.Item>
                            <Button onClick={loadDevices} icon={<RiRefreshLine />} />
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}
