const playBoard = document.getElementsByClassName("play-board")[0];
const scoreElement = document.getElementsByClassName("score")[0];
const highScoreElement = document.getElementsByClassName("high-score")[0];
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let paperX, paperY;
let hakuX = 5, hakuY = 5;
let velocityX = 0, velocityY = 0;
let hakuBody = [];
let setIntervalId;
let score = 0;

// Se busca la puntuación más alta del almacenamiento local
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `Highest Score: ${highScore} puntos`;

// Actualizamos la posición de la comida de forma aleatoria
const paperPlace = () => {
    paperX = Math.floor(Math.random() * 30) + 1;
    paperY = Math.floor(Math.random() * 30) + 1;
};

// Final del juego
const endGame = () => {
    clearInterval(setIntervalId);
    var hakuCrashes = new Audio("sounds/Haku-crashes.wav");
    hakuCrashes.play();
    alert("Game Over! Press 'enter' to try again");
    location.reload();
};

// Cambiar la dirección de la serpiente
const changeDirect = e => {
    switch (e.key) {
        case "ArrowUp":
            if (velocityY !== 1) {
                velocityX = 0;
                velocityY = -1;
            }
            break;
        case "ArrowDown":
            if (velocityY !== -1) {
                velocityX = 0;
                velocityY = 1;
            }
            break;
        case "ArrowLeft":
            if (velocityX !== 1) {
                velocityX = -1;
                velocityY = 0;
            }
            break;
        case "ArrowRight":
            if (velocityX !== -1) {
                velocityX = 1;
                velocityY = 0;
            }
            break;
        default:
            break;
    }
};

// Llamar a changeDirect en cada clic y pasar el valor del conjunto de datos clave como un objeto
controls.forEach(button => button.addEventListener("click", () => changeDirect({ key: button.dataset.key })));

const iniciarJuego = () => {
    if (gameOver) return endGame();
    let html = `<div class="paper" style="grid-area: ${paperY} / ${paperX}"></div>`;

    // Comprobamos si la serpiente se come la comida.
    if (hakuX === paperX && hakuY === paperY) {
        paperPlace();
        var hakuCrashes = new Audio("sounds/Eat-Paper.mp3");
        setTimeout(function() {
            hakuCrashes.pause();
          }, 1000);
        hakuCrashes.play();
        hakuBody.push(hakuBody.length - 1 [paperY, paperX]); // Empujamos la comida a la matriz del cuerpo de la serpiente, para que la serpiente crezca
        score++; // Se incrementa la puntuación en 1
        // Guardamos las puntuaciones
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score} papers`;
        highScoreElement.innerText = `Highest score: ${highScore} papers`;
    }
    // Actualización de la posición de la cabeza de la serpiente en función de la velocidad actual
    hakuX += velocityX;
    hakuY += velocityY;

    // Desplazando hacia adelante los valores de los elementos en el cuerpo de la serpiente en uno
    for (let i = hakuBody.length - 1; i > 0; i--) {
        hakuBody[i] = hakuBody[i - 1];
    }
    hakuBody[0] = [hakuX, hakuY];
    
    
     // Configuración del primer elemento del cuerpo de la serpiente en la posición actual de la serpiente

    // Comprobando si la cabeza de la serpiente está fuera de la pared, si es así se configura gameOver en verdadero para finalizar el juego
    if (hakuX <= 0 || hakuX > 30 || hakuY <= 0 || hakuY > 30) {
        return gameOver = true;
    }

    for (let i = 0; i < hakuBody.length; i++) {
        // Se dibuja un div para cada parte del cuerpo de la serpiente.
        if (hakuBody.length === 1) {
            html += `<div class="head" style="grid-area: ${hakuBody[0][1]} / ${hakuBody[0][0]}"></div>`;
        } else if (hakuBody.length === 2) {
            html += `<div class="head" style="grid-area: ${hakuBody[0][1]} / ${hakuBody[0][0]}"></div>`;
            html += `<div class="tail" style="grid-area: ${hakuBody[1][1]} / ${hakuBody[1][0]}"></div>`;
        } else {
            html += `<div class="head" style="grid-area: ${hakuBody[0][1]} / ${hakuBody[0][0]}"></div>`;

            for (let i = 1; i < hakuBody.length - 1; i++) {
                html += `<div class="body" style="grid-area: ${hakuBody[i][1]} / ${hakuBody[i][0]}"></div>`;
            }
    
            for (let i = hakuBody.length - 1; i < hakuBody.length; i++) {
                html += `<div class="tail" style="grid-area: ${hakuBody[i][1]} / ${hakuBody[i][0]}"></div>`;
            }
        }
        // switch() {
        //     case "head":
        //         html += `<div class="head" style="grid-area: ${hakuBody[0][1]} / ${hakuBody[0][0]}"></div>`;
        //         break;

        //     case "body":
        //         if (hakuBody.length > 2 && 0 < 1 < hakuBody.length -1){
        //             html += `<div class="body" style="grid-area: ${hakuBody[i][1]} / ${hakuBody[i][0]}"></div>`;
        //         }
        //         break;
            
        //     case "tail":
        //         if (i === hakuBody.length - 1) {
        //             html += `<div class="tail" style="grid-area: ${hakuBody[i][1]} / ${hakuBody[i][0]}"></div>`
        //         }
        //         break;
            
        //     case 
        // }
        
        // Comprobamos si la cabeza de la serpiente golpeó el cuerpo, si es así, establezca gameOver en verdadero
        if (i !== 0 && hakuBody[0][1] === hakuBody[i][1] && hakuBody[0][0] === hakuBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = html;
}
// Llamar a la actualización de la posición de la comida
paperPlace();
setIntervalId = setInterval(iniciarJuego, 200);
document.addEventListener("keyup", changeDirect);
