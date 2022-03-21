'use strict';
import './vendors/vendors.js';
import Swiper, {
    Navigation,
    Pagination,
    Thumbs,
    EffectFade,
    Mousewheel,
    Manipulation
} from 'swiper';
import AirDatepicker from 'air-datepicker';
import localeEn from 'air-datepicker/locale/en.js';



// Ограничение по дням стекущего дня

const dayLimit = +document.querySelector('[ data-day-limit]').dataset.dayLimit;

const todayDate = new Date();
const finishDate = new Date().setDate(todayDate.getDate() + dayLimit);
const currentDateTextElements = document.querySelectorAll('.selected-date');
const sliderSpeed = 1200;
const datapicker = new AirDatepicker('#widget-datapicker', {
    // visible: true,
    // куда выводить данные
    speed: sliderSpeed,
    altField: '.wqeqwe',
    autoClose: true,
    //Английская локализация
    locale: localeEn.default,
    startDate: todayDate,
    minDate: todayDate,
    maxDate: finishDate,
    dateFormat: 'MMM dd, yyyy',
    onSelect({ date, formattedDate, datepicker }) {

        currentDateTextElements.forEach(textBlock => textBlock.textContent = formattedDate);
        console.log(`Выбранная дата в календаре в нужном формате для вёрстки: ${formattedDate}`);
        console.log(`Дата в общем формате: ${date}`);

        const activeSlide = [...slider.slides].find(slide => slide.dataset.slideSetDate == formattedDate);
        //Прокрутка к слайду с нужной датой из календаря
        slider.slideTo(activeSlide.dataset.slideIndex, sliderSpeed);
        cleanSlideActiveClass(slider.slides, activeSlide);
    }
});
const options = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    timezone: 'UTC',
};
//Сегодняшний день в нужном формате
const calendarStartDate = datapicker.viewDate.toLocaleString('en', options);
datapicker.selectDate(calendarStartDate);



const slider = new Swiper('.swiper', {
    modules: [Manipulation, Navigation],
    slidesPerView: 8,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    spaceBetween: 20,
    longSwipesRatio: 2,
    allowTouchMove: false,
    on: {
        init() {
            for (let index = 0; index < dayLimit + 1; index++) {
                let slideDate = new Date().setDate(todayDate.getDate() + index);
                let slideDataValue = new Date(slideDate).toLocaleString('en', options);
                const timeGetData = new Date(slideDate).toLocaleString('en', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                });
                this.addSlide(index,
                    `<a class="swiper-slide" data-slide-index="${index}" data-slide-set-date="${slideDataValue}" data-slide-back-date="${timeGetData}">
                         ${slideDataValue}
                     </a>`);
            }
            const slides = this.slides;
            slides.forEach(slide => {
                slide.addEventListener('click', (e) => {
                    e.preventDefault();
                    const dateForDatapickerUpdate = slide.dataset.slideSetDate;
                    datapicker.selectDate(dateForDatapickerUpdate);
                })
            })
        }
    }
});

function cleanSlideActiveClass(slides, slide) {
    slides.forEach(slide => slide.classList.remove('active'));
    slide.classList.add('active');
}

