import React from "react"

import styles from "./styles.module.css"

const RoundedImage = ({src, alt, width}) => {
  return (
    <img 
        className={`${styles.rounded_image} ${styles[width]}`}
        src={src}
        alt={alt}
    />
  )
}

export default RoundedImage