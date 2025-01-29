window.addEventListener('DOMContentLoaded', () => {

  // global variables; items in the basket
  var basket = [];

  // Fake API call; populate the item options on program init
  (function () {
    // assuming item_options is the return of an API call containing all items and corresponding data
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

    // Fake API call; GET item data of item to be added to basket
    let itemData = item_options.find(item => item.id == item_id);

    // for items that are priced on weight, two properties are added to the item object
    // corresponding to the user inputted weight and price of weighed item calculated
    // using the aforesaid inputted weight
    if (!itemData.price_per_weight || (itemData.price_per_weight && weightInput)) {
      Object.assign(itemData, weightInput ? {
        input_weight: +weightInput,
        weighed_price: +weightInput * itemData.price_per_weight
      } : {});
      // item is added to the basket array
      basket.push(itemData);

      if (weightInput) {
        weightInputElement.value = '';
      }

      // basket subtotal is refreshed,
      // which leads to savings and total also being refreshed
      refreshBasket();
    }
  }

  // function; removes an item from the basket on basket item click in UI
  function removeFromBasket(elementPosition) {
    // the basket item is removed from the basket array
    basket.splice(elementPosition, 1);

    // basket subtotal is refreshed,
    // which leads to savings and total also being refreshed
    refreshBasket();
  }

  // function; refreshes the items in the basket and the subtotal,
  // which leads to savings and total also being refreshed
  function refreshBasket() {
    const basketElement = document.getElementById('basket');
    const subTotalElement = document.getElementById('subtotal');
    // reset subtotal ready for recalculation of basket items
    let subtotal = 0;

    basketElement.innerHTML = '';
    subTotalElement.textContent = '';

    // cycle through each basket item, adding the item price
    // to the subtotal (individual or weighed accordingly)
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
    // savings and total are calculated using the subtotal
    calculateBasket(subtotal);
  }

  // function; calculates the savings and total (subtotal minus savings)
  function calculateBasket(subtotal) {
    // savingsItems is an array of objects representing grouped similar basket items
    // and offer details associated with those grouped items; includes the calculated
    // value of the offer to be deducted from the subtotal

    // important note: even though a group of basket items may have an associated offer,
    // it is not automatically true that the group has accrued any savings, as the number of
    // corresponding basket items may not be sufficient i.e. a minimum of 3 tins of beans
    // is required to accrue savings on beans

     // reset calculations
    let savingsItems = [];
    let totalSavings = 0;
    let total = 0;

    document.getElementById('savings').innerHTML = '';

    // if basket is not empty cycle through each basket item
    if (basket.length) {
      basket.forEach(basketItem => {
        // Fake API call; GET any offers associated with basket item
        let itemOnOffer = item_offers.find(itemOffer => itemOffer.item_id.includes(basketItem.id));

        // if an offer is found from the API return, add or amend an item in the savings array to represent it
        if (itemOnOffer) {
          let savingsOffer = savingsItems.find(savingsOfferItem => savingsOfferItem.item_offer_id == itemOnOffer.id);

          if (savingsOffer) {
            // if an item corresponding to the offer is already stored in the savings array,
            // increment the number of basket items subject to offer
            savingsOffer.item_count = ++savingsOffer.item_count;
          } else {
            // if an item corresponding to the offer is not stored in the savings array,
            // add an savings item object to represent it
            savingsItems.push({
              item_offer_id: itemOnOffer.id,
              item_price: basketItem.price_per_item,
              item_count: 1
            });
          }
        }
      });

      // cycle through each object in the savings array
      savingsItems.forEach(savingsItem => {
        // Fake API call; GET the offer associated with saving item object
        let itemOffer = item_offers.find(itemOffersElement => itemOffersElement.id == savingsItem.item_offer_id);
        // calculate offer saving value using the method in the item offer object,
        // from the number of basket items subject to the offer and the original item price
        // only if the number of items satisfies the offer will the offer count and saving value be above zero
        let savingsValue = itemOffer.savings(savingsItem.item_count, savingsItem.item_price);

        // append offer details and savings value to saving item object even if zero,
        // savings value is the total value of savings accrued and
        // offer_count is the number of times the offer has been applied
        savingsItem['offer_name'] = itemOffer.offer_name;
        savingsItem['offer_value'] = savingsValue.savings_value;
        savingsItem['offer_count'] = savingsValue.offer_count;

        // if an offer has been applied at least once to a group of basket items,
        // add the offer savings to the savings total
        if (savingsValue.offer_count > 0) {
          totalSavings += savingsValue.savings_value;
          document.getElementById('savings').innerHTML += `<li class="savings__item">
              ${itemOffer.offer_name} x ${savingsValue.offer_count} saving £${savingsValue.savings_value.toFixed(2)}
            </li>`;
        }
      });
    }

    // calculate the total by subtracting the savings from the subtotal
    document.getElementById('savings-total').textContent = `£${totalSavings.toFixed(2).toString()}`;
    total = subtotal - totalSavings;
    document.getElementById('total').textContent = `£${total.toFixed(2).toString()}`;
  }
});

// Faux API item data; representing each available item
// is_weighed_item identifies items priced by weight
// an item should only have a price_per_item or price_per_weight
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
// Faux API offer data; representing offers available
// item_id is an array of items that are subject to the offer
// savings method calculates the potential savings from an applied offer
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
