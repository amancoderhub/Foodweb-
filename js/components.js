export function createFoodCard(product) {
    const {
        id,
        name,
        price,
        image,
        rating,
        time,
        discount
    } = product;
    return `
        <article class="food-card"
        data-id="${id}"
        data-name="${name}"
        data-price="${price}"
        >
        <div class="food-img-wrap">
            ${discount ? `<span class="food-badge">${discount}%</span>` : ""}
            <img src="${image}" alt="${name}" loading="lazy">
        </div>

        <div class="food-card-details">
            <div class="food-title-row">
            <h3>${name}</h3>
            <span class="food-price">₹${price}</span>
            </div>

            <div class="food-bottom-row">
            <div class="food-meta">
                ${
                rating
                    ? `
                <span class="rating">
                    <span class="star">★</span> ${rating}
                </span>
                <span class="time">${time}</span>
                `
                    : ""
                }
            </div>

            <!-- INITIAL ADD BUTTON -->
            <button class="add-btn yellow" aria-label="Add item">+</button>

            <!-- QTY CONTROL (HIDDEN INITIALLY) -->
            <div class="qty-control hidden">
                <button class="qty-btn minus">-</button>
                <span class="qty">1</span>
                <button class="qty-btn plus">+</button>
            </div>
            </div>
        </div>
        </article>
    `;
}
