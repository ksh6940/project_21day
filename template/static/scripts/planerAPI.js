document.addEventListener("DOMContentLoaded", function () {
    const saveBtn = document.querySelector('.savebtn');

    if (saveBtn) {
        saveBtn.addEventListener('click', function () {
            const daySelect = document.getElementById('day-select');
            const selectedDay = daySelect?.value;

            if (!selectedDay) {
                console.log("일차를 선택해주세요!");
                return;
            }

            // 입력값 수집
            const musicTitle = getInputValue('.input-music-title');
            const musicArtist = getInputValue('.input-music-artist');
            const comment = getInputValue('.input-goal') || getInputValue('#comment');
            const studyHours = getInputValue('.input-time-hour');
            const studyMinutes = getInputValue('.input-time-minute');

            // 계획 수집
            const planItems = [];
            document.querySelectorAll('.todo-item').forEach(item => {
                const label = item.querySelector('label');
                const checkbox = item.querySelector('input[type="checkbox"]');
                const subjectBlock = item.closest('.subject-plan');
                let subject = '기타';

                if (subjectBlock) {
                    const id = subjectBlock.id || ''; // e.g., "subject-korean"
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
                music: {
                    title: musicTitle,
                    artist: musicArtist
                },
                comment: comment,
                studyTime: {
                    hours: studyHours,
                    minutes: studyMinutes
                },
                plans: planItems
            };

            fetch('/saveData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
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
                console.log('저장 중 오류가 발생했습니다.');
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
