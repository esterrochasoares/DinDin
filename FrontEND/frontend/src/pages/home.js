import "../css/home.css";
import logo from "../assets/logo-completo.svg";
import UserInfo from "../components/userInfo";
import Table from "../components/table";
import Summary from "../components/summary";
import Modal from "../components/modal";
import React, { useEffect, useRef, useState } from "react";
import TransactionModal from "../components/transactionModal";
import UserModal from "../components/userModal";
import DeleteModal from "../components/deleteModal";
import { Navigate } from "react-router-dom";
import axios from "axios";

function Home() {

  let totalIn = 0;
  let totalOut = 0;

  const modalRef = useRef();
  const userInfoRef = useRef();
  const [modalType, setModalType] = useState();
  const token = localStorage.getItem("token");
  const [transactions, setTransactions] = useState([]);
  const [transactionId, setTransactionId] = useState(0);

  async function getTransactions() {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:8000/transacao", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTransactions(res.data);
  }

  useEffect(() => {
    getTransactions();
  }, []);

  transactions.forEach((transaction) => {
    if (transaction.tipo === "entrada") {
      totalIn += transaction.valor;
    } else {
      totalOut += transaction.valor;
    }
  });

  function openModalAdd() {
    modalRef.current.open("Adicionar Registro");
    setModalType("newTransaction");
  }

  function openModalEdit(id) {
    setTransactionId(id);
    modalRef.current.open("Editar Registro");
    setModalType("editTransaction");
  }

  function openModalUser() {
    modalRef.current.open("Editar Perfil");
    setModalType("user");
  }

  function openModalDelete(id) {
    setTransactionId(id);
    modalRef.current.open("Apagar item?");
    setModalType("delete");
  }

  function closeModalUser() {
    userInfoRef.current.getUser();
    modalRef.current.close();
  }

  function closeModalDelete() {
    getTransactions();
    modalRef.current.close();
  }

  function closeModalTransaction() {
    getTransactions();
    modalRef.current.close();
  }

  function getModal(id) {
    if (modalType === "newTransaction" || modalType === "editTransaction") {
      return <TransactionModal type={modalType} close={closeModalTransaction} id={transactionId}/>;
    } else if (modalType === "user") {
      return <UserModal close={closeModalUser} />;
    } else if (modalType === "delete") {
      return <DeleteModal close={closeModalDelete} id={transactionId}/>;
    }
  }

  return token ? (
    <div class="background">
      <div class="header">
        <img src={logo} alt="" class="logo" />
        <UserInfo modal={openModalUser} ref={userInfoRef} />
      </div>
      <div class="content roundBorders">
        <Table
          transactions={transactions}
          modalEdit={openModalEdit}
          modalDelete={openModalDelete}
        />
        <div class="summaryAndButton">
          <Summary totalIn={totalIn} totalOut={totalOut} />
          <br />
          <br />
          <button class="button" onClick={openModalAdd}>
            Adicionar registro
          </button>
        </div>
      </div>
      <Modal ref={modalRef}>{getModal()}</Modal>
    </div>
  ) : (
    <Navigate to="/" />
  );
}

export default Home;
