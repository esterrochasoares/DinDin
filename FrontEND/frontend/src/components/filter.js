import { useEffect, useState } from "react";
import getCategories from "../apis/categories";
import filter from "../assets/filter.svg";
import "../css/filter.css";

export function Filter({ fields }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [categories, setCategories] = useState([]);

  function openOrClose() {
    setExpanded(!expanded);
  }

  useEffect(() => {
    async function fn() {
      const cat = (await getCategories()).map((category) => {
        return category.descricao;
      });
      const op = (await getCategories()).map((category) => {
        return category.descricao;
      });
      setCategories(cat);
      setSelectedOptions(op);
    }
    fn();
  }, []);

  function value(val) {
    selectedOptions.includes(val)
      ? selectedOptions.splice(selectedOptions.indexOf(val), 1)
      : selectedOptions.push(val);
    setSelectedOptions(selectedOptions);
    console.log(selectedOptions);
    fields(selectedOptions);
  }

  return (
    <div>
      <div class="filtrar" onClick={openOrClose}>
        <img src={filter} alt=""></img>
        Filtrar
      </div>
      <div style={{ display: expanded ? "flex" : "none" }} class="options">
        {categories.map((option) => {
          return <Option label={option} value={value} />;
        })}
      </div>
    </div>
  );
}

export function Option({ label, value }) {
  const [selectedOption, setSelectedOption] = useState(true);
  function selectOption() {
    setSelectedOption(!selectedOption);
    value(label);
  }
  return (
    <div
      class={selectedOption ? "selected option" : "option"}
      onClick={selectOption}
    >
      {label}
    </div>
  );
}
