document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('item-form');
    const itemList = document.getElementById('item-list');
    const filterInput = document.getElementById('filter');
    const clearButton = document.getElementById('clear');
    const itemInput = document.getElementById('item-input');
  
    let editMode = false;
    let editItem = null;
  
    loadItemsFromLocalStorage();
  
    form.addEventListener('submit', function (e) {
      e.preventDefault();
  
      const newItemText = itemInput.value.trim();
  
      if (newItemText !== '') {
        if (!isItemInShoppingList(newItemText)) {
          if (editMode) {
            // Edit mode: update the edited item
            updateItemInShoppingList(editItem, newItemText);
            updateItemInLocalStorage(editItem, newItemText);
            resetUIState();
          } else {
            // Add mode: add a new item
            const newItem = createListItem(newItemText);
            itemList.appendChild(newItem);
            saveItemToLocalStorage(newItemText);
          }
  
          itemInput.value = '';
        } else {
          alert('Item already exists in the shopping list.');
        }
      }
    });
  
    itemList.addEventListener('click', function (e) {
      const listItem = e.target.closest('li');
  
      if (listItem) {
        if (!editMode) {
          // Enter edit mode
          editMode = true;
          editItem = listItem;
          itemInput.value = listItem.textContent.trim();
        }
      }
    });
  
    filterInput.addEventListener('input', function () {
      filterItems();
    });
  
    clearButton.addEventListener('click', function () {
      itemList.innerHTML = '';
      clearLocalStorage();
      resetUIState();
    });
  
    function createListItem(text) {
      const newItem = document.createElement('li');
      newItem.textContent = text;
  
      const removeButton = document.createElement('button');
      removeButton.className = 'remove-item btn-link text-red';
      removeButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
      removeButton.addEventListener('click', removeItem);
  
      newItem.appendChild(removeButton);
      return newItem;
    }
  
    function isItemInShoppingList(itemText) {
      const items = itemList.getElementsByTagName('li');
      for (const item of items) {
        if (item.textContent.trim().toLowerCase() === itemText.toLowerCase()) {
          return true;
        }
      }
      return false;
    }
  
    function updateItemInShoppingList(item, newText) {
      item.textContent = newText;
    }
  
    function removeItem(e) {
      const listItem = e.target.parentElement;
      itemList.removeChild(listItem);
  
      // Remove item from local storage
      removeItemFromLocalStorage(listItem.textContent);
  
      resetUIState();
    }
  
    function resetUIState() {
      editMode = false;
      editItem = null;
      itemInput.value = '';
    }
  
    function filterItems() {
      const filterText = filterInput.value.toLowerCase();
      const items = itemList.getElementsByTagName('li');
  
      for (const item of items) {
        const itemText = item.textContent.toLowerCase();
        itemText.includes(filterText) ? item.style.display = 'block' : item.style.display = 'none';
      }
    }
  
    function saveItemToLocalStorage(item) {
      let items = getItemsFromLocalStorage();
      items.push(item);
      localStorage.setItem('shoppingListItems', JSON.stringify(items));
    }
  
    function updateItemInLocalStorage(oldItem, newItemText) {
      let items = getItemsFromLocalStorage();
      const index = items.indexOf(oldItem.textContent.trim());
  
      if (index !== -1) {
        items[index] = newItemText;
        localStorage.setItem('shoppingListItems', JSON.stringify(items));
      }
    }
  
    function getItemsFromLocalStorage() {
      return JSON.parse(localStorage.getItem('shoppingListItems')) || [];
    }
  
    function loadItemsFromLocalStorage() {
      const items = getItemsFromLocalStorage();
  
      for (const item of items) {
        const newItem = createListItem(item);
        itemList.appendChild(newItem);
      }
    }
  
    function removeItemFromLocalStorage(item) {
      let items = getItemsFromLocalStorage();
      items = items.filter(i => i !== item);
      localStorage.setItem('shoppingListItems', JSON.stringify(items));
    }
  
    function clearLocalStorage() {
      localStorage.removeItem('shoppingListItems');
    }
  });
  