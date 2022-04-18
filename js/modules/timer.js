function timer(id, deadline) {


    function getTimeRemaining(d) {
        const deadDate = Date.parse(d),
            t = deadDate - Date.parse(new Date()),
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor(t / (1000 * 60 * 60) % 24),
            minutes = Math.floor(t / (1000 * 60) % 60), 
            seconds = Math.floor(t / 1000 % 60); 

        return {
            t,
            days,
            hours,
            minutes,
            seconds
        };
    }

    function getZero(n) {
        if(n >= 0 && n < 10) {
            return `0${n}`;
        }
        else {
            return n;
        }
    }

    function setClock(selector, d) {

        const timer = document.querySelector(selector),
            day = timer.querySelector('#days'),
            hour = timer.querySelector('#hours'),
            minute = timer.querySelector('#minutes'),
            second = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);


        function updateClock() {
            const t = getTimeRemaining(d);

            day.innerHTML = getZero(t.days);
            hour.innerHTML = getZero(t.hours);
            minute.innerHTML = getZero(t.minutes);
            second.innerHTML = getZero(t.seconds);

            if(t.t <= 0) {
                clearInterval(timeInterval);
            }

        }
    }

    setClock(id, deadline);
}

export default timer;