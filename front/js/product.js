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