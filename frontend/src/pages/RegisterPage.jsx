import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function RegisterPage(){

const navigate = useNavigate();

const [form,setForm] = useState({
name:"",
email:"",
password:"",
gender:"",
age:"",
phoneNo:""
});

const handleChange=(e)=>{
setForm({
...form,
[e.target.name]:e.target.value
});
};

const handleSubmit=async(e)=>{
e.preventDefault();

try{

const res = await fetch("http://localhost:8081/api/auth/register",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(form)
});

if(res.ok){
alert("Registration Successful");
navigate("/login");
}else{
alert("Registration Failed");
}

}catch(err){
console.log(err);
alert("Server Error");
}

};

return(
<div className="container">
<div className="card">
<h2>Create Account</h2>

<form onSubmit={handleSubmit}>

<input
name="name"
placeholder="Full Name"
onChange={handleChange}
/>

<input
name="email"
type="email"
placeholder="Email"
onChange={handleChange}
/>

<input
name="password"
type="password"
placeholder="Password"
onChange={handleChange}
/>

<select name="gender" onChange={handleChange}>
<option>Select Gender</option>
<option>Male</option>
<option>Female</option>
</select>

<input
name="age"
placeholder="Age"
onChange={handleChange}
/>

<input
name="phoneNo"
placeholder="Phone Number"
onChange={handleChange}
/>

<button>
Register
</button>

<p>
Already registered?
<Link to="/"> Login</Link>
</p>

</form>
</div>
</div>
)

}

export default RegisterPage;