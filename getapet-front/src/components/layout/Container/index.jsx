import React from 'react'

//css
import styles from "./styles.module.css"

const Container = ({children}) => {
  return (
    <main className={styles.container}>
        {children}
    </main>
  ) 
}

export default Container