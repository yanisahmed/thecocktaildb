const productContainer = document.getElementById('product-list');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const searchForm = document.getElementById('search-form');
const cartList = document.getElementById('cart');

searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const query = searchInput.value.trim().toLowerCase();
    console.log(query)

    if (!query) {
        return
    }
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`)
        .then(response => response.json())
        .then(data => {
            const drinks = data.drinks;
            productContainer.innerHTML = ''; // Clear previous results

            if (drinks) {
                drinks.forEach(drink => {

                    const drinkDiv = document.createElement('div');
                    drinkDiv.classList.add('drink');
                    drinkDiv.innerHTML = `
                        <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}"/>
                        <h3>${drink.strDrink}</h3>
                        <p><strong>Category:</strong> ${drink.strCategory}</p>
                        <p><strong>Instructions:</strong> ${drink.strInstructions.slice(1, 30)}</p>
                        <div class="buttons d-flex justify-content-center">
                            <button class="add-to-cart" data-id="${drink.idDrink}">Add to Cart</button>
                            <button class="show-details" data-id="${drink.idDrink}">Show Details</button>
                        </div>
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
                        // implement detail modal
                        implementDetailModal(drinkId);


                    });
                });
            } else {
                productContainer.innerHTML = '<p>No drinks found.</p>';
            }
        })
        .catch(error => console.error('Error fetching drinks:', error));
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
                <div class="buttons d-flex  justify-content-center">
                <button class="add-to-cart" data-id="${drink.idDrink}">Add to Cart</button>
                <button class="show-details" data-id="${drink.idDrink}">Show Details</button>
                </div>
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
                // implement detail modal
                implementDetailModal(drinkId);


            });
        });


    } else {
        productContainer.innerHTML = '<p>No drinks found.</p>';
    }
});



async function addToCart(drinkId) {
    if (cartList.children.length >= 9) {
        alert('You can only add up to 7 items to the cart.');
        return;
    }
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`)
    const data = await response.json();
    const drinks = data.drinks;
    if (drinks && drinks.length > 0) {

        drinks.forEach(drink => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.classList.add('d-flex');
            cartItem.innerHTML = `
                <div class="cart-col sn">${cartList.children.length - 1}</div>
                <div class="cart-col image">
                    <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
                </div>
                <div class="cart-col title">${drink.strDrink}</div>
                
            `;


            cartList.appendChild(cartItem);
            console.log(cartList.children.length);
        });

    } else {
        console.error('Drink not found for ID:', drinkId);
    }
}

async function implementDetailModal(drinkId) {
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`);
    const data = await response.json();
    const drink = data.drinks[0];

    if (drink) {
        // Populate modal fields
        const modalContent = document.getElementById('modal-content');
        modalContent.innerHTML = `
            <span class="close-button" id="close-button">&times;</span>
            <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" />
            <h2>${drink.strDrink}</h2>
            <p><strong>Category:</strong> ${drink.strCategory}</p>
            <p><strong>Instructions:</strong> ${drink.strInstructions}</p>
            <p><strong>Alcoholic:</strong> ${drink.strAlcoholic}</p>
            <p><strong>Glass:</strong> ${drink.strGlass}</p>
            `;
        // Show modal
        document.getElementById('drink-modal').style.display = 'flex';
        document.getElementById('drink-modal').appendChild(modalContent);
    } else {
        console.error('Drink not found for ID:', drinkId);
    }
}

document.addEventListener('click', (e) => {
    if (e.target.id === 'close-button') {
        console.log('Modal closed');
        document.getElementById('drink-modal').style.display = 'none';
    }
});


// Close modal when clicking outside content
window.addEventListener('click', (e) => {
    const modal = document.getElementById('drink-modal');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});



