import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/register.css";
import toast from "react-hot-toast";
import axios from "axios";

function Login() {
  const [formDetails, setFormDetails] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const inputChange = (e) => {
    const { name, value } = e.target;
    return setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  const formSubmit = async (e) => {
    try {
      e.preventDefault();
      const { email, password } = formDetails;
      if (!email || !password) {
        return toast.error("Input field should not be empty");
      }

      const response = await axios.post(
        'http://localhost:5000/users/login',
        JSON.stringify({ user_name: email, password: password}),
        {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        }
      );
      localStorage.setItem("token", response?.data);
      return navigate("/")
    } catch (error) {
      return error;
    }
  };

  const getUser = async (id) => {
  };
  return (
    <section className="register-section flex-center">
      <div className="register-container flex-center">
        <h2 className="form-heading">Sign In</h2>
        <form
          onSubmit={formSubmit}
          className="register-form"
        >
          <input
            type="text"
            name="email"
            className="form-input"
            placeholder="Enter your User Name"
            value={formDetails.email}
            onChange={inputChange}
          />
          <input
            type="password"
            name="password"
            className="form-input"
            placeholder="Enter your password"
            value={formDetails.password}
            onChange={inputChange}
          />
          <button
            type="submit"
            className="btn form-btn"

          >
            sign in
          </button>
        </form>
        <p>
          Not a user?{" "}
          <NavLink
            className="login-link"
            to={"/register"}
          >
            Register
          </NavLink>
        </p>
      </div>
    </section>
  );
}

export default Login;