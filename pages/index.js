import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import canvas from '../src/data.json'
import { Fragment } from 'react'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Fantom Canvas</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Fantom Canvas!</a>
        </h1>

        <div className='canvas'>
          {buildCanvas()}
        </div>

      </main>

     
    </div>
  )
}

function buildCanvas(){
    let lastX = 0;
    let lastY = 0;

    let elements = canvas.items.map(element => {      
      /* 
        Color {element.name}
        <br/>
        Name {element.color}
        <br/>
        X: {element.x}
        <br/>
        Y: {element.y}
     */
      let item = (
        <Fragment>
          {element.x < lastX ? (<div className='break'></div>) : ''}
          <div className='item' style={{backgroundColor: element.color}}>
            
          </div>
        </Fragment>
      )
      lastX = element.x;
      lastY = element.y;

      return item;
    })

    return elements
}