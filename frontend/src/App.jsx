import {
BrowserRouter,
Routes,
Route,
Navigate
}
from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";


function PrivateRoute({children}){

const token=
localStorage.getItem("token");

return token
? children
: <Navigate to="/" replace/>;

}


function App(){

return(

<BrowserRouter>

<Routes>

<Route
path="/"
element={<LoginPage/>}
/>

<Route
path="/register"
element={<RegisterPage/>}
/>

<Route
path="/dashboard"
element={
<PrivateRoute>
<Dashboard/>
</PrivateRoute>
}
/>


<Route
path="/admin"
element={
<PrivateRoute>
<AdminDashboard/>
</PrivateRoute>
}
/>

</Routes>

</BrowserRouter>

)

}

export default App;