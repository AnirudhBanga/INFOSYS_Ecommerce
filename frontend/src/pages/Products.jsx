import { useEffect, useState } from "react";
import "../style/products.css";

function Products(){

const [products,setProducts]=useState([]);

useEffect(()=>{
fetchProducts();
},[]);

const fetchProducts=async()=>{
try{
const res=await fetch("http://localhost:8081/api/products");
const data=await res.json();
setProducts(data);
}
catch(error){
console.log(error);
}
};

return(

<div className="products-page">

<h1 className="title">👟 Premium Shoe Store</h1>

<div className="product-grid">

{products.length === 0 && (
<p>No products found. Add from admin panel.</p>
)}

{
products.map((product)=>(

<div key={product.id} className="product-card">

<img
src={`https://source.unsplash.com/400x300/?shoes,${product.name}`}
alt={product.name}
/>

<h3>{product.name}</h3>

<p className="desc">{product.description}</p>

<div className="price">₹ {product.price}</div>

<button>Buy Now</button>

</div>

))
}

</div>

</div>

)

}

export default Products;