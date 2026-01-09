// ============================
// HORLOGE
// ============================
"use strict";

// Array de stockage de la valeur de chaque <span>
const tabValeurs = "hh-mm-ss".split("");
// Array de stockage des <span> créés
const tabSpans = [];

function digitaleClock(date) {
    const sDate = date.toLocaleString("fr-FR").replace(/\u200e/g, "").split(" ").pop();
    const tabNum = sDate.split("");
    tabNum.forEach((num, ind) => {
        if (num != tabValeurs[ind]) {
            // Sauve la valeur en cours
            tabValeurs[ind] = num;
            // Affecte la nouvelle classe CSS
            tabSpans[ind].className = "clock_" + num;
            // Affiche le chiffre en texte
            tabSpans[ind].innerText = num;
        }
    });
}

function updateClock() {
    digitaleClock(new Date());
    
    // Affichage texte
    const now = new Date();
    const heureFormattee = now.toLocaleTimeString('fr-FR');
    const affichageHeure = document.getElementById('affichage-heure');
    if (affichageHeure) affichageHeure.innerText = heureFormattee;
    
    requestAnimationFrame(updateClock);
}

// Rajout de 8 <span> dans la <div id="clock">
const elClock = document.getElementById("clock");
if (elClock) {
    for (let ind = 0; ind < tabValeurs.length; ind += 1) {
        tabSpans.push(document.createElement("SPAN"));
    }
    // Ajout de l'ensemble des <span>
    elClock.append(...tabSpans);
}

// Lance la mise à jour
updateClock();


// ============================
// CHRONOMÈTRE
// ============================
let chrono = {
    milliseconds: 0,
    running: false,
    intervalId: null,
    laps: []
};

const chronoDisplay = document.getElementById('chrono-display');
const startStopChronoBtn = document.getElementById('start-stop-chrono');
const tourChronoBtn = document.getElementById('tour-chrono');
const resetChronoBtn = document.getElementById('reset-chrono');
const listeToursUl = document.getElementById('liste-tours');

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updateChronoDisplay() {
    chronoDisplay.innerText = formatTime(chrono.milliseconds);
}

startStopChronoBtn.addEventListener('click', () => {
    if (!chrono.running) {
        chrono.running = true;
        startStopChronoBtn.innerText = 'Arrêt';
        tourChronoBtn.disabled = false;
        
        chrono.intervalId = setInterval(() => {
            chrono.milliseconds += 10;
            updateChronoDisplay();
        }, 10);
    } else {
        chrono.running = false;
        startStopChronoBtn.innerText = 'Marche';
        tourChronoBtn.disabled = true;
        clearInterval(chrono.intervalId);
    }
});

tourChronoBtn.addEventListener('click', () => {
    const lapTime = formatTime(chrono.milliseconds);
    chrono.laps.push(lapTime);
    const li = document.createElement('li');
    li.innerText = `Tour ${chrono.laps.length}: ${lapTime}`;
    listeToursUl.appendChild(li);
});

resetChronoBtn.addEventListener('click', () => {
    chrono.milliseconds = 0;
    chrono.running = false;
    chrono.laps = [];
    startStopChronoBtn.innerText = 'Marche';
    tourChronoBtn.disabled = true;
    clearInterval(chrono.intervalId);
    updateChronoDisplay();
    listeToursUl.innerHTML = '';
});

// ============================
// MINUTEUR
// ============================
let minuteur = {
    totalMilliseconds: 0,
    remainingMilliseconds: 0,
    running: false,
    intervalId: null
};

const minuteurDisplay = document.getElementById('minuteur-display');
const minuteurMinutesInput = document.getElementById('minuteur-minutes');
const minuteurSecondsInput = document.getElementById('minuteur-seconds');
const startMinuteurBtn = document.getElementById('start-minuteur');
const pauseMinuteurBtn = document.getElementById('pause-minuteur');
const resetMinuteurBtn = document.getElementById('reset-minuteur');
const minuteurStatus = document.getElementById('minuteur-status');

function formatMinuteur(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updateMinuteurDisplay() {
    minuteurDisplay.innerText = formatMinuteur(minuteur.remainingMilliseconds);
}

function updateMinuteurInput() {
    const totalSeconds = Math.floor(minuteur.totalMilliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    minuteurMinutesInput.value = minutes;
    minuteurSecondsInput.value = seconds;
}

minuteurMinutesInput.addEventListener('change', () => {
    if (!minuteur.running) {
        const minutes = parseInt(minuteurMinutesInput.value) || 0;
        const seconds = parseInt(minuteurSecondsInput.value) || 0;
        minuteur.totalMilliseconds = (minutes * 60 + seconds) * 1000;
        minuteur.remainingMilliseconds = minuteur.totalMilliseconds;
        updateMinuteurDisplay();
        minuteurStatus.innerText = '';
    }
});

minuteurSecondsInput.addEventListener('change', () => {
    if (!minuteur.running) {
        const minutes = parseInt(minuteurMinutesInput.value) || 0;
        const seconds = parseInt(minuteurSecondsInput.value) || 0;
        minuteur.totalMilliseconds = (minutes * 60 + seconds) * 1000;
        minuteur.remainingMilliseconds = minuteur.totalMilliseconds;
        updateMinuteurDisplay();
        minuteurStatus.innerText = '';
    }
});

startMinuteurBtn.addEventListener('click', () => {
    if (!minuteur.running && minuteur.remainingMilliseconds > 0) {
        minuteur.running = true;
        startMinuteurBtn.disabled = true;
        pauseMinuteurBtn.disabled = false;
        minuteurMinutesInput.disabled = true;
        minuteurSecondsInput.disabled = true;
        
        minuteur.intervalId = setInterval(() => {
            minuteur.remainingMilliseconds -= 100;
            if (minuteur.remainingMilliseconds <= 0) {
                minuteur.remainingMilliseconds = 0;
                minuteur.running = false;
                clearInterval(minuteur.intervalId);
                startMinuteurBtn.disabled = false;
                pauseMinuteurBtn.disabled = true;
                minuteurMinutesInput.disabled = false;
                minuteurSecondsInput.disabled = false;
                minuteurStatus.innerText = '✓ Minuteur terminé!';
                minuteurStatus.style.color = 'green';
                alert('Le minuteur est terminé!');
            }
            updateMinuteurDisplay();
        }, 100);
    }
});

pauseMinuteurBtn.addEventListener('click', () => {
    minuteur.running = false;
    clearInterval(minuteur.intervalId);
    startMinuteurBtn.disabled = false;
    pauseMinuteurBtn.disabled = true;
    minuteurMinutesInput.disabled = false;
    minuteurSecondsInput.disabled = false;
});

resetMinuteurBtn.addEventListener('click', () => {
    minuteur.running = false;
    clearInterval(minuteur.intervalId);
    const minutes = parseInt(minuteurMinutesInput.value) || 0;
    const seconds = parseInt(minuteurSecondsInput.value) || 0;
    minuteur.totalMilliseconds = (minutes * 60 + seconds) * 1000;
    minuteur.remainingMilliseconds = minuteur.totalMilliseconds;
    startMinuteurBtn.disabled = false;
    pauseMinuteurBtn.disabled = true;
    minuteurMinutesInput.disabled = false;
    minuteurSecondsInput.disabled = false;
    updateMinuteurDisplay();
    minuteurStatus.innerText = '';
});

// Initialize minuteur display
updateMinuteurInput();
updateMinuteurDisplay();

// ============================
// RÉVEIL
// ============================
let alarm = {
    hour: 7,
    minute: 0,
    active: false,
    intervalId: null
};

const reveillHeure = document.getElementById('reveil-heure');
const reveilMinute = document.getElementById('reveil-minute');
const btnSetReveil = document.getElementById('btn-set-reveil');
const btnStopReveil = document.getElementById('btn-stop-reveil');
const reveilStatus = document.getElementById('reveil-status');

function checkAlarm() {
    const now = new Date();
    if (now.getHours() === alarm.hour && now.getMinutes() === alarm.minute) {
        triggerAlarm();
    }
}

function triggerAlarm() {
    reveilStatus.innerText = '🔔 RÉVEIL! RÉVEIL! RÉVEIL!';
    reveilStatus.style.color = 'red';
    alert('☏ ☏ ☏ RÉVEIL! RÉVEIL! ☏ ☏ ☏');
    
    // Jouer un son (optionnel)
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 1000;
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

btnSetReveil.addEventListener('click', () => {
    alarm.hour = parseInt(reveillHeure.value);
    alarm.minute = parseInt(reveilMinute.value);
    alarm.active = true;
    
    reveilStatus.innerText = `Réveil programmé pour ${String(alarm.hour).padStart(2, '0')}:${String(alarm.minute).padStart(2, '0')}`;
    reveilStatus.style.color = 'green';
    
    btnSetReveil.disabled = true;
    btnStopReveil.disabled = false;
    reveillHeure.disabled = true;
    reveilMinute.disabled = true;
    
    alarm.intervalId = setInterval(checkAlarm, 1000);
});

btnStopReveil.addEventListener('click', () => {
    alarm.active = false;
    clearInterval(alarm.intervalId);
    reveilStatus.innerText = 'Réveil désactivé';
    reveilStatus.style.color = 'gray';
    btnSetReveil.disabled = false;
    btnStopReveil.disabled = true;
    reveillHeure.disabled = false;
    reveilMinute.disabled = false;
});

// ============================
// NAVIGATION ENTRE LES SECTIONS
// ============================
const navButtons = document.querySelectorAll('nav button');
const sections = document.querySelectorAll('.tab-content');

navButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        // Retirer la classe active de tous les boutons
        navButtons.forEach((b) => b.classList.remove('active'));
        sections.forEach((s) => s.classList.remove('active-section'));
        
        // Ajouter la classe active au bouton cliqué
        btn.classList.add('active');
        
        // Afficher la section correspondante
        const sectionId = btn.id.replace('btn-', '') + '-section';
        document.getElementById(sectionId).classList.add('active-section');
    });
});
