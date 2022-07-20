import { BrowserRouter, Routes, Route } from "react-router-dom";

//Global Components
import { Container, Footer, Navbar } from './components';

//Public Routes
import { Home, Register, Login } from './components'

//Private Routes

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Container>
        <Routes>
          <Route path="/login" exact element={<Login />} />
          <Route path="/register" exact element={<Register />} />
          <Route path="/" exact element={<Home />} />
        </Routes>
      </Container>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
