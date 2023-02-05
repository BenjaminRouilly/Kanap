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

    /** Récupération des données sur le produit depuis localStorage, on vérifie si les données du panier correspondents
     * à celles de l'API */
    (async function () {
        const products = await getProducts(url);
      
        for (let i = 0; i < cart.length; i++) {
          for (let j = 0; j < products.length; j++) {
            if (cart[i].id === products[j]._id) {
            cart[i].imageUrl = products[j].imageUrl;
            cart[i].altTxt = products[j].altTxt;
            cart[i].name = products[j].name;
            cart[i].price = products[j].price;
            cart[i].total = cart[i].quantity * products[j].price;
          }
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

    /* Constante pour le formulaire de contact */
    const order = document.getElementById('order');

  /*
  *  Création d'un objet contact, vérification des données fournies par l'utilisateur à l'aide d'expressions régulières 
  blocage et message d'erreur si contenu non conforme au format attendu */
  order.addEventListener('click', (event) => {
    event.preventDefault();

    const contact = {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      address: document.getElementById('address').value,
      city: document.getElementById('city').value,
      email: document.getElementById('email').value,
    };

    const firstName = contact.firstName;
    const lastName = contact.lastName;
    const address = contact.address;
    const city = contact.city;
    const email = contact.email;

    const cityNameRegex = (value) => {
      return /^[A-Za-z ,.'-]{1,40}$/.test(value);
    };

    const cityNameErrorMsg = `Veuillez n'utiliser que des lettres majuscules ou minuscules, des espaces ou les caractères suivants: , . ' -`;

    function verifyFirstName() {
      let firstNameErrorMsg = document.getElementById('firstNameErrorMsg');

      if (cityNameRegex(firstName)) {
        firstNameErrorMsg.innerText = '';
        return true;
      } else {
        firstNameErrorMsg.innerText = cityNameErrorMsg;
        return false;
      }
    }

    function verifyLastName() {
      let lastNameErrorMsg = document.getElementById('lastNameErrorMsg');

      if (cityNameRegex(lastName)) {
        lastNameErrorMsg.innerText = '';
        return true;
      } else {
        lastNameErrorMsg.innerText = cityNameErrorMsg;
        return false;
      }
    }

    function verifyAddress() {
      let addressErrorMsg = document.getElementById('addressErrorMsg');

      if (/^[A-Za-z0-9° ,.'-]{1,80}$/.test(address)) {
        addressErrorMsg.innerText = '';
        return true;
      } else {
        addressErrorMsg.innerText = `Veuillez n'utiliser que des lettres majuscules ou minuscules, des espaces ou les caractères suivants: , . ' -`;
        return false;
      }
    }

    function verifyCity() {
      let cityErrorMsg = document.getElementById('cityErrorMsg');

      if (cityNameRegex(city)) {
        cityErrorMsg.innerText = '';
        return true;
      } else {
        cityErrorMsg.innerText = cityNameErrorMsg;
        return false;
      }
    }

    function verifyEmail() {
      let emailErrorMsg = document.getElementById('emailErrorMsg');

      if (/^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,4}$/.test(email)) {
        emailErrorMsg.innerText = '';
        return true;
      } else {
        emailErrorMsg.innerText =
          'Email invalide, veuillez renseigner une adresse mail correcte, par exemple: utilisateur@mail.fr';
        return false;
      }
    }

    if (
      verifyFirstName() && verifyLastName() && verifyAddress() && verifyCity() && verifyEmail()) {
      localStorage.setItem('contact', JSON.stringify(contact));

      let products = [];
      for (let selectedItem of cart) {
        products.push(selectedItem.id);
      }

      const postProperties = {
        products,
        contact,
      };

      postCommand(postProperties);
    } else {
      alert('Veuillez remplir tous les champs du formulaire');
    }
  });

  /* Appel de l'API avec Fetch et envoi des données avec la méthode POST si le formulaire est conforme aux attentes */
  function postCommand(postProperties) {
    if (cart.length == 0) {
      alert("Il n'y a pas d'article dans votre panier");
      return;
    }

    const promise = fetch('http://localhost:3000/api/products/order', {
      method: 'POST',
      body: JSON.stringify(postProperties),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    promise.then(async (response) => {
      try {
        const content = await response.json();
        let orderId = content.orderId;

        window.location.assign('confirmation.html?id=' + orderId);
      } catch (error) {
        console.log(error);
      }
    });
  }