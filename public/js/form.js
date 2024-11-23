document.getElementById('productForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the form from submitting normally

  // Get form values
  const productName = document.getElementById('productName').value;
  const productDescription = document.getElementById('productDescription').value;
  const productPrice = document.getElementById('productPrice').value;
  const productImage = document.getElementById('productImage').value;

  // Create a new product card
  const productContainer = document.getElementById('productContainer');
  const productCard = document.createElement('div');
  productCard.classList.add('product-card');

  // Populate product card with product information
  productCard.innerHTML = `
      <img src="${productImage}" alt="${productName}" class="product-image">
      <h2 class="product-title">${productName}</h2>
      <p class="product-description">${productDescription}</p>
      <p class="product-price">$${parseFloat(productPrice).toFixed(2)}</p>
      <button class="add-to-cart">Add to Cart</button>
  `;

  // Append the new product card to the product container
  productContainer.appendChild(productCard);

  // Clear the form
  document.getElementById('productForm').reset();
});