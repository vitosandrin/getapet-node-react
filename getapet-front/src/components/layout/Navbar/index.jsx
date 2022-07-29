import React, { useContext } from "react"
import { Link } from "react-router-dom"

//Styles
import styles from "./styles.module.css"
import Logo from "../../../assets/img/logo.png"

import { Context } from '../../../context/UserContext'

const Navbar = () => {

  const { authenticated, logout } = useContext(Context)

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar_logo}>
        <img src={Logo} alt="get a pet" />
        <h2>Get a Pet</h2>
      </div>
      <ul>
        <li>
          <Link to="/">Adotar</Link>
        </li>
        {
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
        }
      </ul>
    </nav>
  )
}

export default Navbar