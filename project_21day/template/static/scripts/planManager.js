document.addEventListener('DOMContentLoaded', () => {
    const subjectMap = {
        korean: '국어',
        math: '수학',
        english: '영어',
        science: '탐구'
    };

    const planInput = document.getElementById('plan-input');
    const subjectSelect = document.getElementById('subject-select');
    const planContainer = document.getElementById('plan-container');

    // 계획 추가: Enter 입력 시 추가
    planInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const subject = subjectSelect.value;
            const text = planInput.value.trim();
            if (!text) return;

            addPlan(subject, text);
            planInput.value = '';
        }
    });

    // 계획 추가 함수
    function addPlan(subject, text, checked = false) {
        const listId = `${subject}-list`;
        let list = document.getElementById(listId);

        if (!list) {
            const subjectBlock = document.createElement('div');
            subjectBlock.className = 'subject-plan';
            subjectBlock.id = `subject-${subject}`;

            const h4 = document.createElement('h4');
            h4.textContent = `# ${subjectMap[subject]}`;
            subjectBlock.appendChild(h4);

            list = document.createElement('div');
            list.className = 'todo-list';
            list.id = listId;
            subjectBlock.appendChild(list);

            planContainer.appendChild(subjectBlock);
        }

        const newId = `${subject}-${Date.now()}`;
        const todoItem = document.createElement('div');
        todoItem.className = 'todo-item';
        todoItem.style.display = 'flex';
        todoItem.style.justifyContent = 'space-between';
        todoItem.style.alignItems = 'center';
        todoItem.style.position = 'relative';

        const left = document.createElement('div');
        left.style.display = 'flex';
        left.style.alignItems = 'center';
        left.style.gap = '8px';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = newId;
        checkbox.checked = checked;

        const label = document.createElement('span');
        label.id = newId + '-label';
        label.classList.add('editable');
        label.textContent = text;
        label.style.cursor = 'pointer';

        left.appendChild(checkbox);
        left.appendChild(label);

        const removeBtn = document.createElement('button');
        removeBtn.textContent = '✕';
        removeBtn.title = '삭제';
        removeBtn.style.border = 'none';
        removeBtn.style.background = 'transparent';
        removeBtn.style.color = 'red';
        removeBtn.style.cursor = 'pointer';
        removeBtn.style.fontSize = '1.2rem';
        removeBtn.style.alignSelf = 'center';

        removeBtn.addEventListener('click', () => {
            todoItem.remove();
            if (list.children.length === 0) {
                list.parentElement.remove();
            }
        });

        todoItem.appendChild(left);
        todoItem.appendChild(removeBtn);
        list.appendChild(todoItem);
    }

    window.addPlan = addPlan;
});
