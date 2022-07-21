import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import api from '../../../utils/api'

//Styles
import styles from './styles.module.css'
//Global Components
import { RoundedImage } from '../../../components'

//Hooks
import useFlashMessage from '../../../hooks/useFlashMessage'

const MyPets = () => {
    const [pets, setPets] = useState([])
    const [token] = useState(localStorage.getItem('token') || '')
    const { setFlashMessage } = useFlashMessage()
    const routePath = useLocation();

    const onTop = () => {
        window.scrollTo(0, 0);
    }
    useEffect(() => {
        onTop()
    }, [routePath]);


    useEffect(() => {
        api.get('/pets/mypets', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        })
            .then(response => {
                setPets(response.data.pets)
            })
    }, [token])

    async function removePet(id) {

        let msgType = 'success'
        const data = await api.delete(`/pets/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        }).then(response => {
            //Get all pets filtering by id 
            const updatedPets = pets.filter(pet => pet._id !== id) 
            setPets(updatedPets) //Delete front  
            return response.data //Delete back

        }).catch(err => {
            msgType = 'error'
            return err.response.data
        })

        setFlashMessage(data.message, msgType)
    }

    async function conludeAdoption(id) {
        let msgType = 'success'

        const data = await api.patch(`/pets/conclude/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        }).then(response => response.data).catch(err => {
            msgType = 'error'
            return err.response.data
        })
    }

    return (
        <section>
            <div className={styles.petlist_header}>
                <h1>Meus Pets</h1>
                <Link to='/pet/add'>Cadastrar Pet</Link>
            </div>
            <div className={styles.petlist_container}>
                {pets.length > 0 && (
                    pets.map((pet) => (
                        <div key={pet._id} className={styles.petlist_row}>
                            <RoundedImage
                                src={`${process.env.REACT_APP_API}/images/pets/${pet.images[0]}`}
                                alt={pet.name}
                                width="px75"
                            />
                            <span className='bold'>{pet.name}</span>
                            <div className={styles.action}>
                                {pet.available ? (
                                    <>
                                        {pet.adopter && (
                                            <button className={styles.conclude_btn} onClick={() => {
                                                conludeAdoption(pet._id)
                                            }}>Concluir adoção</button>
                                        )}
                                        <Link to={`/pet/edit/${pet._id}`}>Editar</Link>
                                        <button onClick={() => removePet(pet._id)}>Excluir</button>
                                    </>
                                ) : (
                                    <p>Pet já adotado!</p>
                                )}
                            </div>
                        </div>
                    ))
                )}
                {pets.length === 0 && <p>Não tem nenhum pet cadastrado ;(</p>}
            </div>
        </section>
    )
}

export default MyPets