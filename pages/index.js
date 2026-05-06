import Head from "next/head";
import { useState, useEffect, useRef } from "react";

const IMAGES = [
  "/foto1.jpg",
  "/foto2.jpg",
  "/foto3.jpg",
  "/foto4.jpg",
  "/foto5.jpg",
  "/foto6.jpg",
  "/foto7.jpg",
  "/foto8.jpg",
];

// O array original de presentes
const PRESENTES_BASE = [
  "Colar de Dachshund 🐶",
  "Vale-Dupla no Beach 🎾",
  "Viseira Nova ☀️",
  "Sessão de Cinema 🎬",
  "Jantar Especial 🍝",
  "Raqueteira Nova 🎒",
];

export default function Home() {
  const [fase, setFase] = useState("jogo");
  const [cards, setCards] = useState([]);
  const [viradas, setViradas] = useState([]);
  const [encontradas, setEncontradas] = useState([]);

  // Estados da Raspadinha
  const [presentesEmbaralhados, setPresentesEmbaralhados] = useState([]);
  const [presentesEscolhidos, setPresentesEscolhidos] = useState([]);

  // Referência para a música de fundo não reiniciar a cada renderização
  const audioRef = useRef(null);

  // Inicialização (Embaralha jogo da memória e a raspadinha)
  useEffect(() => {
    const memoryShuffled = [...IMAGES, ...IMAGES]
      .sort(() => Math.random() - 0.5)
      .map((img, id) => ({ id, img }));
    setCards(memoryShuffled);

    const presentesShuffled = [...PRESENTES_BASE].sort(
      () => Math.random() - 0.5,
    );
    setPresentesEmbaralhados(presentesShuffled);
  }, []);

  // Lógica do Jogo da Memória
  useEffect(() => {
    if (viradas.length === 2) {
      const [primeira, segunda] = viradas;
      if (cards[primeira].img === cards[segunda].img) {
        setEncontradas((prev) => [...prev, primeira, segunda]);
        setViradas([]);
      } else {
        setTimeout(() => setViradas([]), 1000);
      }
    }
  }, [viradas, cards]);

  // Sons de Efeito (Helper function)
  const tocarEfeito = (nomeDoArquivo) => {
    const efeito = new Audio(`/${nomeDoArquivo}.mp3`);
    efeito.volume = 0.5; // Deixa o efeito um pouco mais baixo que a música
    efeito.play().catch((e) => console.log("Erro no áudio:", e));
  };

  const handleCartaClick = (index) => {
    if (
      viradas.length < 2 &&
      !viradas.includes(index) &&
      !encontradas.includes(index)
    ) {
      tocarEfeito("click"); // Som ao virar carta
      setViradas((prev) => [...prev, index]);
    }
  };

  // Transição para a Carta e Play na Música
  const irParaCarta = () => {
    setFase("carta");
    audioRef.current = new Audio("/musica.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3; // Volume baixo para não atrapalhar a leitura
    audioRef.current.play().catch((e) => console.log("Erro na música:", e));
  };

  // Lógica da Raspadinha
  const handleRaspadinhaClick = (index) => {
    if (
      presentesEscolhidos.length < 3 &&
      !presentesEscolhidos.includes(index)
    ) {
      tocarEfeito("tada"); // Som ao revelar presente
      setPresentesEscolhidos((prev) => [...prev, index]);
    }
  };

  return (
    <>
      <Head>
        <title>Para Minha Mãe</title>
      </Head>
      <div className="container">
        {/* FASE 1: O JOGO DA MEMÓRIA */}
        {fase === "jogo" && (
          <>
            <h1>Feliz Dia das Mães! ❤️</h1>
            <p>Ache todos os pares para liberar a surpresa.</p>
            <div className="grid">
              {cards.map((card, index) => {
                const isVirada =
                  viradas.includes(index) || encontradas.includes(index);
                return (
                  <div
                    key={index}
                    className={`card ${!isVirada ? "card-hidden" : ""}`}
                    onClick={() => handleCartaClick(index)}
                  >
                    {isVirada && <img src={card.img} alt="Memória" />}
                  </div>
                );
              })}
            </div>

            {/* Botão só aparece quando ganha o jogo */}
            {encontradas.length === 16 && (
              <button
                className="button"
                style={{ marginTop: "20px" }}
                onClick={irParaCarta}
              >
                Continuar ➡️
              </button>
            )}
          </>
        )}

        {/* FASE 2: A CARTA DE GRATIDÃO */}
        {fase === "carta" && (
          <>
            <h1>Você conseguiu! 🎉</h1>
            <p>Mãe, eu queria deixar registrado aqui o quanto eu te amo.</p>
            <p>
              Sei que a vida às vezes é corrida e eu posso ser difícil de lidar,
              mas eu reconheço cada sacrifício que você faz. Obrigado por me
              apoiar nas minhas ideias, por me ajudar com meu currículo, por
              estar sempre lá. Peço desculpas pelas vezes que falhei, mas saiba
              que meu maior objetivo é te dar orgulho e ajudar a nossa família.
            </p>
            <p>Você é minha inspiração.</p>
            <button className="button" onClick={() => setFase("sorteio")}>
              Ir para os Presentes 🎁
            </button>
          </>
        )}

        {/* FASE 3: A RASPADINHA */}
        {fase === "sorteio" && (
          <>
            <h1>Seus Presentes!</h1>
            <p>
              Você tem direito a escolher <strong>3 prêmios</strong>. Escolha
              com sabedoria!
            </p>
            <p>Prêmios restantes: {3 - presentesEscolhidos.length}</p>

            <div className="grid">
              {presentesEmbaralhados.map((presente, index) => {
                const isRevelado = presentesEscolhidos.includes(index);
                return (
                  <div
                    key={index}
                    className={`card-raspadinha ${isRevelado ? "revelado" : ""}`}
                    onClick={() => handleRaspadinhaClick(index)}
                  >
                    {isRevelado ? (
                      <span>{presente}</span>
                    ) : (
                      <span style={{ fontSize: "2em" }}>❓</span>
                    )}
                  </div>
                );
              })}
            </div>

            {presentesEscolhidos.length === 3 && (
              <div className="sorteio-box" style={{ marginTop: "20px" }}>
                <p>
                  <strong>Parabéns! Você ganhou:</strong>
                </p>
                {presentesEscolhidos.map((idx) => (
                  <p key={idx} className="presente-destaque">
                    {presentesEmbaralhados[idx]}
                  </p>
                ))}
                <p style={{ marginTop: "15px", fontSize: "0.9em" }}>
                  (Tire um print para resgatar!)
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
