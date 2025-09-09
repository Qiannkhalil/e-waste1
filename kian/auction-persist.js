                                                // --- Auction Items Persistence ---
const AUCTION_STORAGE_KEY = 'auctionItems';

function getSavedAuctions() {
  const data = localStorage.getItem(AUCTION_STORAGE_KEY);
  if (!data) return null;
  try { return JSON.parse(data); } catch { return null; }
}

function saveAuctionsToStorage(items) {
  localStorage.setItem(AUCTION_STORAGE_KEY, JSON.stringify(items));
}

function renderAuctionItems() {
  const auctionList = document.querySelector('.auction-list');
  if (!auctionList) return;
  // Remove all except add form/button and heading
  Array.from(auctionList.children).forEach(child => {
    if (!child.matches('h2, #showAddItemFormBtn, #addItemForm')) child.remove();
  });
  const items = getSavedAuctions();
  if (!items) return;
  items.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'auction-item' + (item.sold ? ' sold' : '');
    itemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.title}" class="auction-img" style="cursor:pointer;" title="Click to change image" />
      <div class="auction-info">
        <h4>${item.title}</h4>
        <p>Condition: ${item.condition} | Quantity: ${item.quantity} units</p>
        <p>Location: ${item.location}</p>
        <p>Current Bid: $${item.bid}</p>
      </div>
      <div class="bid-section">
        <input type="number" min="${Number(item.bid)+1}" placeholder="Your Bid" class="bid-input" id="bid${item.id}" ${item.sold ? 'disabled' : ''}/>
        <button class="bid-btn" onclick="placeBid(${item.id})" ${item.sold ? 'disabled' : ''}>Place Bid</button>
        <button class="remove-btn" onclick="removeAuctionItem(this)">Remove</button>
        <button class="sold-btn" onclick="markItemSold(this)"${item.sold ? ' disabled' : ''}>Mark as Sold</button>
      </div>
      ${item.sold ? '<div class="sold-label">SOLD</div>' : ''}
    `;
    auctionList.appendChild(itemDiv);
  });
  enableImageReplace();
}

function enableImageReplace() {
  document.querySelectorAll('.auction-img').forEach(function(img) {
    img.onclick = function() {
      const items = getSavedAuctions();
      if (!items) return;
      const itemDiv = img.closest('.auction-item');
      const title = itemDiv.querySelector('h4').textContent;
      const item = items.find(i => i.title === title);
      const newUrl = prompt('Enter new image URL:', img.src);
      if (newUrl && newUrl.trim() && newUrl !== img.src) {
        img.src = newUrl.trim();
        if (item) { item.image = newUrl.trim(); saveAuctionsToStorage(items); }
      }
    };
  });
}

// On page load, render from storage if on auction.html
if (document.querySelector('.auction-list')) {
  if (!getSavedAuctions()) {
    // If no saved, initialize with default items
    saveAuctionsToStorage([
      {id:1,title:'Used Laptop - Dell Inspiron',condition:'Good',quantity:10,location:'New York, NY',bid:250,image:'https://images.pexels.com/photos/163126/laptop-computer-dell-latitude-163126.jpeg?auto=compress&w=400&q=80',sold:false},
      {id:2,title:'Old Mobile Phones Lot',condition:'Mixed',quantity:50,location:'San Francisco, CA',bid:300,image:'https://images.pexels.com/photos/1309338/pexels-photo-1309338.jpeg?auto=compress&w=400&q=80',sold:false},
      {id:3,title:'Broken Desktop Monitor',condition:'For Parts',quantity:5,location:'Chicago, IL',bid:50,image:'https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg?auto=compress&w=400&q=80',sold:false},
      {id:4,title:'Used Headphones - Sony WH-CH500',condition:'Fair',quantity:15,location:'Austin, TX',bid:40,image:'https://images.pexels.com/photos/159220/headphones-headset-audio-equipment-music-159220.jpeg?auto=compress&w=400&q=80',sold:false},
      {id:5,title:'Tablet - Samsung Galaxy Tab A',condition:'Good',quantity:8,location:'Miami, FL',bid:120,image:'https://images.pexels.com/photos/325153/pexels-photo-325153.jpeg?auto=compress&w=400&q=80',sold:false},
      {id:6,title:'Old Printer - HP DeskJet 2130',condition:'Used',quantity:3,location:'Seattle, WA',bid:25,image:'https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg?auto=compress&w=400&q=80',sold:false}
    ]);
  }
  renderAuctionItems();
}

function addAuctionItem(event) {
  event.preventDefault();
  const title = document.getElementById('itemTitle').value.trim();
  const condition = document.getElementById('itemCondition').value.trim();
  const quantity = document.getElementById('itemQuantity').value;
  const location = document.getElementById('itemLocation').value.trim();
  const bid = document.getElementById('itemBid').value;
  const image = document.getElementById('itemImage').value.trim();

  const items = getSavedAuctions() || [];
  const newId = Date.now();
  items.push({id:newId,title,condition,quantity,location,bid,image,sold:false});
  saveAuctionsToStorage(items);
  renderAuctionItems();

  // Reset and hide form
  document.getElementById('addItemForm').reset();
  document.getElementById('addItemForm').style.display = 'none';
  document.getElementById('showAddItemFormBtn').style.display = '';
  return false;
}

function removeAuctionItem(btn) {
  const item = btn.closest('.auction-item');
  if (!item) return;
  const title = item.querySelector('h4').textContent;
  let items = getSavedAuctions() || [];
  items = items.filter(i => i.title !== title);
  saveAuctionsToStorage(items);
  renderAuctionItems();
}

function markItemSold(btn) {
  const itemDiv = btn.closest('.auction-item');
  if (!itemDiv) return;
  const title = itemDiv.querySelector('h4').textContent;
  let items = getSavedAuctions() || [];
  items = items.filter(i => i.title !== title);
  saveAuctionsToStorage(items);
  renderAuctionItems();
}
