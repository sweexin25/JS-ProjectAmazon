import {cart, removeFromCart, calculateCartQuantity, updateDeliveryOption} from '../../data/cart.js';
import {products, getProduct} from '../../data/products.js';
import {formatCurrency} from '../utils/money.js';
import {hello} from 'https://unpkg.com/supersimpledev@1.0.1/hello.esm.js';
import {calculateDeliveryDate, deliveryOptions, getDeliveryOption} from '../../data/deliveryOptions.js'
import {renderPaymentSummary} from './paymentSummary.js'

//just  practices for external libraries
// hello();

// const today = dayjs();
// const deliveryDate = today.add(7, 'days');
// console.log(deliveryDate.format('D/M/YYYY'));

export function renderOrderSummary(){
  let cartSummaryHTML ='';
  cart.forEach((cartItem)=>{
    const productId = cartItem.productId;

    const matchingProduct = getProduct(productId);
    
    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const dateStr = calculateDeliveryDate(deliveryOption)
      
    cartSummaryHTML += 
    `
    <div class="cart-item-container  js-cart-item-container js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: ${dateStr}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingProduct.image}">

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
            RM${matchingProduct.getPrice()}
          </div>
          <div class="product-quantity js-product-quantity-${matchingProduct.id}">
            <span>
              Quantity: <span class="quantity-label">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary">
              Update
            </span>
            <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${matchingProduct.id}" data-product-id="${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          ${deliveryOptionsHTML(matchingProduct, cartItem)}
        </div>
      </div>
    </div>
    `
  });

  //console.log(cartSummaryHTML);

  function deliveryOptionsHTML(matchingProduct, cartItem){
    let html ='';

    deliveryOptions.forEach((deliveryOption)=>{
      
      const dateStr = calculateDeliveryDate(deliveryOption);

      const priceStr = deliveryOption.priceCents === 0?  'FREE' : `RM${formatCurrency(deliveryOption.priceCents)} -`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;


      html += `
        <div class="delivery-option js-delivery-option" data-product-id="${matchingProduct.id}" data-delivery-option-id="${deliveryOption.id}">
          <input type="radio"
          ${isChecked? 'checked' : ''}
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              ${dateStr}
            </div>
            <div class="delivery-option-price">
              ${priceStr} Shipping
            </div>
          </div>
        </div>
      `
    })

    return html;
  }

  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

  document.querySelectorAll('.js-delete-link').forEach((link)=> {
    link.addEventListener('click',()=>{
      const productId = link.dataset.productId;
      removeFromCart(productId);

      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      container.remove();
      updateCartQuantity();
      renderPaymentSummary();
    })
  })

  document.querySelectorAll('.js-delivery-option').forEach((element)=>{
    element.addEventListener('click', () =>{
      // const {productId, deliveryOptionId} = element.dataset;
      const productId = element.dataset.productId;
      const deliveryOptionId = element.dataset.deliveryOptionId;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    })
  })
}



function updateCartQuantity(){
  const cartQuantity = calculateCartQuantity();

  const returnToHomeLink = document.querySelector('.js-return-to-home-link');

  // Only update it if it exists on the page
  if (returnToHomeLink) {
    returnToHomeLink.innerHTML = `${cartQuantity} items`;
  }
  
}
updateCartQuantity();

