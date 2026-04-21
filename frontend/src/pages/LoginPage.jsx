import {useState} from "react";

import {
useNavigate,
Link
}
from "react-router-dom";

function LoginPage(){

const navigate=useNavigate();

const [email,setEmail]=useState("");
const [password,setPassword]=useState("");

const handleLogin=async(e)=>{

e.preventDefault();

try{

const res=
await fetch(
"http://localhost:8081/api/auth/login",
{
method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
email,
password
})
}
);

if(res.ok){

const data=
await res.json();

localStorage.setItem(
"token",
data.token
);

navigate("/dashboard");

}else{

alert("Invalid Login");

}

}catch(error){

console.log(error);

alert("Server Error");

}

};

return(

<div className="container">

<div className="card">

<h2>Login</h2>

<form onSubmit={handleLogin}>

<input
type="email"
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<button>
Login
</button>

<p>
New User?

<Link to="/register">
Register
</Link>

</p>

</form>

</div>

</div>

)

}

export default LoginPage;