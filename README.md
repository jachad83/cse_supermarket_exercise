# CSE SuperMarket Pricing Calculator Exercise - James Chadwick

## General comments:

- I coded this exercise without the prior planning I'd usually do, so it represents my thought process as opposed to what I think is a perfect answer (which this isn't).
- I coded a very basic UI to accompany the calculations even though it wasn't required, I thought it would be almost as much effort to code to the console as making a basic UI. I also haven't coded vanilla JS in several months and so I took the opportunity to refresh my memory!
- The code that actually solves the exercise is found from line 95 onwards in the scripts.js file.

## How to use

- open the index.html file in any browser with JS enabled.
- To add an item to the basket click on an item text underneath the text 'Options'.
- To add 'Onions' or 'Oranges' a number must be entered in the 'Weight' input box.
  - There is no validation on the input box as I felt that was outside the scope of the exercise.
- To remove an item from the basket click on an item text underneath the text 'Basket'
  - The subtotal, savings and total are calculated every time the basket items change i.e. one is added or removed.

## Strengths

- The item and offer data is separated; this could make the data more robust as a data error may not affect both data sets.
- All items that are subject to an offer, regardless if they accrue savings, are collated into groups. If as suggested below further offers are added and items become subject to multiple offers, the code could be expanded to collate all possible offer combinations and the combination of offers that provide the largest saving selected for use.

## Weaknesses and areas for further development

- The code requires multiple faux API calls; this is a trade-off to achieve the above strength of data robustness, while it would slow down the process and increase the number of potential failure points.
- The code doesn't take into account that an item may have more than one offer associated with it. As it exists now, if for instance a new offer is added where coca-cola and ale(s) in combination are subject to it, the same item may be used to qualify for multiple offers.
- The method to calculate the savings should be refactored by being removed from the item_offer object.
- Individually and weighed priced items should have their pricing methods separated to prevent user error at time of input.

Thank you for taking the time to read my notes and (hopefully) use the app!

James
