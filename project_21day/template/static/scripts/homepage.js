document.addEventListener('DOMContentLoaded', () => {
    const totalPlans = 21;
    const completedDays = window.completed_days || [];
    const inProgressDays = window.in_progress_days || [];

    const completedCount = completedDays.length;
    const inProgressCount = inProgressDays.length;
    const remainingCount = totalPlans - completedCount - inProgressCount;
    const progressPercent = totalPlans > 0 ? Math.round((completedCount / totalPlans) * 100) : 0;

    const progressBar = document.getElementById('progress');
    if (progressBar) {
        progressBar.value = progressPercent;
        progressBar.max = 100;
    }

    const statsElem = document.querySelector('.stats');
    if (statsElem) {
        statsElem.innerHTML = `
            <p>총 목표 수: <strong>${totalPlans}개</strong></p>
            <p>완벽 달성 목표 수: <strong>${completedCount}개</strong></p>
            <p>진행 중 목표 수: <strong>${inProgressCount}개</strong></p>
            <p>남은 목표 수: <strong>${remainingCount}개</strong></p>
        `;
    }

    completedDays.forEach(dayNum => {
        const dayElem = document.querySelector(`.day[data-day="${dayNum}"]`);
        if (dayElem) {
            fetch(`/getStudyTime?day=${dayNum}`)
                .then(res => res.json())
                .then(data => {
                    const st = data.studyTime || { hours: '0', minutes: '0' };
                    dayElem.textContent = `${st.hours}시간 ${st.minutes}분 ✅`;
                    dayElem.title = '완벽 달성된 날';
                })
                .catch(err => console.error(`Failed to fetch study time for day ${dayNum}:`, err));
        }
    });

    inProgressDays.forEach(dayNum => {
        const dayElem = document.querySelector(`.day[data-day="${dayNum}"]`);
        if (dayElem) {
            fetch(`/getStudyTime?day=${dayNum}`)
                .then(res => res.json())
                .then(data => {
                    const st = data.studyTime || { hours: '0', minutes: '0' };
                    dayElem.textContent = `${st.hours}시간 ${st.minutes}분 🔄`;
                    dayElem.title = '진행 중인 날';
                })
                .catch(err => console.error(`Failed to fetch study time for day ${dayNum}:`, err));
        }
    });
});