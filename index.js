

// Menü kartları
const menuCardsContainer = document.getElementById('menu-cards');
const viewMenuButton = document.querySelector('.menu4 button');
let allPosts = [];
let filteredPosts = [];
let selectedCategory = "ALL";
let isAllPostsVisible = false;

const categoryLinks = document.querySelectorAll('.category');

// Sepet için gerekli değişkenler
const basketModal = document.getElementById("basketModal");
const closeButton = document.querySelector(".close");
const viewBasketBtn = document.getElementById('viewBasketBtn');
const clearBasketBtn = document.getElementById('clearBasketBtn');
const basketContents = document.getElementById('basketContents');
const basketSummary = document.getElementById('basketSummary');
const continueShoppingBtn = document.getElementById('continueShoppingBtn');
const checkoutBtn = document.getElementById('checkoutBtn');
let basket = [];

// Verileri al
fetch('db.json')
    .then(response => response.json())
    .then(data => {
        allPosts = data.posts;
        filteredPosts = allPosts;
        displayPosts(getRandomPosts(filteredPosts, 4)); 
    })
    .catch(error => {
        console.error('Error fetching the data:', error);
    });

function getRandomPosts(posts, count) {
    const shuffled = [...posts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Sepete ürün ekle
function addToBasket(post) {
  let productInBasket = basket.find(item => item.id === post.id);

  // Ürün zaten sepette varsa, miktarını arttır
  if (productInBasket) {
      productInBasket.quantity++;
  } else {
      post.quantity = 1;
      basket.push(post);
  }

  // Sepet güncellemesini yap
  updateBasket();
}

// Sepetteki ürünleri güncelle
function updateBasket() {
    basketContents.innerHTML = '';

    if (basket.length === 0) {
        basketContents.innerHTML = "<p>empty</p>";
        basketSummary.innerHTML = "";
    } else {
        let totalQuantity = 0;
        let totalPrice = 0;

        basket.forEach(post => {
            const basketItem = document.createElement('div');
            basketItem.classList.add("basket-item");
            
            basketItem.innerHTML = `
                <img src="${post.image}" width="50">
                <span>${post.title} - ${post.price}₺ x ${post.quantity}</span>
                <span>Total: ${(post.price * post.quantity).toFixed(2)}₺</span>
                <button class="remove-btn" data-id="${post.id}">Sil</button>
                <button class="decrease-quantity" data-id="${post.id}">-</button>
                <button class="increase-quantity" data-id="${post.id}">+</button>
            `;
            basketContents.appendChild(basketItem);

            totalQuantity += post.quantity;
            totalPrice += post.price * post.quantity;
        });

        const taxAndShipping = 20;
        const discount = 10;
        const totalAfterDiscount = totalPrice - discount;
        const grandTotal = totalAfterDiscount + taxAndShipping;

        basketSummary.innerHTML = `
            <p><strong>Toplam Ürün Sayısı:</strong> ${totalQuantity}</p>
            <p><strong>Genel Toplam:</strong> ${grandTotal.toFixed(2)}₺</p>
        `;
        updateRemoveBtns();
        updateQuantityBtns();
    }
}

// Ürün silme
function removeFromBasket(productId) {
    basket = basket.filter(post => post.id !== productId);
    updateBasket();
}

// Sepetteki ürün adet artırma
function increaseQuantity(productId) {
    let product = basket.find(post => post.id === productId);
    if (product) {
        product.quantity++;
        updateBasket();
    }
}

// Sepetteki ürün adet azaltma
function decreaseQuantity(productId) {
    let product = basket.find(post => post.id === productId);
    if (product && product.quantity > 1) {
        product.quantity--;
        updateBasket();
    }
}

// Sepet modal'ı açma
viewBasketBtn.addEventListener('click', function() {
    basketModal.style.display = "block";
    updateBasket();
});

// Modal'ı kapama
closeButton.onclick = function() {
    basketModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == basketModal) {
        basketModal.style.display = "none";
    }
}

// Sepeti boşaltma
clearBasketBtn.addEventListener('click', function() {
    basket = [];
    updateBasket();
});

// Alışverişe devam etme
continueShoppingBtn.addEventListener('click', function() {
    basketModal.style.display = "none";
});

// Ödeme yapma
checkoutBtn.addEventListener('click', function() {
    alert("Siparişiniz kabul edildi.");
    basket = [];  // Sepeti boşalt
    updateBasket(); // Sepet güncellemesi yap
});

// Sepet işlevleri
function updateRemoveBtns() {
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            removeFromBasket(productId);
        });
    });
}

function updateQuantityBtns() {
    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            increaseQuantity(productId);
        });
    });

    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            decreaseQuantity(productId);
        });
    });
}

// Kartları görselleştirme
function displayPosts(postsToDisplay) {
  menuCardsContainer.innerHTML = ''; 
  postsToDisplay.forEach(post => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `
          <img src="${post.image}" alt="Menu Image">
          <p>${post.price}₺</p>
          <div class="propss">
              <h4>${post.title}</h4>
          </div>
          <div class="propss-two">
              <p>${post.description.slice(0, 15)}...</p>
              <button data-id="${post.id}" data-title="${post.title}" data-price="${post.price}" data-image="${post.image}" onclick="addToBasketFromButton(this)">Order Now</button>
          </div>
      `;
      menuCardsContainer.appendChild(card);
  });
}

// Butona tıklandığında addToBasket fonksiyonunu çağır
function addToBasketFromButton(button) {
    const post = {
        id: button.getAttribute('data-id'),
        title: button.getAttribute('data-title'),
        price: button.getAttribute('data-price'),
        image: button.getAttribute('data-image')
    };
    addToBasket(post);
}

// Kategori değişikliği
categoryLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        selectedCategory = e.target.getAttribute('data-category');
        isAllPostsVisible = false;
        viewMenuButton.textContent = 'View All';

        if (selectedCategory === "ALL") {
            filteredPosts = allPosts; 
        } else {
            filteredPosts = allPosts.filter(post => post.category === selectedCategory);
        }

        displayPosts(getRandomPosts(filteredPosts, 4));
    });
});

viewMenuButton.addEventListener('click', () => {
    if (isAllPostsVisible) {
        displayPosts(getRandomPosts(filteredPosts, 4));
        viewMenuButton.textContent = 'View All';
    } else {
        displayPosts(filteredPosts);
        viewMenuButton.textContent = 'View Less';
    }

    isAllPostsVisible = !isAllPostsVisible;
});

// Form kontrol fonksiyonu
function checkForm() {
    const name = document.querySelector('input[type="text"]').value;
    const people = document.querySelector('select').value;
    const date = document.querySelector('input[type="date"]').value;
    const time = document.querySelector('input[type="time"]').value;
    const message = document.querySelector('textarea').value;

    if (name === '' || people === '' || date === '' || time === '' || message === '') {
        alert('Please fill in all fields before submitting!'); 
        return false;
    }

    alert(`Reservation Details:\n\nName: ${name}\nPerson: ${people}\nDate: ${date}\nTime: ${time}\nMessage: ${message}`);
    return false;
}

// Burger menü işlevi
document.addEventListener('DOMContentLoaded', function () {
    const burger = document.querySelector('.burger');
    const nav2 = document.querySelector('.nav2');

    burger.addEventListener('click', function () {
        nav2.classList.toggle('active');
    });
});


// === === === === ==MƏHSULLARIN MODELİ== === === === === === == === === === === === === === === ==
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("OurStory-modal");
    const openModalBtn = document.getElementById("OurStory-openModal");
    const closeModalBtn = document.querySelector(".OurStory-close");

    openModalBtn.addEventListener("click", () => {
        modal.style.display = "block";
    });

    closeModalBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});




document.querySelectorAll('.chef2-prof').forEach((prof) => {
    prof.addEventListener('click', function () {
        const chef = this.getAttribute('data-chef');
        const modal = document.getElementById(`chef-modal-${chef}`);
        if (modal) {
            modal.style.display = 'block';
        }
    });
});

document.querySelectorAll('.chef-modal-close').forEach((closeBtn) => {
    closeBtn.addEventListener('click', function () {
        this.closest('.chef-modal').style.display = 'none';
    });
});

window.addEventListener('click', function (event) {
    if (event.target.classList.contains('chef-modal')) {
        event.target.style.display = 'none';
    }
});

// === === === === ==MƏHSULLARIN MODELİ== === === === === === == === === === === === === === === ==