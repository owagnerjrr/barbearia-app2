import { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

function Cliente() {
<<<<<<< HEAD
  const [tela, setTela] = useState("home");
=======
  const [tela, setTela] = useState("home"); 
>>>>>>> a8a6166363017e8bcd834d6622dbbfc83f647cbd
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [horariosOcupados, setHorariosOcupados] = useState([]);

<<<<<<< HEAD
=======
  // 🔥 HORÁRIOS (CORRETO NO TOPO)
>>>>>>> a8a6166363017e8bcd834d6622dbbfc83f647cbd
  const horarios = [
    "07:00","08:00","09:00","09:40","10:20",
    "11:00","11:40","12:00","12:30","13:00",
    "13:30","14:00","15:00","16:00","17:00"
  ];

  const buscarHorariosOcupados = async (data) => {
<<<<<<< HEAD
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

  const desabilitarDias = (date) => {
    const [ano, mes, dia] = date.split("-");
    const dataLocal = new Date(Number(ano), Number(mes) - 1, Number(dia));
    const diaSemana = dataLocal.getDay();

    return diaSemana === 0 || diaSemana === 1;
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundImage: "url('/fundo.png?v=1')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white"
      }}


      // teste atualização // teste deploy agora
    >
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          padding: "40px 20px 60px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        {tela === "home" && (
          <div style={{ textAlign: "center", marginTop: "-100px" }}>
            <h1>Agende já seu horário</h1>
=======
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
      marginTop: "-100px",
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
        marginTop: "400px",
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
      Agendar
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

    // 🔥 BLOQUEIA DOMINGO E SEGUNDA
    if (desabilitarDias(data)) {
      alert("Não atendemos domingo e segunda ❌");
      return;
    }

    // ❌ BLOQUEIA DATA PASSADA
    if (data < hoje) {
      alert("Essa data já passou ❌");
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
>>>>>>> a8a6166363017e8bcd834d6622dbbfc83f647cbd

            <button
              onClick={() => setTela("data")}
              style={{
<<<<<<< HEAD
                marginTop: "400px",
                padding: "14px 32px",
                background: "red",
                color: "#fff",
                border: "none",
                borderRadius: "15px",
                cursor: "pointer"
              }}
            >
              Agendar
            </button>
          </div>
        )}

        {tela === "data" && (
          <div style={{ textAlign: "center", marginTop: "-320px" }}>
            <h2>Escolha uma data</h2>

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
            />

            <br />

            <button onClick={() => setTela("home")}>
=======
                marginTop: "20px",
                padding: "10px 20px",
                background: "rgba(255,255,255,0.18)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.35)",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
>>>>>>> a8a6166363017e8bcd834d6622dbbfc83f647cbd
              Voltar
            </button>
          </div>
        )}

<<<<<<< HEAD
        {tela === "agenda" && (
          <div style={{ textAlign: "center", marginTop: "-320px" }}>
            <h2>Escolha um horário</h2>

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
                >
                  {h} {ocupado ? "❌" : ""}
                </button>
              );
            })}

            <br />
            <button onClick={() => setTela("data")}>Voltar</button>
          </div>
        )}

        {tela === "confirmar" && (
          <div style={{ textAlign: "center", marginTop: "-320px" }}>
=======
        {tela === "confirmar" && (
          <div style={{ textAlign: "center", marginTop: "-320px", color: "#fff", background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)", padding: "30px 25px", borderRadius: "15px", maxWidth: "520px" }}>
>>>>>>> a8a6166363017e8bcd834d6622dbbfc83f647cbd
            <h2>Confirmar horário</h2>

            <p>{dataSelecionada}</p>
            <p>{horarioSelecionado}</p>

            <input
              placeholder="Seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
<<<<<<< HEAD
=======
              style={{
                padding: "10px",
                borderRadius: "10px",
                border: "none",
                marginTop: "10px",
                width: "100%",
                maxWidth: "400px",
              }}
>>>>>>> a8a6166363017e8bcd834d6622dbbfc83f647cbd
            />

            <br />

            <input
              placeholder="Seu telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
<<<<<<< HEAD
=======
              style={{
                padding: "10px",
                borderRadius: "10px",
                border: "none",
                marginTop: "10px",
                width: "100%",
                maxWidth: "400px",
              }}
>>>>>>> a8a6166363017e8bcd834d6622dbbfc83f647cbd
            />

            <br />

            <button
              onClick={async () => {
                if (!nome || !telefone) {
                  alert("Preencha tudo!");
                  return;
                }

<<<<<<< HEAD
                await confirmarAgendamento();
                setTela("home");
              }}
=======
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
>>>>>>> a8a6166363017e8bcd834d6622dbbfc83f647cbd
            >
              Confirmar
            </button>

            <br />

<<<<<<< HEAD
            <button onClick={() => setTela("agenda")}>
=======
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
>>>>>>> a8a6166363017e8bcd834d6622dbbfc83f647cbd
              Voltar
            </button>
          </div>
        )}
      </div>
<<<<<<< HEAD
    </div>
  );
}

export default Cliente;
=======
      </div>
    
      );
}

export default Cliente;
>>>>>>> a8a6166363017e8bcd834d6622dbbfc83f647cbd
