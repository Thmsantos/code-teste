import React, { useState, useEffect } from "react";
import { Button, CloseButton, Table, Form, Modal } from "react-bootstrap";
import { saveAs } from "file-saver";
import Axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

function AvalicacoesPendentes() {
  
  const { email } = useParams();

  const [modal, setModal] = useState(false);
  const [modalPdf, setmodalPdf] = useState(false);
  const [dados, setDados] = useState([]);
  const [descricao, setDescricao] = useState("");
  const [medico, setMedico] = useState("");
  const [msgPdfAtleta,setmsgPdfAtleta] = useState('')

  const [pdf,setPdf] = useState('')
  const [deletarurl,setDeletarurl] = useState(false)

  useEffect(() => {
    Axios.get(`http://localhost:3001/atleta/verExamesSolicitados/${email}`)
      .then((res) => {
        setDados(res.data);
        setMedico(res.data[0].medico);
        setDescricao(res.data[0].descricao);
      })  
      .catch((error) => {
        toast.error('Houve um erro!')
      });
  }, []);

  useEffect(() => {
    if(deletarurl === true){
      Axios.put(`http://localhost:3001/atleta/modificarPdf/${email}`,{
        decisao:false
      })
      .then((res) => (res))
      .catch((error) => {
        toast.error('Houve um erro!')
      })
      setDeletarurl(false)
    }
  } , [deletarurl]);


  async function ViewPdf ( ){
    await Axios.put(`http://localhost:3001/atleta/modificarPdf/${email}`,{
      decisao:true
    })
    .then((res) => {  
      setPdf(res.data.msg)
    })
  }

  function enviarExame () {
    let arquivo = document.getElementById("file").files[0]  
    var formData = new FormData();
    formData.append('pdf',arquivo);
    Axios.put(`http://localhost:3001/atleta/enviarPdf/${email}` ,formData,{
    headers: {
      'Content-Type': 'multipart/form-data'
    }
    })
    .then((res) => {
      setmsgPdfAtleta(res.data.msg)
      setTimeout(() => {
        window.location.reload();
      },'1000')
    })
  }

  return (
    <div>
      {dados.length > 0 ? 
      <Table striped bordered hover>
        <thead>
          <tr className="titulo bg-tabela text-black">
            <th>guia do exame:</th>
            <th>Situação:</th>
            <th>Enviar Exame:</th>
          </tr>
        </thead>
        <tbody>
          {dados.map((dados) => {
            return (
              <tr>
                <td>
                  <Button
                    onClick={() => {
                      ViewPdf(); 
                      setmodalPdf(true);    
                    }}
                  >
                    Visualizar guia
                  </Button>
                </td>
                <td>{dados.situacao}</td>
                <td>
                  {dados.situacao == "PENDENTE" ? (
                    <Button variant="success" onClick={() => setModal(true)}>
                      Enviar
                    </Button>
                  ) : (
                    "Encerrado"
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
        </Table>
          : 'não há exames no momento'}
        {/* ---------------------------- Modal ------------------------ */}

        <Modal show={modal} onHide={() => setModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Enviar exame solicitado: </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
            <h3 style={{color:'green'}}>{msgPdfAtleta}</h3>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Descrição do exame:</Form.Label>
                <Form.Control
                  autoFocus
                  disabled
                  value={descricao}
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Médico:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder=""
                  disabled
                  value={medico}
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Enviar PDF do Exame:</Form.Label>
                <input type="file" accept="application/pdf" id='file'/>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={() => {
              enviarExame()
            }}>
              Enviar
            </Button>
          </Modal.Footer>
        </Modal>

        {/* ---------------------------- Modal visualizar PDF ------------------------ */}

        <Modal show={modalPdf} onHide={() => setmodalPdf(false)}>
          <Modal.Header>
            <Modal.Title>Ver exame: </Modal.Title>
            <CloseButton onClick={() => {
              setDeletarurl(true)
              setmodalPdf(false)
              }} />
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Descrição do exame:</Form.Label>
                <Form.Control
                  as="textarea"
                  autoFocus
                  disabled
                  style={{ resize: "none" }}
                  value={descricao}
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Médico:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder=""
                  disabled
                  value={medico}
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                  <Button variant="success"  onClick={() => { saveAs(pdf) }}>
                    Baixar PDF do Exame
                  </Button>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>

    </div>
  );
}

export default AvalicacoesPendentes;
