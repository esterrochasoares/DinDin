import axios from "axios";
import { useEffect, useState } from "react";
import "../css/transactionModal.css";

function DeleteModal({ close, id }) {
  const [transactionId, setTransactionId] = useState(id);

  useEffect(() => {
    setTransactionId(id);
  }, [id]);

  async function remove() {
    const token = localStorage.getItem("token");
    const res = await axios.delete(`http://localhost:8000/transacao/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 200) {
        close();
    }
  }

  return (
    <div style={{ flexGrow: "1", display: "flex", flexDirection: "row" }}>
      <button class="in" onClick={remove}>Sim</button>
      <button class="out" onClick={close}>Não</button>
    </div>
  );
}

export default DeleteModal;
