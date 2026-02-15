const state = {
  history: [],
};

const chatWindow = document.getElementById("chatWindow");
const form = document.getElementById("chatForm");
const input = document.getElementById("userInput");
const template = document.getElementById("messageTemplate");

const systemStyle = [
  "مرحبًا! أنا مساعد دردشة ذكي 😊",
  "هدفي أن أقدم لك إجابات دقيقة، واضحة، ودافئة.",
  "يمكنك سؤالي عن أي موضوع وسأشرح خطوة بخطوة عندما يلزم.",
].join("\n");

addMessage("assistant", systemStyle);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  addMessage("user", text);
  state.history.push({ role: "user", content: text });

  input.value = "";
  autoResize();

  const typingNode = addMessage("assistant", "... أفكر معك الآن");

  setTimeout(() => {
    typingNode.querySelector(".message-bubble").textContent = generateReply(text, state.history);
    state.history.push({ role: "assistant", content: typingNode.querySelector(".message-bubble").textContent });
    scrollToBottom();
  }, 450);
});

input.addEventListener("input", autoResize);

function autoResize() {
  input.style.height = "auto";
  input.style.height = `${Math.min(input.scrollHeight, 160)}px`;
}

function addMessage(role, text) {
  const node = template.content.firstElementChild.cloneNode(true);
  node.classList.add(role);
  node.querySelector(".message-role").textContent = role === "assistant" ? "المساعد" : "أنت";
  node.querySelector(".message-bubble").textContent = text;
  chatWindow.appendChild(node);
  scrollToBottom();
  return node;
}

function scrollToBottom() {
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function generateReply(question, history) {
  const normalized = question.toLowerCase();

  if (question.length < 4) {
    return [
      "أحسنت على البداية 👏",
      "حتى أجاوبك بدقة أعلى، ممكن توضح سؤالك أكثر بكلمتين أو ثلاث؟",
      "مثال: (شرح مبسط للذكاء الاصطناعي) أو (خطة تعلم بايثون للمبتدئين).",
    ].join("\n");
  }

  if (/(من أنت|مين انت|تعريفك|who are you)/i.test(normalized)) {
    return [
      "أنا بوت دردشة ذكي مصمم ليشرح بشكل واضح وودود.",
      "أتعامل مع الأسئلة خطوة بخطوة وأحاول تبسيط الأفكار المعقدة بأمثلة.",
      "إذا رغبت، يمكنني تخصيص الشرح حسب مستواك (مبتدئ/متوسط/متقدم).",
    ].join("\n");
  }

  if (/(برمجة|javascript|js|بايثون|python|html|css)/i.test(normalized)) {
    return [
      "سؤال ممتاز! 💡",
      "لنمشي بطريقة مرتبة:",
      "1) نحدد الهدف العملي الذي تريد بناءه.",
      "2) نقسمه إلى أجزاء صغيرة (واجهة، منطق، بيانات).",
      "3) نبدأ بنموذج بسيط ثم نحسّنه تدريجيًا.",
      "مثال سريع: إذا أردت تعلم JavaScript، ابدأ بالمتغيرات والدوال ثم DOM ثم مشروع صغير مثل To-Do.",
      "لو تحب، أقدر أضع لك خطة تعلم أسبوعية مخصصة.",
    ].join("\n");
  }

  if (/(رياضيات|معادلة|تفاضل|تكامل|احسب|حساب)/i.test(normalized)) {
    return [
      "جميل جدًا! أحب هذا النوع من الأسئلة 🧠",
      "لضمان الدقة، سأعمل هكذا:",
      "1) أستخرج المعطيات من السؤال.",
      "2) أختار القانون المناسب مع سبب اختياره.",
      "3) أحل خطوة بخطوة ثم أتحقق من النتيجة.",
      "أرسل المسألة كما هي، وسأحلها مع شرح واضح جدًا.",
    ].join("\n");
  }

  if (/(غامض|مو واضح|مش واضح|confus|غير واضح)/i.test(normalized)) {
    return [
      "معك حق، خلّينا نوضّحها بطريقة أسهل 🌟",
      "اختر ما يناسبك الآن:",
      "- شرح مبسط جدًا (كأننا نشرح لصديق مبتدئ).",
      "- شرح متوسط مع مثالين عمليين.",
      "- شرح متقدم مع تفاصيل تقنية.",
      "قل لي الخيار الذي تريده وسأكمل فورًا.",
    ].join("\n");
  }

  const followup = pickFollowup(history.length);

  return [
    "سؤال رائع، وشكرًا على صياغته 👌",
    "إجابة دقيقة ومختصرة بشكل مفيد:",
    summarizeQuestion(question),
    "للحصول على أفضل نتيجة، أخبرني إن كنت تريد: مثال عملي، شرح أعمق، أو خطوات تنفيذ مباشرة.",
    followup,
  ].join("\n");
}

function summarizeQuestion(question) {
  return `- فهمت أنك تسأل عن: «${question}»\n- الخطوة التالية: أحدد الهدف، أوضح الفكرة، ثم أعطيك تطبيقًا عمليًا مناسبًا.`;
}

function pickFollowup(turn) {
  const prompts = [
    "فضولك ممتاز! كلما كان السؤال أدق، كانت النتيجة أقوى ✨",
    "إذا أحببت، يمكنني تحويل الإجابة إلى خطة قصيرة قابلة للتنفيذ.",
    "أنا معك خطوة بخطوة—أرسل أي تفصيل إضافي وسأبني عليه مباشرة.",
  ];
  return prompts[turn % prompts.length];
}
