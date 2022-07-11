import styles from '../styles/Home.module.css'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Swal from 'sweetalert2'

export default function Header({ loading, date, items }) {
    return (
        <div className='header'>

            <h1 className={styles.title}>
                Fantom Canvas
            </h1>

            {loading ? <LoadingCanvas /> : ''}

            <ConnectButton />
        </div>
    )

    function LoadingCanvas() {
        return (
            <div className='canvas' style={{ textAlign: ' center' }}>
                Loading new Data 
                <br/>
                ({1000-items}/1000)
                <br/>
                Last update: {new Date(date).toLocaleString()} 
                <br/>
            </div>
        );
    }
}