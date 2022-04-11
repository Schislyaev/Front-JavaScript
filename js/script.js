window.addEventListener('DOMContentLoaded', () => {

    // tabs
    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items'); 
          
    function hideTabsContent() {
        tabsContent.forEach(tab => {
            tab.style.display = 'none';
        });

        tabs.forEach(tab => {
            tab.classList.remove('tabheader__item_active');
        });
           
    }

    function showTabContent(i = 0) {
       tabsContent[i].style.display = 'block'; 
       tabs[i].classList.add('tabheader__item_active');
    }

    hideTabsContent();
    showTabContent();

    tabsParent.addEventListener('click', (e) => {
        const target = e.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((tab, i) => {
                if (target == tab) {
                    hideTabsContent();
                    showTabContent(i);    
                }
            });
        }
    });

    // Timer

    const deadline = '2022-02-10';

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

    setClock('.timer', deadline);

    //Modal

    //function getModal(tag) {
    
    const btns = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal');

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(setTimerId);
    }

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    btns.forEach((btn) => {
        btn.addEventListener('click', openModal);
    });

    // btnClose.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if(e.target === modal || e.target.getAttribute('data-close') == '') {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
    
    const setTimerId = setInterval(openModal, 50000);
    
    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    // Используем классы для карточек

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.parent = document.querySelector(parentSelector);
        }

        render() {
            const element = document.createElement('div');
            element.innerHTML = `
                <div class="menu__item">
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>
                </div>
            `;
            this.parent.append(element);
        }
    }

    const getResource = async (url) => {
        const res = await fetch(url);

        if(!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    };

    // getResource('http://localhost:3000/menu')
    //     .then(data => {
    //         data.forEach(({img, altimg, title, descr, price}) => {
    //             new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
    //         });
    //     });

    

    axios.get('http://localhost:3000/menu')
        .then(data => {
            data.data.forEach(({img, altimg, title, descr, price}) => {
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
            });
        });

    // form

    const forms = document.querySelectorAll('form');

    const message  = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо - свяжемся',
        failure: 'Что-то не так'
    };

    forms.forEach(form => {
        bindPostData(form);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        return await res.json();
    };
    
    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            //form.append(statusMessage);
            form.insertAdjacentElement('afterend', statusMessage);


            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));
            
            // object = {};
            // formData.forEach(function(value, key){
            //     object[key] = value;
            // });

            
            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            }).catch(() => {
                showThanksModal(message.failure);
            }).finally(() => {
                form.reset();
            });

            // request.addEventListener('load', () => {
            //     if (request.status === 200) {
            //         console.log(request.response);
            //         showThanksModal(message.success);
            //         form.reset();
            //         statusMessage.remove();
            //     } else {
            //         showThanksModal(message.failure);
            //     }
            // });
        });

    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
                <div class="modal__content">
                    <div class="modal__close" data-close>×</div>
                    <div class="modal__title">${message}</div>
                </div>
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }

    // Slider

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

    total.textContent = `${getZero(totalSlidesCnt)}`;
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

        cur.textContent = getZero(curCnt);
       
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
        cur.textContent = getZero(curCnt);

        dots.forEach(dot => dot.style.opacity = '.5');
        dots[curCnt - 1].style.opacity = 1;
    });

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to');

            curCnt = slideTo;
            offset = getNumberWithoutLetters(width) * (slideTo - 1);

            slidesField.style.transform = `translateX(-${offset}px)`;

            cur.textContent = getZero(curCnt);

            dots.forEach(dot => dot.style.opacity = '.5');
            dots[curCnt - 1].style.opacity = 1;
        });
    })

    function getNumberWithoutLetters(s) {
        return +s.replace(/\D/g, '');
    }
    

    // Calc

    const result = document.querySelector('.calculating__result span');
    let gender, height, weight, age, ratio;

    if (localStorage.getItem('gender')) {
        gender = localStorage.getItem('gender');
    }
    else {
        gender = 'femail';
        localStorage.setItem('gender', 'femail');
    }

    if (localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    }
    else {
        ratio = 1.375;
        localStorage.setItem('ratio', 1.375);
    }

    function initLocalSettings(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.classList.remove(activeClass);
            if (elem.getAttribute('id') === localStorage.getItem('gender')) {
                elem.classList.add(activeClass);
            }
            if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                elem.classList.add(activeClass);
            }
        });
    }

    initLocalSettings('#gender div', 'calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

    function calcTotal() {
        if (!gender || !height || !weight || !age || !ratio) {
            result.textContent = '____';
            return;
        }
        if (gender === 'femail') {
        result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio); 
        }
        else {
        result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }

    calcTotal();
    
    function getStaticInformaion(parentClass, activeClass) {
        const elements = document.querySelectorAll(`${parentClass} div`);

        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio');
                    localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'));
                }
                else {
                    gender = e.target.getAttribute('id');
                    localStorage.setItem('gender', e.target.getAttribute('id'));
                }

                elements.forEach(elem => {
                    elem.classList.remove(activeClass);
                });

                e.target.classList.add(activeClass);
                calcTotal();
            });
        });
    }

    getStaticInformaion('#gender', 'calculating__choose-item_active');
    getStaticInformaion('.calculating__choose_big', 'calculating__choose-item_active');
    
    function getDinamycInformation(selector){
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {

            if (input.value.match(/\D/g)) {
                input.style.border = '1px solid red';
            } 
            else {
                input.style.border = 'none';
            }

            switch (input.getAttribute('id')) {
                case "height":
                    height = +input.value;
                    break;
                case "weight":
                    weight = +input.value;
                    break;
                case "age":
                    age = +input.value;
                    break;
            }

            calcTotal();
        });
    }

    getDinamycInformation('#height');
    getDinamycInformation('#weight');
    getDinamycInformation('#age');


});

