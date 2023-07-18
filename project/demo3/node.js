class noeud {
    valeur;
    static nextId = 0;
    enfants = [];

    constructor(valeur) {
        this.valeur = valeur;
        this.id = this.constructor.nextId++;
    }

    toString() {
        return "Noeud " + this.id + " de valeur " + this.valeur;
    }

    maxId() {
        return noeud.nextId;
    }

}

/**
 * insérer un noeud dans l'arbre
 * @param root racine de l'arbre
 * @param parent le noeud sur lequel on souhaite ajouter un enfant
 * @param node le noeud à ajouter
 */
function insert(root, parent, node) {
    if (!root) {
        root = node;
    } else {
        if (root.id == parent) {
            root.enfants.push(node);
        } else {
            // recursion
            let l = root.enfants.length;
            for (let i = 0; i < l; i++) {
                if (root.enfants[i].id == parent) {
                    insert(root.enfants[i], parent, node);
                } else {
                    insert(root.enfants[i], parent, node);
                }
            }
        }
    }
}

//obsolete
/*function displayTree(root) {
    let aff = document.getElementById("affichage");

    let p = document.createElement('p');
    p.innerHTML = (root.toString() + ": " + root.enfants + "<br>");
    aff.appendChild(p);


    // recursion
    let l = root.enfants.length;
    for (let i = 0; i < l; i++) {
        displayTree(root.enfants[i])
    }

}*/

function printNTree(x, flag, depth, isLast) {
    let aff = document.getElementById("affichage");
    let p = document.createElement('p');

    if (x == null) {
        return;
    }

    for (let i = 1; i < depth; ++i) {
        if (flag[i] == true) {

            p.innerHTML += ("|_"
                + "__"
                + "__"
                + "__");
        } else {
            p.innerHTML += ("__"
                + "__"
                + "__"
                + "__");
        }
    }

    if (depth == 0) {
        p.innerHTML += (x.valeur + " (" + x.id + ")" + "<br>");
    } else if (isLast) {
        p.innerHTML += ("+--- " + x.valeur + " (" + x.id + ")" + '<br>');
        flag[depth] = false;
    } else {

        p.innerHTML += ("+--- " + x.valeur + " (" + x.id + ")" + '<br>');

    }

    aff.appendChild(p);
    let it = 0;
    for (let i of x.enfants.values()) {
        ++it;

        // Recursion
        printNTree(i, flag, depth + 1, it == (x.enfants.length) - 1);
    }
    flag[depth] = true;
}

/* pour rapport:
0
+--- 1
|    +--- 4
|    +--- 5
+--- 2
+--- 2
    +--- 3
    +--- 6
    |    +--- 8
    +--- 7
 */

function BFS(root) {
    if(!root){
        return [];
    }
    let tab = [];
    let queue = [];
    queue.push(root);

    while(queue.length !== 0){
        let node = queue.shift();
        tab.push(node.valeur);

        node.enfants.forEach(enfant => {
            //console.log(enfant);
            queue.push(enfant);
        });
    }

    let aff = document.getElementById("affichage");
    let bfs = document.createElement('p');
    bfs.innerHTML = "BFS: ";
    bfs.innerHTML += tab;
    aff.appendChild(bfs);
}

//     __1__
//    /     \
//   2      _3_
//   |     / | \
//   4    5  6  7
//
// –> [1, 2, 3, 4, 5, 6, 7]

//     __1__
//    /  |  \
//   3   2   4
//  /  \
// 5    6
//
// –> [1, 3, 2, 4, 5, 6]


var moveIndex = 0;
function DFS(root){
    let tab = [];

    DFSTraitement(root,tab);
    moveIndex++;
    let aff = document.getElementById("createur");
    let dfs = document.createElement('p');
    //dfs.innerHTML = "Mouvement " + moveIndex;
    dfs.innerHTML = "Mouvement " + moveIndex + " : " + oth.getOpponent(oth.turn);
    dfs.innerHTML += tab;
    aff.appendChild(dfs);
}

function DFSTraitement(root, tab) { //parcours suffixe
    if(!root){
        return [];
    }

    if(root.enfants.length !== 0){
        root.enfants.forEach(enfant => {
            DFSTraitement(enfant, tab);
        });
    }

    tab.push(root.valeur);
}


//     __1__
//    /  |  \
//   3   2   4
//  /  \
// 5    6
//
// –> [5, 6, 3, 2, 4, 1]