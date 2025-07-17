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
    const day = dayNames[today.getDay()];
    todaySpan.textContent = `${yyyy}년 ${mm}월 ${dd}일 ${day}`;

    // 계획 추가 기능
    planInput.addEventListener('keydown', (e) => {
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
            subjectBlock.classList.add('subject-plan');
            subjectBlock.id = `subject-${subject}`;

            const h4 = document.createElement('h4');
            h4.textContent = `# ${subjectMap[subject]}`;
            subjectBlock.appendChild(h4);

            list = document.createElement('div');
            list.classList.add('todo-list');
            list.id = listId;
            subjectBlock.appendChild(list);

            planContainer.appendChild(subjectBlock);
        }

        const newId = `${subject}-${Date.now()}`;
        const todoItem = document.createElement('div');
        todoItem.className = 'todo-item';
        todoItem.style.display = 'flex';
        todoItem.style.alignItems = 'center';
        todoItem.style.justifyContent = 'space-between';

        // 왼쪽 영역: 체크박스 + 라벨
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

        // 오른쪽 영역: X 버튼
        const removeBtn = document.createElement('button');
        removeBtn.textContent = '✕';
        removeBtn.style.border = 'none';
        removeBtn.style.background = 'transparent';
        removeBtn.style.color = 'red';
        removeBtn.style.cursor = 'pointer';
        removeBtn.style.fontSize = '1rem';
        removeBtn.title = '삭제';

        removeBtn.addEventListener('click', () => {
            todoItem.remove();
        });

        todoItem.appendChild(left);
        todoItem.appendChild(removeBtn);
        list.appendChild(todoItem);
    }


    // span → input/textarea (더블클릭 시 복원)
    function convertToInput(span) {
        let input;
        if (span.id === 'comment') {
            input = document.createElement('textarea');
            input.id = 'comment';
            input.maxLength = 100;
            input.style.resize = 'none';
            input.style.height = '3rem';
            input.style.lineHeight = '1.5rem';
            input.style.fontSize = '1rem';
            input.style.maxWidth = '100%';
        } else {
            input = document.createElement('input');
            input.type = 'text';
        }

        // ✅ span에 있던 class 유지
        span.classList.forEach(cls => input.classList.add(cls));

        input.value = span.textContent;

        input.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                convertToSpan(input);
            }
        });

        span.replaceWith(input);
        input.focus();
    }

    // Enter 시 → span 변환
    document.querySelectorAll('input[type="text"], textarea').forEach(input => {
        input.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                convertToSpan(input);
            }
        });
    });
});
