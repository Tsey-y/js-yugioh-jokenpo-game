const state ={
    score:{
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById('score_points'),
    },
    cardSprites:{
        avatar: document.getElementById('card-image'),
        name: document.getElementById('card-name'),
        type: document.getElementById('card-type'),
    },
    fieldCards:{
        player: document.getElementById('player-field-card'),
        computer: document.getElementById('computer-field-card'),
    },
    button: document.getElementById('next-duel'),
};

const playersSides = {
    player1: 'player-cards',
    player1Box: document.querySelector('#player-cards'),
    computer: 'computer-cards',
    computerBox: document.querySelector('#computer-cards'),
}

const pathImages= './src/assets/icons/'

const cardData = [
    {
        id: 0,
        name: 'Blue Eyes White Dragon',
        type: 'Paper',
        img: `${pathImages}dragon.png`,
        WinOf:[1],
        LoseOf:[2],
    },
    {
        id: 1,
        name: 'Dark Magician',
        type: 'Rock',
        img: `${pathImages}magician.png`,
        WinOf:[2],
        LoseOf:[0],
    },
    {
        id: 2,
        name: 'Exodia',
        type: 'Scissors',
        img: `${pathImages}exodia.png`,
        WinOf:[0],
        LoseOf:[1],
    },
]

const players = {
    player1: 'players-cards',
}

const bgm = document.getElementById('bgm')

async function getRandomCardId(){
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(idCard, fieldSide){
    const cardImage = document.createElement('img');
    cardImage.setAttribute('height', '100px');
    cardImage.setAttribute('src', './src/assets/icons/card-back.png');
    cardImage.setAttribute('data-id', idCard);
    cardImage.classList.add('card');

    if(fieldSide === playersSides.player1){
        cardImage.addEventListener('click', () =>{
            setCardField(cardImage.getAttribute('data-id'))
        });

        cardImage.addEventListener('mouseover', () =>{
            drawSelectCard(idCard)
        });
    }
    
    return cardImage
}

async function drawSelectCard(idCard){
    state.cardSprites.avatar.src = cardData[idCard].img;
    state.cardSprites.name.innerText = cardData[idCard].name;
    state.cardSprites.type.innerText = `Attribute: ${cardData[idCard].type}`;
}

async function setCardField(cardId){
    await removeAllCardsImages();
    let computerCardId = await getRandomCardId();

    state.fieldCards.player.style.display = 'block';
    state.fieldCards.computer.style.display = 'block';


    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResult = await checkDuelResult(cardId, computerCardId);
    await updateScore();
    await drawButton(duelResult);
}

async function removeAllCardsImages(){
    let cards = playersSides.computerBox;
    let imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img)=> img.remove());

    cards = playersSides.player1Box;
    imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img)=> img.remove());
}

async function checkDuelResult(playerCardId, computerCardId){
    let duelResults = 'Empate';
    let playerCard = cardData[playerCardId];

    if(playerCard.WinOf.includes(computerCardId)){
    duelResults = 'Ganhou!';
    await playAudio('win')
        state.score.playerScore++;
    }

    if(playerCard.LoseOf.includes(computerCardId)){
        duelResults = 'Perdeu';
        await playAudio('lose')
            state.score.computerScore++;
    }
    return duelResults

}

async function updateScore(){
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`
}

async function drawButton(result){
    state.button.innerText = result;
    state.button.style.display = 'block';
}

async function drawCards(cardNumbers, fieldSide){
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function resetDuel(){
    state.cardSprites.avatar.src = '';
    state.button.style.display = 'none';

    state.fieldCards.player.style.display = 'none'
    state.fieldCards.computer.style.display = 'none'

    state.cardSprites.name.innerText = "Selecione"
    state.cardSprites.type.innerText = "uma carta"

    main()
}

async function playAudio(status){
    const audio = new Audio(`./src/assets/audios/${status}.wav`)
    audio.volume = 0.2;
    audio.play()
}

async function toggleMute() {
    var bgm = document.getElementById('bgm');
    bgm.muted = !bgm.muted;
}

function main(){
    state.fieldCards.player.style.display = "none"
    state.fieldCards.computer.style.display = "none"
    drawCards(5, playersSides.player1);
    drawCards(5, playersSides.computer);

}

main();