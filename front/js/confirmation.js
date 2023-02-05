    'use strict';
    /* Récupération de l'orderId pour que le numéro de commande soit visible sur la page */
    let orderId = new URLSearchParams(window.location.search).get('id');
    let displayIdOrder = document.getElementById('orderId');
    displayIdOrder.textContent = orderId;

    /* Une fois le numéro de la commande affiché, nettoyage du localStorage */
    localStorage.clear();