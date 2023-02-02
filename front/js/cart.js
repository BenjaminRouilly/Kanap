'use strict';
/* Récuperation du LocalStorage */
let cart = localStorage.getItem('Cart');
cart = JSON.parse(cart);

/* Si le panier n'existe pas le panier sera vide */
if (cart == null) {
  cart = [];
}

/* URL de l'API */
const url = `http://localhost:3000/api/products/`;

/* Div dans laquelle on ajoutera le contenu du panier */
const cart__items = document.getElementById("cart__items");

  /* Réccupération du produit */

  async function getProducts(url) {
    try {
      const res = await fetch(url);
      const product = await res.json();
  
      return product;
    } catch (err) {
        console.warn(`Erreur de connexion avec le serveur:${err.message}`);
  
      return [];
    }
  }

/** Récupération des données sur le produit depuis LocalStorage */
(async function () {
    const products = await getProducts(url);
  
    for (let i = 0; i < cart.length; i++) {
      for (let j = 0; j < products.length; j++) {
        if (cart[i].id === products[j]._id) cart[i].imageUrl = products[j].imageUrl;
        cart[i].altTxt = products[j].altTxt;
        cart[i].name = products[j].name;
        cart[i].price = products[j].price;
        cart[i].total = cart[i].quantity * products[j].price;
      }
    }
    checkCart();
  })();

  /* Si local storage vide > panier vide */
  function checkCart() {
    cart__items.innerText = '';
    cart.forEach((item) => addItemsToCart(item));
  
    if (cart === null || cart == 0) {
      document.getElementById('totalQuantity').textContent = 0;
      document.getElementById('totalPrice').textContent = 0;
      document.querySelector('h1').innerHTML = 'Votre panier est vide';
      cart = [];
    }
  }

/* Création des élements dans le panier depuis l'API */
function addItemsToCart(item) {
  const cartArticle = document.createElement('article');
  cartArticle.classList.add('cart__item');
  cartArticle.dataset.id = item.id;
  cartArticle.dataset.color = item.color;
  cart__items.appendChild(cartArticle);

  const imgProduct = document.createElement('div');
  imgProduct.classList.add('cart__item__img');
  cartArticle.appendChild(imgProduct);
  const cartImage = document.createElement('img');
  cartImage.src = item.imageUrl;
  cartImage.alt = item.altTxt;
  imgProduct.appendChild(cartImage);

  const contentProduct = document.createElement('div');
  contentProduct.classList.add('cart__item__content');
  cartArticle.appendChild(contentProduct);

  const contentDescriptionProduct = document.createElement('div');
  contentDescriptionProduct.classList.add('cart__item__content__description');
  contentProduct.appendChild(contentDescriptionProduct);

  const productName = document.createElement('h2');
  productName.textContent = item.name;
  contentDescriptionProduct.appendChild(productName);

  const productColor = document.createElement('p');
  productColor.textContent = 'Couleur: ' + item.color;
  contentDescriptionProduct.appendChild(productColor);

  const productPrice = document.createElement('p');
  productPrice.textContent = 'Prix: ' + item.price + ' €';
  contentDescriptionProduct.appendChild(productPrice);

  const settingsProduct = document.createElement('div');
  settingsProduct.classList.add('cart__item__content__settings');
  contentProduct.appendChild(settingsProduct);

  const settingsQuantityProduct = document.createElement('div');
  settingsQuantityProduct.classList.add('cart__item__content__settings__quantity');
  settingsProduct.appendChild(settingsQuantityProduct);

  const productQuantity = document.createElement('p');
  productQuantity.textContent = 'Qté :';
  settingsQuantityProduct.appendChild(productQuantity);

  const itemQuantity = document.createElement('input');
  itemQuantity.classList.add('itemQuantity');
  itemQuantity.type = 'number';
  itemQuantity.name = 'itemQuantity';
  itemQuantity.min = '1';
  itemQuantity.max = '100';
  itemQuantity.value = item.quantity;
  itemQuantity.addEventListener('input', () =>
    editedQuantity(item.id, item.color, itemQuantity.value)
  );
  settingsQuantityProduct.appendChild(itemQuantity);

  const deletesettingsProduct = document.createElement('div');
  deletesettingsProduct.classList.add('cart__item__content__settings__delete');
  settingsProduct.appendChild(deletesettingsProduct);

  const productDelete = document.createElement('p');
  productDelete.classList.add('deleteItem');
  productDelete.textContent = 'Supprimer';
  deletesettingsProduct.appendChild(productDelete);

/* Utilisation d'Element.closest pour ne pas répéter les données dans les éléments enfants */
  const dataId = productDelete.closest('.cart__item').dataset.id;
  const dataColor = productDelete.closest('.cart__item').dataset.color;
  productDelete.addEventListener('click', () => deleteItem(dataId, dataColor));

  addTotalQuantity();
  addTotalPrice();
}

/* Calculer et afficher la quantité totale */
function addTotalQuantity() {
  let itemsTotalQuantity = document.getElementById('totalQuantity');
  let totalQuantity = 0;

  for (let i = 0; i < cart.length; i++) {
    totalQuantity += cart[i].quantity;
  }
  itemsTotalQuantity.textContent = totalQuantity;
}

/* Calculer et afficher le prix total */
function addTotalPrice() {
  let itemsTotalPrice = document.getElementById('totalPrice');
  let totalPrice = 0;

  for (let i = 0; i < cart.length; i++) {
    totalPrice += cart[i].quantity * cart[i].price;
  }
  itemsTotalPrice.textContent = totalPrice;
}

/* Modifier la quantité dans le localStorage */
function editedQuantity(id, color, newValue) {
  const itemToChange = cart.find(
    (item) => item.id === id && item.color === color
  );
  itemToChange.quantity = Number(newValue);

  addTotalQuantity();
  addTotalPrice();
  localStorage.setItem('Cart', JSON.stringify(cart));
}

/* Supprimer un article */
function deleteItem(dataId, dataColor) {
  for (let i = 0; i < cart.length; i++) {
    let product = cart[i];
    if (product.id === dataId && product.color === dataColor) {
      cart.splice(i, 1);
    }
    localStorage.setItem('Cart', JSON.stringify(cart));
    checkCart();
  }
}

/* Constante pour le formulaire */
const order = document.getElementById('order');

