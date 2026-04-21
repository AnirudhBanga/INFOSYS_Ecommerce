import {
useEffect,
useState
}
from "react";

import {
useNavigate
}
from "react-router-dom";

function Dashboard(){

const navigate=useNavigate();

const [message,setMessage]=
useState("");

useEffect(()=>{

fetchProtectedData();

},[]);


const fetchProtectedData=async()=>{

const token=
localStorage.getItem("token");

try{

const res=
await fetch(
"http://localhost:8081/api/dashboard",
{
headers:{
Authorization:
`Bearer ${token}`
}
}
);

if(res.status===401){

localStorage.removeItem("token");

navigate("/");

return;

}

const data=
await res.text();

setMessage(data);

}catch(error){

console.log(error);

}

};


const logout=()=>{

localStorage.removeItem(
"token"
);

navigate("/");

};

return(

<div className="dashboard">

<nav className="navbar">

<h2>
Infosys E-Commerce
</h2>

<button onClick={logout}>
Logout
</button>

</nav>

<div className="welcome">

<h1>
Welcome User
</h1>

<p>
{message}
</p>

</div>

</div>

)

}

export default Dashboard;