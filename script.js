// ================= THEMES =================

const themes = [
{
  name:"past",
  header:"🌸 Past — You came this far",
  messages:[
    "🐱 Happiest birthday to you…",
    "🐱 For all the past years I wasn’t there."
  ]
},
{
  name:"present",
  header:"🌿 Present — You are here",
  messages:[
    "🐱 Happiest birthday for the present…",
    "🐱 Where I have you."
  ]
},
{
  name:"future",
  header:"✨ Future — What’s ahead",
  messages:[
    "🐱 For all the years I will stay with you…",
    "🐱 A promise.",
    "🐱 Happiest birthdays in advance."
  ]
},
{
  name:"final",
  header:"🎉 Just for You",
  messages:[
    "💗 May this year bring you happiness.",
    "💗 May all your wishes come true.",
    "💗 May your smile never fade.",
    "💗 And may I always be there with you."
  ]
}
];

// ================= DOM =================

const slider = document.getElementById("slider");
const body = document.body;
const header = document.getElementById("headerText");

let slides = [];
let index = 0;

// ================= BUILD =================

themes.forEach(theme => {

  const slide = document.createElement("div");
  slide.className = "slide";

  const wrap = document.createElement("div");
  wrap.className = "envelope-wrapper";

  const envelope = document.createElement("div");
  envelope.className = "envelope";

  const flap = document.createElement("div");
  flap.className = "flap";

  const seal = document.createElement("div");
  seal.className = "seal";

  envelope.appendChild(flap);
  envelope.appendChild(seal);

  const container = document.createElement("div");
  container.className = "card-container";

  theme.messages.forEach(msg => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerText = msg;
    container.appendChild(card);
  });

  let birthdayText = null;

  if (theme.name === "final") {
    birthdayText = document.createElement("div");
    birthdayText.className = "birthday-text final-birthday";
    birthdayText.innerHTML = `
      <span>🎉</span>
      <span>HAPPY</span>
      <span>BIRTHDAY</span>
      <span>🎉</span>
    `;
  }

  let isOpen = false;
  let isAnimating = false;

  envelope.onclick = () => {
    vibrateTap();

    if (isAnimating) return;
    isAnimating = true;

    const cards = container.children;

    // ===== OPEN =====
    if (!isOpen) {


      if (audioEnabled) {
        const sound = Math.random() > 0.5 ? barkSound : meowSound;
        sound.currentTime = 0;
        sound.play();
      }

      if (petsActive) {
        document.getElementById("petLayer")?.classList.add("peek");
      }

      envelope.classList.add("open");
      randomBurst();

      triggerPetReaction();

      if (audioEnabled) {
        meowSound.currentTime = 0;
        meowSound.play();
      }

      if (theme.name === "final") {
        startFirecracker();
      }

      for (let i = 0; i < cards.length; i++) {
        setTimeout(() => {
          cards[i].classList.add("show");
        }, i * 300);
      }

      if (birthdayText) {
        birthdayText.classList.add("show-bday");
      }

      setTimeout(() => {
        isAnimating = false;
      }, 500);

      isOpen = true;
    }

    // ===== CLOSE =====
    else {

      document.getElementById("petLayer")?.classList.remove("peek");

      closeEnvelope(envelope, container, birthdayText, () => {
        isAnimating = false;
      });

      isOpen = false;
    }
  };

  wrap.appendChild(container);
  if (birthdayText) wrap.appendChild(birthdayText);
  wrap.appendChild(envelope);

  slide.appendChild(wrap);
  slider.appendChild(slide);

  slides.push({
    envelope,
    container,
    birthdayText,
    isOpenRef: () => isOpen,
    forceClosed: () => { isOpen = false; }
  });
});

// ================= CLOSE =================

function closeEnvelope(envelope, container, birthdayText, done){

  const cards = container.children;

  if (birthdayText) {
    birthdayText.classList.remove("show-bday");
  }

  for (let i = 0; i < cards.length; i++) {
    cards[i].classList.add("hide");
  }

  setTimeout(() => {
    envelope.classList.remove("open");

    [...cards].forEach(c =>
      c.classList.remove("show","hide")
    );

    if (done) done();

  }, 400);
}

// ================= RESET =================

function hardResetSlide(s){

  document.getElementById("petLayer")?.classList.remove("peek");

  s.envelope.classList.remove("open");

  if (s.birthdayText) {
    s.birthdayText.classList.remove("show-bday");
  }

  [...s.container.children].forEach(c =>
    c.classList.remove("show","hide")
  );

  s.forceClosed();
}

// ================= NAV =================

function updateButtons(){
  const back = document.getElementById("backBtn");
  const next = document.getElementById("nextBtn");

  back.style.display = index === 0 ? "none" : "inline-block";
  next.style.display = index === themes.length - 1 ? "none" : "inline-block";
}

document.getElementById("nextBtn").onclick = () => {
  vibrateTap();
  const current = slides[index];

  if (current.isOpenRef()) {
    closeEnvelope(current.envelope, current.container, current.birthdayText, () => {
      hardResetSlide(current);
      moveNext();
    });
  } else {
    moveNext();
  }
};

document.getElementById("backBtn").onclick = () => {
  vibrateTap();
  const current = slides[index];

  if (current.isOpenRef()) {
    closeEnvelope(current.envelope, current.container, current.birthdayText, () => {
      hardResetSlide(current);
      moveBack();
    });
  } else {
    moveBack();
  }
};

function moveNext(){
  if (index < themes.length - 1) {
    index++;
    slider.style.transform = `translateX(-${index * 100}%)`;
    body.className = themes[index].name;
    header.innerText = themes[index].header;
    updateButtons();
  }
}

function moveBack(){
  if (index > 0) {
    index--;
    slider.style.transform = `translateX(-${index * 100}%)`;
    body.className = themes[index].name;
    header.innerText = themes[index].header;
    updateButtons();
  }
}

// ================= CANVAS =================

const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const imgs = [
  "images/dog_emojis1.png","images/dog_emojis2.png","images/dog_emojis3.png","images/dog_emojis4.png",
  "images/dog_emojis5.png","images/dog_emojis6.png","images/dog_emojis7.png","images/dog_emojis8.png",
  "images/cat_emojis1.png","images/cat_emojis2.png","images/cat_emojis3.png","images/cat_emojis4.png",
  "images/cat_emojis5.png","images/cat_emojis6.png","images/cat_emojis7.png","images/cat_emojis8.png"
].map(src=>{
  const i = new Image();
  i.src = src;
  return i;
});

let particles = [];

function spawnRain(){
  particles.push({
    x: Math.random()*canvas.width,
    y: -50,
    size: 36,
    speed: 2 + Math.random(),
    img: imgs[Math.floor(Math.random()*imgs.length)]
  });
}

function burst(x,y){
  for(let i=0;i<8;i++){
    particles.push({
      x,y,
      vx:(Math.random()-0.5)*6,
      vy:(Math.random()-0.5)*6,
      size:28,
      img: imgs[Math.floor(Math.random()*imgs.length)]
    });
  }
}

function randomBurst(){
  for(let i=0;i<4;i++){
    burst(Math.random()*canvas.width, Math.random()*canvas.height);
  }
}

let firecrackerInterval = null;

function startFirecracker(){
  if (firecrackerInterval) return;

  firecrackerInterval = setInterval(()=>{
    burst(Math.random()*canvas.width, Math.random()*canvas.height);
  },300);
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  if(Math.random()<0.12){
    spawnRain();
  }

  particles.forEach(p=>{
    if(p.vx!==undefined){
      p.x+=p.vx;
      p.y+=p.vy;
    } else {
      p.y+=p.speed;
    }

    if(p.img.complete){
      ctx.drawImage(p.img,p.x,p.y,p.size,p.size);
    }
  });

  particles = particles.filter(p => p.y < canvas.height+50);

  requestAnimationFrame(draw);
}

draw();
updateButtons();

// ================= GIFT SYSTEM =================

const gift = document.getElementById("giftContainer");
const dialog = document.getElementById("dialogBox");
const gift2 = document.getElementById("gift2");

let step = 0;

// show gift ONLY on final page + open state
function updateGiftVisibility() {
  const current = slides[index];

  gift2.classList.add("hidden");

  if (themes[index].name === "final" && current.isOpenRef()) {
    gift.classList.remove("hidden");
  } else {
    gift.classList.add("hidden");
    dialog.classList.add("hidden");
    step = 0;
  }
}

// hook into navigation
const originalMoveNext = moveNext;
moveNext = function() {
  originalMoveNext();
  updateGiftVisibility();
};

const originalMoveBack = moveBack;
moveBack = function() {
  originalMoveBack();
  updateGiftVisibility();
};

// also trigger on envelope click
slides.forEach((s, i) => {
  const oldClick = s.envelope.onclick;

  s.envelope.onclick = () => {
    oldClick();
    setTimeout(updateGiftVisibility, 300);
  };
});

// ================= DIALOG FLOW =================

gift.onclick = () => {
    vibrateTap();
  dialog.classList.remove("hidden");
  step = 0;
  showStep();
};

gift2.onclick = () => {

    // show surprise message
    dialog.classList.remove("hidden");
    dialog.innerHTML = "<div>Surprise 🎉 opening your gift...</div>";
  
    // redirect after delay
    setTimeout(() => {
      window.location.href = "gift.html";
    }, 1500);
  };

function showStep() {

  if (step === 0) {
    dialog.innerHTML = `
      <div>Do you want a gift? 🎁</div>
      <button onclick="handleYes()">Yes</button>
      <button onclick="handleNo()">No</button>
    `;
  }

  else if (step === 1) {
    dialog.innerHTML = `
      <div>Really? 😏</div>
      <button onclick="handleYes()">Yes</button>
      <button onclick="handleNo()">No</button>
    `;
  }

  else if (step === 2) {
    dialog.innerHTML = `
      <div>Really really?? 🤨</div>
      <button onclick="handleYes()">Yes</button>
      <button onclick="handleNo()">No</button>
    `;
  }

  else if (step === 3) {
    dialog.innerHTML = `
      <div>Really REALLY??? 😆</div>
      <button onclick="handleYes()">Yes</button>
      <button onclick="handleNo()">No</button>
    `;
  }

  else {
    dialog.innerHTML = `
      <div>Okay okay 😂</div>
      <button onclick="handleNo()">Continue</button>
    `;
  }
}

function handleYes() {
  step++;
  showStep();
}

// ================= EMOJI DROP =================

function dropLaughing(){
  for(let i=0;i<10;i++){
    particles.push({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height/2,
      vx:(Math.random()-0.5)*4,
      vy:Math.random()*3,
      size:26,
      img: createEmoji("😂")
    });
  }
}

function createEmoji(char){
  const c = document.createElement("canvas");
  c.width = 40;
  c.height = 40;
  const ctx2 = c.getContext("2d");
  ctx2.font = "30px serif";
  ctx2.fillText(char,5,30);
  const img = new Image();
  img.src = c.toDataURL();
  return img;
}

function handleNo() {

  dialog.innerHTML = `<div>Cool 😎 I haven’t prepared any 😂</div>`;

  dropLaughing();

  // hide dialog after a bit
  setTimeout(() => {
    dialog.classList.add("hidden");
  }, 1500);

  // spawn second gift after delay
  setTimeout(() => {

    gift2.classList.remove("hidden");

  }, 3000 + Math.random() * 2000); // 3–5 sec
}

// ================= PRESENCE SYSTEM =================

const promptBox = document.getElementById("presencePrompt");
const petLayer = document.getElementById("petLayer");
const dog = document.getElementById("dog");
const cat = document.getElementById("cat");

let petsActive = false;

// YES
document.getElementById("yesComp").onclick = () => {

  if (audioEnabled) {
    barkSound.currentTime = 0;
    barkSound.play();
  
    setTimeout(()=>{
      meowSound.currentTime = 0;
      meowSound.play();
    },300);
  }

  promptBox.style.display = "none";

  // puff effect (reuse particles)
  for (let i = 0; i < 15; i++) {
    particles.push({
      x: canvas.width/2,
      y: canvas.height/2,
      vx:(Math.random()-0.5)*5,
      vy:(Math.random()-0.5)*5,
      size:20,
      img: createEmoji("💨")
    });
  }

  setTimeout(() => {
    petLayer.classList.remove("hidden");
    petsActive = true;
  }, 300);
};

// NO
document.getElementById("noComp").onclick = () => {
  promptBox.innerHTML = "Alright 😌";

  promptBox.style.transition = "opacity 0.5s";
  promptBox.style.opacity = "1";

  setTimeout(() => {
    promptBox.style.opacity = "0";
  }, 800);

  setTimeout(() => {
    promptBox.style.display = "none";
  }, 1300);
};

// ================= ENVELOPE HOOK =================

// make pets react to envelope open
function triggerPetReaction() {
  if (!petsActive) return;

  cat.classList.add("lean");

  setTimeout(() => {
    cat.classList.remove("lean");
  }, 800);
}

// ======================AUDIO

// ================= AUDIO =================

const bgMusic = new Audio("audio/lofi.mp3");
const barkSound = new Audio("audio/bark.mp3");
const meowSound = new Audio("audio/meow.mp3");

bgMusic.loop = true;
bgMusic.volume = 0.3;

barkSound.volume = 0.6;
meowSound.volume = 0.6;

let audioEnabled = false;

const audioBtn = document.getElementById("audioToggle");

audioBtn.onclick = async () => {

  audioEnabled = !audioEnabled;

  if (audioEnabled) {
    try {
      await bgMusic.play();
    } catch (e) {
      console.log("Audio blocked:", e);
    }

    audioBtn.innerText = "🔊";
  } else {
    bgMusic.pause();
    audioBtn.innerText = "🔇";
  }
};

// ========MOBILE
const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

function vibrateTap() {
  if (isMobile && navigator.vibrate) {
    navigator.vibrate(10); // very subtle
  }
}

if (isMobile) {

  let startX = 0;
  let endX = 0;

  document.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  document.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX;

    const diff = startX - endX;

    // swipe threshold
    if (Math.abs(diff) > 50) {

      vibrateTap();

      const current = slides[index];

      // swipe left → next
      if (diff > 0) {

        if (current.isOpenRef()) {
          closeEnvelope(current.envelope, current.container, current.birthdayText, () => {
            hardResetSlide(current);
            moveNext();
          });
        } else {
          moveNext();
        }
      }

      // swipe right → back
      else {

        if (current.isOpenRef()) {
          closeEnvelope(current.envelope, current.container, current.birthdayText, () => {
            hardResetSlide(current);
            moveBack();
          });
        } else {
          moveBack();
        }
      }
    }
  });
}