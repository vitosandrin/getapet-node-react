import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

//Hooks
import { useState, useEffect } from 'react'
import useFlashMessage from "./useFlashMessage"

export default function useAuth() {

    const [authenticated, setAuthenticated] = useState(false)
    const { setFlashMessage } = useFlashMessage()
    const navigate = useNavigate()

    useEffect(() => {

        const token = localStorage.getItem('token')

        if (token) {
            api.defaults.headers.Authorization = `Bearer ${(token)}`
            setAuthenticated(true)
        }

    }, [])

    async function register(user) {

        let msgText = 'Cadastro realizado com sucesso!'
        let msgType = 'success'

        try {
            const data = await
                api.post('/users/register', user)
                    .then(res => {
                        return res.data
                    })
            await authUser(data)

        } catch (err) {
            msgText = err.response.data.message
            msgType = 'error'
        }
        setFlashMessage(msgText, msgType)
    }

    async function login(user) {
        let msgText = "Login realizado com sucesso!"
        let msgType = 'success'

        try {

            const data = await api.post("/users/login", user).then(response => {
                return response.data
            })

            await authUser(data)

        } catch (err) {

            msgText = err.response.data.message
            msgType = 'error'

        }

        setFlashMessage(msgText, msgType)
    }

    async function authUser(data) {
        setAuthenticated(true)
        localStorage.setItem('token', JSON.stringify(data.token))
        navigate('/')
    }


    function logout() {
        const msgText = 'Logout realizado com sucesso!'
        const msgType = 'success'

        setAuthenticated(false)
        localStorage.removeItem('token')
        api.defaults.headers.Authorization = undefined
        navigate("/")

        setFlashMessage(msgText, msgType)
    }

    return { register, authenticated, logout, login }
}