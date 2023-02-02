  /* Evite les erreurs de syntaxe en évitant les variables non déclarées */

  'use strict';

  /* Réccupération de l'id du produit */

  const urlSearchParams = new URLSearchParams(window.location.search);
  const id = urlSearchParams.get('id');

  /* URL de l'API */
  const url = `http://localhost:3000/api/products/${id}`;

  /* Réccupération des infos du produit */

  (async function () {
    const product = await getProduct(url);
    addAttributes(product);
  })();

  /* Réccupération du produit */

  async function getProduct(url) {
    try {
      const res = await fetch(url);
      const product = await res.json();

      return product;
    } catch (err) {
      console.warn(`Erreur de connexion avec le serveur:${err.message}`);

      return [];
    }
  }

  /* Insertion du produit et ses éléments */

  function addAttributes(product) {
    const image = document.createElement('img');
    image.src = product.imageUrl;
    image.alt = product.altTxt;
    const imageParent = document.querySelector('.item__img');
    imageParent.appendChild(image);

    const title = document.getElementById('title');
    title.textContent = product.name;

    const price = document.getElementById('price');
    price.textContent = product.price;

    const description = document.getElementById('description');
    description.textContent = product.description;

    const select = document.getElementById('colors');
    product.colors.forEach((color) => {
      const option = document.createElement('option');
      option.value = color;
      option.textContent = color;
      select.appendChild(option);
    });
  }

  /*  Ajouter des produits dans le panier */

  /* Elimination des situations où les choix ne sont pas fait */
  const button = document.getElementById('addToCart');
  button.addEventListener('click', () => {
    let color = document.getElementById('colors').value;
    let quantity = document.getElementById('quantity').value;

    if (color === '' && quantity === '0') {
      alert('Veuillez sélectionner la couleur et la quantité');
      return;
    } else if (color === '') {
      alert('Veuillez sélectionner la couleur');
      return;
    } else if (quantity === '0') {
      alert('Veuillez sélectionner la quantité');
      return;
    } else if (quantity > 100) {
      alert('Le maximum est de 100');
      return;
    }

    /* Création d'un array contenant l'id, la couleur et la nouvelle propriété quantity pour le nombre d'objets commandés */
    const selectedProduct = {
      id: id,
      color: color,
      quantity: Number(quantity),
    };
    let cart = localStorage.getItem('Cart');
    cart = JSON.parse(cart) ?? [];

    /* Recherche du produit dans le panier */
    let item = cart.find(
      (cartItem) =>
        selectedProduct.id == cartItem.id && selectedProduct.color == cartItem.color
    );

    /* Ajout de l'article */
    if (item) {
      let totalQuantity = Number(selectedProduct.quantity) + Number(item.quantity);
      if (totalQuantity < 101) {
        alert('Ajouté au panier');
        item.quantity = totalQuantity;
        localStorage.setItem('Cart', JSON.stringify(cart));
      } else {
        alert('Le maximum est de 100');
        localStorage.removeItem('cart');
      }
    } else {
      alert('Ajouté au panier');
      cart.push(selectedProduct);
      localStorage.setItem('Cart', JSON.stringify(cart));
    }

    /* Remise à zero des valeurs */
    document.getElementById('colors').value = '';
    document.getElementById('quantity').value = 0;
  });