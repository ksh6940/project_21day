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
    const daySelect = document.getElementById('day-select');
    const todaySpan = document.getElementById('today-date');
    const saveBtn = document.querySelector('.savebtn');

    // =================================================================
    // 초기화 및 데이터 로딩
    // =================================================================

    // day-select 초기값 셋팅
    if (window.currentDay && daySelect) {
        daySelect.value = window.currentDay;
    }

    // 저장된 데이터 읽어서 UI에 표시
    function loadDataToInputs(data) {
        try {
            // 날짜 표시
            if (data.date) {
                const date = new Date(data.date);
                const yyyy = date.getFullYear();
                const mm = String(date.getMonth() + 1).padStart(2, '0');
                const dd = String(date.getDate()).padStart(2, '0');
                const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
                todaySpan.textContent = `${yyyy}년 ${mm}월 ${dd}일 ${dayNames[date.getDay()]}`;
            } else {
                setDefaultDate();
            }

            // 음악 정보
            if (data.music) {
                const musicTitle = document.querySelector('.input-music-title');
                const musicArtist = document.querySelector('.input-music-artist');
                if (musicTitle && data.music.title) musicTitle.value = data.music.title;
                if (musicArtist && data.music.artist) musicArtist.value = data.music.artist;
            }

            // 오늘의 목표
            if (data.memo) {
                const goalInput = document.getElementById('comment');
                if (goalInput) goalInput.value = data.memo;
            }

            // 공부 시간
            if (data.studyTime) {
                const hourInput = document.querySelector('.input-time-hour');
                const minuteInput = document.querySelector('.input-time-minute');
                if (hourInput && data.studyTime.hours !== undefined) hourInput.value = data.studyTime.hours;
                if (minuteInput && data.studyTime.minutes !== undefined) minuteInput.value = data.studyTime.minutes;
            }

            // 공부 계획 불러오기
            if (data.plans && Array.isArray(data.plans)) {
                planContainer.innerHTML = ''; // 초기화
                data.plans.forEach(plan => {
                    const subject = plan.subject || '기타';
                    const content = plan.text || '';
                    if (content) {
                        addPlan(subject, content, !!plan.checked);
                    }
                });
            }
        } catch (e) {
            console.error('데이터 로드 오류:', e);
        }
    }

    function setDefaultDate() {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
        todaySpan.textContent = `${yyyy}년 ${mm}월 ${dd}일 ${dayNames[today.getDay()]}`;
    }

    // 초기 데이터 로드
    if (window.noteData && Object.keys(window.noteData).length > 0) {
        loadDataToInputs(window.noteData);
    } else {
        setDefaultDate();
    }

    // =================================================================
    // 계획 추가 및 삭제
    // =================================================================

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

    // =================================================================
    // 데이터 저장
    // =================================================================

    if (saveBtn) {
        saveBtn.addEventListener('click', function () {
            saveBtn.disabled = true;
            const selectedDay = daySelect?.value;

            if (!selectedDay) {
                alert("일차를 선택해주세요!");
                saveBtn.disabled = false;
                return;
            }

            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            const dateStr = `${yyyy}-${mm}-${dd}`;

            const musicTitle = getInputValue('.input-music-title');
            const musicArtist = getInputValue('.input-music-artist');
            const memo = getInputValue('.input-goal') || getInputValue('#comment');
            const studyHours = getInputValue('.input-time-hour');
            const studyMinutes = getInputValue('.input-time-minute');

            const planItems = [];
            document.querySelectorAll('.todo-item').forEach(item => {
                const label = item.querySelector('span.editable');
                const checkbox = item.querySelector('input[type="checkbox"]');
                const subjectBlock = item.closest('.subject-plan');
                let subject = '기타';

                if (subjectBlock) {
                    const id = subjectBlock.id || '';
                    subject = id.replace('subject-', '') || '기타';
                }

                if (label && checkbox) {
                    planItems.push({
                        subject: subject,
                        text: label.textContent.trim(),
                        checked: checkbox.checked
                    });
                }
            });

            const data = {
                day: selectedDay,
                date: dateStr,
                music: {
                    title: musicTitle,
                    artist: musicArtist
                },
                memo: memo,
                studyTime: {
                    hours: studyHours,
                    minutes: studyMinutes
                },
                plans: planItems
            };

            fetch('/saveData', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return response.json();
            })
            .then(result => {
                console.log('✅ 저장 성공!');
                window.location.href = '/';
            })
            .catch(error => {
                console.error('❌ 저장 실패:', error);
                alert('저장 중 오류가 발생했습니다.');
            })
            .finally(() => {
                saveBtn.disabled = false;
            });
        });
    }

    function getInputValue(selector) {
        const span = document.querySelector(`span${selector}`);
        if (span) return span.textContent.trim();

        const elem = document.querySelector(selector);
        if (elem) {
            if ('value' in elem) return elem.value.trim();
            else return elem.textContent.trim();
        }
        return '';
    }
});