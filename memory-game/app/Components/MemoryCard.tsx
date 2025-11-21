"use client";

import React, { useState, useEffect } from "react";
import { Shuffle, RotateCcw, Trophy } from "lucide-react";

interface Card {
  id: number;
  image: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const imageUrls = [
  "/i1.png",
  "/i2.png",
  "/i3.png",
  "/i4.png",
  "/i5.png",
  "/i6.png",
];

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isGameWon, setIsGameWon] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const initializeGame = () => {
    let idCounter = 0;

    const duplicatedImages = [...imageUrls, ...imageUrls].map((img) => ({
      id: idCounter++,
      image: img,
      isFlipped: false,
      isMatched: false,
    }));

    const shuffled = duplicatedImages.sort(() => Math.random() - 0.5);

    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setIsGameWon(false);
    setIsChecking(false);
  };

  useEffect(() => {
    if (gameStarted) initializeGame();
  }, [gameStarted]);

  useEffect(() => {
    if (flippedCards.length !== 2) return;

    setIsChecking(true);
    setMoves((m) => m + 1);

    const [firstId, secondId] = flippedCards;

    const firstCard = cards.find((c) => c.id === firstId);
    const secondCard = cards.find((c) => c.id === secondId);

    if (!firstCard || !secondCard) {
      setFlippedCards([]);
      setIsChecking(false);
      return;
    }

    if (firstCard.image === secondCard.image) {
      // MATCH
      setCards((prev) =>
        prev.map((card) =>
          card.id === firstId || card.id === secondId
            ? { ...card, isMatched: true }
            : card
        )
      );

      setMatches((prev) => {
        const newMatchCount = prev + 1;
        if (newMatchCount === imageUrls.length) {
          setTimeout(() => setIsGameWon(true), 500);
        }
        return newMatchCount;
      });

      setFlippedCards([]);
      setIsChecking(false);
    } else {
      // NOT A MATCH — flip back
      setTimeout(() => {
        setCards((prev) =>
          prev.map((card) =>
            card.id === firstId || card.id === secondId
              ? { ...card, isFlipped: false }
              : card
          )
        );
        setFlippedCards([]);
        setIsChecking(false);
      }, 900);
    }
  }, [flippedCards]);

  const handleCardClick = (id: number) => {
    const card = cards.find((c) => c.id === id);

    if (!card) return;
    if (isChecking || card.isMatched || card.isFlipped) return;
    if (flippedCards.length >= 2) return;

    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFlipped: true } : c))
    );
    setFlippedCards((prev) => [...prev, id]);
  };

  // Start screen
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Memory Puzzle
            </h1>
            <p className="text-gray-600">Match all pairs to win!</p>
          </div>

          <div className="space-y-4">
            <input
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900"
              placeholder="Enter your name..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && playerName && setGameStarted(true)}
            />

            <button
              onClick={() => playerName && setGameStarted(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 w-full text-white font-bold py-3 rounded-lg"
            >
              Start Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Game screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-xl">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Memory Puzzle</h1>
              <p className="text-gray-600">Player: {playerName}</p>
            </div>

            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{moves}</p>
                <p className="text-sm text-gray-600">Moves</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-pink-600">
                  {matches}/{imageUrls.length}
                </p>
                <p className="text-sm text-gray-600">Matches</p>
              </div>
            </div>

            <button
              onClick={initializeGame}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className="aspect-square cursor-pointer perspective"
            >
              <div
                className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
                  card.isFlipped || card.isMatched ? "rotate-y-180" : ""
                }`}
              >
                {/* Back */}
                <div className="absolute w-full h-full backface-hidden rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 shadow-lg flex items-center justify-center">
                  <Shuffle className="w-12 h-12 text-white" />
                </div>

                {/* Front */}
                <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={card.image}
                    alt="Memory card"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Win Modal */}
        {isGameWon && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 text-center shadow-2xl">
              <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-4xl font-bold text-gray-800 mb-2">You Won!</h2>
              <p className="text-lg mb-4">Great job, {playerName}!</p>
              <p className="text-gray-600 mb-6">Finished in {moves} moves</p>
              <button
                onClick={initializeGame}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-8 rounded-lg"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .perspective { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
}
