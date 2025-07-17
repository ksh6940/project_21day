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
    const daySelect = document.getElementById('day-select');

    // 날짜 표시
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    todaySpan.textContent = `${yyyy}년 ${mm}월 ${dd}일 ${dayNames[today.getDay()]}`;

    // day-select 초기값 셋팅
    if (window.currentDay && daySelect) {
        daySelect.value = window.currentDay;
    }

    // 저장된 데이터 읽어서 UI에 표시
    function loadDataToInputs(data) {
        try {
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
                    const content = plan.content || plan.text || '';
                    if (content) {
                        addPlan(subject, content, !!plan.checked);
                    }
                });
            }
        } catch (e) {
            console.error('데이터 로드 오류:', e);
        }
    }

    // 공부 계획 추가 함수 (저장할 때 쓰는 것과 동일 디자인)
    function addPlan(subject, text, checked = false) {
        const listId = `${subject}-list`;
        let list = document.getElementById(listId);

        if (!list) {
            const subjectBlock = document.createElement('div');
            subjectBlock.classList.add('subject-plan');
            subjectBlock.id = `subject-${subject}`;

            const h4 = document.createElement('h4');
            h4.textContent = `# ${subjectMap[subject] || subject}`;
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

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = newId;

        // ✅ 체크 여부 반영
        checkbox.checked = checked;

        const label = document.createElement('label');
        label.htmlFor = newId;
        label.textContent = text;

        todoItem.appendChild(checkbox);
        todoItem.appendChild(label);
        list.appendChild(todoItem);
    }

    // 계획 입력 엔터 이벤트
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

    // 저장 버튼 클릭 이벤트
    const saveBtn = document.querySelector('.savebtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const selectedDay = daySelect.value;

            if (!selectedDay) {
                console.log('저장할 일차를 선택해주세요.');
                return;
            }

            const musicTitle = document.querySelector('.input-music-title')?.value.trim() || '';
            const musicArtist = document.querySelector('.input-music-artist')?.value.trim() || '';
            const comment = document.getElementById('comment')?.value.trim() || '';
            const studyHours = document.querySelector('.input-time-hour')?.value.trim() || '';
            const studyMinutes = document.querySelector('.input-time-minute')?.value.trim() || '';

            // 계획 정보 수집
            const planItems = [];
            document.querySelectorAll('.todo-item').forEach(item => {
                const label = item.querySelector('label');
                const checkbox = item.querySelector('input[type="checkbox"]');
                const subjectId = item.closest('.subject-plan')?.id || 'subject-기타';
                const subject = subjectId.replace('subject-', '') || '기타';

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
                music: {
                    title: musicTitle,
                    artist: musicArtist
                },
                memo: comment,
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
            }).then(async res => {
                try {
                    if (res.status === 204) {
                        console.log('저장 성공!');
                        return;
                    }
                    const text = await res.text();
                    let json;
                    try {
                        json = JSON.parse(text);
                    } catch {
                        json = null;
                    }
                    if (!res.ok) {
                        throw new Error(json?.message || `HTTP ${res.status} - ${text}`);
                    }
                    console.log(json?.message || '저장 성공!');
                } catch (err) {
                    console.log('저장 실패:', err.message);
                    console.error('저장 실패 사유:', err);
                }
            });
        });
    }

    // 초기 데이터 로드
    if (window.noteData && Object.keys(window.noteData).length > 0) {
        loadDataToInputs(window.noteData);
    }
});
