"use strict"
/* Индекс слайда по умолчанию */
var slideIndex = 1;

showSlides(slideIndex);

/* Функция увеличивает индекс на 1, показывает следующй слайд*/
function next() {
  showSlides(slideIndex += 1);
}

/* Функция уменьшяет индекс на 1, показывает предыдущий слайд*/
function previous() {
  showSlides(slideIndex -= 1);
}

/* Устанавливает текущий слайд */
function currentSlide(n) {
  showSlides(slideIndex = n);
}

/* Основная функция слайдера */
function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName('item');
  var dots = document.getElementsByClassName("dots");
  if (n > slides.length) {
    slideIndex = 1
  }
  if (n < 1) {
    slideIndex = slides.length
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'center'
  });
  dots[slideIndex-1].className += " active";
}

var minus = document.getElementById('previous');

minus.addEventListener('touchstart', function(event) {
  event.preventDefault();
  event.stopPropagation(); 
  previous()
}, false);

var plus = document.getElementById('next');

plus.addEventListener('touchstart', function(event) {
  event.preventDefault();
  event.stopPropagation(); 
  next()
}, false);

var dotsTouch = document.getElementsByClassName('dots');
for (let i=0; i<dotsTouch.length; i++) {
  var dotsTouchElem = dotsTouch[i];
dotsTouchElem.addEventListener('touchstart', function(event) {
  event.preventDefault();
  event.stopPropagation(); 
    currentSlide(i+1);
}, false);
}

var holster = document.getElementById('holster');

if(holster.clientWidth<700) {
  holster.style.height = "inherit";
}

var scaling = false;
var dist = 0;
var scale_factor = 1.0;
var curr_scale = 1.0;
var max_zoom = 8.0;
var min_zoom = 0.5

/*Пишем функцию, которая определяет расстояние между пальцами*/
function distance (p1, p2) {
  return (Math.sqrt(Math.pow((p1.clientX - p2.clientX), 2) + Math.pow((p1.clientY - p2.clientY), 2)));
}

var area = document.getElementById('area');
var startPoint={};
var nowPoint;
var ldelay;
var container = document.getElementById('container');

/*Ловим касание пальца*/
holster.addEventListener('touchstart', function(event) {
  event.preventDefault();
  event.stopPropagation();
  startPoint.x=event.changedTouches[0].pageX;
  startPoint.y=event.changedTouches[0].pageY;
  ldelay=new Date();
  var tt = event.targetTouches;

  if (tt.length >= 2) {
    dist = distance(tt[0], tt[1]);
    scaling = true;
  } else {
    scaling = false;
    }
}, false);

/*Ловим движение пальцем*/
holster.addEventListener('touchmove', function(event) {
  event.preventDefault();
  event.stopPropagation();
  
  var fingerPlace={};
  
  nowPoint=event.changedTouches[0];
  fingerPlace.x=nowPoint.pageX-startPoint.x;
  fingerPlace.y=nowPoint.pageY-startPoint.y;

  /*Обработайте данные*/
  if(Math.abs(fingerPlace.x)>200){
    if(fingerPlace.x<0){/*СВАЙП ВЛЕВО(СЛЕД.СТРАНИЦА)*/next();}
    if(fingerPlace.x>0){/*СВАЙП ВПРАВО(ПРЕД.СТРАНИЦА)*/previous();}
    startPoint={x:nowPoint.pageX,y:nowPoint.pageY};
  }
  if(Math.abs(fingerPlace.y)>200){
    if(fingerPlace.y>0){/*СВАЙП ВНИЗ(ОБНОВ.СТРАНИЦЫ)*/document.location.reload();}
    startPoint={x:nowPoint.pageX,y:nowPoint.pageY};
  }
  draw();
  
  var tt = event.targetTouches;

  if (scaling) {
    curr_scale = distance(tt[0], tt[1]) / dist * scale_factor;
    container.style.WebkitTransform = "scale(" + curr_scale + ", " + curr_scale + ")";
  }
}, false);

var str='';
function draw(){
  str+='<div style="width:25px; height:15px; background-color:red;  position:fixed; border-radius: 50%; area-shadow: 0 0 20px white; top:'; /* + Touch.screenX + 'px;top:' + Touch.screenY + 'px;z-index: 5">jhkjhkj</div>';*/
  str+= nowPoint.clientY;
  str+= 'px;left:';
  str+= nowPoint.clientX;
  str+= 'px;z-index: 5"></div>';
  area.innerHTML=str;
}

/*Ловим отпускание пальца*/
holster.addEventListener('touchend', function(event) {
  str='';
  area.innerHTML='';
  nowPoint=event.changedTouches[0];
  var tt = event.targetTouches;
  if (tt.length < 2) {
    scaling = false;
    if (curr_scale < min_zoom) {
      scale_factor = 1;
    } else {
      if (curr_scale > max_zoom) {
        scale_factor = 1;
      } else {
        scale_factor = 1;
        }
      }
    container.style.WebkitTransform = "scale(" + scale_factor + ", " + scale_factor + ")";
  } else {
    scaling = true;
    }
}, false);