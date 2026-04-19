import { useNavigate, Link } from "react-router-dom";

function LoginPage(){

const navigate = useNavigate();

const handleLogin=(e)=>{
e.preventDefault();

navigate("/dashboard");
};

return(
<div className="container">
<div className="card">

<h2>Login</h2>

<form onSubmit={handleLogin}>

<input
type="email"
placeholder="Email"
/>

<input
type="password"
placeholder="Password"
/>

<button>
Login
</button>

<p>
New user?
<Link to="/register"> Register</Link>
</p>

</form>

</div>
</div>
)
}

export default LoginPage;