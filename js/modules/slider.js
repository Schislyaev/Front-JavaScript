function slider() {
    const slider = document.querySelector('.offer__slider'),
    prev = document.querySelector('.offer__slider-prev'),
    next = document.querySelector('.offer__slider-next'),
    cur = slider.querySelector('#current'),
    total = slider.querySelector('#total'),
    offerSlides = slider.querySelectorAll('.offer__slide'),
    totalSlidesCnt = offerSlides.length,
    slidesWrapper = document.querySelector('.offer__slider-wrapper'),
    slidesField = document.querySelector('.offer__slider-inner'),
    width = window.getComputedStyle(slidesWrapper).width;

    let curCnt = 1;
    let offset = 0;

    slidesField.style.width = 100 * totalSlidesCnt + '%';
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';

    slidesWrapper.style.overflow = 'hidden';

    offerSlides.forEach(slide => {
        slide.style.width = width;
    });

    slider.style.position = 'relative';

    const indicators = document.createElement('ol'),
        dots = [];

    indicators.classList.add('carousel-indicators');
    indicators.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
    `;
    slider.append(indicators);

    function getZero1(n) {
        if(n >= 0 && n < 10) {
            return `0${n}`;
        }
        else {
            return n;
        }
    }

    for (let i = 0; i < totalSlidesCnt; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .5;
            transition: opacity .6s ease;
        `;
        if (i == 0) {
            dot.style.opacity = 1;
        }
        indicators.append(dot);
        dots.push(dot);
    }

    total.textContent = `${getZero1(totalSlidesCnt)}`;
    cur.textContent = '01';

    next.addEventListener('click', () => {
        if(offset == getNumberWithoutLetters(width) * (totalSlidesCnt - 1)){
            offset = 0;
            curCnt = 1;
        }
        else {
            offset += getNumberWithoutLetters(width);
            ++curCnt;
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        cur.textContent = getZero1(curCnt);
    
        dots.forEach(dot => dot.style.opacity = '.5');
        dots[curCnt - 1].style.opacity = 1;
    });

    prev.addEventListener('click', () => {
        if(offset == 0){
            offset = getNumberWithoutLetters(width) * (totalSlidesCnt - 1);
            curCnt = totalSlidesCnt;
        }
        else {
            offset -= getNumberWithoutLetters(width);
            --curCnt;
        }
        
        slidesField.style.transform = `translateX(-${offset}px)`;
        cur.textContent = getZero1(curCnt);

        dots.forEach(dot => dot.style.opacity = '.5');
        dots[curCnt - 1].style.opacity = 1;
    });

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to');

            curCnt = slideTo;
            offset = getNumberWithoutLetters(width) * (slideTo - 1);

            slidesField.style.transform = `translateX(-${offset}px)`;

            cur.textContent = getZero1(curCnt);

            dots.forEach(dot => dot.style.opacity = '.5');
            dots[curCnt - 1].style.opacity = 1;
        });
    })

    function getNumberWithoutLetters(s) {
        return +s.replace(/\D/g, '');
    }
}

export default slider;