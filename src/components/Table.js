import { useState, useEffect } from "react";
import Modal from "react-modal";
const axios = require("axios");

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "50px",
  },
};

function Table() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalIsOpenInput, setIsOpenInput] = useState(false);
  const [details, setDetails] = useState();
  const [isNew, setIsNew] = useState(false);
  const [selectedToEdit, setSelectedToEdit] = useState();
  const [inputCodigo, setInputCodigo] = useState();
  const [inputDescricao, setInputDescricao] = useState();
  const [inputPreco, setInputPreco] = useState();
  const [erro, setErro] = useState(false);

  const dadosParaSalvar = {
    codigo: inputCodigo,
    descricao: inputDescricao,
    preco: inputPreco,
  };

  const getData = async () => {
    const res = await axios.get("http://localhost:4000/products");
    const dados = await res.data;

    setData(dados);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (!inputCodigo || !inputDescricao || !inputPreco) {
      setErro(true);
    } else if (
      typeof parseInt(inputCodigo) != "number" ||
      typeof parseInt(inputPreco) != "number" ||
      data.some((c) => c.codigo === parseInt(inputCodigo))
    ) {
      setErro(true);
    } else if (typeof inputDescricao != "string") {
      setErro(true);
    } else {
      setErro(false);
    }
    // console.log(data.some((c) => c.codigo === parseInt(inputCodigo)))
  }, [inputCodigo, inputDescricao, inputPreco]);

  const editar = async (item) => {
    if (!item) {
      setSelectedToEdit("");
      setIsOpenInput(true);
      setInputDescricao("");
      setInputCodigo("");
      setInputPreco("");
      setIsNew(true);
    } else {
      setIsNew(false);
      setSelectedToEdit(item);
      setIsOpenInput(true);
      setInputDescricao(item.descricao);
      setInputCodigo(item.codigo);
      setInputPreco(item.preco);
    }
  };

  const salvar = async () => {
    if (isNew) {
      await axios.post(`http://localhost:4000/products/`, dadosParaSalvar);
      getData();
      setIsOpenInput(false);
    } else {
      axios
        .put(
          `http://localhost:4000/products/${selectedToEdit.id}`,

          dadosParaSalvar
        )
        .then(() => {
          getData();
          setIsOpenInput(false);
        });
    }
  };

  const excluir = (item) => {
    const arr = [...data];
    axios
      .delete(`http://localhost:4000/products/${item.id}`)
      .then(() => {
        arr.splice(arr.indexOf(item), 1);
        setData(arr);
      })
      .catch((error) => {
        setError(true);
      });
  };

  const detalhes = async (item) => {
    const dados = await axios
      .get(`http://localhost:4000/products/${item.id}`)
      .catch((error) => {
        setError(true);
      });

    setIsOpen(true);
    setDetails(dados.data);
  };

  return (
    <div className="main">
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
          <h2>Novos dados:</h2>
          <input
            type="number"
            placeholder="código"
            value={inputCodigo}
            onChange={(e) => setInputCodigo(e.target.value)}
          ></input>
          <input
            placeholder="descrição"
            value={inputDescricao}
            onChange={(e) => setInputDescricao(e.target.value)}
          ></input>
          <input
            type="number"
            placeholder="preço"
            value={inputPreco}
            onChange={(e) => setInputPreco(e.target.value)}
          ></input>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {erro && (
              <div style={{fontSize : '12px', color: "red" }} >
                <p>Insira dados válidos:</p>
                <p>Código e preço precisam ser números.</p>
                <p>Códigos já existentes não são válidos.</p>
                <p> A descrição é o nome do produto.</p>
              </div>
            )}
            <button
              style={{ color: erro ? "#dddddd" : "" }}
              onClick={() => (erro ? "" : salvar())}
            >
              Salvar
            </button>
          </div>
        </div>
      </Modal>
      {data.length !== 0 ? (
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
      ) : (
        <p>Nenhum produto cadastrado</p>
      )}
      <div id="cadastro">
        <button onClick={() => editar(false)}>Cadastrar novo produto</button>
      </div>
      {error && (
        <p style={{ color: "red" }}>
          Ocorreu um erro, por favor atualize a página.
        </p>
      )}
    </div>
  );
}

export default Table;
