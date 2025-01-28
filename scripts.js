window.addEventListener('DOMContentLoaded', () => {

  // global variables; items in the basket, basket running subtotal
  var userBasket = [];
  var basketSubtotal = 0;

  // Fake API call; populate the item options on program init on program init
  (function () {
    item_options.forEach(element => {
      document.getElementById('options').innerHTML += `<li class="options__item" data-id="${element.id}">${element.item_name}</li>`;
    });

    for (element of document.getElementsByClassName('options__item')) {
      element.addEventListener('click', function() {
        addToBasket(this.dataset.id);
      });
    }

    document.getElementById('calculate-total').addEventListener('click', function() {
      calculateBasket();
    });
  })();

  // function; adds an item to the basket
  function addToBasket(item_id) {
    const weightInputElem = document.getElementById('weight');
    const weightInput = weightInputElem.value;

    // Fake API call; GET item data of item added to basket
    let itemData = item_options.find(element => element.id == item_id);

    if (!itemData.price_per_weight || (itemData.price_per_weight && weightInput)) {
      Object.assign(itemData, weightInput ? {
        input_weight: +weightInput,
        weighed_price: +weightInput * itemData.price_per_weight
      } : {});
      userBasket.push(itemData);

      if (weightInput) {
        weightInputElem.value = '';
      }

      refreshBasket();
    }
  }

  // function; removes an item from the basket
  function removeFromBasket(elementPos) {
    userBasket.splice(elementPos, 1);
    refreshBasket();
  }

  // function; refreshes the items in the basket and the running subtotal
  function refreshBasket() {
    const basketElem = document.getElementById('basket');
    const subTotalElem = document.getElementById('subtotal');
    subTotalElem.textContent = '';

    basketSubtotal = 0;
    basketElem.innerHTML = '';

    userBasket.forEach(element => {
      const price = element.is_weighed_item ? element.weighed_price : element.price_per_item;

      document.getElementById('basket').innerHTML += `<li class="basket__item">${element.item_name} - £${price.toFixed(2)}</li>`;
      basketSubtotal += price
    });

    subTotalElem.textContent = `£${basketSubtotal.toFixed(2).toString()}`;

    for (element of document.getElementsByClassName('basket__item')) {
      element.addEventListener('click', function() {
        removeFromBasket(Array.prototype.indexOf.call(basketElem.children, this));
      });
    }
  }

  function calculateBasket() {
    let savingsItems = [];

    if (userBasket.length) {
      userBasket.forEach(basketElement => {
        let isItemOnOffer = item_offers.find(itemOffersElement => itemOffersElement.item_id == basketElement.id);

        if (isItemOnOffer) {
          let offerItem = savingsItems.find(savingsElement => savingsElement.item_id == basketElement.id);

          if (offerItem) {
            offerItem.item_count = ++offerItem.item_count;
          } else {
            savingsItems.push({
              item_id: basketElement.id,
              item_price: basketElement.price_per_item,
              item_count: 1
            });
          }
        }

      });

      savingsItems.forEach(savingsElement => {
        let itemOffer = item_offers.find(itemOffersElement => itemOffersElement.item_id == savingsElement.item_id);

        savingsElement['offer_name'] = itemOffer.offer_name;
        savingsElement['offer_value'] = itemOffer.savings(savingsElement.item_count, savingsElement.item_price);
      });

      console.log('savingsItems', savingsItems);
    }
  }
});

// Faux API item data
const item_options = [
  {
    id: 1,
    item_name: 'Coca-Cola',
    price_per_item: 0.70,
    is_weighed_item: false,
    price_per_weight: 0
  },
  {
    id: 2,
    item_name: 'Beans',
    price_per_item: 0.50,
    is_weighed_item: false,
    price_per_weight: 0
  },
  {
    id: 3,
    item_name: 'Onions',
    price_per_item: 0,
    is_weighed_item: true,
    price_per_weight: 0.29
  },
  {
    id: 4,
    item_name: 'Ale',
    price_per_item: 2.50,
    is_weighed_item: false,
    price_per_weight: 0
  },
  {
    id: 5,
    item_name: 'Oranges',
    price_per_item: 0,
    is_weighed_item: true,
    price_per_weight: 1.99
  }
];

const item_offers = [
  {
    id: 1,
    item_id: 2,
    offer_name: 'Beans 3 for 2',
    savings: function(itemCount, pricePerItem) {
      let savings;

      let count = Math.trunc(itemCount/3);
      savings = count * pricePerItem;

      return savings;
    }
  },
  {
    id: 2,
    item_id: 1,
    offer_name: '2 Cans of Coca-cola for £1',
    savings: function(itemCount, pricePerItem) {
      let savings;

      let count = Math.trunc(itemCount/2);
      savings = count * (pricePerItem - 0.30);

      return savings;
    }
  }
];
