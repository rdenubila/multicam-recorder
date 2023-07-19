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
    'startRecord': CustomEvent<{}>
    'stopRecord': CustomEvent<{}>
  }
}