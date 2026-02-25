function qs(s){return document.querySelector(s);}
function qsa(s){return document.querySelectorAll(s);}
function onlyDigits(s){ return (s || "").replace(/\D/g, ""); }

/* MENU MOBILE */
const menuBtn = qs("#menuBtn");
const navMobile = qs("#navMobile");

if(menuBtn && navMobile){
  menuBtn.addEventListener("click", ()=> navMobile.classList.toggle("show"));
  qsa("#navMobile a").forEach(a => a.addEventListener("click", ()=> navMobile.classList.remove("show")));
}

/* REVEAL */
const observer = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting) e.target.classList.add("in");
  });
}, {threshold:0.12});
qsa(".reveal").forEach(el=> observer.observe(el));

/* QUIZ (1 por vez) */
const quiz = qs("#quiz");
if(quiz){
  const steps = Array.from(qsa(".quizStep"));
  const prog = qs("#quizProg");
  const stepLabel = qs("#quizStepLabel");
  const backBtn = qs("#quizBackBtn");
  let idx = 0;
  const data = {};

  function totalSteps(){ return steps.length; }

  function setActive(i){
    steps.forEach((s, n)=> s.classList.toggle("active", n===i));
    const pct = ((i+1) / totalSteps()) * 100;
    if(prog) prog.style.width = pct + "%";
    if(stepLabel) stepLabel.textContent = `Passo ${i+1} de ${totalSteps()}`;
    if(backBtn) backBtn.style.visibility = (i === 0) ? "hidden" : "visible";
    if(window.innerWidth < 900) quiz.scrollIntoView({behavior:"smooth", block:"center"});
  }

  setActive(0);

  qsa(".quizOptions button").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const key = btn.getAttribute("data-key");
      const val = btn.getAttribute("data-value");
      if(key) data[key] = val;

      btn.style.borderColor = "rgba(139,92,246,.65)";
      btn.style.background = "rgba(139,92,246,0.14)";

      setTimeout(()=>{
        btn.style.borderColor = "";
        btn.style.background = "";
        if(idx < totalSteps()-1){ idx++; setActive(idx); }
      }, 140);
    });
  });

  if(backBtn){
    backBtn.addEventListener("click", ()=>{
      if(idx > 0){ idx--; setActive(idx); }
    });
  }

  const inputWpp = qs("#quizContato");
  if(inputWpp){
    inputWpp.addEventListener("input", ()=>{
      const dig = onlyDigits(inputWpp.value).slice(0, 13);
      inputWpp.value = dig;
    });
  }

  const sendBtn = qs("#quizSendBtn");
  if(sendBtn){
    sendBtn.addEventListener("click", ()=>{
      const nome = (qs("#quizNome")?.value || "").trim();
      const empresa = (qs("#quizEmpresa")?.value || "").trim();
      const wpp = onlyDigits(qs("#quizContato")?.value || "");

      if(!nome) return alert("Preencha seu nome.");
      if(wpp.length < 10) return alert("Informe um WhatsApp válido (com DDD).");

      const msg =
`Olá! Vim pelo site da Freitas Dev.

Nome: ${nome}
Empresa: ${empresa || "—"}

Quero: ${data.tipo || "—"}
Objetivo: ${data.objetivo || "—"}
Urgência: ${data.prazo || "—"}
Identidade visual: ${data.design || "—"}

Pode me enviar uma proposta com prazo e valor?
(Quero o projeto 100% do meu jeito, não igual a demo.)`;

      window.open(`https://wa.me/5513997833810?text=${encodeURIComponent(msg)}`, "_blank");
    });
  }
}
