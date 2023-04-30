import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

// PART 1 //

// function CardDeck() {
//     const [deck, setDeck] = useState(null);
//     const [card, setCard] = useState(null);

//     useEffect(function fetchDeckWhenMounted() {
//         async function fetchDeck() {
//             const deckResult = await axios.get(
//                 "https://deckofcardsapi.com/api/deck/new/shuffle"
//             );
//             setDeck(deckResult.data);
//         }
//         fetchDeck();
//     }, []);

//     async function drawCard() {
//         const cardResult = await axios.get(
//             `https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=1`
//         );
//         cardResult.data.remaining === 0
//             ? alert("Error: No cards remaining!")
//             : setCard(cardResult.data);
//     }
//     console.log(card ? card.cards[0] : null);

//     return (
//         <div>
//             <div>
//                 {card ? (
//                     <img
//                         src={card.cards[0].image}
//                         alt={`${card.cards[0].value} of ${card.cards[0].suit}`}
//                         width="200px"
//                         style={{ margin: "20px" }}
//                     />
//                 ) : null}
//             </div>
//             <button onClick={() => drawCard()}>Draw Card</button>
//         </div>
//     );
// }

// PART 2

function CardDeck() {
    const [deck, setDeck] = useState(null);
    const [card, setCard] = useState(null);
    const [startDraw, setStartDraw] = useState(false);
    const timerId = useRef();

    useEffect(function fetchDeckWhenMounted() {
        async function fetchDeck() {
            const deckResult = await axios.get(
                "https://deckofcardsapi.com/api/deck/new/shuffle"
            );
            setDeck(deckResult.data);
        }
        fetchDeck();
    }, []);

    useEffect(
        function drawCardsWhenMounted() {
            if (startDraw === true) {
                timerId.current = setInterval(() => {
                    drawCard();
                }, 1000);

                async function drawCard() {
                    const cardResult = await axios.get(
                        `https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=1`
                    );
                    if (cardResult.data.remaining === 0) {
                        clearInterval(timerId.current);
                        alert("Error: No cards remaining!");
                    } else {
                        setCard(cardResult.data);
                    }
                }

                return function cleanUpClearTimer() {
                    clearInterval(timerId.current);
                };
            }
        },
        [timerId, deck, startDraw]
    );

    function toggleDraw() {
        setStartDraw(() => !startDraw);
    }

    return (
        <div>
            <div>
                {card ? (
                    <img
                        src={card.cards[0].image}
                        alt={`${card.cards[0].value} of ${card.cards[0].suit}`}
                        width="200px"
                        style={{ margin: "20px" }}
                    />
                ) : null}
            </div>
            <button onClick={toggleDraw}>
                {!startDraw ? "Start Draw" : "Stop Draw"}
            </button>
        </div>
    );
}

export default CardDeck;
