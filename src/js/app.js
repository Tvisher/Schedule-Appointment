'use strict';
// import './vendors/vendors.js';
import Swiper, {
    Navigation,
    Manipulation
} from 'swiper';
import AirDatepicker from 'air-datepicker';
import localeEn from 'air-datepicker/locale/en.js';

//родительский элемент для всего виджета/блока и формой
const widgetTemplateParent = document.querySelector('#widget-template');
// первый шаг формы
const widgetTemplateStepOne = widgetTemplateParent.querySelector('[data-step="1"]');
// Слайдер с датами
const widgetTemplateSlider = widgetTemplateStepOne.querySelector('.widget-template__slider');
// Ограничение по дням с текущего дня
const dayLimit = +widgetTemplateParent.querySelector('[ data-day-limit]').dataset.dayLimit;
// получаем сегодняшний день
const todayDate = new Date();
// получаем конеечный день учитывая ограничитель
const finishDate = new Date().setDate(todayDate.getDate() + dayLimit);
// элементы куда выводить выбранные даты/время
const currentDateTextElements = widgetTemplateParent.querySelectorAll('.selected-date');
const currentTimeTextElements = widgetTemplateParent.querySelectorAll('.selected-time');
const currentFullDateTextElements = widgetTemplateParent.querySelectorAll('.selected-date-full');
// настройка скорости слайдера / скорости анимации
const sliderSpeed = 1800;
// описываем компонент календаря
const stepOneDatapicker = new AirDatepicker('#widget-datapicker', {
    // куда выводить данные
    speed: sliderSpeed,
    autoClose: true,
    position: 'bottom right',
    //Английская локализация
    locale: localeEn.default,
    startDate: todayDate,
    minDate: todayDate,
    maxDate: finishDate,
    dateFormat: 'MMM dd, yyyy',
    altField: '.selected-date',
    altFieldDateFormat: 'MMM dd',
    buttons: [
        {
            content(dp) {
                return 'Today';
            },
            onClick(dp) {
                dp.selectDate(todayDate);
            }
        }
    ],
    // Событие описывающее момент выбора даты в календаре
    onSelect({ date, formattedDate, datepicker }) {
        // выводим выбранную дату в элементы под это дело
        currentDateTextElements.forEach(textBlock => textBlock.textContent = datepicker.$altField.value);
        currentFullDateTextElements.forEach(textBlock => textBlock.textContent = date.toLocaleString('en', { weekday: 'long', month: 'short', day: '2-digit', year: 'numeric' }));
        setTimeout(() => {
            currentTimeTextElements.forEach(timeElem => timeElem.innerHTML = '');
        }, 300);
        //Скрываем кнопку перехода к следущему шагу
        widgetTemplateStepOne.querySelector('[data-show-next-step]').classList.remove('show');
        // Место под отрисовку инппутов со временем
        const renderTimeContainer = widgetTemplateStepOne.querySelector('[data-render-container]');
        // Крутим прелоадер пока ждём респонс
        const timeCellPreloader = widgetTemplateStepOne.querySelector('[data-preloader]');
        timeCellPreloader.classList.add('show');

        setTimeout(() => {
            // запрос на сервак =>
            // тут можно разместить запрос на бэк за нужными данными по дате
            console.log(`Выбранная дата в календаре в нужном формате для вёрстки: ${formattedDate}`);
            console.log(`Дата в общем формате: ${date}`);

            // renderTimeContainerChildred - техническая переменная, в дальнейшем заменить на ответ с сервера
            let renderTimeContainerChildred = renderTimeContainer.innerHTML;
            // Очищаяем контейнер под инпуты и рендерим ответ с сервера
            renderTimeContainer.innerHTML = '';
            renderTimeContainer.innerHTML = renderTimeContainerChildred;
            // Убираем спинер после отрисовки инпутов
            timeCellPreloader.classList.remove('show');
            // После ответа с сервера и отрисовки инпутов, вешаем слушалку на инпуты
            const sheduleTimeInputs = widgetTemplateStepOne.querySelectorAll('[name="shedule-time"]');
            if (sheduleTimeInputs) {
                sheduleTimeInputs.forEach(input => {
                    input.addEventListener('input', (e) => {
                        // Если выбран инпут со временем, отображаем кнопку со следующим шагом
                        widgetTemplateParent.querySelector('[data-show-next-step]').classList.add('show');
                        const selectedTime = e.target.value;
                        console.log(`Выбранное время : ${selectedTime}`);
                        // выводим выбранное время в элементы под это дело
                        currentTimeTextElements.forEach(timeElem => timeElem.innerHTML = `&nbsp;${selectedTime}`);
                    })
                });
            }
        }, 1200);
        //получаем соответствующий дате слайд
        const activeSlide = [...slider.slides].find(slide => slide.dataset.slideSetDate == formattedDate);
        //меняем классы у слайдов
        slidesClassTogler(slider.slides, activeSlide);
        //Прокрутка к слайду с выбранной датой из календаря с соответсвующей задержкой для анимации
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
const calendarStartDate = stepOneDatapicker.viewDate.toLocaleString('en', options);
//автоматически выбитаем сегодняшний день в календаре и получаемс первое событие onSelect у календаря
stepOneDatapicker.selectDate(calendarStartDate);

// описываем компонент слайдера
const slider = new Swiper('.widget-template__slider', {
    modules: [Manipulation, Navigation],
    slidesPerView: "auto",
    spaceBetween: 5,
    allowTouchMove: true,
    breakpoints: {
        576: {
            allowTouchMove: false,
        }
    },
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
            //вешаем событие клика на слайды и связываем слайдер с выбором даты в календаре(генерим событие onSelect)
            const slides = this.slides;
            slides.forEach(slide => {
                slide.addEventListener('click', (e) => {
                    e.preventDefault();
                    const dateForDatapickerUpdate = slide.dataset.slideSetDate;
                    stepOneDatapicker.selectDate(dateForDatapickerUpdate);
                })
            });
        },
        slideChangeTransitionEnd() {
            slider.updateSize();
            widgetTemplateSlider.classList.remove('blur');
        },
        //обновляем слайдер для коррекного отображения и блокируем возможность клика по нему во время анимаци перелистывания
        slideChangeTransitionStart() {
            slider.updateSize();
            widgetTemplateSlider.classList.add('blur');
        },
    }
});

//Смена активного слайда 
function slidesClassTogler(slides, slide) {
    slides.forEach(slide => slide.classList.remove('active'));
    slide.classList.add('active');
}

// В зависимости от ширины экрана, настраиваем отображение календаря
function checkWindowSize(e) {
    const windowInnerWidth = window.innerWidth;
    if (windowInnerWidth <= 576) {
        stepOneDatapicker.update({ isMobile: true });
    } else {
        stepOneDatapicker.update({ isMobile: false });
    }
}
checkWindowSize();
window.addEventListener('resize', checkWindowSize);

