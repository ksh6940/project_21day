function calculateDday(targetDateStr) {
    const today = new Date();
    const targetDate = new Date(targetDateStr);
    targetDate.setHours(0, 0, 0, 0);

    const diff = targetDate - today;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `D-${days}`;
    else if (days === 0) return "D-DAY";
    else return `D+${Math.abs(days)}`;
}

function updateDdays() {
    const suneungDate = "2025-11-13";
    const septemberExamDate = "2025-09-03";

    document.getElementById("korean-sat").textContent = calculateDday(suneungDate);
    document.getElementById("september-sat").textContent = calculateDday(septemberExamDate);
}

window.addEventListener("DOMContentLoaded", updateDdays);