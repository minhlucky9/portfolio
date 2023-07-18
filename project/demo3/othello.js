var Difficulte = {
    ALEATOIRE: 0,
    GLUTON: 1,
    MINMAX: 2,
    ALPHABETA: 3
}
class othello {

    constructor(rows, columns) {
        this.rows = rows;
        this.columns = columns;
        this.turn = "W";
        this.board = this.createBoard(rows, columns);
        this.initializeBoard();
    }


    // Creates an empty board with the specified number of rows and columns
    createBoard(rows, columns) {
        const board = new Array(rows);
        for (let i = 0; i < rows; i++) {
            board[i] = new Array(columns);
        }
        return board;
    }

    // Initializes the board with the starting pieces
    initializeBoard() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                this.board[i][j] = '_';
            }
        }
        const middleRow = Math.floor(this.rows / 2) - 1;
        const middleColumn = Math.floor(this.columns / 2) - 1;
        this.board[middleRow][middleColumn] = 'B';
        this.board[middleRow][middleColumn + 1] = 'W';
        this.board[middleRow + 1][middleColumn] = 'W';
        this.board[middleRow + 1][middleColumn + 1] = 'B';
    }

    getJoueur() {
        return this.turn;
    }

    calculWinner() {
        let blocs = this.rows * this.columns;
        //console.log("Le plateau a " + blocs + " cases !");
        let b = 0;
        for (let lig = 0; lig < this.rows; lig++) {
            for (let col = 0; col < this.columns; col++) {
                if (this.board[lig][col] === "B") b++;
            }
        }
        let c = blocs - b;
        let s = "Noir possède " + b + " jetons !";
        s += "\n";
        s += "Blanc possède " + c + " jetons !";
        s += "\n";
        //console.log("Noir a posé " + b + " jetons !");
        //console.log("Blanc a posé " + c + " jetons !");
        if (b > blocs - b) s += "Noir a gagné !";
        else s += "Blanc a gagné !";
        //console.log("Début alerte");
        setTimeout(function(){
            alert(s);
        },1000); 
        //console.log("Fin alerte");
    }

    gagnant() {
        if (this.isGameOverMM(false)) {
            let blackScore = 0;
            let whiteScore = 0;

            // Parcourir le plateau pour compter les pions de chaque joueur
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.columns; j++) {
                    if (this.board[i][j] === 'B') {
                        blackScore++;
                    } else if (this.board[i][j] === 'W') {
                        whiteScore++;
                    }
                }
            }

            // Déterminer le gagnant en fonction du score
            if (blackScore > whiteScore) {
                return 'B';
            } else if (whiteScore > blackScore) {
                return 'W';
            }
        } else return false;
    }

    // Returns true if the game is over (i.e., the board is full or no more moves can be made)
    isGameOver(bool) {
        // Check if the board is full
        /*for (let i = 0; i < this.rows; i++) {
             for (let j = 0; j < this.columns; j++) {
                 if (this.board[i][j] === '_') {
                     return false;
                 }
             }
         }*/
        //If one player can't move
        let res = true;
        for (let i = 0; i < this.rows; i++) {
             for (let j = 0; j < this.columns; j++) {
                if (this.board[i][j] === '_') {
                    res = false;
                }
             }
         }
        if (res && bool) this.calculWinner(this.signe);
        if (!this.hasValidMoves(this.turn) && this.hasValidMoves(this.getOpponent(this.turn))) {
            console.log(this.turn + " : j'ai passé mon tour");
            this.turn = this.getOpponent(this.turn);
            /*
            this.isGameOver(false);
            let racine;
            let morpion;
            let oth;
            this.getValidMoves('W');
            racine = new noeud(this.getPlateau());
            DFS(racine);
            this.affichageOthello();
            addClickEventToValidMovesA();
            */
            //console.log("C'est maintenant le tour de "+ this.turn);
            return false;
        }
        // Check if either player has no valid moves
        if (!this.hasValidMoves('B') && !this.hasValidMoves('W')) {
            this.calculWinner(this.signe);
            return true;
        } else return false;
        //return !this.hasValidMoves('B') && !this.hasValidMoves('W');
    }

    isGameOverMM(bool) {
        //Check if the board is full
        let res = true;
        for (let i = 0; i < this.rows; i++) {
             for (let j = 0; j < this.columns; j++) {
                if (this.board[i][j] === '_') {
                    res = false;
                }
             }
         }
        if (res && bool) this.calculWinner(this.signe);
        //If one player can't move
        if (!this.hasValidMoves(this.turn) && this.hasValidMoves(this.getOpponent(this.turn))) {
            console.log(this.turn + " : j'ai passé mon tour");
            this.turn = this.getOpponent(this.turn);
            this.isGameOverMM(false);
            let racine;
            let morpion;
            let oth;
            this.getValidMoves('W');
            racine = new noeud(this.getPlateau());
            DFS(racine);
            this.affichageOthello();
            addClickEventToValidMovesA();
            return false;
        }
        // Check if either player has no valid moves
        if (!this.hasValidMoves('B') && !this.hasValidMoves('W')) {
            //this.calculWinner(this.signe);
            return true;
        } else return false;
        //return !this.hasValidMoves('B') && !this.hasValidMoves('W');
    }
    switchTurn() {
        this.turn = this.getOpponent(this.turn);
    }
    // Returns true if the specified player has at least one valid move
    hasValidMoves(player) {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                if (this.isValidMove(i, j, player)) {
                    return true;
                }
            }
        }
        return false;
    }

    // Vérifie si le mouvement proposé est valide
    isValidMove(row, column, player) {
        // Vérifie que la case est vide
        if (this.board[row][column] !== '_') {
            return false;
        }

        // Recherche des pièces capturées dans chaque direction
        const opponent = this.getOpponent(player);
        const directions = [
            [0, 1], [0, -1], [1, 0], [-1, 0],
            [1, 1], [1, -1], [-1, 1], [-1, -1]
        ];
        let hasValidDirection = false;
        for (const direction of directions) {
            let r = row + direction[0];
            let c = column + direction[1];
            let validDirection = false;
            while (r >= 0 && r < this.rows && c >= 0 && c < this.columns && this.board[r][c] === opponent) {
                r += direction[0];
                c += direction[1];
                validDirection = true;
            }
            if (r >= 0 && r < this.rows && c >= 0 && c < this.columns && this.board[r][c] === player && validDirection) {
                hasValidDirection = true;
            }
        }
        return hasValidDirection;
    }

// Effectue le mouvement proposé et capture les pièces nécessaires
    makeMove(row, column) {
        const player = this.turn;

        // Vérifie que le mouvement est valide
        if (!this.isValidMove(row, column, player)) {
            return false;
        }

        // Effectue le mouvement
        this.board[row][column] = player;

        // Capture les pièces nécessaires
        this.capture(row, column);

        // Passe au tour suivant
        this.turn = this.getOpponent(player);

        return true;
    }

    getPlateau() {
        const emojis = {
            '_': '🟩',
            'W': '⚪️',
            'B': '⚫️',
            'V': '🟦'
        };
        let result = '<br><br>';
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                const cell = this.board[i][j];
                if (cell === '_') {
                    if (this.isValidMove(i, j, this.turn)) {
                        result += emojis['V'];
                    } else {
                        result += emojis['_'];
                    }
                } else {
                    result += emojis[cell];
                }
                if (j < this.columns - 1) {
                    result += '|';
                }
            }
            result += '\n';
            if (i < this.rows - 1) {
                result += '<br>';
            }
        }
        return result;
    }

// Capture les pièces nécessaires après un mouvement
    capture(row, column) {
        const player = this.turn;
        const opponent = this.getOpponent(player);

        const directions = [
            [0, 1], [0, -1], [1, 0], [-1, 0],
            [1, 1], [1, -1], [-1, 1], [-1, -1]
        ];
        for (const direction of directions) {
            let r = row + direction[0];
            let c = column + direction[1];
            let piecesToCapture = [];
            while (r >= 0 && r < this.rows && c >= 0 && c < this.columns && this.board[r][c] === opponent) {
                piecesToCapture.push([r, c]);
                r += direction[0];
                c += direction[1];
            }
            if (r >= 0 && r < this.rows && c >= 0 && c < this.columns && this.board[r][c] === player) {
                for (const pieceToCapture of piecesToCapture) {
                    const captureRow = pieceToCapture[0];
                    const captureColumn = pieceToCapture[1];
                    this.board[captureRow][captureColumn] = player;
                }
            }
        }
    }

    getOpponent(player) {
        return (player === 'B') ? 'W' : 'B';
    }

// Returns the current state of the game as a string
    toString() {
        let result = '';
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                result += (this.board[i][j]) ? this.board[i][j] : '-';
                result += ' ';
            }
            result += '\n';
        }
        return result;
    }
    wait() {
        setTimeout(function(){
            
        },1000);
    }
    affichageOthello() {
        let aff = document.getElementById("affichage");
        aff.innerHTML = '';
        for (let i = 0; i < this.rows; i++) {
            let p = document.createElement("p");
            for (let j = 0; j < this.columns; j++) {
                const cell = this.board[i][j];
                let span = document.createElement("span");
                span.dataset.index_i = i;
                span.dataset.index_j = j;

                if (cell === "W") {
                    span.innerHTML = "⚪️";
                } else if (cell === "B") {
                    span.innerHTML = "⚫️";
                } else if (cell === "_") {
                    if (this.isValidMove(i, j, this.turn)) {
                        span.className = "valid-move";
                        span.innerHTML = "🟦";

                    } else {
                        span.innerHTML = "🟩";
                    }
                }
                p.appendChild(span);
                if (j < this.columns - 1) {
                    let space = document.createTextNode("\u00A0");
                    p.appendChild(space);
                }
            }
            aff.appendChild(p);
        }

        let validMoves = document.getElementsByClassName("valid-move");
        for (let i = 0; i < validMoves.length; i++) {
            validMoves[i].addEventListener("mouseover", () => {
                validMoves[i].style.cursor = "pointer";
            });
        }

    }

    /*autoPlay() {
        while (!this.isGameOver()) {
            let result = [];
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.columns; j++) {
                    const cell = this.board[i][j];
                    if (cell === '_') {
                        if (this.isValidMove(i, j, this.turn)) {
                            result.push([i, j]);
                        }
                    }

                }
            }
            const move = result[Math.floor((Math.random() * result.length))];
            this.makeMove(move[0], move[1]);
        }
    }*/

    autoPlay(bot1, bot2){

        let idInterval = setInterval(function() {
            if(!oth.isGameOver(false)){
                
                let oldJoueur = oth.getJoueur();
             
                if(oth.hasValidMoves(oldJoueur)) {
                    let result = oth.getValidMoves(oldJoueur);
                    if(oth.getJoueur() == "W") {
                        let move = oth.getBot(bot1, result);
                        oth.makeMove(move[0],move[1]);
                        let racine = new noeud(oth.getPlateau());
                        //console.log(oth.toString());
                        console.log("bot1");
                        DFS(racine);
                    } else {
                        let move = oth.getBot(bot2, result);
                        oth.makeMove(move[0],move[1]);
                        let racine = new noeud(oth.getPlateau());
                        //console.log(oth.toString());
                        console.log("bot2");
                        DFS(racine);
                    }

                } else {
                    console.log(oldJoueur + " : j'ai passé mon tour");
                    oth.switchTurn();
                }
                
            } else {
                clearInterval(idInterval);
            }
            oth.affichageOthello();
        }, 100);
        
    }

    getBot(nom, result) {
        switch(nom) {
            case Difficulte.ALEATOIRE:
                return this.botAleatoire(result);
            case Difficulte.GLUTON:
                return this.botGlouton(result);
            case Difficulte.MINMAX:
                return this.meilleurCoup(this.getJoueur());
            case Difficulte.ALPHABETA:
                return this.meilleurCoupAB(this.getJoueur());
            default:
                return this.botAleatoire(result);
        }
    }

    calculJetonObtenirPourMouvement(row, column, player) {

        // Vérifie que la case est vide
        if (this.board[row][column] !== '_') {
            return 0;
        }

        // Recherche des pièces capturées dans chaque direction
        const opponent = this.getOpponent(player);
        const directions = [
            [0, 1], [0, -1], [1, 0], [-1, 0],
            [1, 1], [1, -1], [-1, 1], [-1, -1]
        ];
        let jetonObtenir = 0;

        for (const direction of directions) {
            let r = row + direction[0];
            let c = column + direction[1];
            let validDirection = false;
            let jetonDansDirection = 0;
            while (r >= 0 && r < this.rows && c >= 0 && c < this.columns && this.board[r][c] === opponent) {
                r += direction[0];
                c += direction[1];
                jetonDansDirection++;
                validDirection = true;
            }

            if (r >= 0 && r < this.rows && c >= 0 && c < this.columns && this.board[r][c] === player && validDirection) {
                jetonObtenir += jetonDansDirection;
            }
        }
        return jetonObtenir;
    }

    botAleatoire(possibleMouvement) {
        //console.log(possibleMouvement);
        return possibleMouvement[Math.floor((Math.random() * possibleMouvement.length))];
    }

    botGlouton(possibleMouvement) {
        let meilleurMoves = [possibleMouvement[0]];
        //console.log(meilleurMoves);
        let max = this.calculJetonObtenirPourMouvement(meilleurMoves[0][0], meilleurMoves[0][1], this.turn);

        for(let i = 1; i < possibleMouvement.length; i ++) {
            let val = this.calculJetonObtenirPourMouvement(possibleMouvement[i][0], possibleMouvement[i][1], this.turn);
            if(max < val) {
                max = val;
                meilleurMoves = [possibleMouvement[i]];
            } else if(max == val) {
                meilleurMoves.push(possibleMouvement[i]);
            }
        }

        return meilleurMoves[Math.floor((Math.random() * meilleurMoves.length))];
    }

    getValidMoves(joueur) {
        let result = [];
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                const cell = this.board[i][j];
                if (cell === '_') {
                    if (this.isValidMove(i, j, joueur)) {
                        result.push([i, j]);
                    }
                }
            }
        }
        return result
    }

    switchTurn() {
        this.turn = this.getOpponent(this.turn);
    }

    meilleurCoup(joueur) {
        if (this.isGameOver(false)) {
            return null;
        }

        let meilleurScore = -Infinity;
        let meilleurCoup;

        const validMoves = this.getValidMoves(joueur);
        //console.log("Valid moves:", validMoves); // Ajoutez cette ligne pour afficher les coups valides

        for (const move of validMoves) {
            this.board[move[0]][move[1]] = joueur;
            let score = this.minimax(4, false, joueur);
            this.board[move[0]][move[1]] = "_";
            //console.log("Score for move", move, ":", score); // Ajoutez cette ligne pour afficher les scores

            if (score > meilleurScore) {
                meilleurScore = score;
                meilleurCoup = move;
            }
        }

        console.log("Best move:", meilleurCoup); // Ajoutez cette ligne pour afficher le meilleur coup
        return meilleurCoup;
    }

    minimax(profondeur, estMaximisant, joueur) {
        if (this.isGameOverMM(false) || profondeur === 0) {
            let gagnant = this.gagnant();
            if (gagnant === joueur) {
                return 100 - profondeur;
            } else if (gagnant === this.getOpponent(joueur)) {
                return -100 + profondeur;
            } else {
                return 0;
            }
        }

        if (estMaximisant) {
            let meilleurScore = -Infinity;
            const validMoves = this.getValidMoves(joueur);
            for (const move of validMoves) {
                this.board[move[0]][move[1]] = joueur;
                let score = this.minimax(profondeur - 1, false, joueur);
                this.board[move[0]][move[1]] = "_";
                meilleurScore = Math.max(meilleurScore, score);
            }
            return meilleurScore;
        } else {
            let pireScore = Infinity;
            const validMoves = this.getValidMoves(this.getOpponent(joueur));
            for (const move of validMoves) {
                this.board[move[0]][move[1]] = this.getOpponent(joueur);
                let score = this.minimax(profondeur - 1, true, joueur);
                this.board[move[0]][move[1]] = "_";
                pireScore = Math.min(pireScore, score);
            }
            return pireScore;
        }
    }

    meilleurCoupAB(joueur) {
        if (this.isGameOver(false)) {
            return null;
        }

        let meilleurScore = -Infinity;
        let meilleurCoup;

        const validMoves = this.getValidMoves(joueur);

        for (const move of validMoves) {
            this.board[move[0]][move[1]] = joueur;
            let score = this.minimaxAB(2, false, joueur, -Infinity, Infinity);
            this.board[move[0]][move[1]] = "_";
            //console.log("Score for move", move, ":", score); // Ajoutez cette ligne pour afficher les scores

            if (score > meilleurScore) {
                meilleurScore = score;
                meilleurCoup = move;
            }
        }

        return meilleurCoup;
    }

    minimaxAB(profondeur, estMaximisant, joueur, alpha, beta) {
        if (this.isGameOverMM(false) || profondeur === 0) {
            let gagnant = this.gagnant();
            if (gagnant === joueur) {
                return 100 - profondeur;
            } else if (gagnant === this.getOpponent(joueur)) {
                return -100 + profondeur;
            } else {
                return 0;
            }
        }
        if (estMaximisant) {
            let meilleurScore = -Infinity;
            const validMoves = this.getValidMoves(joueur);
            for (const move of validMoves) {
                this.board[move[0]][move[1]] = joueur;
                let score = this.minimaxAB(profondeur - 1, false, joueur, alpha, beta);
                this.board[move[0]][move[1]] = "_";
                meilleurScore = Math.max(meilleurScore, score);
                alpha = Math.max(alpha, meilleurScore);
                if (beta <= alpha) {
                    break;
                }
            }
            return meilleurScore;
        } else {
            let pireScore = Infinity;
            const validMoves = this.getValidMoves(this.getOpponent(joueur));
            for (const move of validMoves) {
                this.board[move[0]][move[1]] = this.getOpponent(joueur);
                let score = this.minimaxAB(profondeur - 1, true, joueur, alpha, beta);
                this.board[move[0]][move[1]] = "_";
                pireScore = Math.min(pireScore, score);
                beta = Math.min(beta, pireScore);
                if (beta <= alpha) {
                    break;
                }
            }
            return pireScore;
        }
    }

}


