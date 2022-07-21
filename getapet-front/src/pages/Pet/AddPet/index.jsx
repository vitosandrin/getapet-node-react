import { useState, useEffect } from 'react'
import api from '../../../utils/api'

//Styles
import styles from './styles.module.css'

import { useNavigate, useLocation } from 'react-router-dom'
//Hooks
import useFlashMessage from '../../../hooks/useFlashMessage'

//Global Components
import { PetForm } from '../../../components'

const AddPet = () => {
    const [token] = useState(localStorage.getItem('token') || '')
    const { setFlashMessage } = useFlashMessage()
    const navigate = useNavigate()
    const routePath = useLocation();

    const onTop = () => {
        window.scrollTo(0, 0);
    }
    useEffect(() => {
        onTop()
    }, [routePath]);


    async function registerPet(pet) {
        let msgType = 'success'

        const formData = new FormData
        //Get single pet and add to formdata, not body 
        await Object.keys(pet).forEach((key) => {
            if (key === 'images') {

                for (let i = 0; i < pet[key].length; i++) {
                    formData.append('images', pet[key][i])
                }

            } else {
                //With key.name append to pet.keyname
                formData.append(key, pet[key])
            }
        })

        const data = await api.post('/pets/create', formData, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
                'Content-Type': 'multipart/form-data',
            }
        })
            .then(response => {
                return response.data
            }
            )
            .catch(err => {
                msgType = 'error'
                return err.response.data
            })

        setFlashMessage(data.message, msgType)
        if (msgType !== 'error') {
            navigate('/pet/mypets')
        }
    }

    return (
        <section className={styles.addpet_header}>
            <div>
                <h1>Cadastre um Pet</h1>
                <p>Depois ele ficará disponivel para adoção</p>
            </div>
            <PetForm
                btnText='Cadastrar Pet'
                handleSubmit={registerPet}
            />
        </section>
    )
}

export default AddPet