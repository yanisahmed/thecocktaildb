const productContainer = document.getElementById('product-list');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const searchForm = document.getElementById('search-form');

searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const query = searchInput.value.trim().toLowerCase();
    console.log(query)

    if (!query) {
        return
    }
});



document.addEventListener('DOMContentLoaded', async (e) => {
    const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=cocktail');
    const data = await response.json();
    const drinks = data.drinks;

    console.log(drinks);

    if (drinks) {
        drinks.forEach(drink => {
            const drinkDiv = document.createElement('div');
            drinkDiv.classList.add('drink');
            drinkDiv.innerHTML = `
                
                <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}"/>
                <h3>${drink.strDrink}</h3>
                <p><strong>Category:</strong> ${drink.strCategory}</p>
                <p><strong>Instructions:</strong> ${drink.strInstructions.slice(1, 30)}</p>
                <button class="add-to-cart" data-id="${drink.idDrink}">Add to Cart</button>
                <button class="show-details" data-id="${drink.idDrink}">Show Details</button>
            `;
            productContainer.appendChild(drinkDiv);
        });

        // Add event listeners after DOM elements are inserted
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const drinkId = e.target.dataset.id;
                console.log(`Added to cart: ${drinkId}`);

                addToCart(drinkId);
            });
        });

        document.querySelectorAll('.show-details').forEach(button => {
            button.addEventListener('click', (e) => {
                const drinkId = e.target.dataset.id;
                console.log(`Show details for: ${drinkId}`);
                // You can implement detail modal or redirect here
            });
        });


    } else {
        productContainer.innerHTML = '<p>No drinks found.</p>';
    }
});



async function addToCart(drinkId) {
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`)
    const data = await response.json();
    console.log(data.drinks || []);
}
