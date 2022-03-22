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


const widgetTemplateSlider = document.querySelector('.widget-template__slider');

// Ограничение по дням с текущего дня
const dayLimit = +document.querySelector('[ data-day-limit]').dataset.dayLimit;
// получаем сегодняшний день
const todayDate = new Date();
// получаем конеечный день учитывая ограничитель
const finishDate = new Date().setDate(todayDate.getDate() + dayLimit);
// элементы куда выводить выбранные даты
const currentDateTextElements = document.querySelectorAll('.selected-date');
// настройка скорости слайдера
const sliderSpeed = 1800;
// описываем компонент календаря
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
        // выводим выбранную дату в элементы под это дело
        currentDateTextElements.forEach(textBlock => textBlock.textContent = formattedDate);
        // тут можно разместить запрос на бэк за нужными данными по дате
        console.log(`Выбранная дата в календаре в нужном формате для вёрстки: ${formattedDate}`);
        console.log(`Дата в общем формате: ${date}`);
        //получаем соответствующий дате слайд
        const activeSlide = [...slider.slides].find(slide => slide.dataset.slideSetDate == formattedDate);
        //меняем классы у слайдов
        slidesClassTogler(slider.slides, activeSlide);
        //Прокрутка к слайду с выбранной датой из календаря
        setTimeout(() => {
            slider.updateSlides();
            slider.slideTo(activeSlide.dataset.slideIndex, sliderSpeed * 0.8);
        }, 350);

    }
});
// настройки опции форматирования даты
const options = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
};
//Сегодняшний день в нужном формате
const calendarStartDate = datapicker.viewDate.toLocaleString('en', options);
//выбитаем сегодняшний день в календаре и получаемс первое событие onSelect
datapicker.selectDate(calendarStartDate);

// описываем компонент слайдера
const slider = new Swiper('.widget-template__slider', {
    modules: [Manipulation, Navigation],
    // slidesPerView: 8,
    slidesPerView: "auto",
    // slidesPerGroup: 3,
    spaceBetween: 6,
    allowTouchMove: false,
    observeParents: true,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    on: {
        init() {

            //Готовим даты для выврда в слайд и циклом генерируем слайды в нужном колличиестве
            for (let index = 0; index < dayLimit + 1; index++) {
                const slideDate = new Date().setDate(todayDate.getDate() + index);
                const formatDate = new Date(slideDate)
                const slideDataValue = formatDate.toLocaleString('en', options);
                const timeGetData = formatDate.toLocaleString('en', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                });
                const slideFullWeekday = formatDate.toLocaleString('en', { weekday: 'long' });
                const slideShorWeekday = formatDate.toLocaleString('en', { weekday: 'short' }).slice(0, -1);
                const slideMonth = formatDate.toLocaleString('en', { month: 'short' });
                const slideNumDay = formatDate.toLocaleString('en', { day: '2-digit' });
                this.addSlide(index,
                    `<a href="#" class="swiper-slide" data-slide-index="${index}" data-slide-set-date="${slideDataValue}" data-slide-back-date="${timeGetData}">
                        <div class="date-slide__head">
                             <span class ='date-slide-full-day'>${slideFullWeekday}</span>  
                             <span class ='date-slide-short-day'>${slideShorWeekday}</span>  
                        </div>
                        <div class="date-slide__body">
                            <span>${slideMonth}</span>
                            <span>${slideNumDay}</span>
                        </div> 
                     </a>`);
            }
            //вешаем событие клика на слайд и связываем его с выбором даты в календаре(генерим событие onSelect)
            const slides = this.slides;
            slides.forEach(slide => {
                slide.addEventListener('click', (e) => {
                    e.preventDefault();
                    const dateForDatapickerUpdate = slide.dataset.slideSetDate;
                    datapicker.selectDate(dateForDatapickerUpdate);
                })
            });
        },
        transitionEnd() {
            console.log('transitionEnd');
        },
        slideChangeTransitionEnd() {
            slider.updateSize();
            widgetTemplateSlider.classList.remove('blur');

        },
        slideChangeTransitionStart() {
            slider.updateSize();
            widgetTemplateSlider.classList.add('blur');
        },
    }
});


function slidesClassTogler(slides, slide) {
    slides.forEach(slide => slide.classList.remove('active'));
    slide.classList.add('active');
}

