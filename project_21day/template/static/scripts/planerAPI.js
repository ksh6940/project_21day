document.addEventListener("DOMContentLoaded", function () {
    const saveBtn = document.querySelector('.savebtn');

    if (saveBtn) {
        saveBtn.addEventListener('click', function () {
            saveBtn.disabled = true;
            const daySelect = document.getElementById('day-select');
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
