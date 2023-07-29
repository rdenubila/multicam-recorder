
import { Form, Input, Modal, Switch, Tooltip } from "antd";
import { useContext, useEffect } from "react";
import { GlobalStateContext } from "../wrapper/GlobalContext";
import { RiInformationFill } from "react-icons/ri";

interface Props {
    isModalOpen: boolean,
    onCloseModal: () => void
}

export default function ConfigModal({ isModalOpen, onCloseModal }: Props) {
    const { currentConfig, setCurrentConfig } = useContext(GlobalStateContext)

    const handleOk = async () => {
        try {
            await form.validateFields()
            setCurrentConfig(form.getFieldsValue())
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
    const showExportFields = Form.useWatch('exportConversionCommands', form);

    useEffect(() => {
        if (isModalOpen)
            form.setFieldsValue(currentConfig)
    }, [isModalOpen])

    return (
        <>
            <Modal title="Config" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>

                <Form
                    form={form}
                    name="configForm"
                    labelCol={{ span: 10 }}
                    wrapperCol={{ span: 14 }}
                    initialValues={currentConfig}
                >
                    <Form.Item
                        label="Take Name"
                        name="takeName"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label={
                            <Tooltip title="The name of the video file. You can use these tags to customize your file: {index}, {takeName}, {camName}, {camId}">
                                Filename Pattern
                                <RiInformationFill />
                            </Tooltip>}
                        name="videoPattern"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label={
                            <Tooltip title="Delay time (in seconds) before start recording when press record button">
                                Start Delay
                                <RiInformationFill />
                            </Tooltip>}
                        name="startDelay"
                        rules={[{ required: true }]}
                    >
                        <Input type="number" min={0} />
                    </Form.Item>


                    <Form.Item
                        label={
                            <Tooltip title="Max. time to record. Set to zero to keep recording until press Stop Record button">
                                Record duration
                                <RiInformationFill />
                            </Tooltip>}
                        name="recordDuration"
                        rules={[{ required: true }]}
                    >
                        <Input type="number" min={0} />
                    </Form.Item>

                    <Form.Item
                        label="Export Conversion Commands"
                        name="exportConversionCommands"
                    >
                        <Switch checked={form.getFieldValue("exportConversionCommands")} />
                    </Form.Item>

                    {showExportFields &&
                        <Form.Item
                            label="Desired FPS (framerate)"
                            name="desiredFps"
                            rules={[{ required: true }]}
                        >
                            <Input type="number" min={0} />
                        </Form.Item>
                    }

                </Form>
            </Modal>
        </>
    )
}
