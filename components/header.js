import styles from '../styles/Home.module.css'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Swal from 'sweetalert2'

export default function Header({update}) {
    return (
        <div className='header'>

            <h1 className={styles.title}>
                Fantom Canvas
            </h1>

            <div className='center'>
                Last Update 
                <br/>
                {dateTime(update)}
            </div>

            <ConnectButton />
        </div>
    )

    function dateTime(lastUpdate) {
        return lastUpdate.getHours() + ':' + lastUpdate.getMinutes() + ':' + ('0' + lastUpdate.getSeconds()).slice(-2);
    }
}