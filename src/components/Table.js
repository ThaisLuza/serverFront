import { useState, useEffect } from "react";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

function Table() {
  const [data, setData] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalIsOpenInput, setIsOpenInput] = useState(false);
  const [details, setDetails] = useState();
  const [isNew, setIsNew] = useState(false);
  const [selectedToEdit, setSelectedToEdit] = useState();
  const [inputCodigo, setInputCodigo] = useState();
  const [inputDescricao, setInputDescricao] = useState();
  const [inputPreco, setInputPreco] = useState();
  const [inputData, setInputData] = useState();

  const getData = async () => {
    const res = await fetch("http://localhost:4000/products");
    const dados = await res.json();

    setData(dados);
  };

  useEffect(() => {
    getData();
  }, []);

  const editar = async (item) => {
    if (!item) {
      setSelectedToEdit("");
      setIsOpenInput(true);
      setInputDescricao("");
      setInputCodigo("");
      setInputData("");
      setInputPreco("");
      setIsNew(true);
    } else {
      setIsNew(false);
      setSelectedToEdit(item);
      setIsOpenInput(true);
      setInputDescricao(item.descricao);
      setInputCodigo(item.codigo);
      setInputData(item.data_cadastro);
      setInputPreco(item.preco);
    }
  };

  const salvar = async () => {
    if (isNew) {
      const res = await fetch(`http://localhost:4000/products/`, {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8", // Indicates the content
        },
        body: JSON.stringify({
          codigo: inputCodigo,
          descricao: inputDescricao,
          preco: inputPreco,
          data_cadastro: inputData,
        }),
      });
    } else {
      const res = await fetch(
        `http://localhost:4000/products/${selectedToEdit.id}`,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json; charset=UTF-8", // Indicates the content
          },
          body: JSON.stringify({
            codigo: inputCodigo,
            descricao: inputDescricao,
            preco: inputPreco,
            data_cadastro: inputData,
          }),
        }
      );
      const dados = await res.json();
      return dados;
    }
  };

  const excluir = (item) => {
    const arr = [...data];
    arr.splice(data.indexOf(item), 1);
    fetch(`http://localhost:4000/products/${item.id}`, {
      method: "DELETE",
    });
    setData(arr);
  };

  const detalhes = async (item) => {
    const res = await fetch(`http://localhost:4000/products/${item.id}`);
    const dados = await res.json();
    setIsOpen(true);
    setDetails(dados);
  };

  const cadastrar = async (item) => {
    const res = await fetch(`http://localhost:4000/products/${item.id}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8", // Indicates the content
      },
      body: JSON.stringify({
        codigo: inputCodigo,
        descricao: inputDescricao,
        preco: inputPreco,
        data_cadastro: inputData,
      }),
    });
    const dados = await res.json();
    return dados;
  };

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setIsOpen(false)}
        style={customStyles}
        contentLabel="Example Modal"
      >
        {details && (
          <div>
            <p>Código: {details.codigo}</p>
            <p>Descrição: {details.descricao}</p>
            <p>Preço: {details.preco}</p>
            <p>
              Data de cadastro:{" "}
              {details.data_cadastro.split("-")[2].slice(0, 2)}/
              {details.data_cadastro.split("-")[1]}/
              {details.data_cadastro.split("-")[0]}
            </p>
          </div>
        )}
      </Modal>
      <Modal
        isOpen={modalIsOpenInput}
        onRequestClose={() => setIsOpenInput(false)}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div>
          <input
            value={inputCodigo}
            onChange={(e) => setInputCodigo(e.target.value)}
          ></input>
          <input
            value={inputDescricao}
            onChange={(e) => setInputDescricao(e.target.value)}
          ></input>
          <input
            value={inputPreco}
            onChange={(e) => setInputPreco(e.target.value)}
          ></input>
          <input
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
          ></input>
          <button onClick={() => salvar()}>Salvar</button>
        </div>
      </Modal>
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Descrição</th>
          </tr>
        </thead>

        <tbody>
          {data &&
            data.map((item, key) => (
              <tr key={key}>
                <td>{item.codigo}</td>
                <td>{item.descricao}</td>
                <td>
                  <button onClick={() => editar(item)}>Editar</button>
                </td>
                <td>
                  <button onClick={() => excluir(item)}>Deletar</button>
                </td>
                <td>
                  <button onClick={() => detalhes(item)}>Detalhes</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div>
        <button onClick={() => editar(false)}>Cadastrar novo produto</button>
      </div>
    </div>
  );
}

export default Table;
