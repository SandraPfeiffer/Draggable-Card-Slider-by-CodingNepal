const wrapper = document.querySelector(".wrapper");
const carousel = document.querySelector(".carousel");
const arrowBtns = document.querySelectorAll(".wrapper i");
const firstCardWidth = carousel.querySelector(".card").offsetWidth;
const carouselChildrens = [...carousel.children];

    // !!!step 2: Einschränkung mousemove: nur, wenn Klick und Mausbewegung
    // !!!step 5: false, startX, startScrollLeft; propper card-slide according to mouse movement
let isDragging = false, startX, startScrollLeft, timeoutId;

    // !!!step 7: infinite scrolling
    // step 7: get number of cards that can fit
let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

    // step 7.1: insert last few cards at beginning for infinite look
carouselChildrens.slice(-cardPerView).reverse().forEach(card => {
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
});

    // step 7.2: insert first few cards at the end for infinite look
carouselChildrens.slice(0, cardPerView).forEach(card => {
    carousel.insertAdjacentHTML("beforeend", card.outerHTML);
});

    // !!!step 6: event listener for buttons
arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        carousel.scrollLeft += btn.id === "left" ? -firstCardWidth : firstCardWidth;
    });
});

    // step 2
const dragStart = (e) => {
    isDragging = true;
    // !!!step 3: verhindern, dass Text bei Mouseover/-drag ausgewählt wird
    // in CSS: courser:grab; user-select: none;
    // in HTML: bei img draggable="false"
    carousel.classList.add("dragging");
    // step 5: records initial cursor and scroll position of carousel
    startX = e.pageX;
    startScrollLeft = carousel.scrollLeft;
}

    // !!!step 1: mousemove über carousel --> horizontale Bewegung
const dragging = (e) => {
    // step 2: if isDragging is false return from here
    if(!isDragging) return;
    // step 1: scrollLeft sets or returns number of pixels an element's content is scrolled horizontally
    // step 5: updates scroll position of carousel based on cursor movement
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
}
    
    // step 4
const dragStop = () => {
    isDragging = false;
    carousel.classList.remove("dragging");
}

    // !!!step 9: Autoplay (not on moblie device)
const autoPlay = () => {
    if(window.innerWidth < 800) return; 
    // Autoplay after 2500ms
    timeoutId = setTimeout(() => carousel.scrollLeft += firstCardWidth, 2500);
}
autoPlay();


    // !!!step 8: infinite loop
const infiniteScroll = () => {
    if(carousel.scrollLeft === 0) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
        carousel.classList.remove("no-transition");
    }
    else if (Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.offsetWidth;
        carousel.classList.remove("no-transition");
    }
    // step 9 clear existing timeout/stopp autoplay if mouse hovers carousel
    clearTimeout(timeoutId);
    if(!wrapper.matches(":hover")) autoPlay();
}

    

    // step 2
carousel.addEventListener("mousedown", dragStart);
    // step 1
carousel.addEventListener("mousemove", dragging);
    // !!!step 4: stops cards from sliding if mousedown released
document.addEventListener("mouseup", dragStop);
carousel.addEventListener("scroll", infiniteScroll);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", autoPlay);