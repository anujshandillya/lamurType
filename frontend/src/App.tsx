import SpotlightSearch from "./components/SpotlightSearch/SpotlightSearch";
import PreferenceProvider from "./context/Preference/PreferenceContext";
import UserAuthProvider from "./context/User/UserAuthContext";
import commands from "./data/commands";
import Auth from "./Layouts/Auth";
import Home from "./Layouts/Home";
import Main from "./Layouts/Main";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SoloPage from "./Layouts/SoloPage";
import ToastContainer from "./components/ToastContainer";
import { RoomProvider } from "./context/Room/RoomContext";
import { ChatProvider } from "./context/Chat/ChatContext";
import MultiplayerPage from "./Layouts/Multiplayer/Index";
import MultiplayerPageID from "./Layouts/Multiplayer/Room";

function App() {
  return (
    <UserAuthProvider>
      <PreferenceProvider>
        <Router>
          <RoomProvider>
            <ChatProvider>
              <Main>
                <ToastContainer />
                <SpotlightSearch data={commands} />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/auth/login" element={<Auth type="login" />} />
                  <Route
                    path="/auth/register"
                    element={<Auth type="register" />}
                  />
                  <Route path="/solo" element={<SoloPage />} />
                  <Route path="/multiplayer" element={<MultiplayerPage />} />
                  <Route path="/multiplayer/:id" element={<MultiplayerPageID />} />
                </Routes>
              </Main>
            </ChatProvider>
          </RoomProvider>
        </Router>
      </PreferenceProvider>
    </UserAuthProvider>
  );
}

export default App;
