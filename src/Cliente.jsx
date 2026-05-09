import { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

function Cliente() {
  const [tela, setTela] = useState("home");
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [horariosOcupados, setHorariosOcupados] = useState([]);

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

      alert("Agendado com sucesso!");
    } catch (error) {
      console.error(error);
    }
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

        {/* HOME */}
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
          </div>
        )}

        {/* DATA */}
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
              type="date"
              onChange={async (e) => {
                const data = e.target.value;
                const hoje = new Date().toISOString().split("T")[0];

                if (desabilitarDias(data)) {
                  alert("Não atendemos domingo e segunda ❌");
                  return;
                }

                if (data < hoje) {
                  alert("Essa data já passou ❌");
                  return;
                }

                setDataSelecionada(data);
                await buscarHorariosOcupados(data);
                setTela("agenda");
              }}
              style={{
                padding: "14px",
                borderRadius: "14px",
                border: "1px solid rgba(212,175,55,0.7)",
                background: "rgba(0,0,0,0.85)",
                color: "#fff",
                fontSize: "1rem",
                outline: "none",
                width: "100%",
                maxWidth: "320px",
                marginBottom: "25px",
                boxShadow: "0 0 15px rgba(212,175,55,0.2)"
              }}
            />

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

        {/* AGENDA */}
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
            <button onClick={() => setTela("data")}
              
             onClick={() => setTela("home")}
              style={{
                marginTop: "50px",
                padding: "10px 20px",
                background: "linear-gradient(145deg, #d4af37, #b8962e)",
                color: "#000",
                border: "none",
                borderRadius: "20px",
                fontWeight: "bold",
                FontSize: "1rem",
                boxshadow: "0 6px 20px rgba(212,175,55,0.3)",
                cursor: "pointer"
              }}>Voltar
              
              </button>
          </div>
        )}

        {/* CONFIRMAR */}
        {tela === "confirmar" && (
          <div style={{ textAlign: "center", marginTop: "-320px" }}>
            <h2>Confirmar horário</h2>

            <p>{dataSelecionada}</p>
            <p>{horarioSelecionado}</p>

            <input
              placeholder="Seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
               style={{
        padding: "12px",
        borderRadius: "12px",
        border: "1px solid rgba(212,175,55,0.6)",
        background: "rgba(0,0,0,0.8)",
        color: "#fff",
        width: "100%",
        maxWidth: "320px",
        marginBottom: "20px",
        outline: "none",
        boxShadow: "0 0 10px rgba(212,175,55,0.2)"
        }}
            />

            <br />

            <input
              placeholder="Seu telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              style={{
        padding: "12px",
        borderRadius: "12px",
        border: "1px solid rgba(212,175,55,0.6)",
        background: "rgba(0,0,0,0.8)",
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
            >
              Confirmar
            </button>

            <br />

            <button onClick={() => setTela("agenda")}>
        style={{
        padding: "10px 20px",
        
       
        
        
        
      }}
    
            
              Voltar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cliente;