import { useNavigate } from "react-router-dom";

function Dashboard(){

const navigate=useNavigate();

const logout=()=>{
navigate("/");
};

return(
<div className="dashboard">

<nav className="navbar">
<h2>Infosys E-Commerce</h2>

<button onClick={logout}>
Logout
</button>

</nav>

<div className="welcome">
<h1>Welcome User</h1>
<p>Your dashboard is working.</p>
</div>

</div>
)

}

export default Dashboard;