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
    const comment = document.getElementById('comment');

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

    // 오늘 목표 textarea 편집 이벤트 (엔터 시 span으로 변환)
    comment.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            convertCommentTextareaToSpan(comment);
        }
    });
    comment.addEventListener('blur', e => {
        convertCommentTextareaToSpan(comment);
    });

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
        todoItem.style.position = 'relative';

        // 왼쪽: 체크박스 + editable span
        const left = document.createElement('div');
        left.style.display = 'flex';
        left.style.alignItems = 'center';
        left.style.gap = '8px';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = newId;

        const label = document.createElement('span');
        label.id = newId + '-label';
        label.classList.add('editable');
        label.textContent = text;
        label.style.cursor = 'pointer';
        label.addEventListener('dblclick', () => convertToInput(label));

        left.appendChild(checkbox);
        left.appendChild(label);

        // 오른쪽: 삭제 버튼 (세로 중앙 배치)
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

            // 전체 체크박스 개수 확인
            const allCheckboxes = planContainer.querySelectorAll('input[type="checkbox"]');
            if (allCheckboxes.length === 0) {
                // 계획이 하나도 없으면 모든 과목 블록 제거
                document.querySelectorAll('.subject-plan').forEach(block => block.remove());
            } else {
                // 현재 과목 블록 내 체크박스 개수 확인해서 0이면 과목 블록 제거
                const currentSubjectBlock = document.getElementById(`subject-${subject}`);
                if (currentSubjectBlock) {
                    const remainingCheckboxes = currentSubjectBlock.querySelectorAll('input[type="checkbox"]');
                    if (remainingCheckboxes.length === 0) {
                        currentSubjectBlock.remove();
                    }
                }
            }
        });

        todoItem.appendChild(left);
        todoItem.appendChild(removeBtn);
        list.appendChild(todoItem);
    }

    // span → input/textarea 변환
    function convertToInput(span) {
        let input;

        if (span.id === 'comment' || span.id === 'memo') {
            input = document.createElement('textarea');
            input.maxLength = 100;
            input.style.resize = 'none';
            input.style.height = '3rem';
            input.style.lineHeight = '1.5rem';
            input.style.fontSize = '1rem';
            input.style.maxWidth = '100%';
            input.style.wordBreak = 'break-word';
        } else {
            input = document.createElement('input');
            input.type = 'text';
        }

        input.value = span.textContent;
        if (span.id) input.id = span.id;
        span.classList.forEach(cls => input.classList.add(cls));

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                if (input.tagName.toLowerCase() !== 'textarea') {
                    e.preventDefault();
                    convertToSpan(input);
                }
            }
        });

        input.addEventListener('blur', () => {
            convertToSpan(input);
        });

        span.replaceWith(input);
        input.focus();
    }

    // input/textarea → span 변환
    function convertToSpan(input) {
        const value = input.value.trim();
        if (!value) {
            input.remove();
            return;
        }

        const span = document.createElement('span');
        span.textContent = value;

        if (input.id) span.id = input.id;
        input.classList.forEach(cls => span.classList.add(cls));
        span.classList.add('editable');

        span.style.cursor = 'pointer';
        span.addEventListener('dblclick', () => convertToInput(span));

        input.replaceWith(span);
    }

    // 오늘 목표 textarea → span 변환 함수
    function convertCommentTextareaToSpan(textarea) {
        const val = textarea.value.trim();
        if (!val) {
            textarea.value = '';
            return;
        }

        const span = document.createElement('span');
        span.className = textarea.className;
        span.id = textarea.id;
        span.textContent = val;
        span.classList.add('editable');
        span.style.cursor = 'pointer';

        span.addEventListener('dblclick', () => convertToInput(span));

        textarea.replaceWith(span);
    }

    // 기존 span.editable 요소에 더블클릭 이벤트 연결
    document.querySelectorAll('span.editable').forEach(span => {
        span.addEventListener('dblclick', () => convertToInput(span));
    });
});
