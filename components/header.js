import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import canvas from '../src/data.json'
import { Fragment } from 'react'
import Swal from 'sweetalert2'
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Home() {
    return (
        <div className={styles.container}>
            <ConnectButton />
            <h1 className={styles.title}>
                Fantom Canvas
            </h1>
        </div>
    )
}