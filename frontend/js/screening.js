requireAuth();

// STED milestone questions mapped by age range in months
const MILESTONES = {
  '0-6': [
    { id: 'M_0_1', domain: 'Motor', question: 'Does the child lift their head when placed on their stomach?' },
    { id: 'M_0_2', domain: 'Social', question: 'Does the child make eye contact with familiar faces?' },
    { id: 'M_0_3', domain: 'Communication', question: 'Does the child respond to sounds or voices by turning their head?' }
  ],
  '7-12': [
    { id: 'M_7_1', domain: 'Motor', question: 'Can the child sit without support for at least a few seconds?' },
    { id: 'M_7_2', domain: 'Social', question: 'Does the child smile or laugh in response to others?' },
    { id: 'M_7_3', domain: 'Communication', question: 'Does the child babble or make sounds like "ba", "ma", "da"?' },
    { id: 'M_7_4', domain: 'Cognitive', question: 'Does the child look for an object that has been hidden?' }
  ],
  '13-24': [
    { id: 'M_13_1', domain: 'Motor', question: 'Can the child walk independently without holding on to anything?' },
    { id: 'M_13_2', domain: 'Social', question: 'Does the child point at objects or pictures to show interest?' },
    { id: 'M_13_3', domain: 'Communication', question: 'Does the child say at least 3 recognizable words?' },
    { id: 'M_13_4', domain: 'Cognitive', question: 'Does the child imitate simple actions such as clapping or waving?' },
    { id: 'M_13_5', domain: 'Social', question: 'Does the child show concern when others are upset or crying?' }
  ],
  '25-36': [
    { id: 'M_25_1', domain: 'Motor', question: 'Can the child run and climb stairs with support?' },
    { id: 'M_25_2', domain: 'Communication', question: 'Does the child use 2-word phrases such as "more milk" or "go out"?' },
    { id: 'M_25_3', domain: 'Social', question: 'Does the child play alongside other children, even without interacting directly?' },
    { id: 'M_25_4', domain: 'Cognitive', question: 'Can the child sort objects by shape or colour?' },
    { id: 'M_25_5', domain: 'Communication', question: 'Does the child follow simple 2-step instructions?' }
  ],
  '37-60': [
    { id: 'M_37_1', domain: 'Motor', question: 'Can the child hop on one foot or catch a large ball?' },
    { id: 'M_37_2', domain: 'Communication', question: 'Can the child tell a short story using sentences of 4 or more words?' },
    { id: 'M_37_3', domain: 'Social', question: 'Does the child take turns and play cooperatively with other children?' },
    { id: 'M_37_4', domain: 'Cognitive', question: 'Can the child identify and name basic colours and shapes?' },
    { id: 'M_37_5', domain: 'Cognitive', question: 'Does the child understand concepts like bigger, smaller, more, less?' }
  ],
  '61-72': [
    { id: 'M_61_1', domain: 'Motor', question: 'Can the child draw simple shapes like circles or crosses?' },
    { id: 'M_61_2', domain: 'Communication', question: 'Does the child speak clearly enough for strangers to understand most of what they say?' },
    { id: 'M_61_3', domain: 'Social', question: 'Does the child have at least one consistent friend they regularly play with?' },
    { id: 'M_61_4', domain: 'Cognitive', question: 'Can the child count to 10 or beyond?' },
    { id: 'M_61_5', domain: 'Cognitive', question: 'Can the child follow 3-step instructions without reminders?' }
  ]
};

function getAgeGroup(months) {
  if (months <= 6) return '0-6';
  if (months <= 12) return '7-12';
  if (months <= 24) return '13-24';
  if (months <= 36) return '25-36';
  if (months <= 60) return '37-60';
  return '61-72';
}

function getAgeInMonths(dob) {
  return Math.floor((Date.now() - new Date(dob)) / (1000 * 60 * 60 * 24 * 30));
}

// State
let currentChild = null;
let milestones = [];
let responses = {};

async function initScreening() {
  const params = new URLSearchParams(window.location.search);
  const childId = params.get('child_id');

  if (!childId) {
    document.getElementById('screening-container').innerHTML =
      `<div class="alert alert-error show">No child selected. <a href="/dashboard.html">Go to dashboard</a></div>`;
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
      <p>Age: ${ageMonths} months · Age group: ${group} months</p>
    </div>

    <div class="screening-progress">
      <div class="screening-progress-bar" id="progress-bar" style="width:0%"></div>
    </div>
    <p id="progress-text" style="font-size:13px;color:#6b7280;margin-bottom:20px;text-align:right">0 of ${milestones.length} answered</p>

    <div id="milestones-list">
      ${milestones.map((m, i) => `
        <div class="milestone-card" id="card-${i}">
          <div class="milestone-domain">${m.domain}</div>
          <div class="milestone-question">${m.question}</div>
          <div class="yn-buttons">
            <button class="yn-btn yes" onclick="setResponse(${i}, 1)">✓ Yes</button>
            <button class="yn-btn no" onclick="setResponse(${i}, 0)">✗ No</button>
          </div>
        </div>
      `).join('')}
    </div>

    <div id="submit-area" style="display:none;margin-top:24px">
      <button class="btn btn-primary btn-full" id="submit-btn" onclick="submitScreening()">Submit screening →</button>
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
  document.getElementById('progress-text').textContent = `${answered} of ${milestones.length} answered`;

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
    // Store result and go to results page
    sessionStorage.setItem('screening_result', JSON.stringify({
      result,
      child: currentChild
    }));
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