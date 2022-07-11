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
  const [ items, setItems] = useState(0);

  const contract = useContract({
    addressOrName: '0x292c25415dac88bfd9a0017270357e9d42b7deb7',
    contractInterface: abi,
    signerOrProvider: signer
  })

  const colors = {
    1: 'black', //black
    2: '#db2828', //red
    3: '#21ba45', //green
    4: '#fbbd08', //yealoww
    5: '#b5cc18', // olive
    6: '#f2711c',//orange
    7: '#00b5ad', //teal
    8: '#2185d0', //blue
    9: '#6435c9', // violet
    10: '#a333c8', //purple
    11: '#e03997', //pink
    12: 'white', //white
  }

  
  useEffect(() => {
    if(data && loading){
      setResults(data.data);
    }
    
    console.log(contract);
    if(!(contract.provider) || !(loading)) return;
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
      setItems(requests.length);
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
      <Header loading={loading} date={data.date} items={items}/>

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
        html: "You can buy this square <br/> <br/> Price: 3 FTM <br/><br/> Choose a color: <br/> "+ 

        '<input type="radio" name="color" id="black" value="1" />' +
        '<label for="black"><span class="black"></span></label>'+

        '<input type="radio" name="color" id="red" value="2" />' +
        '<label for="red"><span class="red"></span></label>'+

        '<input type="radio" name="color" id="green" value="3" />'+
        '<label for="green"><span class="green"></span></label>'+

        '<input type="radio" name="color" id="yellow" value="4"/>'+
        '<label for="yellow"><span class="yellow"></span></label>'+

        '<input type="radio" name="color" id="olive" value="5" />'+
        '<label for="olive"><span class="olive"></span></label>'+

        '<input type="radio" name="color" id="orange" value="6"/>'+
        '<label for="orange"><span class="orange"></span></label>'+

        '<input type="radio" name="color" id="teal" value="7"/>'+
        '<label for="teal"><span class="teal"></span></label>'+

        '<input type="radio" name="color" id="blue" value="8"/>'+
        '<label for="blue"><span class="blue"></span></label>'+

        '<input type="radio" name="color" id="violet" value="9"/>'+
        '<label for="violet"><span class="violet"></span></label>'+

        '<input type="radio" name="color" id="purple" value="10"/>'+
        '<label for="purple"><span class="purple"></span></label>'+

        '<input type="radio" name="color" id="pink" value="11"/>' +
        '<label for="pink"><span class="pink"></span></label>' +

        '<input type="radio" name="color" id="white" value="12"/>' +
        '<label for="white"><span class="white"></span></label>',
        icon: 'none',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Mint!',
        customClass: 'swal-wide',
      }).then((result) => {
        if (result.isConfirmed) {
          buy(element.index)
        }
      })
    }
  }

  async function buy(id){
    let overrides = {
      value: ethers.utils.parseEther("1")
    };

    let color = document.querySelectorAll('input[name=color]:checked');
    
    let tx = await contract.mintPublic(id, color[0].value, overrides);
    console.log(tx);

    //Swal.fire('Success', 'Square minted', 'success')
    let data = results;
    data[id] = { id: id, color: color[0].value};
    setResults(data);
    setItems(id);
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
}
