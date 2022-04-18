import  tabs  from './modules/tabs';
import  modal  from './modules/modal';
import  calc  from './modules/calc';
import  cards  from './modules/cards';
import  forms  from './modules/forms';
import  slider  from './modules/slider';
import  timer  from './modules/timer';
import {openModal} from './modules/modal';

window.addEventListener('DOMContentLoaded', () => {
    const modalTimerId = setInterval(() => openModal('.modal', modalTimerId), 50000);

    tabs('.tabheader__item', '.tabcontent', '.tabheader__items','tabheader__item_active');
    modal('[data-modal]', '.modal', modalTimerId);
    timer('.timer', '2022-06-11');
    cards();
    forms('form', modalTimerId);
    slider();
    calc();

});


