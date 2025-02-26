<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Adivina el Número de 4 Cifras</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin-top: 50px;
            background-color: #f4f4f4;
            color: #333;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            gap: 50px;
        }
        .game-container {
            max-width: 600px;
            text-align: center;
        }
        .legend {
            max-width: 300px;
            text-align: left;
            background-color: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .message {
            margin: 20px;
            font-size: 1.2em;
        }
        .input {
            padding: 10px;
            font-size: 1em;
            margin: 10px;
        }
        .button {
            padding: 10px 20px;
            font-size: 1em;
            cursor: pointer;
            margin: 10px;
        }
        .attempts {
            margin-top: 20px;
            font-size: 1.2em;
        }
        .history {
            margin-top: 20px;
            font-size: 1.2em;
        }
        .history ul {
            list-style-type: none;
            padding: 0;
        }
        .history li {
            margin: 5px 0;
        }
        .score {
            margin-top: 20px;
            font-size: 1.2em;
        }
        .timer {
            margin-top: 20px;
            font-size: 1.5em;
            font-weight: bold;
            display: none; /* Ocultar inicialmente */
        }
        .game-mode {
            margin-top: 20px;
        }
        .game-mode button {
            margin: 5px;
        }
    </style>
</head>
<body>

    <div class="game-container">
        <h1>Adivina el Número de 4 Cifras</h1>

        <!-- Selección de modo de juego -->
        <div class="game-mode" id="gameMode">
            <p>Elige un modo de juego:</p>
            <button onclick="setNormalMode()" class="button">Normal (18 intentos)</button>
            <button onclick="setHardMode()" class="button">Difícil (9 intentos)</button>
            <button onclick="setTimeChallenge()" class="button">Desafío con Tiempo</button>
        </div>

        <!-- Área de juego (oculta inicialmente) -->
        <div id="gameArea" style="display: none;">
            <p>Ingresa un número de 4 cifras (sin repetir dígitos y sin el dígito 0):</p>

            <div class="message" id="message"></div>

            <input type="number" id="guessInput" class="input" min="1111" max="9999">
            <button onclick="checkGuess()" class="button">Adivinar</button>
            <button onclick="resetGame()" class="button">Reiniciar Juego</button>
            <button onclick="resetMode()" class="button">Reiniciar Modo</button>

            <div class="attempts" id="attempts"></div>
            <div class="timer" id="timer">Tiempo restante: 59 segundos</div>
            <div class="score" id="score"></div>
            <div class="history" id="history">
                <h2>Historial de Intentos</h2>
                <ul id="historyList"></ul>
            </div>
        </div>
    </div>

    <div class="legend">
        <h2>¿Cómo jugar?</h2>
        <p><strong>Fama (F):</strong> Un dígito es "Fama" cuando está en la posición correcta en el número secreto.</p>
        <p><strong>Toque (T):</strong> Un dígito es "Toque" cuando está en el número secreto, pero en una posición incorrecta.</p>
        <h3>Ejemplo:</h3>
        <p>Número secreto: <strong>3754</strong></p>
        <ul>
            <li>Si ingresas <strong>3198</strong>:</li>
            <ul>
                <li>El dígito <strong>3</strong> es "Fama" (posición correcta).</li>
            </ul>
            <li>Si ingresas <strong>1938</strong>:</li>
            <ul>
                <li>El dígito <strong>3</strong> es "Toque" (está en el número secreto, pero en otra posición).</li>
            </ul>
        </ul>
        <h3>Combinaciones Posibles:</h3>
        <p>Hay <strong id="combinations">3024</strong> combinaciones posibles.</p>
    </div>

    <script>
        // Función para generar un número de 4 cifras sin dígitos repetidos y sin el dígito 0
        function generateSecretNumber() {
            const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            let secretNumber = '';
            while (secretNumber.length < 4) {
                const randomIndex = Math.floor(Math.random() * digits.length);
                const digit = digits[randomIndex];
                if (!secretNumber.includes(digit)) {
                    secretNumber += digit;
                }
            }
            return secretNumber;
        }

        // Variables del juego
        let secretNumber;
        let attempts = 0;
        let maxAttempts;
        let isHardMode = false;
        let isTimeChallenge = false;
        let timeLeft = 59;
        let timerInterval;
        const historyList = document.getElementById('historyList');

        // Mostrar el número de intentos restantes
        function updateAttemptsDisplay() {
            document.getElementById('attempts').innerHTML = `Intentos restantes: ${maxAttempts - attempts}`;
        }

        // Reiniciar el juego
        function resetGame() {
            secretNumber = generateSecretNumber();
            attempts = 0;
            historyList.innerHTML = '';
            document.getElementById('message').innerHTML = '';
            document.getElementById('guessInput').disabled = false;
            document.querySelector('button').disabled = false;
            updateAttemptsDisplay();
            if (isTimeChallenge) {
                startTimer();
            }
        }

        // Reiniciar el modo de juego
        function resetMode() {
            document.getElementById('gameMode').style.display = 'block';
            document.getElementById('gameArea').style.display = 'none';
            document.getElementById('timer').style.display = 'none';
            clearInterval(timerInterval);
        }

        // Activar modo normal (18 intentos)
        function setNormalMode() {
            isHardMode = false;
            isTimeChallenge = false;
            maxAttempts = 18;
            document.getElementById('timer').style.display = 'none';
            document.getElementById('gameMode').style.display = 'none';
            document.getElementById('gameArea').style.display = 'block';
            resetGame();
        }

        // Activar modo difícil (9 intentos)
        function setHardMode() {
            isHardMode = true;
            isTimeChallenge = false;
            maxAttempts = 9;
            document.getElementById('timer').style.display = 'none';
            document.getElementById('gameMode').style.display = 'none';
            document.getElementById('gameArea').style.display = 'block';
            resetGame();
        }

        // Activar desafío con tiempo (18 intentos, 59 segundos por intento)
        function setTimeChallenge() {
            isTimeChallenge = true;
            isHardMode = false;
            maxAttempts = 18;
            document.getElementById('timer').style.display = 'block';
            document.getElementById('gameMode').style.display = 'none';
            document.getElementById('gameArea').style.display = 'block';
            resetGame();
        }

        // Iniciar el temporizador
        function startTimer() {
            timeLeft = 59;
            document.getElementById('timer').innerHTML = `Tiempo restante: ${timeLeft} segundos`;
            timerInterval = setInterval(() => {
                timeLeft--;
                document.getElementById('timer').innerHTML = `Tiempo restante: ${timeLeft} segundos`;
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    handleTimeOut();
                }
            }, 1000);
        }

        // Manejar el tiempo agotado
        function handleTimeOut() {
            attempts++;
            const historyItem = document.createElement('li');
            historyItem.innerHTML = `Intento ${attempts}: Tiempo agotado`;
            historyList.appendChild(historyItem);
            updateAttemptsDisplay();

            if (attempts >= maxAttempts) {
                document.getElementById('message').innerHTML = `Game Over, te quedaste sin intentos. El número secreto era: ${secretNumber}.`;
                document.getElementById('message').style.color = 'red';
                disableInput();
            } else {
                startTimer(); // Reiniciar el temporizador para el siguiente intento
            }
        }

        // Determinar el rango y mensaje basado en los intentos
        function getRankAndMessage(attempts) {
            if (attempts === 1) {
                return { rank: "Ultra Mega S+++", message: "Eres Nostradamus, absolutamente demencial" };
            } else if (attempts === 2) {
                return { rank: "Ultra S+++", message: "Eres Baba Vanga pitonisa legendaria" };
            } else if (attempts === 3) {
                return { rank: "Ultra S++", message: "Eres Rasputín, adivino místico" };
            } else if (attempts === 4) {
                return { rank: "S+", message: "Eres René Guénon vidente épico" };
            } else if (attempts === 5) {
                return { rank: "S", message: "" };
            } else if (attempts === 6) {
                return { rank: "A+", message: "" };
            } else if (attempts === 7) {
                return { rank: "A", message: "" };
            } else if (attempts === 8) {
                return { rank: "A-", message: "" };
            } else if (attempts === 9) {
                return { rank: "B+", message: "" };
            } else if (attempts === 10) {
                return { rank: "B", message: "" };
            } else if (attempts === 11) {
                return { rank: "B-", message: "" };
            } else if (attempts === 12) {
                return { rank: "C", message: "" };
            } else if (attempts === 13) {
                return { rank: "C-", message: "" };
            } else if (attempts === 14) {
                return { rank: "D", message: "" };
            } else if (attempts === 15) {
                return { rank: "D-", message: "" };
            } else if (attempts === 16) {
                return { rank: "E", message: "" };
            } else if (attempts === 17) {
                return { rank: "E-", message: "" };
            } else if (attempts === 18) {
                return { rank: "F", message: "" };
            } else {
                return { rank: "F-", message: "" };
            }
        }

        // Verificar la suposición del jugador
        function checkGuess() {
            const userGuess = document.getElementById('guessInput').value;
            const message = document.getElementById('message');

            // Validar la entrada del usuario
            if (userGuess.length !== 4 || !/^[1-9]{4}$/.test(userGuess) || new Set(userGuess).size !== 4) {
                message.innerHTML = 'Por favor, ingresa un número válido de 4 cifras (sin repetir dígitos y sin el dígito 0).';
                message.style.color = 'red';
                return;
            }

            attempts++;
            let fama = 0;
            let toque = 0;

            // Verificar "Fama" y "Toque"
            for (let i = 0; i < 4; i++) {
                if (userGuess[i] === secretNumber[i]) {
                    fama++;
                } else if (secretNumber.includes(userGuess[i])) {
                    toque++;
                }
            }

            // Agregar el intento al historial
            const historyItem = document.createElement('li');
            historyItem.innerHTML = `Intento ${attempts}: ${userGuess} - Fama: ${fama}, Toque: ${toque}`;
            historyList.appendChild(historyItem);

            // Verificar si el jugador ha ganado
            if (fama === 4) {
                const { rank, message: rankMessage } = getRankAndMessage(attempts);
                message.innerHTML = `¡Felicidades! Adivinaste el número secreto (${secretNumber}) en ${attempts} intentos. ${rankMessage} Rango: ${rank}`;
                message.style.color = 'green';
                disableInput();
                clearInterval(timerInterval);
            } else if (attempts >= maxAttempts) {
                message.innerHTML = `Game Over, te quedaste sin intentos. El número secreto era: ${secretNumber}.`;
                message.style.color = 'red';
                disableInput();
                clearInterval(timerInterval);
            } else {
                message.innerHTML = 'Sigue intentando.';
                message.style.color = 'black';
                if (isTimeChallenge) {
                    startTimer(); // Reiniciar el temporizador para el siguiente intento
                }
            }

            // Actualizar el contador de intentos
            updateAttemptsDisplay();

            // Limpiar el campo de entrada
            document.getElementById('guessInput').value = '';
        }

        // Deshabilitar la entrada después de ganar o perder
        function disableInput() {
            document.getElementById('guessInput').disabled = true;
            document.querySelector('button').disabled = true;
        }
    </script>

</body>
</html>