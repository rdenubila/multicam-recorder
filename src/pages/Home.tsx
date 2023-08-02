import { Empty, Layout } from "antd";
import HeaderMenu from "../components/HeaderMenu";
import { GlobalStateContext } from "../wrapper/GlobalContext";
import { useContext } from "react";
import Camera from "../components/Camera";

const { Header, Content, Footer } = Layout;

function Home() {
  const { cameraList, server } = useContext(GlobalStateContext)

  return (
    <>
      <Layout>
        <Header className="flex items-center justify-between">
          <h1 className="text-white text-xl">
            Multicam Recorder
          </h1>
          <div className="flex-1 flex gap-2 justify-end">
            <HeaderMenu />
          </div>
        </Header>
        <Content className="p-8">
          {
            cameraList.length === 0 && <Empty description="No cameras" />
          }
          <div className="grid grid-cols-3 gap-2">
            {
              cameraList?.map(cam => <Camera key={cam.deviceId} cameraInfo={cam} />)
            }
          </div>
        </Content>
        <Footer>
          Server ID: {server?.id}
        </Footer>
      </Layout>
    </>
  )
}

export default Home
