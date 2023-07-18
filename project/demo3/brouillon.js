/*function evalGrille() {
    if (grille.gagnant() === joueur) {
      return MAX_VAL;
    } else if (grille.gagnant() === grille.adversaire(joueur)) {
      return MIN_VAL;
    } else {
      return 0;
    }
  }

function minimaxAB(alpha, beta, profondeur, joueurActuel) {
    if (profondeur === 0 || grille.finDePartie()) {
      return evalGrille();
    }
    
    let meilleurScore = (joueurActuel === joueur) ? MIN_VAL : MAX_VAL;
    let coupPossibles = [];

    for (let i = 0; i < grille.n; i++) {
      for (let j = 0; j < grille.m; j++) {
        if (grille[i][j] === '_') {
          coupPossibles.push([i, j]);
        }
      }
    }

    // on mélange les coups possibles pour plus de variété dans les parties
    coupPossibles.sort(() => 0.5 - Math.random());

    for (let i = 0; i < coupPossibles.length; i++) {
      let [x, y] = coupPossibles[i];
      grille[x][y] = joueurActuel;

      let score = minimax(alpha, beta, profondeur - 1, grille.adversaire(joueurActuel));

      grille[x][y] = '_';

      if (joueurActuel === joueur) {
        meilleurScore = Math.max(meilleurScore, score);
        alpha = Math.max(alpha, score);
      } else {
        meilleurScore = Math.min(meilleurScore, score);
        beta = Math.min(beta, score);
      }

      if (alpha >= beta) {
        break;
      }
    }

    return meilleurScore;
  }*/




// fonction pour créer un noeud dans l'arbre
function createNode(parent, value) {
  var node = {};
  node.value = value;
  node.parent = parent;
  node.children = [];
  if (parent) {
    parent.children.push(node);
  }
  return node;
}

// fonction pour créer l'arbre minimax
function createTree(node, depth, isMaximizingPlayer, joueur) {
  if (depth === 0 || node.finDePartie()) {
    return node.valeur();
  }

  if (isMaximizingPlayer) {
    var meilleurScore = -Infinity;
    for (var i = 0; i < node.maxLigne; i++) {
      for (var j = 0; j < node.maxCol; j++) {
        if (node.plateau[i][j] === "_") {
          node.plateau[i][j] = joueur;
          var score = createTree(createNode(node, [i, j]), depth - 1, false, joueur);
          node.plateau[i][j] = "_";
          meilleurScore = Math.max(meilleurScore, score);
        }
      }
    }
    node.value = meilleurScore;
    return meilleurScore;
  } else {
    var pireScore = Infinity;
    for (var i = 0; i < node.maxLigne; i++) {
      for (var j = 0; j < node.maxCol; j++) {
        if (node.plateau[i][j] === "_") {
          node.plateau[i][j] = node.adversaire(joueur);
          var score = createTree(createNode(node, [i, j]), depth - 1, true, joueur);
          node.plateau[i][j] = "_";
          pireScore = Math.min(pireScore, score);
        }
      }
    }
    node.value = pireScore;
    return pireScore;
  }
}

// fonction pour dessiner l'arbre minimax
function drawTree(node, $parent) {
  var $node = $("<div>");
  $node.addClass("node");
  $node.html(node.value);

  $parent.append($node);

  if (node.children.length > 0) {
    var $children = $("<div>");
    $children.addClass("children");

    $parent.append($children);

    for (var i = 0; i < node.children.length; i++) {
      drawTree(node.children[i], $children);
    }
  }
}

// exemple d'utilisation
var tictactoe = new TicTacToe(3, 3);
var rootNode = createNode(null, null);
createTree(rootNode, 2, true, "O");
drawTree(rootNode, $("#tree"));
