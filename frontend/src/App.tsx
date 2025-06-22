import SpotlightSearch from "./components/SpotlightSearch/SpotlightSearch";
import PreferenceProvider from "./context/Preference/PreferenceContext";
import commands from "./data/commands";
import Home from "./Layouts/Home";
import Main from "./Layouts/Main";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <PreferenceProvider>
    <Router>
      <Main>
      <SpotlightSearch data={commands} />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Main>
    </Router>
    </PreferenceProvider>
  );
}

export default App;
