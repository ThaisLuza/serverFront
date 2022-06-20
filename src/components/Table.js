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
  const [inputData, setInputData] = useState();

  const getData = async () => {
    const res = await axios.get("http://localhost:4000/products");
    const dados = await res.data;

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
      setInputData(
        item.data_cadastro.slice(0, item.data_cadastro.indexOf("T"))
      );
      setInputPreco(item.preco);
    }
  };

  const salvar = () => {
    const dadosParaSalvar = {
      codigo: inputCodigo,
      descricao: inputDescricao,
      preco: inputPreco,
      data_cadastro: inputData,
    };
    if (isNew) {
      axios
        .post(`http://localhost:4000/products/`, dadosParaSalvar)
        .then(() => {
          const arr = [...data];
          arr.push(dadosParaSalvar);
          setData(arr);
          setIsOpenInput(false);
        });
    } else {
      axios.put(
        `http://localhost:4000/products/${selectedToEdit.id}`,

        dadosParaSalvar
      ).then(()=>{
        const arr = [...data];
        arr[arr.indexOf(selectedToEdit)] = dadosParaSalvar
        setIsOpenInput(false);
        setData(arr)
      })
      
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
        console.log(error);
      });
  };

  const detalhes = async (item) => {
    const dados = await axios
      .get(`http://localhost:4000/products/${item.id}`)
      .catch((error) => {
        setError(true);
        console.log(error);
      });

    setIsOpen(true);
    setDetails(dados.data);
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
            placeholder="preço"
            value={inputPreco}
            onChange={(e) => setInputPreco(e.target.value)}
          ></input>
          <input
            placeholder="YYYY-MM-DD"
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
      {error && <p style={{ color: "red" }}>Ocorreu um erro</p>}
    </div>
  );
}

export default Table;
