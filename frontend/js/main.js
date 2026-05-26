import { explainTopic, fetchHistory, fetchSession } from './api.js';
import { renderStudyContent, formatDate } from './render.js';

const form = document.getElementById('study-form');
const topicInput = document.getElementById('topic');
const levelSelect = document.getElementById('level');
const focusSelect = document.getElementById('focus');
const submitBtn = document.getElementById('submit-btn');
const statusEl = document.getElementById('status');
const resultsEl = document.getElementById('results');
const historyToggle = document.getElementById('history-toggle');
const historyClose = document.getElementById('history-close');
const historyPanel = document.getElementById('history-panel');
const historyList = document.getElementById('history-list');
const historyEmpty = document.getElementById('history-empty');

function setStatus(message, type = 'loading') {
  statusEl.hidden = false;
  statusEl.textContent = message;
  statusEl.className = `status status--${type}`;
}

function clearStatus() {
  statusEl.hidden = true;
  statusEl.textContent = '';
  statusEl.className = 'status';
}

function setLoading(loading) {
  submitBtn.disabled = loading;
  topicInput.disabled = loading;
  levelSelect.disabled = loading;
  focusSelect.disabled = loading;
  submitBtn.textContent = loading ? 'Generating…' : 'Generate study guide';
}

function showResults(data) {
  renderStudyContent(resultsEl, data);
  resultsEl.hidden = false;
  resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function openHistory() {
  historyPanel.hidden = false;
  historyToggle.setAttribute('aria-expanded', 'true');
  loadHistory();
}

function closeHistory() {
  historyPanel.hidden = true;
  historyToggle.setAttribute('aria-expanded', 'false');
}

async function loadHistory() {
  historyList.innerHTML = '';
  historyEmpty.hidden = true;

  try {
    const { data: sessions } = await fetchHistory();

    if (!sessions?.length) {
      historyEmpty.hidden = false;
      return;
    }

    sessions.forEach((session) => {
      const li = document.createElement('li');
      li.className = 'history-item';

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'history-item__btn';

      const topicSpan = document.createElement('span');
      topicSpan.className = 'history-item__topic';
      topicSpan.textContent = session.topic;

      const metaSpan = document.createElement('span');
      metaSpan.className = 'history-item__meta';
      metaSpan.textContent = `${session.level} · ${formatDate(session.createdAt)}`;

      btn.append(topicSpan, metaSpan);

      btn.addEventListener('click', () => loadSession(session.id));
      li.appendChild(btn);
      historyList.appendChild(li);
    });
  } catch (err) {
    historyEmpty.textContent = err.message ?? 'Could not load history';
    historyEmpty.hidden = false;
  }
}

async function loadSession(id) {
  setLoading(true);
  setStatus('Loading saved session…', 'loading');
  closeHistory();

  try {
    const { data } = await fetchSession(id);
    clearStatus();
    showResults(data.content);
    topicInput.value = data.topic ?? '';
    if (data.level) levelSelect.value = data.level;
    if (data.focus) focusSelect.value = data.focus;
  } catch (err) {
    setStatus(err.message ?? 'Failed to load session', 'error');
    resultsEl.hidden = true;
  } finally {
    setLoading(false);
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const topic = topicInput.value.trim();
  if (topic.length < 3) return;

  setLoading(true);
  resultsEl.hidden = true;
  setStatus('Generating your study guide. This may take a moment…', 'loading');

  try {
    const { data } = await explainTopic({
      topic,
      level: levelSelect.value,
      focus: focusSelect.value,
    });

    clearStatus();
    showResults(data);
  } catch (err) {
    setStatus(err.message ?? 'Something went wrong', 'error');
    resultsEl.hidden = true;
  } finally {
    setLoading(false);
  }
});

historyToggle.addEventListener('click', () => {
  if (historyPanel.hidden) {
    openHistory();
  } else {
    closeHistory();
  }
});

historyClose.addEventListener('click', closeHistory);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !historyPanel.hidden) {
    closeHistory();
  }
});
