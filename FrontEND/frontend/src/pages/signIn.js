import "../css/signIn.css";
import logo from "../assets/logo-completo.svg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function signUp() {
    navigate("/signup");
  }

  async function login() {
    const req = { email, senha: password };
    try {
      const res = await axios.post("http://localhost:8000/login", req);
      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("id", res.data.usuario.id);
        navigate("/home");
      }
    } catch (e) {
      setMessage(e.response.data.mensagem);
    }
  }

  return (
    <div class="background">
      <img src={logo} alt="" class="logo" />
      <div class="content">
        <div class="content-left">
          <div class="title">
            Controle suas <span class="highlight">finanças</span>, sem planilha
            chata
          </div>
          <br />
          <div class="subtitle">
            Organizar as suas finanças nunca foi tão fácil, com o DINDIN, você
            tem tudo num único lugar e em um clique de distância
          </div>
          <br />
          <button class="button" onClick={() => signUp()}>
            Cadastre-se
          </button>
        </div>
        <div class="content-right">
          <div class="card">
            <div class="subtitle highlight">Login</div>
            <br />
            <br />
            <div class="label">E-mail</div>
            <input
              class="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div class="label">Password</div>
            <input
              class="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <div class="message">{message}</div>
            <br />
            <button class="button" onClick={login}>
              Entrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
