import {Link} from "react-router-dom"
import { useContext, useState } from "react"

//Context
import { Context } from '../../../context/UserContext'

//Global components
import { Input } from '../../../components'

import styles from '../../form/styles.module.css'

const Register = () => {

  const [user, setUser] = useState({})
  const { register } = useContext(Context)

  function handleChange(e){ //Get all elements from user - update prop name [] with target.value
    setUser({...user, [e.target.name]: e.target.value})
  }
  function handleSubmit(e){ 
    e.preventDefault() //Stop exe form
    register(user)
  }

  return (
    <section className={styles.form_container}>
        <h1>Registrar</h1>
        <form onSubmit={handleSubmit}>
            <Input
              text="Nome"
              type="text"
              name="name"
              placeholder="Digite o seu nome"
              handleOnChange={handleChange}
            />
            <Input
              text="Telofone"
              type="text"
              name="phone"
              placeholder="Digite o seu número"
              handleOnChange={handleChange}
            />
            <Input
              text="E-mail"
              type="email"
              name="email"
              placeholder="Digite o seu E-mail"
              handleOnChange={handleChange}
            />
            <Input
              text="Senha"
              type="password"
              name="password"
              placeholder="Digite a sua senha"
              handleOnChange={handleChange}
            />
            <Input
              text="Confirmar Senha"
              type="password"
              name="confirmpassword"
              placeholder="Confirme a sua senha"
              handleOnChange={handleChange}
            />
            <input type="submit" value="Cadastrar" />
        </form>
        <p>Já tem conta? <Link to="/login">Clique aqui!</Link></p>
    </section>
  )
}

export default Register