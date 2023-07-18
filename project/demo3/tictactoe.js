class tictactoe {

    constructor(nbLigne, nbCol) {
        this.maxLigne = nbLigne;
        this.maxCol = nbCol;
        this.turn = "O";
        this.plateau = [];
        this.etatFinal = [];

        // Initialisation du plateau avec des "_"
        for (let i = 0; i < nbLigne; i++) {
            let tmpLigne = [];
            for (let j = 0; j < nbCol; j++) {
                tmpLigne.push("_");
            }
            this.plateau.push(tmpLigne);
        }

        // Création des états finaux pour chaque ligne
        for (let i = 0; i < nbLigne; i++) {
            let tmpEtatF = [];
            for (let j = 0; j < nbCol; j++) {
                tmpEtatF.push([i, j]);
            }
            this.etatFinal.push(tmpEtatF);
        }

        // Création des états finaux pour chaque colonne
        for (let i = 0; i < nbCol; i++) {
            let tmpEtatF = [];
            for (let j = 0; j < nbLigne; j++) {
                tmpEtatF.push([j, i]);
            }
            this.etatFinal.push(tmpEtatF);
        }

        // Création des états finaux pour les diagonales si nbLigne=nbCol
        if (nbLigne == nbCol) {
            let tmpEtatFD1 = [];
            let tmpEtatFD2 = [];
            for (let i = 0; i < nbLigne; i++) {
                tmpEtatFD1.push([i, i]);
                tmpEtatFD2.push([i, nbLigne-1-i]);
            }
            this.etatFinal.push(tmpEtatFD1);
            this.etatFinal.push(tmpEtatFD2);
        }
    }

    addEtatFinal(Liste) {
        this.etatFinal.push(Liste);
    }

    mouvement(lig, col) {
        if (lig < 0 || lig > this.maxLigne || col < 0 || col > this.maxCol) {
            return false; //l'emplacement est non-valide, c'est toujours au même joueur de jouer
        }
        if (this.plateau[lig][col] === "_") { //si le mouvement est valide
            this.plateau[lig][col] = this.turn; //jouer le coup approprié
            this.turn = this.turn === "O" ? "X" : "O"; //au tour du prochian joueur
            return true;
        } else {
            return false; //le mouvement n'est pas valide, c'est toujours au même joueur de jouer
        }
    }

    /**
     * retourne si la grille est pleine -> match nul
     */
    grillePleine() {
        for (let lig = 0; lig < this.maxLigne; lig++) {
            for (let col = 0; col < this.maxCol; col++) {
                if (this.plateau[lig][col] === "_") return false;
            }
        }
        return true;
    }

    /**
     * retourne le signe gagnant, faux si la partie est toujours en cours
     */
    gagnant() {
        for (let etatFinal of this.etatFinal) { // parcours des états finaux
            let signe = this.plateau[etatFinal[0][0]][etatFinal[0][1]]; // récupération du signe du premier état final
            let gagne = true;
            for (let i = 1; i < etatFinal.length; i++) {
                let ligne = etatFinal[i][0];
                let col = etatFinal[i][1];
                if (this.plateau[ligne][col] != signe) { // vérification si tous les états finaux ont le même signe
                    gagne = false;
                    break;
                }
            }
            if (gagne && signe != "_") { // si tous les états finaux ont le même signe et que ce signe n'est pas "_", on a un gagnant
                return signe;
            }
        }
        return false; // si aucun état final n'a été atteint, la partie n'est pas terminée
    }

    getJoueur() {
        return this.turn;
    }

    adversaire(joueur) {
        return joueur === 'O' ? 'X' : 'O';
    }

    finDePartie() {
        return (this.gagnant() !== false) || (this.grillePleine() === true);
    }

    getGrille(){
        return this.plateau;
    }

    getPlateau() {
        let result = '<br><br>';
        for (let i = 0; i < this.maxLigne; i++) {
            for (let j = 0; j < this.maxCol; j++) {
                const cell = this.plateau[i][j];
                result += cell !== '_' ? cell : '_';
                if (j < this.maxCol - 1) {
                    result += '|';
                }
            }
            result += '\n';
            if (i < this.maxLigne - 1) {
                result += '<br>';
            }
        }
        return result;
    }

    //nom affichage déjà prit dans ce projet
    affichageTicTacToe() {
        let aff = document.getElementById("affichage");
        let p = document.createElement("div");
        for (let i = 0; i < this.maxLigne; i++) {
            for (let j = 0; j < this.maxCol; j++) {
                if (this.plateau[i][j] === "X") {
                    p.innerHTML += " X ";
                } else if (this.plateau[i][j] === "O") {
                    p.innerHTML += " O ";
                } else {
                    p.innerHTML += " _ ";
                }
            }
            p.innerHTML += "<br>";
        }
        aff.appendChild(p);
    }


    /**
     * retourne le meilleur coup possible pour "joueur"
     * le coup gagnant s'il est possible
     * un coup aléatoire sinon
     */
    meilleurCoup(joueur) {
        if (this.finDePartie()) {
            return null;
        }

        let meilleurScore = -Infinity;
        let meilleurCoup;

        for (let i = 0; i < this.maxLigne; i++) {
            for (let j = 0; j < this.maxCol; j++) {
                if (this.plateau[i][j] === "_") {
                    this.plateau[i][j] = joueur;
                    let score = this.minimax(this.plateau, 2, true, joueur);
                    this.plateau[i][j] = "_";
                    if (score => meilleurScore) {
                        meilleurScore = score;
                        meilleurCoup = [i, j];
                    }
                }
            }
        }

        /*if(meilleurScore === -Infinity){ //coup gagnant pas possible
            let allCoups = [];
            for (let i = 0; i < this.maxLigne; i++) {
                for (let j = 0; j < this.maxCol; j++) {
                    if (this.plateau[i][j] === "_") {
                        allCoups.push([i, j]);
                    }
                }
            }
            //console.log("coups dispos: " + allCoups);
            return allCoups[Math.floor(Math.random() * allCoups.length)];
        }*/

        return meilleurCoup;
    }

    /**
     * minimax normal
     * @param grille plateau a tester (nommé grille pour pas confondre avec this.plateau)
     */
    minimax(grille, profondeur, estMaximisant, joueur) {
        if (this.finDePartie() || profondeur === 0) {
            let gagnant = this.gagnant();
            if (gagnant === joueur) {
                return 100-profondeur;
            } else if (gagnant === this.adversaire(joueur)) {
                return -100+profondeur;
            } else {
                return 0;
            }
        }

        if (estMaximisant) {
            let meilleurScore = -Infinity;
            for (let i = 0; i < this.maxLigne; i++) {
                for (let j = 0; j < this.maxCol; j++) {
                    if (grille[i][j] === "_") {
                        grille[i][j] = joueur;
                        let score = this.minimax(grille, profondeur - 1, false, joueur);
                        meilleurScore = Math.max(meilleurScore, score);
                        grille[i][j] = "_";
                        
                    }
                }
            }
            return meilleurScore;
        } else {
            let pireScore = Infinity;
            for (let i = 0; i < this.maxLigne; i++) {
                for (let j = 0; j < this.maxCol; j++) {
                    if (grille[i][j] === "_") {
                        grille[i][j] = this.adversaire(joueur);
                        let score = this.minimax(grille, profondeur - 1, true, joueur);
                        pireScore = Math.min(pireScore, score);
                        grille[i][j] = "_";
                        
                    }
                }
            }
            return pireScore;
        }
    }

    /**
     * elagage alpha-beta
     */

    meilleurCoupAB(joueur) {
        if (this.finDePartie()) {
            return null;
        }

        let meilleurScore = -Infinity;
        let meilleurCoup;

        for (let i = 0; i < this.maxLigne; i++) {
            for (let j = 0; j < this.maxCol; j++) {
                if (this.plateau[i][j] === "_") {
                    this.plateau[i][j] = joueur;
                    let score = this.minimaxAB(this.plateau, 2, false, joueur, -Infinity, Infinity);
                    this.plateau[i][j] = "_";

                    if (score > meilleurScore) {
                        meilleurScore = score;
                        meilleurCoup = [i, j];
                    }
                }
            }
        }

        if(meilleurScore === -Infinity){ 
            let allCoups = [];
            for (let i = 0; i < this.maxLigne; i++) {
                for (let j = 0; j < this.maxCol; j++) {
                    if (this.plateau[i][j] === "_") {
                        allCoups.push([i, j]);
                    }
                }
            }
            //console.log("coups dispos: " + allCoups);
            return allCoups[Math.floor(Math.random() * allCoups.length)];
        }

        return meilleurCoup;
    }

    minimaxAB(grille, profondeur, estMaximisant, joueur, alpha, beta) {
        if (this.finDePartie() || profondeur === 0) {
            let gagnant = this.gagnant();
            if (gagnant === joueur) {
                return 100-profondeur;
            } else if (gagnant === this.adversaire(joueur)) {
                return -100+profondeur;
            } else {
                return 0;
            }
        }

        if (estMaximisant) {
            let meilleurScore = -Infinity;
            for (let i = 0; i < this.maxLigne; i++) {
                for (let j = 0; j < this.maxCol; j++) {
                    if (grille[i][j] === "_") {
                        grille[i][j] = joueur;
                        let score = this.minimaxAB(grille, profondeur - 1, false, joueur, alpha, beta);
                        grille[i][j] = "_";
                        meilleurScore = Math.max(meilleurScore, score);
                        alpha = Math.max(alpha, meilleurScore);
                        if (meilleurScore >= beta) {
                            break;
                        }
                    }
                }
            }
            return meilleurScore;
        } else {
            let pireScore = Infinity;
            for (let i = 0; i < this.maxLigne; i++) {
                for (let j = 0; j < this.maxCol; j++) {
                    if (grille[i][j] === "_") {
                        grille[i][j] = this.adversaire(joueur);
                        let score = this.minimaxAB(grille, profondeur - 1, true, joueur, alpha, beta);
                        grille[i][j] = "_";
                        pireScore = Math.min(pireScore, score);
                        beta = Math.min(beta, pireScore);
                        if (pireScore <= alpha) {
                            break;
                        }
                    }
                }
            }
            return pireScore;
        }
    }

}