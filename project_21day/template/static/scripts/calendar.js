document.addEventListener("DOMContentLoaded", function () {
    const dayElements = document.querySelectorAll(".day");

    dayElements.forEach(function (dayEl) {
        dayEl.addEventListener("click", function () {
            const dayValue = this.getAttribute("data-day");

            fetch("/createNote", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ day: dayValue }),
            })
                .then(response => response.json())
                .then(data => {
                    // 서버에서 리턴한 URL로 이동
                    window.location.href = data.redirect_url;
                })
                .catch(error => {
                    console.error("Error:", error);
                });
        });
    });
});
