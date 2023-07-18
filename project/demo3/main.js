/*
récupérer racine
créer nouvel input
"quels sont les enfants de x (entrez avec un ; comme séparateur)"
"laisser vide si pas d'enfants"
répéter pour chaque enfant
*/

let racine;
let morpion;
let oth;

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

function ajoutNoeud() {
    //console.log("hello!"); //ok
    let valP = document.getElementById('parent').value;
    let valE = document.getElementById('enfant').value;

    //console.log(valP, valE);

    if (!valP || !valE) {
        alert("remplir les deux champs svp!");
        return;
    }

    /*step 1: ajouter noeud*/
    insert(racine, valP, new noeud(valE));
    //console.log(racine);

    /*step 2: actualiser l'arbre*/
    //méthode: suppression div dessin, recréation de l'arbre

    let arbol = document.getElementById('arbre');
    let aff = document.getElementById("affichage");
    aff.remove();

    let draw = document.createElement('div');
    draw.setAttribute("id", "affichage");

    let p2 = document.createElement('p');
    p2.innerHTML = "affichage de l'arbre: ";
    draw.appendChild(p2);
    arbol.appendChild(draw);

    //draw
    let max = racine.maxId()
    let flag = new Array(max);
    for (let i = 0; i < max; i++) {
        flag[i] = true;
    }

    //displayTree(racine);
    printNTree(racine, flag, 0, false);

    BFS(racine);
    DFS(racine);
}

function CommencerAIcontreAI() {
    var bot1 = document.getElementById("joueur1").selectedIndex;
    var bot2 = document.getElementById("joueur2").selectedIndex;
    console.log(bot1, bot2);
    if(bot1 != 4) {
       oth.autoPlay(bot1, bot2);
    }

}

function createTree() {
    racine = new noeud(document.getElementById("racine").value);

    if (!racine) {
        alert("remplir le champs svp!");
        return;
    }

    let divi = document.getElementById('init');
    divi.remove();

    let arbol = document.getElementById('arbre');
    let creator = document.createElement('div');
    creator.setAttribute("id", "createur");

    let p = document.createElement('p');
    p.innerHTML = "entrez en premier l'identifiant du noeud parent et en deuxième la valeur du noeud enfant";
    creator.appendChild(p);
    let pp = document.createElement('p');
    pp.innerHTML = "note: la racine a pour identifiant 0";
    creator.appendChild(pp);

    let inputParent = document.createElement('input');
    inputParent.setAttribute("id", "parent");
    inputParent.setAttribute("placeholder", 0);
    //inputParent.setAttribute("type", "number");
    /*let newContent = document.createTextNode("entrez ici le noeud parent");
    inputParent.appendChild(newContent);*/

    let inputEnfant = document.createElement('input');
    inputEnfant.setAttribute("id", "enfant");
    inputEnfant.setAttribute("placeholder", "ex: 3,B,...");
    //inputEnfant.setAttribute("type", "number");
    /*let newContent2 = document.createTextNode("entrez ici le noeud enfant");
    inputEnfant.appendChild(newContent2);*/

    let button = document.createElement("button");
    button.setAttribute("type", "button");
    button.innerHTML = "Valider choix";
    button.setAttribute("onclick", "ajoutNoeud()");

    creator.appendChild(inputParent);
    creator.appendChild(inputEnfant);
    creator.appendChild(button);

    let draw = document.createElement('div');
    draw.setAttribute("id", "affichage");

    let p2 = document.createElement('p');
    p2.innerHTML = "affichage de l'arbre: ";
    draw.appendChild(p2);
    let newContent = document.createTextNode(racine.valeur + " (" + racine.id + ")");
    draw.appendChild(newContent);

    arbol.appendChild(creator);
    arbol.appendChild(draw);

    BFS(racine);
    DFS(racine);
}

function createTreeNull() {
    racine = null;
    let divi = document.getElementById('init');
    divi.remove();

    let arbol = document.getElementById('arbre');
    let draw = document.createElement('div');
    draw.setAttribute("id", "affichage");

    let p2 = document.createElement('p');
    p2.innerHTML = "affichage de l'arbre: ";
    draw.appendChild(p2);
    let newContent = document.createTextNode(racine);
    draw.appendChild(newContent);

    let dfs = document.createElement('p');
    dfs.innerHTML = "DFS: ";
    let bfs = document.createElement('p');
    bfs.innerHTML = "BFS: ";
    draw.appendChild(bfs);
    draw.appendChild(dfs);

    arbol.appendChild(draw);

}

function is_in_set(tab,valeur){
    let bool = false;
    for(let i = 0; i < tab.length; i++){
        bool = ((tab[i].aventuriers === valeur.aventuriers) &&
            (tab[i].cannibales === valeur.cannibales) &&
            (tab[i].posBateau === valeur.posBateau)) || bool;
    }
    return bool;
}

function BFS_CM(root){
    let tab = [];
    let queue = [];
    let visite = [];

    queue.push(root);
    visite.push(root.valeur);

    while(queue.length !== 0){
        let node = queue.shift();
        tab.push(node.valeur);

        if(node.valeur.est_etat_but()){
            break;
        }

        let childs = node.valeur.mouvSuivants();

        childs.forEach(enfant => {
            //console.log(enfant);
            //queue.push(enfant);
            if(!is_in_set(visite,enfant)){
                insert(racine,node.id,new noeud(enfant));
                visite.push(enfant);
            }
        });

        //console.log(visite);

        node.enfants.forEach(enfant => {
            //console.log(enfant);
            queue.push(enfant);
        });
        console.log(queue.length);
    }

    return tab;
}

function createTreeCM(){
    let pb = new cm(3,3,'g');
    racine = new noeud(pb);

    BFS_CM(racine);

    let divi = document.getElementById('init');
    divi.remove();

    let arbol = document.getElementById('arbre');
    let draw = document.createElement('div');
    draw.setAttribute("id", "affichage");

    let p2 = document.createElement('p');
    p2.innerHTML = "affichage de l'arbre: ";

    draw.appendChild(p2);
    arbol.appendChild(draw);

    //draw
    let max = racine.maxId()
    let flag = new Array(max);
    for (let i = 0; i < max; i++) {
        flag[i] = true;
    }

    //displayTree(racine);
    printNTree(racine, flag, 0, false);

    BFS(racine);
    DFS(racine);
}

function ajoutMouv(){
    let valL = document.getElementById('ligne').value;
    let valC = document.getElementById('colonne').value;

    //console.log(valP, valE);

    if (!morpion.mouvement(valL,valC)) {
        alert("valeurs incorrectes");
        return;
    }

    insert(racine,racine.maxId()-1,new noeud((morpion.getPlateau())));

    let arbol = document.getElementById('arbre');
    let aff = document.getElementById("affichage");
    aff.remove();

    let draw = document.createElement('div');
    draw.setAttribute("id", "affichage");

    arbol.appendChild(draw);

    morpion.affichageTicTacToe();

    DFS(racine);

}

function ajoutMouvMM(){
    let valL = document.getElementById('ligne').value;
    let valC = document.getElementById('colonne').value;

    if (!morpion.mouvement(valL,valC)) {
        alert("valeurs incorrectes");
        return;
    }

    insert(racine,racine.maxId()-1,new noeud((morpion.getPlateau())));

    if(!morpion.finDePartie()){
        let meilleurCoup = morpion.meilleurCoup(morpion.getJoueur());
        morpion.mouvement(meilleurCoup[0],meilleurCoup[1]);
        insert(racine,racine.maxId()-1,new noeud((morpion.getPlateau())));
    }

    if(morpion.finDePartie()){//fin de partie possible après coup adverse
        if(morpion.gagnant() !== false){
            alert(morpion.gagnant() + " a gagné");
        }
        else{
            alert("match nul");
        }
    }

    let arbol = document.getElementById('arbre');
    let aff = document.getElementById("affichage");
    aff.remove();

    let draw = document.createElement('div');
    draw.setAttribute("id", "affichage");

    arbol.appendChild(draw);

    morpion.affichageTicTacToe();

    DFS(racine);

}

function ajoutMouvMMAB(){
    let valL = document.getElementById('ligne').value;
    let valC = document.getElementById('colonne').value;

    if (!morpion.mouvement(valL,valC)) {
        alert("valeurs incorrectes");
        return;
    }

    insert(racine,racine.maxId()-1,new noeud((morpion.getPlateau())));

    if(!morpion.finDePartie()){
        let meilleurCoup = morpion.meilleurCoupAB(morpion.getJoueur());
        morpion.mouvement(meilleurCoup[0],meilleurCoup[1]);
        insert(racine,racine.maxId()-1,new noeud((morpion.getPlateau())));
    }

    if(morpion.finDePartie()){//fin de partie possible après coup adverse
        if(morpion.gagnant() !== false){
            alert(morpion.gagnant() + " a gagné");
        }
        else{
            alert("match nul");
        }
    }

    let arbol = document.getElementById('arbre');
    let aff = document.getElementById("affichage");
    aff.remove();

    let draw = document.createElement('div');
    draw.setAttribute("id", "affichage");

    arbol.appendChild(draw);

    morpion.affichageTicTacToe();

    DFS(racine);

}

function createTreeTTT(){

    morpion = new tictactoe(8,8);

    let divi = document.getElementById('init');
    divi.remove();

    let arbol = document.getElementById('arbre');
    let draw = document.createElement('div');
    draw.setAttribute("id", "affichage");
    let creator = document.createElement('div');
    creator.setAttribute("id", "createur");

    let inputLigne = document.createElement('input');
    inputLigne.setAttribute("id", "ligne");
    inputLigne.setAttribute("placeholder", "ex: 0");

    let inputColonne = document.createElement('input');
    inputColonne.setAttribute("id", "colonne");
    inputColonne.setAttribute("placeholder", "ex: 1");

    let button = document.createElement("button");
    button.setAttribute("type", "button");
    button.innerHTML = "Valider choix";
    button.setAttribute("onclick", "ajoutMouv()");

    let buttonMM = document.createElement("button");
    buttonMM.setAttribute("type", "button");
    buttonMM.innerHTML = "Jouer contre minimax";
    buttonMM.setAttribute("onclick", "ajoutMouvMM()");

    let buttonMMAB = document.createElement("button");
    buttonMMAB.setAttribute("type", "button");
    buttonMMAB.innerHTML = "Jouer contre minimax AB";
    buttonMMAB.setAttribute("onclick", "ajoutMouvMMAB()");

    racine = new noeud(morpion.getPlateau());

    creator.appendChild(inputLigne);
    creator.appendChild(inputColonne);
    creator.appendChild(button);
    creator.appendChild(buttonMM);
    creator.appendChild(buttonMMAB);

    arbol.appendChild(creator);
    arbol.appendChild(draw);

    morpion.affichageTicTacToe();

    DFS(racine);

}

function ajoutMouvOT(){
    let valL = document.getElementById('ligne').value;
    let valC = document.getElementById('colonne').value;

    //console.log(valP, valE);

    if (!oth.makeMove(valL,valC)) {
        alert("valeurs incorrectes");
        return;
    }

    insert(racine,racine.maxId()-1,new noeud((oth.getPlateau())));

    let arbol = document.getElementById('arbre');
    let aff = document.getElementById("affichage");
    aff.remove();

    let draw = document.createElement('div');
    draw.setAttribute("id", "affichage");

    arbol.appendChild(draw);

    oth.affichageOthello();
    oth.addClickEventToValidMoves();

    DFS(racine);

}

function addClickEventToValidMoves() {
    const validMoves = document.querySelectorAll('.valid-move');

    for (let i = 0; i < validMoves.length; i++) {
        validMoves[i].addEventListener("click", () => {
            const row = parseInt(validMoves[i].dataset.index_i);
            const col = parseInt(validMoves[i].dataset.index_j);

            if(oth.makeMove(row, col) == true) {
                updateAffichage();
            }
            console.log(row, col);
        });
    }
}

function createTreeOT(){ //glouton

    oth = new othello(6,6,"W");

    let divi = document.getElementById('init');
    divi.remove();

    let arbol = document.getElementById('arbre');
    let draw = document.createElement('div');
    draw.setAttribute("id", "affichage");
    let creator = document.createElement('div');
    creator.setAttribute("id", "createur");


    arbol.appendChild(draw);
    arbol.appendChild(creator);


    updateAffichageG();
}

function updateAffichage() {
    /*
    racine = new noeud(oth.getPlateau());
    console.log(oth.toString());

    oth.affichageOthello();
    addClickEventToValidMoves();
    DFS(racine);

    oth.isGameOver();
    */
    racine = new noeud(oth.getPlateau());
    //console.log(oth.toString());
    DFS(racine);
    let oldJoueur = oth.getJoueur();
    //console.log("Test1");
    let bool = false ;
    if(oth.getJoueur() === 'B' && !oth.isGameOver(false)){
        let movement = oth.botGlouton(oth.getValidMoves(oth.getJoueur()));
        oth.makeMove(movement[0],movement[1]);
        //console.log(oth.toString());
        oth.affichageOthello();
        racine = new noeud(oth.getPlateau());
        DFS(racine);
    }
    if(oldJoueur!=oth.getJoueur()) {
        console.log("oldJoueur!=oth.getJoueur()");
        oth.getValidMoves('W');
        racine = new noeud(oth.getPlateau());
        DFS(racine);
        addClickEventToValidMovesA();
    }
    oth.affichageOthello();
    addClickEventToValidMovesA();
    oth.isGameOver(true);
}
function rien() {
    console.log("rien");
}
function updateAffichageG() {
    while (true) {
        racine = new noeud(oth.getPlateau());
        console.log(oth.toString());
        DFS(racine);
        let oldJoueur = oth.getJoueur();

        // Vérifier si le joueur actuel doit passer son tour
        if (!oth.hasValidMoves(oldJoueur)) {
            console.log(oldJoueur + " : j'ai passé mon tour");
            oth.switchTurn();

            if (oth.isGameOver(false) || (!oth.hasValidMoves(oldJoueur) && !oth.hasValidMoves(oth.getOpponent(oldJoueur)))) {
                oth.isGameOver(true);
                break;
            }
        } else {
            if (oldJoueur === 'B' && !oth.isGameOver(false)) {
                let movement = oth.botGlouton(oth.getValidMoves(oldJoueur));
                if (movement != null) {
                    oth.makeMove(movement[0], movement[1]);
                    console.log(oth.toString());
                    oth.affichageOthello();
                    racine = new noeud(oth.getPlateau());
                    DFS(racine);
                }
            }

            if (oldJoueur != oth.getJoueur()) {
                console.log("oldJoueur!=oth.getJoueur()");
                if (!oth.isGameOver(false)) continue;
            }

            // Affichage et ajout des événements de clic
            oth.affichageOthello();
            addClickEventToValidMovesG();
            oth.isGameOver(true);
            break;
        }
    }
}

function createAIvsAI() {
    createTreeOTA();
    document.getElementById("controls").style.display = "block";
}

function resetPlateau() {
    oth = new othello(6,6,"W");
    document.getElementById("createur").innerHTML = "";
    moveIndex = 0;
    updateAffichageA();
}

function createTreeOTA(){

    oth = new othello(6,6,"W");

    let divi = document.getElementById('init');
    divi.remove();

    let arbol = document.getElementById('arbre');
    let draw = document.createElement('div');
    draw.setAttribute("id", "affichage");
    let creator = document.createElement('div');
    creator.setAttribute("id", "createur");


    arbol.appendChild(draw);
    arbol.appendChild(creator);


    updateAffichageA();
}

function updateAffichageA() {
    /*
    racine = new noeud(oth.getPlateau());
    console.log(oth.toString());
    DFS(racine);

    if(oth.getJoueur() === 'B' && !oth.isGameOver(false)){
        let movement = oth.botAleatoire(oth.getValidMoves(oth.getJoueur()));
        oth.makeMove(movement[0],movement[1]);
        console.log(oth.toString());
        racine = new noeud(oth.getPlateau());
        DFS(racine);
    }

    oth.affichageOthello();
    addClickEventToValidMovesA();
    //DFS(racine);

    oth.isGameOver(true);
    */
    racine = new noeud(oth.getPlateau());
    //console.log(oth.toString());
    DFS(racine);
    //console.log("Joueur Actuel = " + oth.getJoueur());
    let oldJoueur = oth.getJoueur();
    if(oth.getJoueur() === 'B' && !oth.isGameOver(false)){
        //console.log("Joueur Actuel = " + oth.getJoueur());
        //console.log("Je suis en haut");
        let movement = oth.botAleatoire(oth.getValidMoves(oth.getJoueur()));
        oth.makeMove(movement[0],movement[1]);
        //console.log(oth.toString());
        oth.affichageOthello();
        racine = new noeud(oth.getPlateau());
        DFS(racine);
    }
    if(oldJoueur!=oth.getJoueur()) {
        //console.log("Joueur Actuel = " + oth.getJoueur());
        //console.log("Je suis en bas");
        oth.getValidMoves('W');
        racine = new noeud(oth.getPlateau());
        //DFS(racine);
        addClickEventToValidMovesA();
    }
    //console.log("Affichage");
    oth.affichageOthello();
    addClickEventToValidMovesA();
    oth.isGameOver(true);
}
/*
function addClickEventToValidMovesA() {
    const validMoves = document.querySelectorAll('.valid-move');

    for (let i = 0; i < validMoves.length; i++) {
        validMoves[i].addEventListener("click", () => {
            const row = parseInt(validMoves[i].dataset.index_i);
            const col = parseInt(validMoves[i].dataset.index_j);
            let val = oth.calculJetonObtenirPourMouvement(row, col, oth.turn);
            if(oth.makeMove(row, col) == true) {
                updateAffichageA();
            }
            console.log(row, col, val);
        });
    }
}
*/
function addClickEventToValidMovesA() {
    const validMoves = document.querySelectorAll('.valid-move');

    for (let i = 0; i < validMoves.length; i++) {
        validMoves[i].addEventListener("click", () => {
            const row = parseInt(validMoves[i].dataset.index_i);
            const col = parseInt(validMoves[i].dataset.index_j);
            let start = performance.now();
            let val = oth.calculJetonObtenirPourMouvement(row, col, oth.turn);
            if(oth.makeMove(row, col) == true) {
                updateAffichage();
                let timeTaken = performance.now() - start;
                console.log("Total time taken : " + timeTaken + " milliseconds");
            }
            console.log(row, col, val);
        });
    }
}
function createTreeOTMM(){

    oth = new othello(6,6,"W");

    let divi = document.getElementById('init');
    divi.remove();

    let arbol = document.getElementById('arbre');
    let draw = document.createElement('div');
    draw.setAttribute("id", "affichage");
    let creator = document.createElement('div');
    creator.setAttribute("id", "createur");


    arbol.appendChild(draw);
    arbol.appendChild(creator);


    updateAffichageMM();
}

function updateAffichageMM() {
    racine = new noeud(oth.getPlateau());
    //console.log(oth.toString());
    DFS(racine);
    oth.affichageOthello();
    //sleep(1000);
    
    if(oth.getJoueur() === 'B' && !oth.isGameOverMM(false)){
        let movement = oth.meilleurCoup(oth.getJoueur());
        oth.makeMove(movement[0],movement[1]);
        oth.affichageOthello();
        //console.log(oth.toString());
        //sleep(1000);
        racine = new noeud(oth.getPlateau());
        DFS(racine);
        //updateAffichageMM();
    }

    //sleep(1000);
    oth.affichageOthello();
    //sleep(1000);
    addClickEventToValidMovesMM();
    //DFS(racine);

    oth.isGameOverMM(true);
}

function addClickEventToValidMovesMM() {
    const validMoves = document.querySelectorAll('.valid-move');

    for (let i = 0; i < validMoves.length; i++) {
        validMoves[i].addEventListener("click", () => {
            const row = parseInt(validMoves[i].dataset.index_i);
            const col = parseInt(validMoves[i].dataset.index_j);
            let start = performance.now();
            let val = oth.calculJetonObtenirPourMouvement(row, col, oth.turn);
            if(oth.makeMove(row, col) == true) {
                updateAffichageMM();
                let timeTaken = performance.now() - start;
                console.log("Total time taken : " + timeTaken + " milliseconds");
            }
            console.log(row, col, val);
        });
    }
}

function createTreeOTMMAB(){

    oth = new othello(6,6,"W");

    let divi = document.getElementById('init');
    divi.remove();

    let arbol = document.getElementById('arbre');
    let draw = document.createElement('div');
    draw.setAttribute("id", "affichage");
    let creator = document.createElement('div');
    creator.setAttribute("id", "createur");


    arbol.appendChild(draw);
    arbol.appendChild(creator);


    updateAffichageMMAB();
}

function updateAffichageMMAB() {
    racine = new noeud(oth.getPlateau());
    //console.log(oth.toString());
    DFS(racine);

    if(oth.getJoueur() === 'B' && !oth.isGameOverMM(false)){
        let movement = oth.meilleurCoupAB(oth.getJoueur());
        oth.makeMove(movement[0],movement[1]);
        //console.log(oth.toString());
        racine = new noeud(oth.getPlateau());
        DFS(racine);
    }

    oth.affichageOthello();
    addClickEventToValidMovesMMAB();
    //DFS(racine);

    oth.isGameOverMM(true);
}

function addClickEventToValidMovesMMAB() {
    const validMoves = document.querySelectorAll('.valid-move');

    for (let i = 0; i < validMoves.length; i++) {
        validMoves[i].addEventListener("click", () => {
            const row = parseInt(validMoves[i].dataset.index_i);
            const col = parseInt(validMoves[i].dataset.index_j);
            let val = oth.calculJetonObtenirPourMouvement(row, col, oth.turn);
            let start = performance.now();
            if(oth.makeMove(row, col) == true) {
                updateAffichageMMAB();
                let timeTaken = performance.now() - start;
                console.log("Total time taken : " + timeTaken + " milliseconds");
            }
            console.log(row, col, val);
        });
    }
}

function addClickEventToValidMovesG() {
    const validMoves = document.querySelectorAll('.valid-move');

    for (let i = 0; i < validMoves.length; i++) {
        validMoves[i].addEventListener("click", () => {
            const row = parseInt(validMoves[i].dataset.index_i);
            const col = parseInt(validMoves[i].dataset.index_j);
            let val = oth.calculJetonObtenirPourMouvement(row, col, oth.turn);
            let start = performance.now();
            if(oth.makeMove(row, col) == true) {
                updateAffichageG();
                let timeTaken = performance.now() - start;
                console.log("Total time taken : " + timeTaken + " milliseconds");
            }
            console.log(row, col, val);
        });
    }
}
