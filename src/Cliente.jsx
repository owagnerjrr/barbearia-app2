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

  // 🔥 HORÁRIOS (CORRETO NO TOPO)
  const horarios = [
    "07:00","08:00","09:00","09:40","10:20",
    "11:00","11:40","12:00","12:30","13:00",
    "13:30","14:00","15:00","16:00","17:00"
  ];

  const buscarHorariosOcupados = async (data) => {
  console.log("🔥 BUSCANDO HORÁRIOS PRA:", data);

  const querySnapshot = await getDocs(collection(db, "agendamentos"));

  const ocupados = [];

  querySnapshot.forEach((docItem) => {
  const agendamento = docItem.data();

    if (agendamento.data === data) {
      ocupados.push(agendamento.horario);
    }
  });

  console.log("✅ OCUPADOS:", ocupados);

  setHorariosOcupados(ocupados);
};


const confirmarAgendamento = async () => {
  console.log("🔥 clicou no botão");

  try {
    await addDoc(collection(db, "agendamentos"), {
      nome: nome,
      telefone: telefone,
      data: dataSelecionada,
      horario: horarioSelecionado
    });

    console.log("✅ SALVOU NO FIREBASE");

    alert("Agendado com sucesso!");

  } catch (error) {
    console.error("❌ ERRO AO SALVAR:", error);
  }
};

  ;

  const desabilitarDias = (date) => {
    const dia = new Date(date).getDay();
    return dia === 0 || dia === 1;
  };

  return (
    <div style={{
      width: "100%",
      minHeight: "100vh",
      margin: "0",
      padding: "0",
      backgroundImage: "url('/fundo.png?v=1')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
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
  <div
    style={{
      width: "100%",
      maxWidth: "520px",
      textAlign: "center",
      marginTop: "100px",
    }}
  >
    <h1
      style={{
        margin: "0 0 20px",
        fontSize: "2.4rem",
        color: "#fff",
        textShadow: "1px 1px 8px rgba(0,0,0,0.4)",
      }}
    >
      Agende já seu horário
    </h1>

    <button
      onClick={() => setTela("data")}
      style={{
        marginTop: "200px",
        padding: "14px 32px",
        background: "red",
        color: "#fff",
        border: "none",
        borderRadius: "15px",
        cursor: "pointer",
        fontSize: "0.95rem",
        minWidth: "200px",
      }}
    >
      Agenda
    </button>
  </div>
)}

{tela === "data" && (
  <div
    style={{
      textAlign: "center",
      marginTop: "-320px",
      background: "rgba(0,0,0,0.45)",
      backdropFilter: "blur(8px)",
      padding: "30px 25px",
      borderRadius: "15px",
      maxWidth: "520px",
    }}
  >
    <h2 style={{ color: "#fff" }}>Escolha uma data</h2>
        
           <input
  type="date"
  onChange={async (e) => {
    const data = e.target.value;

    const hoje = new Date().toISOString().split("T")[0];

    // ❌ BLOQUEIA APENAS DIAS ANTERIORES
    if (data < hoje) {
      alert("Essa data já passou ❌");
      return;
    }

    if (desabilitarDias(data)) {
      alert("Não atendemos nesse dia ❌");
      return;
    }

    setDataSelecionada(data);

    await buscarHorariosOcupados(data);

    setTela("agenda");
  }}
  style={{
    padding: "10px",
    borderRadius: "10px",
    border: "none",
    marginTop: "20px",
  }}
/>

            <br />

            <button
              onClick={() => setTela("home")}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                background: "rgba(255,255,255,0.18)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.35)",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              Voltar
            </button>
          </div>
)}

        {tela === "agenda" && (
          <div style={{ textAlign: "center", marginTop: "-320px", background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)", padding: "30px 25px", borderRadius: "15px", maxWidth: "520px" }}>
            <h2 style={{ color: "#fff" }}>Escolha um horário</h2>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "10px",
              maxWidth: "500px",
              marginTop: "20px"
            }}>


          
              {horarios.map((h) => {
                
  const agora = new Date();
const dataHoje = new Date().toISOString().split("T")[0];

;

const horarioPassado =
  dataSelecionada === dataHoje &&
  h < agora.toTimeString().slice(0, 5);

const ocupado = (horariosOcupados || []).includes(h) || horarioPassado;




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
        padding: "12px",
        borderRadius: "10px",
        border: "none",
        background: ocupado ? "#555" : "#fff",
        color: ocupado ? "#aaa" : "#000",
        cursor: ocupado ? "not-allowed" : "pointer",
        fontWeight: "bold",
      }}

      // teste git
    >
      {h} {ocupado ? "❌" : ""}
    </button>
  );
})}

              
            </div>

            <button
              onClick={() => setTela("data")}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                background: "rgba(255,255,255,0.18)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.35)",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              Voltar
            </button>
          </div>
        )}

        {tela === "confirmar" && (
          <div style={{ textAlign: "center", marginTop: "-320px", color: "#fff", background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)", padding: "30px 25px", borderRadius: "15px", maxWidth: "520px" }}>
            <h2>Confirmar horário</h2>

            <p>{dataSelecionada}</p>
            <p>{horarioSelecionado}</p>

            <input
              placeholder="Seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "10px",
                border: "none",
                marginTop: "10px",
                width: "100%",
                maxWidth: "400px",
              }}
            />

            <br />

            <input
              placeholder="Seu telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "10px",
                border: "none",
                marginTop: "10px",
                width: "100%",
                maxWidth: "400px",
              }}
            />

            <br />

            <button
              onClick={async () => {
                if (!nome || !telefone) {
                  alert("Preencha tudo!");
                  return;
                }

                await confirmarAgendamento(); // 🔥 AGORA SALVA NO FIREBASE

                
                setTela("home");
              }}
              style={{
                marginTop: "20px",
                padding: "12px 30px",
                background: "red",
                color: "#fff",
                border: "none",
                borderRadius: "20px",
                cursor: "pointer",
              }}
            >
              Confirmar
            </button>

            <br />

            <button
              onClick={() => setTela("agenda")}
              style={{
                marginTop: "10px",
                padding: "10px 20px",
                background: "rgba(255,255,255,0.18)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.35)",
                borderRadius: "10px",
                cursor: "pointer",
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