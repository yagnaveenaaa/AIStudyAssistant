function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function renderList(items) {
  if (!items?.length) return '';
  return `<ul class="list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

function renderSections(sections) {
  if (!sections?.length) return '';
  return sections
    .map(
      (s) => `
    <div class="section-block">
      <h3 class="section-block__title">${escapeHtml(s.title)}</h3>
      <p class="section-block__content">${escapeHtml(s.content)}</p>
      ${
        s.highlights?.length
          ? `<ul class="highlights">${s.highlights.map((h) => `<li class="highlight-tag">${escapeHtml(h)}</li>`).join('')}</ul>`
          : ''
      }
    </div>`
    )
    .join('');
}

function renderExamples(examples) {
  if (!examples?.length) return '';
  return examples
    .map(
      (ex) => `
    <div class="example">
      <p class="example__title">${escapeHtml(ex.title)}</p>
      <p class="example__desc">${escapeHtml(ex.description)}</p>
    </div>`
    )
    .join('');
}

function renderQuiz(quizPrep) {
  if (!quizPrep) return '';

  const focusHtml = quizPrep.focusAreas?.length
    ? `<ul class="quiz-focus">${quizPrep.focusAreas.map((f) => `<li>${escapeHtml(f)}</li>`).join('')}</ul>`
    : '';

  const questionsHtml = (quizPrep.sampleQuestions ?? [])
    .map(
      (q, i) => `
    <div class="quiz-question">
      <p class="quiz-question__q">${i + 1}. ${escapeHtml(q.question)}</p>
      ${q.hint ? `<p class="quiz-question__hint">Hint: ${escapeHtml(q.hint)}</p>` : ''}
      <p class="quiz-question__answer" id="answer-${i}" hidden>${escapeHtml(q.answer)}</p>
      <button type="button" class="reveal-btn" data-target="answer-${i}">Show answer</button>
    </div>`
    )
    .join('');

  return focusHtml + questionsHtml;
}

function renderGlossary(glossary) {
  if (!glossary?.length) return '';
  return `
    <div class="glossary">
      ${glossary
        .map(
          (g) => `
        <div class="glossary__item">
          <span class="glossary__term">${escapeHtml(g.term)}</span>
          <p class="glossary__def">${escapeHtml(g.definition)}</p>
        </div>`
        )
        .join('')}
    </div>`;
}

export function renderStudyContent(container, data) {
  const topic = data.topic ?? 'Study guide';

  container.innerHTML = `
    <section class="card">
      <h2 class="card__topic">${escapeHtml(topic)}</h2>
      <h3 class="card__title">Summary</h3>
      <p class="card__text">${escapeHtml(data.summary ?? '')}</p>
    </section>

    <section class="card">
      <h3 class="card__title">Key points</h3>
      ${renderList(data.keyPoints)}
    </section>

    <section class="card">
      <h3 class="card__title">Explanation</h3>
      ${renderSections(data.sections)}
    </section>

    <section class="card">
      <h3 class="card__title">Examples</h3>
      ${renderExamples(data.examples)}
    </section>

    <section class="card">
      <h3 class="card__title">Quiz prep</h3>
      ${renderQuiz(data.quizPrep)}
    </section>

    ${
      data.glossary?.length
        ? `<section class="card">
      <h3 class="card__title">Glossary</h3>
      ${renderGlossary(data.glossary)}
    </section>`
        : ''
    }
  `;

  container.querySelectorAll('.reveal-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = container.querySelector(`#${btn.dataset.target}`);
      if (target) {
        target.hidden = false;
        btn.hidden = true;
      }
    });
  });
}

export function formatDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return iso;
  }
}
