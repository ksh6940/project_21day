document.addEventListener('DOMContentLoaded', () => {
    const planContainer = document.getElementById('plan-container');
    const daySelect = document.getElementById('day-select');
    const todaySpan = document.getElementById('today-date');

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
                const today = new Date();
                const yyyy = today.getFullYear();
                const mm = String(today.getMonth() + 1).padStart(2, '0');
                const dd = String(today.getDate()).padStart(2, '0');
                const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
                todaySpan.textContent = `${yyyy}년 ${mm}월 ${dd}일 ${dayNames[today.getDay()]}`;
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
                        window.addPlan(subject, content, !!plan.checked);
                    }
                });
            }
        } catch (e) {
            console.error('데이터 로드 오류:', e);
        }
    }

    // 초기 데이터 로드
    if (window.noteData && Object.keys(window.noteData).length > 0) {
        loadDataToInputs(window.noteData);
    } else {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
        todaySpan.textContent = `${yyyy}년 ${mm}월 ${dd}일 ${dayNames[today.getDay()]}`;
    }
});
