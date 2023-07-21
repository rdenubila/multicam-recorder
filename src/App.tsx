import Home from "./pages/Home"
import GlobalContext from "./wrapper/GlobalContext"

function App() {
  return (
    <>
      <GlobalContext>
        <Home />
      </GlobalContext>
    </>
  )
}

export default App

declare global {
  interface DocumentEventMap {
    'resetCamera': CustomEvent<{}>
    'startRecord': CustomEvent<{}>
    'stopRecord': CustomEvent<{}>
  }
}