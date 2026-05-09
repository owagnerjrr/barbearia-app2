import { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Cliente() {
  const [tela, setTela] = useState("home");
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [horariosOcupados, setHorariosOcupados] = useState([]);
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [dataObj, setDataObj] = useState(null);

  const [buscaTelefone, setBuscaTelefone] = useState("");
  const [meusAgendamentos, setMeusAgendamentos] = useState([]);

  const horarios = [
    "07:00","08:00","09:00","09:40","10:20",
    "11:00","11:40","12:00","12:30","13:00",
    "13:30","14:00","15:00","16:00","17:00"
  ];

  const buscarHorariosOcupados = async (data) => {
    const querySnapshot = await getDocs(collection(db, "agendamentos"));
    const ocupados = [];

    querySnapshot.forEach((docItem) => {
      const agendamento = docItem.data();
      if (agendamento.data === data) {
        ocupados.push(agendamento.horario);
      }
    });

    setHorariosOcupados(ocupados);
  };

  const confirmarAgendamento = async () => {
    try {
      await addDoc(collection(db, "agendamentos"), {
        nome,
        telefone,
        data: dataSelecionada,
        horario: horarioSelecionado
      });

      const dataBR = dataSelecionada.split("-").reverse().join("/");

      const mensagem = `💈 Agendamento confirmado!

👤 ${nome}
📅 ${dataBR}
⏰ ${horarioSelecionado}

Confirmado 👍`;

      const telefoneFormatado = "35998598071";

      const url = `https://wa.me/55${telefoneFormatado}?text=${encodeURIComponent(mensagem)}`;

      window.location.href = url;

    } catch (error) {
      console.error(error);
      alert("Erro ao agendar");
    }
  };

  const buscarMeusAgendamentos = async () => {
    const querySnapshot = await getDocs(collection(db, "agendamentos"));
    const lista = [];

    querySnapshot.forEach((docItem) => {
      const data = docItem.data();
      if (data.telefone === buscaTelefone) {
        lista.push({
          id: docItem.id,
          ...data
        });
      }
    });

    setMeusAgendamentos(lista);
  };

  const cancelarAgendamento = async (id) => {
    if (!window.confirm("Cancelar agendamento?")) return;

    await deleteDoc(doc(db, "agendamentos", id));
    buscarMeusAgendamentos();
  };

  const desabilitarDias = (date) => {
    const [ano, mes, dia] = date.split("-");
    const dataLocal = new Date(Number(ano), Number(mes) - 1, Number(dia));
    const diaSemana = dataLocal.getDay();

    return diaSemana === 0 || diaSemana === 1;
  };

  return (
    <div style={{
      width: "100%",
      minHeight: "100vh",
      backgroundImage: "url('/fundo.png?v=1')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "white"
    }}>

      <div style={{
        width: "100%",
        maxWidth: "900px",
        padding: "40px 20px 60px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>

        {tela === "home" && (
          <div style={{ textAlign: "center", marginTop: "-100px" }}>
            <h1 style={{
              fontSize: "2.5rem",
              textShadow: "2px 2px 12px rgba(0,0,0,0.7)"
            }}>
              Agende já seu horário
            </h1>

            <button
              onClick={() => setTela("data")}
              style={{
                marginTop: "400px",
                padding: "14px 32px",
                background: "linear-gradient(145deg, #d4af37, #b8962e)",
                color: "#000",
                border: "none",
                borderRadius: "20px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "1rem",
                boxShadow: "0 6px 20px rgba(212,175,55,0.3)"
              }}
            >
              Agendar
            </button>

            <button
              onClick={() => setTela("area")}
              style={{
             marginTop: "350px",
                padding: "14px 32px",
                background: "linear-gradient(145deg, #d4af37, #b8962e)",
                color: "#000",
                border: "none",
                borderRadius: "20px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "1rem",
                boxShadow: "0 6px 20px rgba(212,175,55,0.3)"
              }}
            >
              Meus agendamentos
            </button>
          </div>
        )}

        {tela === "area" && (
          <div style={{ textAlign: "center", marginTop: "-200px" }}>
            <h2>Meus Agendamentos</h2>

            <input
              placeholder="Digite seu telefone"
              value={buscaTelefone}
              onChange={(e) => setBuscaTelefone(e.target.value)}
              style={{
                padding: "12px",
                borderRadius: "12px",
                border: "1px solid rgba(212,175,55,0.6)",
                background: "rgba(0,0,0,0.8)",
                color: "#fff",
                marginBottom: "15px"
              }}
            />

            <br />

            <button
              onClick={buscarMeusAgendamentos}
              style={{
                padding: "10px 20px",
                background: "linear-gradient(145deg, #d4af37, #b8962e)",
                color: "#000",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer"
              }}
            >
              Buscar
            </button>

            <div style={{ marginTop: "20px" }}>
              {meusAgendamentos.map((a) => (
                <div
                  key={a.id}
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    padding: "15px",
                    borderRadius: "15px",
                    marginBottom: "10px"
                  }}
                >
                  <p>{a.data}</p>
                  <p>{a.horario}</p>

                  <button
                    onClick={() => cancelarAgendamento(a.id)}
                    style={{
                      marginTop: "10px",
                      padding: "8px 20px",
                      background: "#ff4d4d",
                      border: "none",
                      borderRadius: "10px",
                      cursor: "pointer"
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setTela("home")}
              style={{
                marginTop: "20px",
                padding: "10px 25px",
                background: "linear-gradient(145deg, #d4af37, #b8962e)",
                color: "#000",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer"
              }}
            >
              Voltar
            </button>
          </div>
        )}

        {tela === "data" && (
          <div style={{
            textAlign: "center",
            marginTop: "-320px",
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(12px)",
            padding: "40px 30px",
            borderRadius: "20px",
            border: "1px solid rgba(212,175,55,0.6)",
            boxShadow: `
              0 0 0 1px rgba(212,175,55,0.3),
              0 0 25px rgba(212,175,55,0.15),
              0 10px 40px rgba(0,0,0,0.6)
            `
          }}>
            
            <h2 style={{
              color: "#fff",
              fontSize: "2rem",
              fontWeight: "700",
              textShadow: "2px 2px 12px rgba(0,0,0,0.7)",
              marginBottom: "25px"
            }}>
              Escolha uma data
            </h2>

            <input
              type="text"
              readOnly
              placeholder="Selecione uma data"
              value={dataSelecionada ? dataSelecionada.split("-").reverse().join("/") : ""}
              onClick={() => setMostrarCalendario(true)}
              style={{
                padding: "15px",
                borderRadius: "25px",
                border: "1px solid rgba(212,175,55,0.7)",
                background: "rgb(0, 0, 0)",
                color: "#fff",
                fontSize: "1rem",
                outline: "none",
                width: "100%",
                maxWidth: "220px",
                marginBottom: "25px",
                boxShadow: "0 0 15px rgba(212,175,55,0.2)"
              }}
            />

            {mostrarCalendario && (
              <DatePicker
                selected={dataObj}
                inline
                onChange={async (date) => {
                  setMostrarCalendario(false);
                  setDataObj(date);

                  const ano = date.getFullYear();
                  const mes = String(date.getMonth() + 1).padStart(2, "0");
                  const dia = String(date.getDate()).padStart(2, "0");
                  const dataFormatada = `${ano}-${mes}-${dia}`;

                  const hoje = new Date().toISOString().split("T")[0];

                  if (desabilitarDias(dataFormatada)) {
                    alert("Não atendemos domingo e segunda ❌");
                    return;
                  }

                  if (dataFormatada < hoje) {
                    alert("Essa data já passou ❌");
                    return;
                  }

                  setDataSelecionada(dataFormatada);
                  await buscarHorariosOcupados(dataFormatada);
                  setTela("agenda");
                }}
                minDate={new Date()}
              />
            )}

            <br />

            <button
              onClick={() => setTela("home")}
              style={{
                marginTop: "10px",
                padding: "10px 20px",
                background: "linear-gradient(145deg, #d4af37, #b8962e)",
                color: "#000",
                border: "none",
                borderRadius: "20px",
                cursor: "pointer"
              }}
            >
              VOLTAR
            </button>
          </div>
        )}

        {tela === "agenda" && (
          <div style={{ textAlign: "center", marginTop: "-320px" }}>
            <h2 style={{ textShadow: "2px 2px 10px rgba(0,0,0,0.6)" }}>
              Escolha um horário
            </h2>

            {horarios.map((h) => {
              const agora = new Date();
              const dataHoje = new Date().toISOString().split("T")[0];
              
              const horarioPassado =
                dataSelecionada === dataHoje &&
                h < agora.toTimeString().slice(0, 5);

              const ocupado =
                (horariosOcupados || []).includes(h) || horarioPassado;

              return (
                <button
                  key={h}
                  disabled={ocupado}
                  onClick={() => {
                    if (ocupado) return;
                    setHorarioSelecionado(h);
                    setTela("confirmar");
                  }}
                  style={{
                    margin: "5px",
                    padding: "10px",
                    borderRadius: "10px",
                    border: "none",
                    background: ocupado ? "#555" : "#fff",
                    cursor: ocupado ? "not-allowed" : "pointer"
                  }}
                >
                  {h} {ocupado ? "❌" : ""}
                </button>
              );
            })}

            <br />
            <button
              onClick={() => setTela("home")}
              style={{
                marginTop: "50px",
                padding: "10px 20px",
                background: "linear-gradient(145deg, #d4af37, #b8962e)",
                color: "#000",
                border: "none",
                borderRadius: "20px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Voltar
            </button>
          </div>
        )}

        {tela === "confirmar" && (
          <div style={{ textAlign: "center", marginTop: "-320px" }}>
            <h2>Confirmar horário</h2>

            <p>{dataSelecionada && dataSelecionada.split("-").reverse().join("/")}</p>
            <p>{horarioSelecionado}</p>

            <input
              placeholder="Nome Completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={{
                padding: "12px",
                borderRadius: "12px",
                border: "1px solid rgba(212,175,55,0.6)",
                background: "rgba(0,0,0,0.8)",
                color: "#fff",
                fontWeight: "600",
                fontSize: "1rem",
                width: "100%",
                maxWidth: "320px",
                marginBottom: "20px",
                outline: "none",
                boxShadow: "0 0 10px rgba(212,175,55,0.2)"
              }}
            />

            <br />

            <input
              placeholder="Telefone para contato"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              style={{
                padding: "12px",
                borderRadius: "12px",
                border: "1px solid rgba(212,175,55,0.6)",
                background: "rgba(0,0,0,0.8)",
                fontWeight: "600", 
                fontSize: "1rem",
                color: "#fff",
                width: "100%",
                maxWidth: "320px",
                marginBottom: "20px",
                outline: "none",
                boxShadow: "0 0 10px rgba(212,175,55,0.2)"
              }}
            />

            <br />

            <button
              onClick={async () => {
                if (!nome || !telefone) {
                  alert("Preencha tudo!");
                  return;
                }

                await confirmarAgendamento();
                setTela("home");
              }}
              style={{
                marginTop: "10px",
                padding: "10px 25px",
                background: "linear-gradient(145deg, #d4af37, #b8962e)",
                color: "#000",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "600",
                boxShadow: "0 4px 12px rgba(212,175,55,0.3)"
              }}
            >
              Confirmar
            </button>

            <br />

            <button
              onClick={() => setTela("agenda")}
              style={{
                marginTop: "10px",
                padding: "10px 25px",
                background: "linear-gradient(145deg, #d4af37, #b8962e)",
                color: "#000",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "600",
                boxShadow: "0 4px 12px rgba(212,175,55,0.3)"
              }}
            >
              Voltar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cliente;