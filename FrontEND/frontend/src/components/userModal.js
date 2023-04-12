import { useEffect, useState } from "react";
import axios from "axios";

function UserModal({ close }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  function getUser() {
    setMessage("");
    setPassword("");
    setConfirmPassword("");
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:8000/usuario", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setName(res.data.nome);
        setEmail(res.data.email);
      });
  }

  useEffect(() => {
    getUser();
  }, []);

  function verifyPassword() {
    return password === confirmPassword ? true : false;
  }

  async function update() {
    const token = localStorage.getItem("token");
    if (verifyPassword()) {
      const req = { nome: name, email, senha: password };
      try {
        const res = await axios.put("http://localhost:8000/usuario", req, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 204) {
          close();
        }
      } catch (e) {
        setMessage(e.response.data.mensagem);
      }
    } else {
      setMessage("As senhas devem ser iguais");
    }
  }

  return (
    <div class="centerContent">
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
      <div class="message">{message}</div>
      <br />
      <button class="button" onClick={update}>
        Confirmar
      </button>
    </div>
  );
}

export default UserModal;
