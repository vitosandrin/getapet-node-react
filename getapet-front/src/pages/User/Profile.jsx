import api from "../../utils/api"
//Hooks
import { useState, useEffect } from "react"
import useFlashMessage from "../../hooks/useFlashMessage"

//Styles
import styles from "./styles.module.css"
import FormStyles from "../../components/form/styles.module.css"

//Global components
import { Input, RoundedImage } from "../../components"

const Profile = () => {

    const [user, setUser] = useState('')
    const [token] = useState(localStorage.getItem('token') || '')
    const { setFlashMessage } = useFlashMessage()
    const [preview, setPreview] = useState("")


    useEffect(() => {

        api.get("/users/checkuser", {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        }).then(response => {
            setUser(response.data)
        })

    }, [token])

    function onFileChange(e) {
        setPreview(e.target.files[0])
        setUser({ ...user, [e.target.name]: e.target.files[0] })
    }
    function handleChange(e) {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        let msgType = "success"

        const formData = new FormData()

        const userFormData = await Object.keys(user).forEach(key => {
            formData.append(key, user[key])
        })

        formData.append('user', userFormData)

        const data = await api.patch(`/users/edit/${user._id}`, formData, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {

            return response.data

        }).catch(err => {

            msgType = 'error'
            return err.response.data

        })

        setFlashMessage(data.message, msgType)

    }

    return (
        <div>
            <div className={styles.profile_header}>
                <h1>Perfil</h1>
                {(preview || user.image) && (
                    <RoundedImage
                        src={
                            preview
                                ? URL.createObjectURL(preview) //Process não está sendo execultado OBS: Resolver esse problema
                                : `http://localhost:5000/images/users/${user.image}`
                        }
                        alt={user.name}
                    />
                )}
            </div>
            <form onSubmit={handleSubmit} className={FormStyles.form_container}>
                <Input
                    text="Imagem"
                    type="file"
                    name="image"
                    handleOnChange={onFileChange}
                />
                <Input
                    text="E-mail"
                    type="email"
                    name="email"
                    placeholder="Digite o seu E-mail"
                    handleOnChange={handleChange}
                    value={user.email || ''}
                />
                <Input
                    text="Nome"
                    type="text"
                    name="name"
                    placeholder="Digite o seu nome"
                    handleOnChange={handleChange}
                    value={user.name || ''}
                />
                <Input
                    text="Telefone"
                    type="text"
                    name="phone"
                    placeholder="Digite o seu Telefone"
                    handleOnChange={handleChange}
                    value={user.phone || ''}
                />
                <Input
                    text="Senha"
                    type="password"
                    name="password"
                    placeholder="Digite a sua nova senha"
                    handleOnChange={handleChange}
                />
                <Input
                    text="Cofirmação de Senha"
                    type="password"
                    name="confirmpassword"
                    placeholder="Confirme a sua senha"
                    handleOnChange={handleChange}
                />
                <input type="submit" value="Editar" />
            </form>
        </div>
    )
}

export default Profile