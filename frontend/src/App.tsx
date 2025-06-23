import SpotlightSearch from "./components/SpotlightSearch/SpotlightSearch";
import PreferenceProvider from "./context/Preference/PreferenceContext";
import UserAuthProvider from "./context/User/UserAuthContext";
import commands from "./data/commands";
import Auth from "./Layouts/Auth";
import Home from "./Layouts/Home";
import Main from "./Layouts/Main";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <UserAuthProvider>
    <PreferenceProvider>
    <Router>
      <Main>
      <SpotlightSearch data={commands} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/login" element={<Auth type="login" />} />
          <Route path="/auth/register" element={<Auth type="register" />} />
        </Routes>
      </Main>
    </Router>
    </PreferenceProvider>
    </UserAuthProvider>
  );
}

export default App;
