import logo from './logo.svg';
import './App.css';
import MindNode from './components/node.components'

import axios from 'axios';

import React,{useState,useEffect,Component} from 'react';
import './App.css';

// function App() {
//   const [data,setData]=useState([]);
//   const getData=()=>{
//     fetch('data.json'
//     ,{
//       headers : { 
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//        }
//     }
//     )
//       .then(function(response){
//         console.log(response)
//         return response.json();
//       })
//       .then(function(myJson) {
//         console.log(myJson);
//         setData(myJson)
//       });
//   }
//   useEffect(()=>{
//     getData()
//   },[])
//   return (
//     <div className="App">
//      {
//        <p>{data}</p>
//      }
//     </div>
//   );
// }

const api = axios.create({
  baseURL: 'http://localhost:3000/getdata/'
})

class App extends Component{

constructor(){
  super();
  api.get('/').then(res => {
    console.log(res.data)
  })
}
}

export default App;
