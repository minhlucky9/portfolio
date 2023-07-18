class cm{
    constructor(aventuriers,cannibales,posBateau) {
        this.aventuriers = aventuriers;
        this.cannibales = cannibales;
        this.posBateau = posBateau;
    }

    mouvPossible(){
        if(this.aventuriers < 0 || this.cannibales < 0){
            return false;
        }
        if (this.aventuriers < this.cannibales && this.aventuriers > 0) {
            return false;
        }
        else if (this.aventuriers > 3 || this.cannibales > 3) {
            return false;
        }
        return true;
    }

    est_etat_but(){
        return (this.aventuriers === 0 && this.cannibales === 0);
    }

    toString() {
        return "[" + this.aventuriers + "," + this.cannibales + "," + this.posBateau + "]";
    }

    mouvSuivants(){
        let etats = [];
        if (this.posBateau === "g") {
            etats.push(new cm(this.aventuriers - 2, this.cannibales, "d"));
            etats.push(new cm(this.aventuriers - 1, this.cannibales - 1, "d"));
            etats.push(new cm(this.aventuriers, this.cannibales - 2, "d"));
            etats.push(new cm(this.aventuriers - 1, this.cannibales, "d"));
            etats.push(new cm(this.aventuriers, this.cannibales - 1, "d"));
        } else {
            etats.push(new cm(this.aventuriers + 2, this.cannibales, "g"));
            etats.push(new cm(this.aventuriers + 1, this.cannibales + 1, "g"));
            etats.push(new cm(this.aventuriers, this.cannibales + 2, "g"));
            etats.push(new cm(this.aventuriers + 1, this.cannibales, "g"));
            etats.push(new cm(this.aventuriers, this.cannibales + 1, "g"));
        }
        return etats.filter((x) => x.mouvPossible());
    }
}

