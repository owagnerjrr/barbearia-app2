import { useState } from "react";

function Cliente() {
  const [tela, setTela] = useState("home");
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");

  const horarios = [
    "07:00", "08:00", "09:00", "09:40",
    "10:20", "11:00", "11:40", "13:00",
  ];

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
          <div style={{ width: "100%", maxWidth: "520px", textAlign: "center", marginTop: "-320px" }}>
            <h1 style={{
              margin: "0 0 20px",
              fontSize: "2.4rem",
              color: "#fff",
              textShadow: "1px 1px 8px rgba(0,0,0,0.4)"
            }}>
              Agende já seu horário
            </h1>
            <button
              onClick={() => setTela("data")}
              style={{
                marginTop: "10px",
                padding: "14px 32px",
                background: "red",
                color: "#fff",
                border: "none",
                borderRadius: "15px",
                cursor: "pointer",
                fontSize: "0.95rem",
                minWidth: "200px"
              }}
            >
              Agendar horário
            </button>
          </div>
        )}

        {tela === "data" && (
          <div style={{ textAlign: "center", marginTop: "-320px", background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)", padding: "30px 25px", borderRadius: "15px", maxWidth: "520px" }}>
            <h2 style={{ color: "#fff" }}>Escolha uma data</h2>

            <input
              type="date"
              onChange={(e) => {
                if (desabilitarDias(e.target.value)) {
                  alert("Não atendemos nesse dia ❌");
                  return;
                }
                setDataSelecionada(e.target.value);
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
              {horarios.map((h) => (
                <button
                  key={h}
                  onClick={() => {
                    setHorarioSelecionado(h);
                    setTela("confirmar");
                  }}
                  style={{
                    padding: "12px",
                    borderRadius: "10px",
                    border: "none",
                    background: "#fff",
                    cursor: "pointer",
                    fontWeight: "bold",
                    color: "#000",
                  }}
                >
                  {h}
                </button>
              ))}
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
              onClick={() => {
                if (!nome || !telefone) {
                  alert("Preencha tudo!");
                  return;
                }

                alert("Agendado com sucesso 🔥");
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
