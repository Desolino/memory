const carte =document.querySelectorAll('.carta');
const modale= document.querySelector('modal');
const giocaDiNuovo=document.querySelector('.giocaDinuovo');


let cartaGirata= false;
let bloccaBoard= false; //per bloccare le altre carte nel momento del controllo match
let timerPartita=null;
let tempo=null;

let primaCarta, secondaCarta;

//funzione x girare la carta
function giraCarta(){
    if(!timerPartita)avviaPartita();
    //per bloccare le altre carte nel momento del controllo match
    if(bloccaBoard)return; //se bloccaBoard è true, blocca tutto
    //per prevenire il doppio click su una stessa carta:
    if (this === primaCarta) return;// se this quindi l'elemento è === a primaCarta interrompi la funzione

    //this se è in una callback si riferisce all'elemento che ha fatto scattare la callback
    //per un event listener è l'elemento su cui c'è l'event listener
    this.classList.add('flip');
    
    if(!cartaGirata){ //se cartaGirata è falso
        cartaGirata=true; //assegna true a cartaGirata
        primaCarta=this // sempre l'elemento dell'event listener
        return; //carta girata diventa true una volta cliccato 
    }
    //se carta girata è true, quindi c'è gia una carta girata:
    secondaCarta=this;// memorizzata la secondaCarta girata
    //cartaGirata= false; // ripristinato a false
    
    controllaCorrispondenza();
};

function controllaCorrispondenza(){
    /*  scritta con il ternary operator:
    let corrisponde= primaCarta.dateset.meme === secondaCarta.dateset.meme 
    corrisponde ? disablitaCarte() : rigiraCarte(); */
    
    //se l'attributo dataset della prima carta e della seconda è uguale
    if(primaCarta.dataset.meme === secondaCarta.dataset.meme){
        console.log(primaCarta.dataset.meme)
        disablitaCarte(); // disabilita le carte uguali
        return;
    }
    rigiraCarte();//rigira la carta se non trova la corrispondenza

};
//rimuove event listener

function disablitaCarte(){
    primaCarta.removeEventListener('click', giraCarta);
    secondaCarta.removeEventListener('click', giraCarta);
    resetBoard();
    carteTerminate();
};
//imposta un timeOut alla fine del quale si giriano le carte
function rigiraCarte(){
    
    bloccaBoard=true; //blocca le altre cartenel momento che viene chiamata
    //tranne le carte cliccate 
    setTimeout(()=>{
        primaCarta.classList.remove('flip');
        secondaCarta.classList.remove('flip');
        bloccaBoard=false;//bloccaboard false cosi si puo continuare a cliccare le altre carte  
        resetBoard();
    },1500) //1 secondo e mezzo

         
};
function resetBoard(){
    [cartaGirata,bloccaBoard] =[false,false];
    [primaCarta,secondaCarta]=[null,null]; // le variabili perdono il valore e si resetta tutto

};

function carteTerminate(){
    //numero di carte girate:
    const carteGirate=document.querySelectorAll('.flip').length;
    if(carteGirate===12){
        const body=document.body;
        const party = new JSConfetti({body});
        modale.removeAttribute('hidden')
        body.classList.add('vittoria')
        party.addConfetti();
        clearInterval(timerPartita)

    }
};  

function avviaPartita(){
    const secondiHtml=document.querySelector('.timer-secondi');
    const minutiHtml=document.querySelector('.timer-minuti');
    const inizioPartita = Date.now();
    timerPartita=setInterval(()=>{
        const ora= Date.now();
        const tempoPassato= ora-inizioPartita;
        tempo =new Date(tempoPassato);
        secondiHtml.innterText=`${tempo.getSeconds() < 10 ? '0' + tempo.getSeconds() : tempo.getSeconds()}`;
        minutiHtml.innterText=`${tempo.getMinutes() < 10 ? '0' + tempo.getMinutes(): tempo.getMinutes()}`;
    },1000)
};

(function mischia(){//IIFE 

    carte.forEach(carta=>{
        const posizioneCasuale= Math.floor(Math.random()*12);
        //dà all'attributo html style="order:posizione casuale"
        carta.style.order = posizioneCasuale;
    })
})();

carte.forEach(carta=> carta.addEventListener('click',giraCarta)) // niente parentesi x giraCarta xke altrimenti viene eseguito immediatamente, mentre la callback attende che si scateni l'evento
giocaDiNuovo.addEventListener('click',()=>location.reload())