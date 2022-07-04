import Head from 'next/head'
import styles from '../styles/Home.module.css'
import canvas from '../src/data.json'
import { Fragment, useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import Header from '../components/header'
import { useContract, useContractRead, useSigner } from 'wagmi'
import abi from '../src/abi/abi.json';
import { ethers } from "ethers";
import axios from 'axios';
import data from '../data.json';

export default function Home() {
  const [results, setResults] = useState([]);
  const { data: signer, isError, isLoading } = useSigner()
  const [ loading, setLoading ] = useState(true);

  const contract = useContract({
    addressOrName: '0x292c25415dac88bfd9a0017270357e9d42b7deb7',
    contractInterface: abi,
    signerOrProvider: signer
  })

  const colors = {
    1: 'black',
    2: 'white',
    3: 'red',
    4: 'orange',
    5: 'green',
    6: 'yellow'
  }

  useEffect(() => {
    if(data){
      setResults(data.data);
    }
    
    console.log(contract);
    if(!contract.provider) return;
    getData();
  }, [contract.provider])

  function saveToCache(items){
    axios.post(
      '/api/data',
      items
    ).then(data => {
      console.log(data);
    });
  }

  async function getData() {
    if(!contract) return;

    console.log('getData');

    let items = [];
    for (let index = 0; index < 1000; index++) {
      items.push({ id: index })
    }

    let requests = items.slice(0);

    let res = [];

    let fn = async (chunks, res) => {
      let curr;

      curr = await Promise.all(chunks.map(prop =>
        new Promise(async resolve => {
          const data = await contract.getColor(prop.id.toString());
          resolve({id: prop.id, color: data});
        })));
      
      res.push(curr);

      return curr !== undefined && requests.length
        ? fn(requests.splice(0, 50), res)
        : res
    }

    fn(requests.splice(0, 50), res)
      .then(data => {
        let items = []
        data.forEach(element => {
          if(!Array.isArray(element)) return;
          element.forEach(item => {
            items.push(item)
          });
        });

        saveToCache(items);
        setResults(items);
      })
      .catch(err => {
        console.error(err);
      }).finally(() => {
        setLoading(false);
      })
  }
  
  return (
    <div className={styles.container}>
      <Header loading={loading} date={data.date}/>

      <main className={styles.main}>
        <div className='canvas-container'>
          <Canvas />
        </div>
      </main>
    </div>
  )

  async function click(element) {

    try{
      const data = await contract.ownerOf(element.index); 
      console.log(element);
      Swal.fire('Square: ' + element.index + ' Owned by ' + data)
    
      console.log('Success', data)
    } catch(err) {
      console.log('without owner', element);
      Swal.fire({
        title: 'Square ' + element.index,
        html: "You can buy this square <br/> <br/> Price: 3 FTM <br/><br/> Choose a color: <br/> <input type='color' value='black'/>",
        icon: 'none',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Mint!'
      }).then((result) => {
        if (result.isConfirmed) {
          buy(element.index)
        }
      })
    }
  }

  async function buy(id, color = 1){
    let overrides = {
      value: ethers.utils.parseEther("1")
    };
    
    let tx = await contract.mintPublic(id, color, overrides);
    console.log(tx);
  }

  function Canvas() {
    return (
      <div className='canvas'>
  
      {results && results.map((x, index) => {
        return (
          <div className='item' key={index} style={{ backgroundColor: colors[x.color] }} onClick={() => click(
            {
              index: x.id,
              color: x.color
            }
          )}></div>
        )
      })} 
  
      </div>
    );
  }

  function LoadingCanvas() {
    return (
      <div className='canvas' style={{ textAlign: ' center'}}>
  
        Loading...

        <br/>
        <br/>
        <br/>
        <br/>
      </div>
    );
  }  
}
