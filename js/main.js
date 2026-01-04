import { gridProducts, popularProducts } from "./data.js";
import { createFoodCard } from "./components.js";

document.addEventListener("DOMContentLoaded", () => {
  /* Hemburger */
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".nav");
    menuToggle?.addEventListener("click", () => {
        nav.classList.toggle("active");
    });
    /* Home Kitchen */
    const foodGrid = document.getElementById("foodGrid");
    if (foodGrid) {
        gridProducts.forEach(product => {
        foodGrid.insertAdjacentHTML(
            "beforeend",
            createFoodCard(product)
        );
        });
    }
/* popular Item Caruosel */
const popularTrack = document.getElementById("popularTrack");
const carousel = document.getElementById("popularCarousel");
const prevBtn = carousel?.querySelector(".carousel-btn.prev");
const nextBtn = carousel?.querySelector(".carousel-btn.next");
const GAP = 24;
let index = 1;
let cardWidth;
let autoSlideInterval;
let isTransitioning = false;
/* Render Card */
if (popularTrack) {
    popularProducts.forEach(product => {
        popularTrack.insertAdjacentHTML(
        "beforeend",
        createFoodCard(product)
        );
    });
    }
    /* Setup Infinte Loop */
    function setupInfiniteCarousel() {
    const cards = popularTrack.children;
    if (cards.length === 0) return;
    cardWidth = cards[0].offsetWidth + GAP;

    const firstClone = cards[0].cloneNode(true);
    const lastClone = cards[cards.length - 1].cloneNode(true);

    firstClone.classList.add("clone");
    lastClone.classList.add("clone");
    popularTrack.appendChild(firstClone);
    popularTrack.insertBefore(lastClone, cards[0]);
    popularTrack.style.transform =
        `translateX(-${cardWidth * index}px)`;
    }
    window.addEventListener("load", setupInfiniteCarousel);
    /* slide */
    function slideCarousel() {
    isTransitioning = true;
    popularTrack.style.transition = "transform 0.45s ease";
    popularTrack.style.transform =
        `translateX(-${index * cardWidth}px)`;
    }
    /* Next */
    function nextSlide() {
    if (isTransitioning) return;
    index++;
    slideCarousel();
    }
    /* Prev*/
    function prevSlide() {
    if (isTransitioning) return;
    index--;
    slideCarousel();
    }
    /* Loop */
    popularTrack.addEventListener("transitionend", () => {
    const cards = popularTrack.children;

    if (cards[index].classList.contains("clone")) {
        popularTrack.style.transition = "none";
        if (index === cards.length - 1) {
        index = 1;
        } else if (index === 0) {
        index = cards.length - 2;
        }
        requestAnimationFrame(() => {
        popularTrack.style.transform =
            `translateX(-${cardWidth * index}px)`;
        requestAnimationFrame(() => {
            popularTrack.style.transition = "transform 0.45s ease";
        });
        });
    }
    isTransitioning = false;
    });
    /* Auto Slide*/
    function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 3000);
    }
    function stopAutoSlide() {
    clearInterval(autoSlideInterval);
    }
    /* Events */
    nextBtn?.addEventListener("click", () => {
    nextSlide();
    stopAutoSlide();
    startAutoSlide();
    });

    prevBtn?.addEventListener("click", () => {
    prevSlide();
    stopAutoSlide();
    startAutoSlide();
});

carousel?.addEventListener("mouseenter", stopAutoSlide);
carousel?.addEventListener("mouseleave", startAutoSlide);

startAutoSlide();

popularTrack?.addEventListener("click", (e) => {
    const card = e.target.closest(".food-card");
    if (!card) return;

    stopAutoSlide();
});
/* Video Play*/
const video = document.getElementById("serviceVideo");
const playBtn = document.getElementById("videoPlayBtn");

if (video && playBtn) {
    playBtn.addEventListener("click", () => {
        video.play();
        playBtn.style.display = "none";
        video.setAttribute("controls", "true");
    });
    function resetToPoster() {
        video.pause();
        video.currentTime = 0;     
        video.removeAttribute("controls");
        video.load();              
        playBtn.style.display = "block";
    }
    video.addEventListener("pause", resetToPoster);
    video.addEventListener("ended", resetToPoster);
}

document.querySelectorAll("[data-scroll]").forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();

        const targetId = link.dataset.scroll;
        const target = document.getElementById(targetId);
        if (!target) return;

        const offset = 80; // navbar height
        const y = target.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({
        top: y,
        behavior: "smooth"
        });
    });
});
    /* Model */
    const modal = document.getElementById("modal");
    const openBtn = document.querySelector(".request-btn");
    const closeBtn = document.querySelector(".modal-close");
    const cancelBtn = document.querySelector(".cancel-btn");
    const overlay = document.querySelector(".modal-overlay");

    function openModal() {
        modal.classList.remove("hidden");
        document.body.style.overflow = "hidden";
    }
    function closeModal() {
        modal.classList.add("hidden");
        document.body.style.overflow = "";
    }
    openBtn?.addEventListener("click", openModal);
    closeBtn?.addEventListener("click", closeModal);
    cancelBtn?.addEventListener("click", closeModal);
    overlay?.addEventListener("click", closeModal);
});
/* add items  */
let cart = [];

document.addEventListener("click", e => {
    const addBtn = e.target.closest(".add-btn");
    const plus = e.target.closest(".plus");
    const minus = e.target.closest(".minus");
    /* First click + (convert to qty) section  */
    if (addBtn) {
        const card = addBtn.closest(".food-card");
        const qtyControl = card.querySelector(".qty-control");
        const qtyEl = card.querySelector(".qty");
        addBtn.classList.add("hidden");
        qtyControl.classList.remove("hidden");
        qtyEl.textContent = 1;
        updateCart(card, 1);
        return;
    }
    if (!plus && !minus) return;

    const card = e.target.closest(".food-card");
    const qtyEl = card.querySelector(".qty");
    const addButton = card.querySelector(".add-btn");
    const qtyControl = card.querySelector(".qty-control");

    let qty = Number(qtyEl.textContent);

    if (plus) qty++;
    if (minus) qty--;

    /* If qty becomes 0 → revert back to + section */
    if (qty === 0) {
        qtyControl.classList.add("hidden");
        addButton.classList.remove("hidden");
        removeFromCart(card.dataset.id);
        return;
    }
    qtyEl.textContent = qty;
    updateCart(card, qty);
});
/* cart helper  */
function updateCart(card, qty) {
    const id = card.dataset.id;
    const name = card.dataset.name;
    const price = Number(card.dataset.price);
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty = qty;
    } else {
        cart.push({ id, name, price, qty });
    }
    console.log("Cart:", cart);
    }
    function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    console.log("Cart:", cart);
}
