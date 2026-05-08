import { useEffect, useState } from "react";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

function Admin() {
<<<<<<< HEAD
  const [agendamentos, setAgendamentos] = useState([]);

  const buscarAgendamentos = async () => {
    const querySnapshot = await getDocs(collection(db, "appointments"));
    const lista = [];
    const dados = JSON.parse(localStorage.getItem("agendamentos")) || [];

    querySnapshot.forEach((docItem) => {
      lista.push({ id: docItem.id, ...docItem.data() });
    });

    // Ordena cronologicamente
    lista.sort((a, b) => {
      const dateA = new Date(a.data);
      const dateB = new Date(b.data);
      return dateA - dateB;
    });

    setAgendamentos(lista);
=======
  const [agendamentos, setAgendamentos] = useState({});

  const buscarAgendamentos = async () => {
    const querySnapshot = await getDocs(collection(db, "agendamentos"));

    const lista = [];

    querySnapshot.forEach((docItem) => {
      lista.push({
        id: docItem.id,
        ...docItem.data()
      });
    });

    // 🔥 FILTRA PASSADOS
    const agora = new Date();

    const listaFiltrada = lista.filter((a) => {
      const dataHora = new Date(`${a.data}T${a.horario}`);
      return dataHora >= agora;
    });

    // 🔥 ORDENA
    listaFiltrada.sort((a, b) => {
      const dateA = new Date(`${a.data}T${a.horario}`);
      const dateB = new Date(`${b.data}T${b.horario}`);
      return dateA - dateB;
    });

    // 🔥 AGRUPA POR DATA
    const agrupados = {};

    listaFiltrada.forEach((item) => {
      if (!agrupados[item.data]) {
        agrupados[item.data] = [];
      }
      agrupados[item.data].push(item);
    });

    setAgendamentos(agrupados);
>>>>>>> a8a6166363017e8bcd834d6622dbbfc83f647cbd
  };

  const formatarDataBr = (data) => {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  useEffect(() => {
<<<<<<< HEAD
    const loadAgendamentos = async () => {
      await buscarAgendamentos();
    };

    void loadAgendamentos();
=======
    buscarAgendamentos();
>>>>>>> a8a6166363017e8bcd834d6622dbbfc83f647cbd
  }, []);

  const excluirAgendamento = async (id) => {
    if (!window.confirm("Excluir agendamento?")) return;

<<<<<<< HEAD
    await deleteDoc(doc(db, "appointments", id));
=======
    await deleteDoc(doc(db, "agendamentos", id));
>>>>>>> a8a6166363017e8bcd834d6622dbbfc83f647cbd
    buscarAgendamentos();
  };

  return (
<<<<<<< HEAD
    <div style={{
      minHeight: "100vh",
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
        maxWidth: "820px",
        background: "rgba(255,255,255,0.12)",
        backdropFilter: "blur(12px)",
        padding: "40px 30px",
        textAlign: "left",
        boxShadow: "0 0 45px rgba(0,0,0,0.25)",
        border: "1px solid rgba(255,255,255,0.22)",
        borderRadius: "24px"
      }}>

        <h2 style={{ margin: "0 0 18px", color: "#fff", textAlign: "center" }}>📋 Agendamentos</h2>

        {agendamentos.length === 0 && (
          <p style={{ color: "#eee", textAlign: "center" }}>Nenhum agendamento encontrado</p>
        )}

        {agendamentos.map((a) => (
          <div key={a.id} style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            background: "rgba(255,255,255,0.1)",
            padding: "18px",
            borderRadius: "16px",
            marginBottom: "14px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
              <div>
                <p style={{ margin: "0", fontSize: "1rem", color: "#fff", fontWeight: "700" }}>{a.nome}</p>
                <p style={{ margin: "4px 0 0", color: "#ddd" }}>📞 {a.telefone}</p>
              </div>
              <button
                onClick={() => excluirAgendamento(a.id)}
                style={{
                  padding: "10px 16px",
                  borderRadius: "12px",
                  border: "none",
                  background: "red",
                  color: "white",
                  cursor: "pointer",
                  minWidth: "120px"
                }}
              >
                ❌ Excluir
              </button>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
              <span style={{ color: "#ddd" }}>📅 {formatarDataBr(a.data)}</span>
              <span style={{ color: "#ddd" }}>⏰ {a.horario}</span>
            </div>
          </div>
        ))}

=======
    <div
      style={{
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
    >
      <div
        style={{
          width: "100%",
          maxWidth: "820px",
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(12px)",
          padding: "40px 30px",
          textAlign: "left",
          boxShadow: "0 0 45px rgba(0,0,0,0.25)",
          border: "1px solid rgba(255,255,255,0.22)",
          borderRadius: "24px"
        }}
      >
        <h2 style={{ textAlign: "center" }}>📋 Agendamentos</h2>

        {Object.keys(agendamentos).length === 0 && (
          <p style={{ textAlign: "center" }}>
            Nenhum agendamento encontrado
          </p>
        )}

        {Object.keys(agendamentos)
          .sort()
          .map((data) => (
            <div key={data} style={{ marginBottom: "20px" }}>
              <h3>📅 {formatarDataBr(data)}</h3>

              {agendamentos[data].map((a) => (
                <div
                  key={a.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    background: "rgba(255,255,255,0.1)",
                    padding: "10px",
                    borderRadius: "16px",
                    marginBottom: "8px"
                  }}
                >
                  <p style={{ fontWeight: "bold" }}>{a.nome}</p>
                  <p>📞 {a.telefone}</p>
                  <p>⏰ {a.horario}</p>

                  <button
                    onClick={() => excluirAgendamento(a.id)}
                    style={{
                      marginTop: "10px",
                      background: "red",
                      color: "#fff",
                      border: "none",
                      padding: "8px",
                      borderRadius: "10px",
                      cursor: "pointer"
                    }}
                  >
                    ❌ Excluir
                  </button>
                </div>
              ))}
            </div>
          ))}
>>>>>>> a8a6166363017e8bcd834d6622dbbfc83f647cbd
      </div>
    </div>
  );
}

export default Admin;
