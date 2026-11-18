(() => {
  'use strict';
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const activate = (tab, focus = false) => {
    for (const item of tabs) {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
    }
    if (focus) tab.focus();
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); activate(tabs[next], true); }
    });
  });

  const inputs = [...document.querySelectorAll('.task-picker input[type="checkbox"]')];
  const count = document.getElementById('task-count');
  const label = document.getElementById('task-count-label');
  const save = document.getElementById('save-list');
  const status = document.getElementById('save-status');
  const selected = () => inputs.filter(input => input.checked).map(input => input.value);
  const update = () => {
    const length = selected().length;
    count.textContent = String(length);
    label.textContent = length === 1 ? 'задача выбрана' : length >= 2 && length <= 4 ? 'задачи выбрано' : 'задач выбрано';
    save.disabled = length === 0;
    status.textContent = '';
  };
  inputs.forEach(input => input.addEventListener('change', update));
  save.addEventListener('click', () => {
    const tasks = selected();
    if (!tasks.length) return;
    const text = 'Легко дома — мой список уборки\n\n' + tasks.map(task => '□ ' + task).join('\n') + '\n\nЭто личный список задач. Заявка в компанию не отправлялась.\n';
    const url = URL.createObjectURL(new Blob(['\uFEFF', text], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url; link.download = 'legko-doma-spisok-uborki.txt';
    document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent = 'Список сохранён в текстовый файл. Это не отправка заявки.';
  });
  update();
})();
