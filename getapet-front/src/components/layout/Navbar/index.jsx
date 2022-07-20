import React, { useContext } from "react"
import {Link} from "react-router-dom"

//css
import styles from "./styles.module.css"
import Logo from "../../../assets/img/logo.png"

//context

function Navbar() {

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar_logo}>
        <img src={Logo} alt="get a pet" />
        <h2>GET A PET</h2>
      </div>
      <ul>
        <li>
          <Link to="/">Adotar</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar

/*{
          authenticated ? (
            <>
              <li>
                <Link to="/pet/myadoptions">Minhas Adoções</Link>
              </li>
              <li>
                <Link to="/pet/mypets">Meus Pets</Link>
              </li>
              <li>
                <Link to="/user/profile">Perfil</Link>
              </li>
              <li onClick={logout}>Sair</li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Entrar</Link>
              </li>
              <li>
                <Link to="/register">Cadastrar</Link>
              </li>
            </>
          )
        } */