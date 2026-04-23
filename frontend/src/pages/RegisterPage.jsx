import { useState } from "react";
import "../style/register.css";
import { useNavigate, Link } from "react-router-dom";

function RegisterPage() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    age: "",
    phoneNo: ""
  });

  const [popup, setPopup] = useState({
    show: false,
    type: "",
    message: ""
  });

  const [passwordStrength, setPasswordStrength] = useState("");
  const [ageError, setAgeError] = useState(false);

  // ✅ Input handler
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });

    // 🔐 Password strength logic
    if (name === "password") {
      if (value.length < 6) {
        setPasswordStrength("weak");
      } else if (
        /[A-Z]/.test(value) &&
        /[0-9]/.test(value)
      ) {
        setPasswordStrength("strong");
      } else {
        setPasswordStrength("medium");
      }
    }

    // 🔢 Age validation
    if (name === "age") {
      if (!/^\d*$/.test(value)) {
        setAgeError(true);
      } else {
        setAgeError(false);
      }
    }
  };

  // ✅ Popup helper
  const showMessage = (type, message) => {
    setPopup({ show: true, type, message });

    setTimeout(() => {
      setPopup({ show: false, type: "", message: "" });
    }, 2000);
  };

  // ✅ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (ageError) {
      showMessage("error", "Age must be a number");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:8081/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form)
        }
      );

      if (res.ok) {
        showMessage("success", "Registration Successful");

        setTimeout(() => {
          navigate("/");
        }, 2000);

      } else {
        showMessage("error", "Registration Failed");
      }

    } catch (error) {
      console.log(error);
      showMessage("error", "Server Error");
    }
  };

  return (

    <div className="container">

      <div className="card">

        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>

          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          {/* 🔐 Password */}
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className={passwordStrength}
            required
          />

          <select
            name="gender"
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          {/* 🔢 Age */}
          <input
            name="age"
            type="text"
            placeholder="Age"
            onChange={handleChange}
            className={ageError ? "input-error" : ""}
            required
          />

          <input
            name="phoneNo"
            placeholder="Phone Number"
            onChange={handleChange}
            required
          />

          <button type="submit">
            Register
          </button>

          <p>
            Already registered?
            <Link to="/"> Login</Link>
          </p>

        </form>
      </div>

      {/* ✅ Popup */}
      {popup.show && (
        <div className="popup">
          <div className={`popup-box ${popup.type}`}>
            <h3>
              {popup.type === "success" ? "✅ Success" : "❌ Error"}
            </h3>
            <p>{popup.message}</p>
          </div>
        </div>
      )}

    </div>
  );
}

export default RegisterPage;