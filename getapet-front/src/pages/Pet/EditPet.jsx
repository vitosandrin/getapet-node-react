import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import api from '../../utils/api'

//Styles
import styles from './AddPet/styles.module.css'

//Global components
import { PetForm } from '../../components'

//Hooks
import useFlashMessage from '../../hooks/useFlashMessage'

const EditPets = () => {

    const [pet, setPet] = useState({})
    const [token] = useState(localStorage.getItem('token'))
    const { id } = useParams()
    const { setFlashMessage } = useFlashMessage()

    useEffect(() => {

        api.get(`/pets/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
            }
        }).then(response => {
            setPet(response.data.pet)
        })

    }, [token, id])


    async function updatePet(pet) {
        let msgType = 'success'

        const formData = new FormData()
        await Object.keys(pet).forEach(key => {
            if (key === 'images') {
                for (let i = 0; i < pet[key].length; i++) {
                    formData.append('images', pet[key][i])
                }
            } else {
                formData.append(key, pet[key])
            }
        })

        const data = await api.patch(`pets/${pet._id}`, formData, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            return response.data
        }
        ).catch(err => {
            msgType = 'error'
            return err.response.data
        })

        setFlashMessage(data.message, msgType)
    }

    return (
        <section>
            <div className={styles.addpet_header}>
                <h1>Editando o pet: {pet.name}</h1>
                <p>Depois da edição os dados serão atualizados no sistema</p>
            </div>
            {pet.name && (
                <PetForm
                    handleSubmit={updatePet}
                    btnText="Atualizar"
                    petData={pet}
                />
            )}
        </section>
    )
}

export default EditPets