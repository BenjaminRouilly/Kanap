/* Evite les erreurs de syntaxe en évitant les variables non déclarées */
'use strict';

/* Création des éléments avec la récupération des données de l'API */
function addProducts(product) {
  const image = document.createElement('img');
  image.src = product.imageUrl;
  image.alt = product.altTxt;

  const h3 = document.createElement('h3');
  h3.classList.add('productName');
  h3.textContent = product.name;

  const p = document.createElement('p');
  p.classList.add('productDescription');
  p.textContent = product.description;

  const article = document.createElement('article');
  article.appendChild(image);
  article.appendChild(h3);
  article.appendChild(p);

  const link = document.createElement('a');
  link.href = './product.html?id=' + product._id;
  link.appendChild(article);

  document.getElementById('items').appendChild(link);
}

/* Récupération de la liste des produits sur l'API / message d'erreur */
async function getproducts() {
  try {
    const res = await fetch('http://localhost:3000/api/products');
    const products = await res.json();

    return products;
  } catch (err) {
    console.warn(`${err.message}: ${'Erreur de connexion avec le serveur'}`);

    return [];
  }
}

/* Ajout des produits sur la page d'accueil*/
(async function () {
  const products = await getproducts();
  products.forEach((product) => addProducts(product));
})();
