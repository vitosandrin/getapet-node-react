import React from "react";
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
import { Home, Register, Login, Profile, MyPets, EditPet, PetDetail, MyAdoptions } from './pages'
import AddPet from "./pages/Pet/AddPet";

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
            <Route path="/pet/mypets" exact element={<MyPets />} />
            <Route path="/pet/myadoptions" exact element={<MyAdoptions />} />
            <Route path="/pet/add" exact element={<AddPet />} />
            <Route path="/pet/edit/:id" exact element={<EditPet />} />
            <Route path="/pet/:id" exact element={<PetDetail />} />
          </Routes>
        
        </Container>
        <Footer />

      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
