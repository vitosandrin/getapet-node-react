import { BrowserRouter, Routes, Route } from "react-router-dom";

//Context
import { UserProvider } from './context/UserContext';

//Global Components
import {
  Container,
  Footer,
  Navbar,
  Message
} from './components';

//Public Routes
import { Home, Register, Login, Profile } from './pages'

//Private Routes

const App = () => {
  return (
    <BrowserRouter>
      <UserProvider>
       
        <Navbar />
        <Message />
        <Container>
        
          <Routes>
            <Route path="/login" exact element={<Login />} />
            <Route path="/register" exact element={<Register />} />
            <Route path="/" exact element={<Home />} />
            <Route path="/user/profile" exact element={<Profile />} />
          </Routes>
        
        </Container>
        <Footer />

      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
