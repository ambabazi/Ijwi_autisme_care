requireAuth();

const MILESTONES = {
  '0-6': [
    { id: 'M_0_1', domain: 'Motor',
      question: 'Does the child lift their head when placed on their stomach?' },
    { id: 'M_0_2', domain: 'Motor',
      question: 'Does the child move both arms and legs equally and smoothly?' },
    { id: 'M_0_3', domain: 'Social',
      question: 'Does the child make eye contact with familiar faces?' },
    { id: 'M_0_4', domain: 'Social',
      question: 'Does the child smile or change expression in response to a familiar face?' },
    { id: 'M_0_5', domain: 'Communication',
      question: 'Does the child respond to sounds or voices by turning their head?' },
    { id: 'M_0_6', domain: 'Communication',
      question: 'Does the child make sounds other than crying (e.g. cooing)?' },
    { id: 'M_0_7', domain: 'Sensory',
      question: 'Does the child react to sudden loud noises (e.g. startle or blink)?' },
  ],
  '7-12': [
    { id: 'M_7_1', domain: 'Motor',
      question: 'Can the child sit without support for at least a few seconds?' },
    { id: 'M_7_2', domain: 'Motor',
      question: 'Does the child reach out and pick up objects using both hands?' },
    { id: 'M_7_3', domain: 'Motor',
      question: 'Does the child use a pincer grip — picking up small objects with thumb and finger?' },
    { id: 'M_7_4', domain: 'Social',
      question: 'Does the child smile or laugh in response to others playing with them?' },
    { id: 'M_7_5', domain: 'Social',
      question: 'Does the child show concern or discomfort around strangers (stranger anxiety)?' },
    { id: 'M_7_6', domain: 'Social',
      question: 'Does the child play peek-a-boo or enjoy simple back-and-forth games?' },
    { id: 'M_7_7', domain: 'Communication',
      question: 'Does the child babble or make repeated sounds like "ba-ba", "ma-ma", "da-da"?' },
    { id: 'M_7_8', domain: 'Communication',
      question: 'Does the child turn toward their own name when called?' },
    { id: 'M_7_9', domain: 'Cognitive',
      question: 'Does the child look for an object that has been hidden under a cloth?' },
  ],
  '13-24': [
    { id: 'M_13_1', domain: 'Motor',
      question: 'Can the child walk independently without holding on to anything?' },
    { id: 'M_13_2', domain: 'Motor',
      question: 'Can the child climb onto low furniture or up a step with support?' },
    { id: 'M_13_3', domain: 'Motor',
      question: 'Can the child kick or throw a large ball?' },
    { id: 'M_13_4', domain: 'Social',
      question: 'Does the child point at objects or pictures to share interest with others?' },
    { id: 'M_13_5', domain: 'Social',
      question: 'Does the child show affection — hugging or coming to caregivers for comfort?' },
    { id: 'M_13_6', domain: 'Social',
      question: 'Does the child show concern when others around them are upset or crying?' },
    { id: 'M_13_7', domain: 'Communication',
      question: 'Does the child say at least 3 clear recognisable words?' },
    { id: 'M_13_8', domain: 'Communication',
      question: 'Does the child use gestures such as waving goodbye or shaking their head for no?' },
    { id: 'M_13_9', domain: 'Cognitive',
      question: 'Does the child imitate simple actions such as clapping, waving, or banging objects?' },
    { id: 'M_13_10', domain: 'Cognitive',
      question: 'Can the child identify and point to at least 2 body parts when asked?' },
  ],
  '25-36': [
    { id: 'M_25_1', domain: 'Motor',
      question: 'Can the child run without frequently falling?' },
    { id: 'M_25_2', domain: 'Motor',
      question: 'Can the child climb stairs holding a rail, one step at a time?' },
    { id: 'M_25_3', domain: 'Motor',
      question: 'Can the child hold a crayon or pencil and make marks on paper?' },
    { id: 'M_25_4', domain: 'Social',
      question: 'Does the child play alongside other children, even without directly interacting?' },
    { id: 'M_25_5', domain: 'Social',
      question: 'Does the child take turns with objects or in simple games with help from an adult?' },
    { id: 'M_25_6', domain: 'Social',
      question: 'Does the child show pride or excitement when they complete a task?' },
    { id: 'M_25_7', domain: 'Communication',
      question: 'Does the child use 2-word phrases such as "more milk" or "go out"?' },
    { id: 'M_25_8', domain: 'Communication',
      question: 'Does the child follow simple 2-step instructions without gestures?' },
    { id: 'M_25_9', domain: 'Cognitive',
      question: 'Can the child sort objects by shape or colour when shown how?' },
    { id: 'M_25_10', domain: 'Cognitive',
      question: 'Does the child engage in pretend play — feeding a doll, talking on a toy phone?' },
  ],
  '37-60': [
    { id: 'M_37_1', domain: 'Motor',
      question: 'Can the child hop on one foot at least twice without support?' },
    { id: 'M_37_2', domain: 'Motor',
      question: 'Can the child catch a large ball thrown from a short distance?' },
    { id: 'M_37_3', domain: 'Motor',
      question: 'Can the child draw a circle or simple shape when shown an example?' },
    { id: 'M_37_4', domain: 'Social',
      question: 'Does the child play cooperatively with other children — sharing and taking turns?' },
    { id: 'M_37_5', domain: 'Social',
      question: 'Does the child have at least one child they prefer to play with regularly?' },
    { id: 'M_37_6', domain: 'Social',
      question: 'Does the child understand and follow basic rules in simple games?' },
    { id: 'M_37_7', domain: 'Communication',
      question: 'Can the child tell a short story or describe a recent event using sentences?' },
    { id: 'M_37_8', domain: 'Communication',
      question: 'Can the child say their own first name and age when asked?' },
    { id: 'M_37_9', domain: 'Cognitive',
      question: 'Can the child correctly identify and name at least 4 basic colours?' },
    { id: 'M_37_10', domain: 'Cognitive',
      question: 'Can the child count 5 or more objects correctly by touching each one?' },
    { id: 'M_37_11', domain: 'Cognitive',
      question: 'Does the child understand concepts like bigger/smaller and more/less?' },
  ],
  '61-72': [
    { id: 'M_61_1', domain: 'Motor',
      question: 'Can the child skip or gallop, alternating feet?' },
    { id: 'M_61_2', domain: 'Motor',
      question: 'Can the child draw a recognisable person with at least a head and limbs?' },
    { id: 'M_61_3', domain: 'Motor',
      question: 'Can the child use scissors to cut along a straight line?' },
    { id: 'M_61_4', domain: 'Social',
      question: 'Does the child have established friendships and prefer certain children?' },
    { id: 'M_61_5', domain: 'Social',
      question: 'Does the child understand the difference between right and wrong in simple situations?' },
    { id: 'M_61_6', domain: 'Social',
      question: 'Does the child cooperate with adults and follow instructions without constant reminders?' },
    { id: 'M_61_7', domain: 'Communication',
      question: 'Does the child speak clearly enough for strangers to understand most of what they say?' },
    { id: 'M_61_8', domain: 'Communication',
      question: 'Can the child tell an elaborate story with a beginning, middle, and end?' },
    { id: 'M_61_9', domain: 'Cognitive',
      question: 'Can the child count to 20 or beyond without mistakes?' },
    { id: 'M_61_10', domain: 'Cognitive',
      question: 'Can the child recognise and name most letters of the alphabet?' },
    { id: 'M_61_11', domain: 'Cognitive',
      question: 'Can the child follow 3-step instructions without reminders?' },
    { id: 'M_61_12', domain: 'Sensory',
      question: 'Does the child cope with everyday sensory experiences — clothing textures, food smells, moderate noise — without significant distress?' },
  ]
};

function getAgeGroup(months) {
  if (months <= 6)  return '0-6';
  if (months <= 12) return '7-12';
  if (months <= 24) return '13-24';
  if (months <= 36) return '25-36';
  if (months <= 60) return '37-60';
  return '61-72';
}

function getAgeInMonths(dob) {
  return Math.floor((Date.now() - new Date(dob)) / (1000 * 60 * 60 * 24 * 30));
}

let currentChild = null;
let milestones = [];
let responses = {};

async function initScreening() {
  const params = new URLSearchParams(window.location.search);
  const childId = params.get('child_id');

  if (!childId) {
    document.getElementById('screening-container').innerHTML =
      `<div class="alert alert-error show">No child selected.
       <a href="/dashboard.html">Go to dashboard</a></div>`;
    return;
  }

  try {
    currentChild = await apiFetch(`/children/${childId}`);
    const ageMonths = getAgeInMonths(currentChild.date_of_birth);
    const group = getAgeGroup(ageMonths);
    milestones = MILESTONES[group];
    renderScreening(ageMonths, group);
  } catch (err) {
    document.getElementById('screening-container').innerHTML =
      `<div class="alert alert-error show">${err.message}</div>`;
  }
}

function renderScreening(ageMonths, group) {
  const container = document.getElementById('screening-container');
  container.innerHTML = `
    <div class="page-header">
      <h1>Screening: ${currentChild.full_name}</h1>
      <p>Age: ${ageMonths} months · Age group: ${group} months · ${milestones.length} questions</p>
    </div>
    <div class="screening-progress">
      <div class="screening-progress-bar" id="progress-bar" style="width:0%"></div>
    </div>
    <p id="progress-text" style="font-size:13px;color:#6b7280;margin-bottom:20px;text-align:right">
      0 of ${milestones.length} answered
    </p>
    <div id="milestones-list">
      ${milestones.map((m, i) => `
        <div class="milestone-card" id="card-${i}">
          <div class="milestone-domain">${m.domain}</div>
          <div class="milestone-question">${m.question}</div>
          <div class="yn-buttons">
            <button class="yn-btn yes" onclick="setResponse(${i}, 1)">✓ Yes</button>
            <button class="yn-btn no"  onclick="setResponse(${i}, 0)">✗ No</button>
          </div>
        </div>`).join('')}
    </div>
    <div id="submit-area" style="display:none;margin-top:24px">
      <button class="btn btn-primary btn-full" id="submit-btn"
              onclick="submitScreening()">Submit screening →</button>
    </div>
    <div class="alert" id="submit-alert" style="margin-top:12px"></div>
  `;
}

function setResponse(index, value) {
  responses[index] = value;

  const card = document.getElementById(`card-${index}`);
  card.classList.add('answered');
  const buttons = card.querySelectorAll('.yn-btn');
  buttons.forEach(b => b.classList.remove('selected'));
  buttons[value === 1 ? 0 : 1].classList.add('selected');

  const answered = Object.keys(responses).length;
  const pct = Math.round((answered / milestones.length) * 100);
  document.getElementById('progress-bar').style.width = pct + '%';
  document.getElementById('progress-text').textContent =
    `${answered} of ${milestones.length} answered`;

  if (answered === milestones.length) {
    document.getElementById('submit-area').style.display = 'block';
  }
}

async function submitScreening() {
  const btn = document.getElementById('submit-btn');
  btn.disabled = true;
  btn.textContent = 'Submitting...';

  const responseArray = milestones.map((m, i) => ({
    milestone_id: m.id,
    domain: m.domain,
    response: responses[i]
  }));

  try {
    const result = await apiFetch('/screenings', {
      method: 'POST',
      body: JSON.stringify({
        child_id: currentChild.id,
        responses: responseArray
      })
    });
    sessionStorage.setItem('screening_result',
      JSON.stringify({ result, child: currentChild }));
    window.location.href = '/results.html';
  } catch (err) {
    const alert = document.getElementById('submit-alert');
    alert.textContent = err.message;
    alert.className = 'alert alert-error show';
    btn.disabled = false;
    btn.textContent = 'Submit screening →';
  }
}

initScreening();