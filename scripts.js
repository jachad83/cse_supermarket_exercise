window.addEventListener('DOMContentLoaded', () => {

  // global variables; items in the basket
  var basket = [];

  // Fake API call; populate the item options on program init on program init
  (function () {
    item_options.forEach(element => {
      document.getElementById('options').innerHTML += `<li class="options__item" data-id="${element.id}">
          ${element.item_name}
        </li>`;
    });

    for (element of document.getElementsByClassName('options__item')) {
      element.addEventListener('click', function() {
        addToBasket(this.dataset.id);
      });
    }
  })();

  // function; adds an item to the basket on item option click in UI
  function addToBasket(item_id) {
    const weightInputElement = document.getElementById('weight');
    const weightInput = weightInputElement.value;

    // Fake API call; GET item data of item added to basket
    let itemData = item_options.find(item => item.id == item_id);

    if (!itemData.price_per_weight || (itemData.price_per_weight && weightInput)) {
      Object.assign(itemData, weightInput ? {
        input_weight: +weightInput,
        weighed_price: +weightInput * itemData.price_per_weight
      } : {});
      basket.push(itemData);

      if (weightInput) {
        weightInputElement.value = '';
      }

      refreshBasket();
    }
  }

  // function; removes an item from the basket on basket item click in UI
  function removeFromBasket(elementPosition) {
    basket.splice(elementPosition, 1);
    refreshBasket();
  }

  // function; refreshes the items in the basket and the subtotal
  function refreshBasket() {
    const basketElement = document.getElementById('basket');
    const subTotalElement = document.getElementById('subtotal');
    let subtotal = 0;

    basketElement.innerHTML = '';
    subTotalElement.textContent = '';

    basket.forEach(basketItem => {
      const itemPrice = basketItem.is_weighed_item ? basketItem.weighed_price : basketItem.price_per_item;

      document.getElementById('basket').innerHTML += `<li class="basket__item">
          ${basketItem.item_name} ${basketItem.is_weighed_item ? `${basketItem.input_weight}kg` : '' } - £${itemPrice.toFixed(2)}
        </li>`;
      subtotal += itemPrice
    });

    subTotalElement.textContent = `£${subtotal.toFixed(2).toString()}`;

    for (element of document.getElementsByClassName('basket__item')) {
      element.addEventListener('click', function() {
        removeFromBasket(Array.prototype.indexOf.call(basketElement.children, this));
      });
    }
    calculateBasket(subtotal);
  }

  function calculateBasket(subtotal) {
    let savingsItems = [];
    let totalSavings = 0;
    let total = 0;

    document.getElementById('savings').innerHTML = '';

    if (basket.length) {
      basket.forEach(basketItem => {
        let itemOnOffer = item_offers.find(itemOffer => itemOffer.item_id.includes(basketItem.id));

        if (itemOnOffer) {
          let savingsOffer = savingsItems.find(savingsOfferItem => savingsOfferItem.item_offer_id == itemOnOffer.id);

          if (savingsOffer) {
            savingsOffer.item_count = ++savingsOffer.item_count;
          } else {
            savingsItems.push({
              item_offer_id: itemOnOffer.id,
              item_price: basketItem.price_per_item,
              item_count: 1
            });
          }
        }
      });

      savingsItems.forEach(savingsElement => {
        let itemOffer = item_offers.find(itemOffersElement => itemOffersElement.id == savingsElement.item_offer_id);
        let savingsValue = itemOffer.savings(savingsElement.item_count, savingsElement.item_price);

        savingsElement['offer_name'] = itemOffer.offer_name;
        savingsElement['offer_value'] = savingsValue.savings_value;
        savingsElement['offer_count'] = savingsValue.offer_count;
      });

      savingsItems.forEach(savingsItem => {
        if (savingsItem.offer_count > 0) {
          totalSavings += savingsItem.offer_value
          document.getElementById('savings').innerHTML += `<li class="savings__item">
              ${savingsItem.offer_name} x ${savingsItem.offer_count} saving £${savingsItem.offer_value.toFixed(2)}
            </li>`;
        }
      });
    }

    document.getElementById('savings-total').textContent = `£${totalSavings.toFixed(2).toString()}`;
    total = subtotal - totalSavings;
    document.getElementById('total').textContent = `£${total.toFixed(2).toString()}`;
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
    item_name: 'Ale One',
    price_per_item: 2.50,
    is_weighed_item: false,
    price_per_weight: 0
  },
  {
    id: 5,
    item_name: 'Ale Two',
    price_per_item: 2.50,
    is_weighed_item: false,
    price_per_weight: 0
  },
  {
    id: 6,
    item_name: 'Ale Three',
    price_per_item: 2.50,
    is_weighed_item: false,
    price_per_weight: 0
  },
  {
    id: 7,
    item_name: 'Ale Four',
    price_per_item: 2.50,
    is_weighed_item: false,
    price_per_weight: 0
  },
  {
    id: 8,
    item_name: 'Ale Five',
    price_per_item: 2.50,
    is_weighed_item: false,
    price_per_weight: 0
  },
  {
    id: 9,
    item_name: 'Oranges',
    price_per_item: 0,
    is_weighed_item: true,
    price_per_weight: 1.99
  }
];

const item_offers = [
  {
    id: 1,
    item_id: [2],
    offer_name: 'Beans 3 for 2',
    savings: function(itemCount, pricePerItem) {
      let savings;
      let count = Math.trunc(itemCount/3);

      savings = count * pricePerItem;

      return {
        savings_value: savings,
        offer_count: count
      };
    }
  },
  {
    id: 2,
    item_id: [1],
    offer_name: '2 Cans of Coca-cola for £1',
    savings: function(itemCount, pricePerItem) {
      let savings;
      let count = Math.trunc(itemCount/2);

      savings = count * (pricePerItem - 0.30);

      return {
        savings_value: savings,
        offer_count: count
      };
    }
  },
  {
    id: 3,
    item_id: [4, 5, 6, 7, 8],
    offer_name: 'Any 3 ales for £6',
    savings: function(itemCount, pricePerItem) {
      let savings;
      let count = Math.trunc(itemCount/3);

      savings = count * (pricePerItem - 1);

      return {
        savings_value: savings,
        offer_count: count
      };
    }
  }
];
