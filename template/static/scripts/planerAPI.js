document.addEventListener("DOMContentLoaded", function () {
    const saveBtn = document.querySelector('.savebtn');

    if (saveBtn) {
        saveBtn.addEventListener('click', function () {
            const daySelect = document.getElementById('day-select');
            const selectedDay = daySelect?.value;

            if (!selectedDay) {
<<<<<<< HEAD
                alert("일차를 선택해주세요!");
                return;
            }

            // 오늘 날짜 계산 (YYYY-MM-DD)
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            const dateStr = `${yyyy}-${mm}-${dd}`;

            // 입력값 수집
            const musicTitle = getInputValue('.input-music-title');
            const musicArtist = getInputValue('.input-music-artist');
            const memo = getInputValue('.input-goal') || getInputValue('#comment');
=======
                console.log("일차를 선택해주세요!");
                return;
            }

            // 입력값 수집
            const musicTitle = getInputValue('.input-music-title');
            const musicArtist = getInputValue('.input-music-artist');
            const comment = getInputValue('.input-goal') || getInputValue('#comment');
>>>>>>> 99db3c703f14bffa6d41302cc5539f4f850b2fc5
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
<<<<<<< HEAD
                date: dateStr,   // 여기 date 추가
=======
>>>>>>> 99db3c703f14bffa6d41302cc5539f4f850b2fc5
                music: {
                    title: musicTitle,
                    artist: musicArtist
                },
<<<<<<< HEAD
                memo: memo,
=======
                comment: comment,
>>>>>>> 99db3c703f14bffa6d41302cc5539f4f850b2fc5
                studyTime: {
                    hours: studyHours,
                    minutes: studyMinutes
                },
                plans: planItems
            };

            fetch('/saveData', {
                method: 'POST',
<<<<<<< HEAD
                headers: { 'Content-Type': 'application/json' },
=======
                headers: {
                    'Content-Type': 'application/json'
                },
>>>>>>> 99db3c703f14bffa6d41302cc5539f4f850b2fc5
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
<<<<<<< HEAD
                alert('저장 중 오류가 발생했습니다.');
=======
                console.log('저장 중 오류가 발생했습니다.');
>>>>>>> 99db3c703f14bffa6d41302cc5539f4f850b2fc5
            });
        });
    }

<<<<<<< HEAD
    // span 또는 input 둘 다 값 읽기
=======
>>>>>>> 99db3c703f14bffa6d41302cc5539f4f850b2fc5
    function getInputValue(selector) {
        const span = document.querySelector(`span${selector}`);
        if (span) return span.textContent.trim();

        const elem = document.querySelector(selector);
        if (elem) {
            if ('value' in elem) return elem.value.trim();
            else return elem.textContent.trim();
        }
<<<<<<< HEAD
=======

>>>>>>> 99db3c703f14bffa6d41302cc5539f4f850b2fc5
        return '';
    }
});
