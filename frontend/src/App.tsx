import Home from "./Layouts/Home";
import Main from "./Layouts/Main";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Main>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Main>
    </Router>
  );
}

export default App;
