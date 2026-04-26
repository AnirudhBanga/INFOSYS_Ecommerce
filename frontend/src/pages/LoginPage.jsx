import { useState } from "react";
import "../style/login.css";
import { useNavigate, Link } from "react-router-dom";

function LoginPage() {

const navigate=useNavigate();

const [email,setEmail]=useState("");
const [password,setPassword]=useState("");

const [popup,setPopup]=useState({
show:false,
type:"",
message:""
});


const showMessage=(type,message)=>{

setPopup({
show:true,
type:type,
message:message
});

setTimeout(()=>{
setPopup({
show:false,
type:"",
message:""
});
},2000);

};


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

const data=await res.json();

localStorage.setItem(
"token",
data.token
);

showMessage(
"success",
"Login Successful"
);


setTimeout(()=>{
navigate("/dashboard");
},2000);

}

else{

showMessage(
"error",
"Invalid Login Credentials"
);

}

}

catch(error){

console.log(error);

showMessage(
"error",
"Server Error"
);

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
onChange={(e)=>
setEmail(e.target.value)
}
required
/>


<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>
setPassword(e.target.value)
}
required
/>


<button type="submit">
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



{popup.show && (

<div className="popup">

<div className={`popup-box ${popup.type}`}>

<h3>
{
popup.type==="success"
?
"✅ Success"
:
"❌ Error"
}
</h3>

<p>
{popup.message}
</p>

</div>

</div>

)}

</div>

)

}

export default LoginPage;