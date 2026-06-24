/* GASTROLAB - DYNAMIC WEB PORTAL JAVASCRIPT LOGIC */

document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------------------------------------------
     1. TAB ROUTING & NAVIGATION SYSTEM
     ------------------------------------------------------------- */
  const navTabs = document.querySelectorAll('.nav-tab');
  const tabContents = document.querySelectorAll('.tab-content');

  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active classes
      navTabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      // Add active to current
      tab.classList.add('active');
      const target = tab.getAttribute('data-target');
      document.getElementById(target).classList.add('active');
    });
  });

  /* -------------------------------------------------------------
     2. DUAL-THEME SWITCHER (SAVORY VS SWEET)
     ------------------------------------------------------------- */
  const themeToggle = document.getElementById('theme-toggle');
  const htmlTag = document.documentElement;

  themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) {
      // Switch to Sweet Theme
      htmlTag.classList.remove('theme-savory');
      htmlTag.classList.add('theme-sweet');
    } else {
      // Switch to Savory Theme
      htmlTag.classList.remove('theme-sweet');
      htmlTag.classList.add('theme-savory');
    }
  });

  /* -------------------------------------------------------------
     3. PORTION RECIPE SCALER LOGIC
     ------------------------------------------------------------- */
  const portionSlider = document.getElementById('portion-slider');
  const portionVal = document.getElementById('portion-val');
  const scalerIngredients = document.querySelectorAll('#scaler-ingredients li');

  portionSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    portionVal.textContent = val;

    scalerIngredients.forEach(item => {
      const baseQty = parseFloat(item.getAttribute('data-base'));
      const unit = item.getAttribute('data-unit');
      // Calculate scaled quantity
      const scaledQty = (baseQty * val).toFixed(baseQty % 1 === 0 ? 0 : 1);
      
      const qtySpan = item.querySelector('.ing-qty');
      qtySpan.textContent = scaledQty;
    });
  });

  /* -------------------------------------------------------------
     4. "WHAT'S IN MY FRIDGE?" RECIPE FILTER
     ------------------------------------------------------------- */
  const fridgeCheckboxes = document.querySelectorAll('.fridge-ing');
  const fridgeResults = document.getElementById('fridge-results');

  // Defined dynamic fusion recipes based on available ingredients
  const fusionRecipes = [
    {
      name: "แซลมอนทาร์ทาร์ซอสครีมอะโวคาโด",
      ingredients: ["salmon", "avocado"],
      desc: "ความหวานของเนื้อแซลมอนสดหั่นเต๋า ผสมผสานกับความมันเนียนของซอสอะโวคาโดบดและน้ำมะนาวเล็กน้อยจานหรู",
      time: "20 นาที"
    },
    {
      name: "สเต็กแซลมอนย่างซอสเห็ดทรัฟเฟิลเข้มข้น",
      ingredients: ["salmon", "truffle"],
      desc: "สเต็กปลาแซลมอนย่างหนังกรอบ ราดซอสครีมเห็ดทรัฟเฟิลดำสูตรโมเดิร์นหอมละมุน",
      time: "25 นาที"
    },
    {
      name: "ช็อกโกแลตสอดไส้ครีมสตรอว์เบอร์รีโฮโลแกรม",
      ingredients: ["chocolate", "strawberry"],
      desc: "ของหวานสุดหรูจากช็อกโกแลตลาวาเข้มข้น สอดไส้ครีมสตรอว์เบอร์รีสดรสเปรี้ยวอมหวานลงตัว",
      time: "30 นาที"
    },
    {
      name: "ทรัฟเฟิลช็อกโกแลตทรัฟเฟิล (Double Truffle)",
      ingredients: ["chocolate", "truffle"],
      desc: "นวัตกรรมขนมหวานแห่งอนาคต นำดาร์กช็อกโกแลตแท้ผสานเห็ดทรัฟเฟิลบดละเอียดเพื่อกลิ่นอายควันจางๆ ในปาก",
      time: "15 นาที"
    },
    {
      name: "สลัดอะโวคาโดและสตรอว์เบอร์รีออร์แกนิก",
      ingredients: ["avocado", "strawberry"],
      desc: "สลัดเพื่อสุขภาพและสิ่งแวดล้อมที่ยั่งยืน ผสานความสดชื่นของผลไม้และไขมันดีจากผักเพาะเลี้ยงพิเศษ",
      time: "10 นาที"
    }
  ];

  function updateFridgeRecipes() {
    // Get checked values
    const checkedIngs = Array.from(fridgeCheckboxes)
                             .filter(cb => cb.checked)
                             .map(cb => cb.value);

    if (checkedIngs.length === 0) {
      fridgeResults.innerHTML = `<p class="placeholder-text"><i class="fa-solid fa-search"></i> เลือกวัตถุดิบเพื่อประมวลผลสูตรฟิวชัน...</p>`;
      return;
    }

    // Filter recipes that contain AT LEAST ONE of the selected ingredients
    const matches = fusionRecipes.filter(recipe => {
      return recipe.ingredients.every(ing => checkedIngs.includes(ing));
    });

    if (matches.length === 0) {
      fridgeResults.innerHTML = `<p class="placeholder-text"><i class="fa-solid fa-face-frown"></i> ขออภัย ไม่พบสูตรฟิวชันสำหรับวัตถุดิบกลุ่มนี้ ลองเลือกแบบคู่อื่นๆ ดูนะ</p>`;
    } else {
      fridgeResults.innerHTML = matches.map(recipe => `
        <div class="glass-panel recipe-match-item" style="margin-bottom: 0.8rem; padding: 1rem; border-left: 4px solid var(--accent-glow);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
            <h4 style="color: var(--accent-glow); margin: 0;">${recipe.name}</h4>
            <span style="font-size: 0.8rem; color: var(--text-secondary);"><i class="fa-solid fa-clock"></i> ${recipe.time}</span>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.4; margin: 0;">${recipe.desc}</p>
        </div>
      `).join('');
    }
  }

  fridgeCheckboxes.forEach(cb => {
    cb.addEventListener('change', updateFridgeRecipes);
  });

  /* -------------------------------------------------------------
     5. INTERACTIVE COOKING MODAL & TIMERS SYSTEM
     ------------------------------------------------------------- */
  const cookingModal = document.getElementById('cooking-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const prevStepBtn = document.getElementById('prev-step-btn');
  const nextStepBtn = document.getElementById('next-step-btn');
  const modalRecipeTitle = document.getElementById('modal-recipe-title');
  const stepTitle = document.getElementById('step-title');
  const stepDescription = document.getElementById('step-description');
  const timerDisplay = document.getElementById('timer-display');
  const timerControlBtn = document.getElementById('timer-control-btn');
  const cookingProgress = document.getElementById('cooking-progress');
  const startCookingButtons = document.querySelectorAll('.start-cooking-btn');

  // Steps definitions
  const recipesSteps = {
    ramen: {
      title: "ราเมนซุปกระดูกหมูสูตรลับ (Ichiran Style)",
      steps: [
        {
          title: "ขั้นตอนที่ 1: เตรียมน้ำซุปทงคัตสึเข้มข้น",
          desc: "ต้มกระดูกหมูหน้าแข้งร่วมกับขิง แกนหัวหอมใหญ่ และไขมันหมูที่อุณหภูมิ 98°C เป็นเวลา 12 ชั่วโมงเพื่อให้ได้ซุปสีขาวน้ำนมเข้มข้นสุดอูมามิ",
          time: 300 // 5 minutes (in seconds)
        },
        {
          title: "ขั้นตอนที่ 2: ผสมเครื่องปรุงแดงรสเผ็ด",
          desc: "ผสมพริกแกงญี่ปุ่นสไตล์สไปซี่แห้ง โชยุชั้นดี มิริน และเครื่องเทศลับ 4 ชนิด พักทิ้งไว้ในโถควบคุมความชื้นเพื่อให้ส่วนผสมซึมลึกเข้ากันดี",
          time: 120 // 2 minutes
        },
        {
          title: "ขั้นตอนที่ 3: ต้มเส้นราเมนระดับอัลเดนเต้",
          desc: "ต้มน้ำในหม้อให้เดือดพล่าน นำเส้นราเมนสดจุ่มลงไปต้มเป็นเวลา 2 นาทีพอดีเพื่อคงความหนึบของแกนเส้นราเมนสไตล์ญี่ปุ่นแท้",
          time: 120 // 2 minutes
        },
        {
          title: "ขั้นตอนที่ 4: จัดวางและราดซอสรสจัดจ้าน",
          desc: "เทซุปทงคัตสึลงชาม คลี่เส้นราเมนลงไป วางหมูชาชู ต้นหอมซอยละเอียด และหยอดซอสแดงสูตรลับตรงกลางชาม พร้อมเสิร์ฟความอร่อยร้อนแรง",
          time: 0 // No timer
        }
      ]
    },
    cheesecake: {
      title: "ดับเบิ้ลชีสเค้กสตรอว์เบอร์รี (Pablo Style)",
      steps: [
        {
          title: "ขั้นตอนที่ 1: เตรียมฐานคุกกี้เนย",
          desc: "บดคุกกี้เนยละเอียด ผสมเนยละลายเกรดพรีเมียม กรุลงในแม่พิมพ์ให้แน่น แช่เย็นจัด 20 นาทีให้ฐานเค้กเซ็ตตัวแข็งพอดี",
          time: 180 // 3 minutes
        },
        {
          title: "ขั้นตอนที่ 2: ผสมครีมชีสทาร์ตสูตรละมุน",
          desc: "ตีครีมชีสสด ครีมสด น้ำตาลทรายแดง และผงส้มเจลาตินออร์แกนิกจนเนื้อเนียนละเอียด ปราศจากฟองอากาศขนาดใหญ่",
          time: 240 // 4 minutes
        },
        {
          title: "ขั้นตอนที่ 3: การอบเนื้อชีสเค้กไฟอ่อน",
          desc: "เทครีมชีสลงแม่พิมพ์ อบแบบรองน้ำที่อุณหภูมิ 160 องศาเซลเซียส เป็นเวลา 45 นาทีเพื่อให้ผิวหน้าเค้กตึงและสุกสม่ำเสมอ",
          time: 600 // 10 minutes (for simulator demonstration)
        },
        {
          title: "ขั้นตอนที่ 4: ราดแยมครีมสตรอว์เบอร์รี่สด",
          desc: "นำชีสเค้กออกจากเตาอบ พักให้เย็น ราดหน้าด้วยแยมสตรอว์เบอร์รี่เปรี้ยวหวานสดชื่น ตกแต่งด้วยใบสะระแหน่ออร์แกนิกพร้อมทาน",
          time: 0 // No timer
        }
      ]
    }
  };

  let currentRecipe = null;
  let currentStepIdx = 0;
  let timerInterval = null;
  let timerSecondsRemaining = 0;
  let isTimerRunning = false;

  // Open modal
  startCookingButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.recipe-card');
      const recipeType = card.getAttribute('data-recipe');
      currentRecipe = recipesSteps[recipeType];
      currentStepIdx = 0;
      
      openCookingStep();
      cookingModal.classList.add('active');
    });
  });

  // Close modal
  function closeModal() {
    cookingModal.classList.remove('active');
    clearInterval(timerInterval);
    isTimerRunning = false;
    currentRecipe = null;
  }

  closeModalBtn.addEventListener('click', closeModal);
  
  // Close on outside click
  cookingModal.addEventListener('click', (e) => {
    if (e.target === cookingModal) closeModal();
  });

  function openCookingStep() {
    if (!currentRecipe) return;
    
    clearInterval(timerInterval);
    isTimerRunning = false;
    timerControlBtn.innerHTML = `<i class="fa-solid fa-play"></i> เริ่มจับเวลา`;
    
    const step = currentRecipe.steps[currentStepIdx];
    modalRecipeTitle.textContent = currentRecipe.title;
    stepTitle.textContent = step.title;
    stepDescription.textContent = step.desc;

    // Progress Bar
    const progress = ((currentStepIdx + 1) / currentRecipe.steps.length) * 100;
    cookingProgress.style.width = `${progress}%`;

    // Timer display
    if (step.time > 0) {
      document.getElementById('step-timer-box').style.display = 'flex';
      timerSecondsRemaining = step.time;
      updateTimerDisplay();
    } else {
      document.getElementById('step-timer-box').style.display = 'none';
    }

    // Prev/Next states
    prevStepBtn.disabled = currentStepIdx === 0;
    if (currentStepIdx === currentRecipe.steps.length - 1) {
      nextStepBtn.innerHTML = `เสร็จสิ้นภารกิจ <i class="fa-solid fa-circle-check"></i>`;
    } else {
      nextStepBtn.innerHTML = `เข้าใจแล้ว ขั้นต่อไป <i class="fa-solid fa-chevron-right"></i>`;
    }
  }

  function updateTimerDisplay() {
    const mins = Math.floor(timerSecondsRemaining / 60).toString().padStart(2, '0');
    const secs = (timerSecondsRemaining % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${mins}:${secs}`;
  }

  // Timer controls
  timerControlBtn.addEventListener('click', () => {
    if (isTimerRunning) {
      // Pause timer
      clearInterval(timerInterval);
      timerControlBtn.innerHTML = `<i class="fa-solid fa-play"></i> เริ่มจับเวลา`;
      isTimerRunning = false;
    } else {
      // Start timer
      isTimerRunning = true;
      timerControlBtn.innerHTML = `<i class="fa-solid fa-pause"></i> หยุดชั่วคราว`;
      
      timerInterval = setInterval(() => {
        timerSecondsRemaining--;
        updateTimerDisplay();
        
        if (timerSecondsRemaining <= 0) {
          clearInterval(timerInterval);
          timerDisplay.textContent = "เสร็จสิ้น!";
          timerControlBtn.innerHTML = `<i class="fa-solid fa-check"></i> เรียบร้อย`;
          isTimerRunning = false;
          // Play audio check
          try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            osc.connect(audioCtx.destination);
            osc.frequency.setValueAtTime(880, audioCtx.currentTime);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.3);
          } catch(err) {
            console.log('Audio contextual warning ignored');
          }
        }
      }, 1000);
    }
  });

  // Steps actions
  nextStepBtn.addEventListener('click', () => {
    if (currentStepIdx === currentRecipe.steps.length - 1) {
      // Finish
      closeModal();
      alert("ยินดีด้วย! คุณเสร็จสิ้นขั้นตอนการปรุงอาหารระดับภัตตาคารแล้ว!");
    } else {
      currentStepIdx++;
      openCookingStep();
    }
  });

  prevStepBtn.addEventListener('click', () => {
    if (currentStepIdx > 0) {
      currentStepIdx--;
      openCookingStep();
    }
  });


  /* -------------------------------------------------------------
     6. CHEF MASTERCLASS VIDEO & LIVE TELEMETRY SIMULATOR
     ------------------------------------------------------------- */
  const chefVideoTrigger = document.getElementById('chef-video-trigger');
  const logStatus = document.getElementById('log-status');
  const telemetryDisplay = document.getElementById('telemetry-display');
  const tHeat = document.getElementById('t-heat');
  const tStable = document.getElementById('t-stable');
  const tTimer = document.getElementById('t-timer');
  const telemetryLog = document.querySelector('.telemetry-log');

  let telemetryInterval = null;
  let isVideoPlaying = false;
  let simSeconds = 0;

  function formatTime(s) {
    const mins = Math.floor(s / 60).toString().padStart(2, '0');
    const secs = (s % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

  function addLogLine(text) {
    const p = document.createElement('p');
    p.className = 'log-line';
    p.textContent = `> ${text}`;
    telemetryLog.appendChild(p);
    // Scroll to bottom
    telemetryLog.scrollTop = telemetryLog.scrollHeight;
  }

  chefVideoTrigger.addEventListener('click', () => {
    if (isVideoPlaying) {
      // Pause simulation
      clearInterval(telemetryInterval);
      isVideoPlaying = false;
      logStatus.textContent = "> วิดีโอและระบบสแกนความร้อนถูกหยุดชั่วคราว";
      addLogLine("หยุดการเชื่อมต่อฟีดข้อมูลโฮโลแกรม");
    } else {
      // Start simulation
      isVideoPlaying = true;
      logStatus.textContent = "> วิดีโอและระบบวิเคราะห์ข้อมูลกำลังรัน...";
      addLogLine("เชื่อมต่อสัญญาณดาวเทียมห้องแล็บเชฟสำเร็จ...");
      addLogLine("กำลังซิงค์ค่าเซ็นเซอร์กระทะและตัวบ่งชี้ความร้อน...");

      telemetryInterval = setInterval(() => {
        simSeconds++;
        tTimer.textContent = formatTime(simSeconds);

        // Generate mock telemetry readings
        const heatVal = (192 + Math.random() * 6).toFixed(1);
        const stabilityVal = (96.5 + Math.random() * 3).toFixed(1);

        tHeat.textContent = `${heatVal} °C`;
        tStable.textContent = `${stabilityVal} %`;

        // Periodically inject interesting cook logs
        if (simSeconds % 5 === 0) {
          const logs = [
            `อัตราหมุนเวียนควันน้ำซุปคงที่ที่ 98.4%`,
            `เซ็นเซอร์จับพบสภาวะเดือดปุดในกระทะปรุงรส`,
            `วิเคราะห์ปฏิกิริยา Maillard สมบูรณ์ 100%`,
            `ระบบรักษาระดับอุณหภูมิอัตโนมัติทำงานราบรื่น`,
            `เชฟแนะนำ: รักษาความคงที่ของหม้อต้มที่ 195 องศาเพื่อดึงเจลาตินกระดูก`
          ];
          const randomLog = logs[Math.floor(Math.random() * logs.length)];
          addLogLine(randomLog);
        }

      }, 1000);
    }
  });


  /* -------------------------------------------------------------
     7. FORM CHALLENGE VALIDATION & SUBMISSION
     ------------------------------------------------------------- */
  const challengeForm = document.getElementById('challenge-form');
  const formFeedback = document.getElementById('form-feedback');

  challengeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameVal = document.getElementById('c-name').value;
    const recipeSelect = document.getElementById('c-recipe');
    const recipeText = recipeSelect.options[recipeSelect.selectedIndex].text;

    formFeedback.className = "form-feedback success";
    formFeedback.innerHTML = `<i class="fa-solid fa-circle-check"></i> ลงทะเบียนสำเร็จ! ขอบคุณเชฟ <strong>${nameVal}</strong> ที่ส่งผลงานในหัวข้อ <strong>${recipeText}</strong> เข้าร่วมแข่งขันประชันฝีมือระดับสากล!`;
    
    // Clear input
    document.getElementById('c-name').value = '';
  });

});
