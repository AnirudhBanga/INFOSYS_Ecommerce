import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/dashboard.css";

function Dashboard(){

const navigate=useNavigate();

const [message,setMessage]=useState("");

useEffect(()=>{
fetchProtectedData();
},[navigate]);

const fetchProtectedData=async()=>{

const token=localStorage.getItem("token");

if(!token){
navigate("/");
return;
}

try{

const res=await fetch(
"http://localhost:8081/api/dashboard",
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

if(res.status===401){
localStorage.removeItem("token");
navigate("/");
return;
}

const data=await res.text();
setMessage(data);

}
catch(error){
console.log(error);
setMessage("Error loading dashboard");
}

};

const logout=()=>{
localStorage.removeItem("token");
navigate("/");
};

return(

<div className="dashboard">

{/* NAVBAR */}
<nav className="navbar">
<h1>ShoeStore 👟</h1>
<p>Discover trending sneakers and premium shoes</p>

<div className="nav-right">

<button onClick={()=>navigate("/products")}>
Browse Products
</button>

<button className="logout" onClick={logout}>
Logout
</button>

</div>

</nav>

{/* HERO SECTION */}
<div className="hero">

<h1>
Step Into Style 👟
</h1>

<p>
Explore premium shoes crafted for comfort and performance.
</p>

<button onClick={()=>navigate("/products")}>
Shop Now
</button>

</div>

{/* MESSAGE */}
<div className="info">
{message}
</div>

</div>

)

}

export default Dashboard;