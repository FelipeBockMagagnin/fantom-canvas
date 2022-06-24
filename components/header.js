import styles from '../styles/Home.module.css'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Swal from 'sweetalert2'

export default function Header() {
    return (
        <div className='header'>
            
            <h1 className={styles.title}>
                Fantom Canvas
            </h1>

            <button onClick={() => Swal.fire('Dont work')}>How it works</button>

            <ConnectButton />
        </div>
    )
}