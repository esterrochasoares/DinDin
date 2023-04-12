import "../css/table.css";
import edit from "../assets/edit.svg";
import del from "../assets/delete.svg";
import formatCurrency from "../utils/currency";
import { useEffect, useState } from "react";
import arrow from "../assets/arrow.svg";
import { Filter } from "./filter";

function Table({ transactions, modalEdit, modalDelete }) {
  const [data, setData] = useState(transactions);
  const [sortType, setSort] = useState("unsorted");

  useEffect(() => {
    setData(transactions);
  },[transactions]);

  function formatDate(date) {
    return (date.split("T")[0]).split("-").reverse().join("/");
  }

  function getDiaSemana(date) {
    const weekDay = new Date(date).getDay();
    switch(weekDay) {
      case 0: {
        return "Domingo";
      }
      case 1: {
        return "Segunda";
      }
      case 2: {
        return "Terça";
      }
      case 3: {
        return "Quarta";
      }
      case 4: {
        return "Quinta";
      }
      case 5: {
        return "Sexta";
      }
      case 6: {
        return "Sabado";
      }
      default : {
        return "Desconhecido"
      }
    }
  }

  function sort() {
    let sortableData = data;
    if (sortType === "unsorted") {
      setSort("asc");
      sortableData = data.sort((a, b) => {
        let aDate = new Date(a.data.split("/").reverse().join("-")).getTime();
        let bDate = new Date(b.data.split("/").reverse().join("-")).getTime();
        return aDate - bDate;
      });
    } else {
      if (sortType === "asc") {
        setSort("desc");
        sortableData = data.sort((a, b) => {
          let aDate = new Date(a.data.split("/").reverse().join("-")).getTime();
          let bDate = new Date(b.data.split("/").reverse().join("-")).getTime();
          return bDate - aDate;
        });
      } else {
        setSort("asc");
        sortableData = data.sort((a, b) => {
          let aDate = new Date(a.data.split("/").reverse().join("-")).getTime();
          let bDate = new Date(b.data.split("/").reverse().join("-")).getTime();
          return aDate - bDate;
        });
      }
    }
    setData(sortableData);
  }

  function getFields(fields) {
    let filteredData = [];
    fields.forEach((field) => {
       filteredData.push(...transactions.filter((transaction) => {
        return transaction.categoria_nome === field;
      }));
    });
    setData(filteredData);
  }

  return (
    <div class="filterAndTable">
      <Filter fields={getFields} />
      <br />
      <div class="table">
        <table>
          <thead>
            <tr>
              <th>
                <div class="data" onClick={sort}>
                  Data
                  {sortType === "unsorted" ? (
                    ""
                  ) : sortType === "asc" ? (
                    <img src={arrow} alt=""></img>
                  ) : (
                    <img
                      style={{ transform: "scaleY(-1)" }}
                      src={arrow}
                      alt=""
                    ></img>
                  )}
                </div>
              </th>
              <th>Dia da semana</th>
              <th>Descrição</th>
              <th>Categoria</th>
              <th>Valor</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map((transaction) => {
              return (
                <tr>
                  <td>{formatDate(transaction.data)}</td>
                  <td>{getDiaSemana(transaction.data)}</td>
                  <td>{transaction.descricao}</td>
                  <td>{transaction.categoria_nome}</td>
                  <td
                    style={{
                      color: transaction.tipo === "entrada" ? "#7B61FF" : "#FA8C10",
                    }}
                  >
                    {formatCurrency(transaction.valor)}
                  </td>
                  <td>
                    <img src={edit} alt="" onClick={() => modalEdit(transaction.id)}></img>
                    <img src={del} alt="" onClick={() => modalDelete(transaction.id)}></img>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
