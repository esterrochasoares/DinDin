import axios from "axios";
import { useEffect, useState } from "react";
import getCategories from "../apis/categories";
import "../css/transactionModal.css";

function TransactionModal({ id, type, close }) {
  const [transactionId, setTransactionId] = useState(id);
  const [categories, setCategories] = useState([]);
  const [btn, setBtn] = useState("saida");
  const [value, setvalue] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(1);
  const [message, setMessage] = useState("");

  function getTransaction(id) {
    setMessage(""); 
    const token = localStorage.getItem("token");
    axios.get(`http://localhost:8000/transacao/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      setBtn(res.data.tipo);
      setCategory(res.data.categoria_id);
      setvalue(res.data.valor);
      setDate(formatDate(res.data.data));
      setDescription(res.data.descricao);
    });
  }

  useEffect(() => {
    async function fn() {
      setBtn("saida");
      setvalue("");
      setDate("");
      setDescription("");
      setCategory(1);
      setMessage("");
      setCategories(await getCategories());
    }
    fn();
  }, [type]);

  useEffect(() => {
    setTransactionId(id);
    getTransaction(id);
  }, [id]);

  function formatDate(date) {
    return (date.split("T")[0]).split("-").reverse().join("/");
  }

  async function submit(id) {
    const token = localStorage.getItem("token");
    const req = {
      descricao: description,
      valor: value,
      data: date.split("/").reverse().join("-"),
      categoria_id: category,
      tipo: btn,
      usuario_id: localStorage.getItem("id"),
    };
    try {
      const res =
        type === "newTransaction"
          ? await axios.post("http://localhost:8000/transacao", req, {
              headers: { Authorization: `Bearer ${token}` },
            })
          : await axios.put(
              `http://localhost:8000/transacao/${transactionId}`,req,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
      if (res.status === 200) {
        close();
      }
    } catch (e) {
      setMessage(e.response.data.mensagem);
    }
  }

  return (
    <div>
      <br />
      <button
        class={btn === "entrada" ? "in" : ""}
        onClick={() => setBtn("entrada")}
      >
        Entrada
      </button>
      <button
        class={btn === "saida" ? "out" : ""}
        onClick={() => setBtn("saida")}
      >
        Saída
      </button>
      <div class="label">Valor</div>
      <input
        class="input"
        value={value}
        onChange={(e) => setvalue(e.target.value)}
      />
      <div class="label">Categoria</div>
      <select
        class="input"
        style={{ width: "93%" }}
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        {categories.map((category) => {
          return <option value={category.id}>{category.descricao}</option>;
        })}
      </select>
      <div class="label">Data</div>
      <input
        class="input"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <div class="label">Descrição</div>
      <input
        class="input"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <br />
      <div class="message">{message}</div>
      <br />
      <div class="centerContent">
        <button class="button" onClick={() => submit(transactionId)}>
          Confirmar
        </button>
      </div>
    </div>
  );
}

export default TransactionModal;
