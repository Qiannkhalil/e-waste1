// Remove auction item
function removeAuctionItem(btn) {
  const item = btn.closest('.auction-item');
  if (item) item.remove();
}

// Mark item as sold
function markItemSold(btn) {
  const item = btn.closest('.auction-item');
  if (!item) return;
  item.classList.add('sold');
  // Disable all inputs and buttons in this item except Remove
  item.querySelectorAll('input, button').forEach(function(el) {
    if (!el.classList.contains('remove-btn')) {
      el.disabled = true;
    }
  });
  // Add sold label
  if (!item.querySelector('.sold-label')) {
    const soldLabel = document.createElement('div');
    soldLabel.className = 'sold-label';
    soldLabel.textContent = 'SOLD';
    item.insertBefore(soldLabel, item.firstChild);
  }
}
// Allow auction item images to be replaced by clicking on them
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.auction-img').forEach(function(img) {
    img.style.cursor = 'pointer';
    img.title = 'Click to change image';
    img.addEventListener('click', function() {
      const newUrl = prompt('Enter new image URL:', img.src);
      if (newUrl && newUrl.trim() && newUrl !== img.src) {
        img.src = newUrl.trim();
      }
    });
  });
});
// Add Item functionality for auction.html
document.addEventListener('DOMContentLoaded', function() {
  const showAddItemFormBtn = document.getElementById('showAddItemFormBtn');
  const addItemForm = document.getElementById('addItemForm');
  const cancelAddItemBtn = document.getElementById('cancelAddItemBtn');
  if (showAddItemFormBtn && addItemForm && cancelAddItemBtn) {
    showAddItemFormBtn.onclick = function() {
      addItemForm.style.display = '';
      showAddItemFormBtn.style.display = 'none';
    };
    cancelAddItemBtn.onclick = function() {
      addItemForm.reset();
      addItemForm.style.display = 'none';
      showAddItemFormBtn.style.display = '';
    };
  }
});

function addAuctionItem(event) {
  event.preventDefault();
  const title = document.getElementById('itemTitle').value.trim();
  const condition = document.getElementById('itemCondition').value.trim();
  const quantity = document.getElementById('itemQuantity').value;
  const location = document.getElementById('itemLocation').value.trim();
  const bid = document.getElementById('itemBid').value;
  const image = document.getElementById('itemImage').value.trim();

  // Find the auction list section
  const auctionList = document.querySelector('.auction-list');
  if (!auctionList) return false;

  // Create new auction item element
  const newId = Date.now();
  const itemDiv = document.createElement('div');
  itemDiv.className = 'auction-item';
  itemDiv.innerHTML = `
    <img src="${image}" alt="${title}" class="auction-img" />
    <div class="auction-info">
      <h4>${title}</h4>
      <p>Condition: ${condition} | Quantity: ${quantity} units</p>
      <p>Location: ${location}</p>
      <p>Current Bid: $${bid}</p>
    </div>
    <div class="bid-section">
      <input type="number" min="${Number(bid)+1}" placeholder="Your Bid" class="bid-input" id="bid${newId}" />
      <button class="bid-btn" onclick="placeBid(${newId})">Place Bid</button>
    </div>
  `;
  auctionList.appendChild(itemDiv);

  // Reset and hide form
  document.getElementById('addItemForm').reset();
  document.getElementById('addItemForm').style.display = 'none';
  document.getElementById('showAddItemFormBtn').style.display = '';
  return false;
}
// Show/hide logout button based on login status
document.addEventListener('DOMContentLoaded', function() {
  const logoutBtn = document.getElementById('logoutBtn');
  const loginBtn = document.getElementById('loginBtn');
  const loggedIn = localStorage.getItem('loggedInUser');
  if (logoutBtn && loginBtn) {
    if (loggedIn) {
      logoutBtn.style.display = '';
      loginBtn.style.display = 'none';
    } else {
      logoutBtn.style.display = '';
      logoutBtn.classList.add('disabled');
      logoutBtn.onclick = function(e) { e.preventDefault(); };
      loginBtn.style.display = '';
    }
    logoutBtn.addEventListener('click', function(e) {
      if (!localStorage.getItem('loggedInUser')) return;
      e.preventDefault();
      localStorage.removeItem('loggedInUser');
      alert('You have been logged out.');
      window.location.href = 'login.html';
    });
  }
});
function placeBid(auctionId) {
  const input = document.getElementById('bid' + auctionId);
  const bidValue = Number(input.value);
  if (!bidValue || bidValue <= 0) {
    alert('Please enter a valid bid amount.');
    return;
  }
  alert(`Your bid of $${bidValue} has been placed on auction #${auctionId}! (Demo only)`);
  input.value = '';
}

function registerUser(event) {
  event.preventDefault();
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const userType = document.getElementById('userType').value;

  if (!username || !email || !userType) {
    alert('Please fill all fields correctly.');
    return false;
  }

  alert(`Welcome, ${username}! You registered as a ${userType}. (Demo only)`);
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 500);
  return false;
}
function loginUser(event) {
  event.preventDefault();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (!email || !password) {
    alert('Please enter both email and password.');
    return false;
  }

  // Demo login validation (no backend)
  alert(`Logged in as ${email} (Demo only)`);
  // Store login status in localStorage
  localStorage.setItem('loggedInUser', email);
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 500);
  return false;
}
