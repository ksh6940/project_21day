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
    const todaySpan = document.getElementById('today-date');

    // 날짜 표시
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const dayName = dayNames[today.getDay()];
    if (todaySpan) {
        todaySpan.textContent = `${yyyy}년 ${mm}월 ${dd}일 ${dayName}`;
    }

    // 계획 추가
    planInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const subject = subjectSelect.value;
            const text = planInput.value.trim();
            if (!text) return;

            addPlan(subject, text);
            planInput.value = '';
        }
    });

    function addPlan(subject, text) {
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

        // 왼쪽: 체크박스 + 라벨
        const left = document.createElement('div');
        left.style.display = 'flex';
        left.style.alignItems = 'center';
        left.style.gap = '8px';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = newId;

        const label = document.createElement('label');
        label.htmlFor = newId;
        label.textContent = text;

        left.appendChild(checkbox);
        left.appendChild(label);

        // 오른쪽: 삭제 버튼
        const removeBtn = document.createElement('button');
        removeBtn.innerHTML = '✕';
        removeBtn.title = '삭제';
        removeBtn.style.border = 'none';
        removeBtn.style.background = 'transparent';
        removeBtn.style.color = 'red';
        removeBtn.style.cursor = 'pointer';
        removeBtn.style.fontSize = '1rem';

        removeBtn.addEventListener('click', () => {
            todoItem.remove();
        });

        todoItem.appendChild(left);
        todoItem.appendChild(removeBtn);
        list.appendChild(todoItem);
    }

    // 더블클릭 시 편집 가능한 input/textarea로 전환
    function convertToInput(span) {
        let input;
        if (span.id === 'memo') {
            input = document.createElement('textarea');
            input.style.resize = 'none';
            input.style.height = '3rem';
            input.style.lineHeight = '1.5rem';
            input.style.fontSize = '1rem';
            input.style.maxWidth = '100%';
        } else {
            input = document.createElement('input');
            input.type = 'text';
        }

        input.value = span.textContent;
        input.id = span.id;
        span.classList.forEach(cls => input.classList.add(cls));

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                convertToSpan(input);
            }
        });

        span.replaceWith(input);
        input.focus();
    }

    function convertToSpan(input) {
        const span = document.createElement('span');
        span.textContent = input.value;
        span.id = input.id;
        input.classList.forEach(cls => span.classList.add(cls));

        span.addEventListener('dblclick', () => {
            convertToInput(span);
        });

        input.replaceWith(span);
    }

    // 기존 editable span에 더블클릭 이벤트 연결
    document.querySelectorAll('span.editable').forEach(span => {
        span.addEventListener('dblclick', () => {
            convertToInput(span);
        });
    });
});
