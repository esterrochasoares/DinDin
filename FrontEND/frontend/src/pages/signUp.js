import "../css/signUp.css";
import logo from "../assets/logo-completo.svg";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  function verifyPassword() {
    return password === confirmPassword ? true : false;
  }

  async function register() {
    if (verifyPassword()) {
      const req = { nome: name, email, senha: password };
      try {
        const res = await axios.post("http://localhost:8000/usuario", req);
        if (res.status === 200) {
          navigate("/signin");
        }
      } catch (e) {
        setMessage(e.response.data.mensagem);
      }
    } else {
      setMessage("As senhas devem ser iguais");
    }
  }

  return (
    <div class="background">
      <img src={logo} alt="" class="logo" />
      <div class="content">
        <div class="card cardCenter">
          <div class="subtitle highlight">Cadastre-se</div>
          <br />
          <br />
          <div class="label">Nome</div>
          <input
            class="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div class="label">E-mail</div>
          <input
            class="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div class="label">Senha</div>
          <input
            class="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div class="label">Confirmação de senha</div>
          <input
            class="input"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <br />
          <br />
          <button class="button" onClick={register}>
            Cadastrar
          </button>
          <br />
          <div class="message">{message}</div>
          <br />
          <a href="/" class="text highlight">
            Já tem cadastro? Clique aqui!
          </a>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
