import Head from "next/head";
import { useState, useEffect } from "react";

// Vetor base com os nomes das imagens que devem estar na pasta /public
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

// Vetor de presentes misturando físicos (até 300 reais) e atitudes
const PRESENTES = [
  "Colar de Dachshund lindo! 🐶",
  "Vale-Dupla no próximo jogo de Beach Tennis! 🎾",
  "Viseira Nova para os jogos! ☀️",
  "Vale-Sessão de Cinema com pipoca em casa 🎬",
  "Vale-Jantar Especial feito por mim 🍝",
  "Uma Raqueteira Térmica Nova! 🎒",
];

export default function Home() {
  const [fase, setFase] = useState("jogo"); // Fases: jogo -> carta -> sorteio
  const [cards, setCards] = useState([]);
  const [viradas, setViradas] = useState([]);
  const [encontradas, setEncontradas] = useState([]);
  const [presenteSorteado, setPresenteSorteado] = useState(null);

  // Embaralha e prepara as 16 cartas ao carregar a página
  useEffect(() => {
    const embaralhadas = [...IMAGES, ...IMAGES]
      .sort(() => Math.random() - 0.5)
      .map((img, id) => ({ id, img }));
    setCards(embaralhadas);
  }, []);

  // Lógica de verificação do Jogo da Memória
  useEffect(() => {
    if (viradas.length === 2) {
      const [primeira, segunda] = viradas;
      if (cards[primeira].img === cards[segunda].img) {
        setEncontradas((prev) => [...prev, primeira, segunda]);
        setViradas([]);
      } else {
        setTimeout(() => setViradas([]), 1000); // Errou, desvira após 1 seg
      }
    }
  }, [viradas, cards]);

  // Checa se venceu o jogo
  useEffect(() => {
    if (encontradas.length === 16 && encontradas.length > 0) {
      setTimeout(() => setFase("carta"), 1000);
    }
  }, [encontradas]);

  const handleCartaClick = (index) => {
    if (
      viradas.length < 2 &&
      !viradas.includes(index) &&
      !encontradas.includes(index)
    ) {
      setViradas((prev) => [...prev, index]);
    }
  };

  const sortearPresente = () => {
    const random = Math.floor(Math.random() * PRESENTES.length);
    setPresenteSorteado(PRESENTES[random]);
  };

  return (
    <>
      <Head>
        <title>Feliz Dia das Mães!</title>
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
              Ir para o seu Presente 🎁
            </button>
          </>
        )}

        {/* FASE 3: O SORTEIO */}
        {fase === "sorteio" && (
          <>
            <h1>Hora do Presente!</h1>
            <p>Clique no botão abaixo para descobrir o que você ganhou hoje!</p>

            {!presenteSorteado ? (
              <button className="button" onClick={sortearPresente}>
                Tirar a Sorte! 🎲
              </button>
            ) : (
              <div className="sorteio-box">
                <p>O seu presente (ou momento) é:</p>
                <div className="presente-destaque">{presenteSorteado}</div>
                <p style={{ marginTop: "15px", fontSize: "0.9em" }}>
                  (Tire um print e me mostre para resgatar!)
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
