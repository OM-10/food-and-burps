// =======================================
/* DOCUMENTATION FOR MULTIPLE SELECT MENU
by Robert Sunny
 
To use a custom UI for a multiple select menu,
wrap the select element inside a div with the class
"select-menu--multiple".

If you want to enable user to add new option,
put the class "enable-add".

If you do enable the add option function, please provide the 
id of the FORM in same "select-menu--multiple" div. THe form
should be placed inside another div with a class of 'float-form'
or any container (if you wish to style it differently) who will
function as a dropdown.

The form should also contains at least two buttons:
1. A submit button with a class of 'submit-btn'.
2. A cancel button with a class of 'cancel-btn'.

If you have any label for the select, put it AFTER the select
element.

The wrapper (with the help of the javascript.) will create
the following items:
1. A search input for filtering options.
2. A select all button.
3. A deselect all button.
4. A create button for adding new option.
5. A form to create new option.
6. A new list-group with items mirroring the options in the real select element.
7. Container for tags for displaying the current selected items.

IMPORTANT!
Every option inside the select element should have a unique value!
When two or more elements have the same value, each time one of them
is clicked, only the first element with that value is selected.
(This includes option without a value or a value of blank.)

DEVELOPER NOTES.
If you want to change the styling of the objects created,
look over to the javascript and rename the classes of the object
automatically created by the script. And you can link it to your own css.


// ======================================= */

const selectMenus = document.querySelector(".select-menu");
const multSelectMenus = document.querySelectorAll(".select-menu--multiple");

// Function to clear all selection.
function deselectAll(selectMenu){  
  const options = selectMenu.querySelectorAll("option");
  options.forEach(option=>{
    deselectOption(option);
    removeTag(option, selectMenu);
  });
}

// Function to select all option.
function selectAll(selectMenu){  
  const options = selectMenu.querySelectorAll("option");
  options.forEach(option=>{
    selectOption(option);
    addTag(option, selectMenu);
  });
}

// Function to select an option.
function selectOption(option){
  const selectMenu = option.closest('.select-menu');
  const item = selectMenu.querySelector(`.list-group-item[data-value="${option.value}"]`);
  item.querySelector('input[type="checkbox"]').checked = true;
  item.classList.add('selected');
  option.selected=true;
};

// Function to deselect an option.
function deselectOption(option){
  const selectMenu = option.closest('.select-menu');
  const item = selectMenu.querySelector(`.list-group-item[data-value="${option.value}"]`);
  item.querySelector('input[type="checkbox"]').checked = false;
  item.classList.remove('selected');
  option.selected=false;
};

// Function to add tags 
function addTag(option, selectMenu) {
  const tagBox = selectMenu.querySelector('.tag-box');
  
  // Create a list of value from the current tags.
  const currTags = [...tagBox.querySelectorAll('.tag')]
    .map(tag => {
      return tag.getAttribute('data-value');
    });
  
  // Create new tag element.
  if (!currTags.includes(option.value)) {
    const tag = document.createElement('div');
    tag.setAttribute('class', 'tag');
    tag.setAttribute('data-value', option.value);
    tag.innerHTML = `${option.textContent}<i class='fas fa-times ml-2'></i>`;
    
    // Add a listener to the created tag.
    tag.addEventListener('click', function(){
      deselectOption(option);
      removeTag(option, selectMenu);
    })
    
    tagBox.appendChild(tag);
  }
}

// Function to Remove the tags
function removeTag(option, selectMenu){
  const tagBox = selectMenu.querySelector('.tag-box');
  tagBox.setAttribute('data-active', 'true');
  const currTags = [...tagBox.querySelectorAll('.tag')]
    .map(tag => {
      return tag.getAttribute('data-value');
    });
  // Create new tag.
  if (currTags.includes(option.value)) {
    const tag = document.querySelector(`.tag[data-value="${option.value}"]`);
    tag.remove();
  }
}

// Function to filter items.
function findMatches(keyword, array){
  return array.filter(item => {
    // return 
    const regex = new RegExp(keyword, 'gi');
    return item.textContent.match(regex);
  });
}

// Function to display the filter results.
function displayMatches(el, array){
  const matchArray = findMatches(el.value, array);
  const listGroup = el.closest('.select-menu').querySelector('.list-group');
  if (matchArray) {
    array.forEach(item => {
      item.style.display = 'none';
      item.style.border = null;
    })
    matchArray.forEach(match=>{
      match.style.display = 'block';
    })
    matchArray[matchArray.length-1].style.border = 'none';
  }
}

// Function to expand an element from 0 height to its scroll height.
function expandElement(el) {
  el.style.height = `${el.scrollHeight}px`;
  el.style.opacity = `1`;
}

// Function to collapse an element. Actually set the height and opacity to its default.
function collapseElement(el) {
  el.style.height = null;
  el.style.opacity = null;
}

multSelectMenus.forEach(selectMenu => {
  // Query the actual select menu as reference.
  const selectRef = selectMenu.querySelector("select");
  
  // Query all the option in the referenced select menu.
  const optionsRef = selectRef.querySelectorAll("option");
  
  // Create container to put all the buttons.
  const actionBar = document.createElement('div');
  actionBar.setAttribute('class', 'clearfix mb-2 w-100 position-relative');
  
  // Create the select all button.
  const selBtn = document.createElement('button');
  selBtn.setAttribute('class', 'btn btn-outline-primary sel-btn mr-1');
  selBtn.setAttribute('data-menu', `${selectMenu.id}`);
  selBtn.textContent = "Select All";
  
  // Create the deselect all button.
  const deselBtn = document.createElement('button');
  deselBtn.setAttribute('class', 'btn btn-outline-primary desel-btn mr-1');
  deselBtn.setAttribute('data-menu', `${selectMenu.id}`);
  deselBtn.textContent = "Deselect All";
  
  actionBar.appendChild(selBtn);
  actionBar.appendChild(deselBtn);
  
  // Create search bar.
  const searchInput = document.createElement('input');
  searchInput.setAttribute('type','text');
  searchInput.setAttribute('placeholder', "Search fruit...")
  searchInput.setAttribute('class', 'form-control mb-2');
  
  // Create new select Menu Container.
  const listGroup = document.createElement("div");
  listGroup.setAttribute("class", "list-group");
  
  const tagBox = document.createElement("div");
  tagBox.setAttribute("class", "tag-box");
  tagBox.setAttribute("data-active", "false");
  
  // Create new div for all options.
  let html = "";
  optionsRef.forEach(option => {
    html += `
      <div class="list-group-item" data-value=${option.value}>
        <input id="${option.id}_${option.value}" type="checkbox">
        <label>${option.textContent}</label>
      </div>
    `
  });
  listGroup.innerHTML = html;
  
  selectMenu.appendChild(searchInput);
  selectMenu.appendChild(actionBar);
  selectMenu.appendChild(listGroup);
  selectMenu.appendChild(tagBox);
  
  
  // Create the add option button.
  if (selectMenu.classList.contains('enable-add')) {
    const addBtn = document.createElement('button');
    addBtn.setAttribute('class', 'btn btn-outline-primary add-btn float-right');
    addBtn.setAttribute('data-menu', `${selectMenu.id}`);
    addBtn.innerHTML = '<i class="fas fa-plus mr-1"></i>Add Option';
    
    actionBar.appendChild(addBtn);
    
    const form = document.querySelector(`#${selectMenu.getAttribute('data-form')}`).parentElement;
    const cancelBtn = form.querySelector('.cancel-btn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', function(){
        collapseElement(form);
      });  
    }
    
    
    const submitBtn = form.querySelector('.submit-btn');
    if (submitBtn) {
      submitBtn.addEventListener('click', function(){
        // CHANGE THIS FUNCTION ACCORDING TO YOUR NEEDS.
        const itemName = form.querySelector('input[name="option_text"]').value;
        const itemValue = form.querySelector('input[name="option_value"]').value;
        if (itemName && itemValue) {
          const newOption = document.createElement('option');
          newOption.id = `opt_${itemValue}`
          newOption.value = itemValue;
          newOption.textContent = itemName;
          selectRef.appendChild(newOption);
          
          const newItem = document.createElement('div');
          const newItemLabel = document.createElement('label');
          const newItemChk = document.createElement('input');
          
          newItemChk.setAttribute('class', 'mr-1')
          newItemChk.setAttribute('type', 'checkbox');
          newItemChk.setAttribute('id', `${newOption.id}_${newOption.value}`);
          newItemLabel.setAttribute('for', newItemChk.id);
          newItemLabel.textContent = itemName;
          newItem.setAttribute('class', 'list-group-item');
          newItem.setAttribute('data-value', itemValue);
          newItem.appendChild(newItemChk);
          newItem.appendChild(newItemLabel);
          listGroup.appendChild(newItem);
          
          newItemChk.addEventListener("click", function(e){
            e.stopPropagation();
            if (newItemChk.checked) {
              newOption.selected = true;
              newItem.classList.add('selected');
              addTag(newOption, selectMenu);
            } else {
              newOption.selected = false;
              newItem.classList.remove('selected');
              removeTag(newOption, selectMenu);
            }
          })

          newItem.addEventListener("click", function(){
            newItemChk.click();
          });
        }
        collapseElement(form);
      });
    }
    
    // Listener for the add buttons.
    addBtn.addEventListener('click', function(){
      if (form.parentNode !== actionBar) {
        actionBar.appendChild(form);
      };
      form.style.height = `${form.scrollHeight}px`;
      form.style.opacity = "1";
    })
  }
  
  // Add Listener for each option.
  const listItems = selectMenu.querySelectorAll(".list-group-item");
  listItems.forEach(item => {
    const checkbox = item.querySelector('input[type="checkbox"]');
    const selectRef = item.closest(".select-menu").querySelector("select");
    const option = selectRef.querySelector(`option[value="${item.getAttribute('data-value')}"]`)
    
    checkbox.addEventListener("click", function(e){
      e.stopPropagation();
      if (checkbox.checked) {
        option.selected = true;
        item.classList.add('selected');
        addTag(option, selectMenu);
      } else {
        option.selected = false;
        item.classList.remove('selected');
        removeTag(option, selectMenu);
      }
    })
    
    item.addEventListener("click", function(){
      checkbox.click();
    });
  });
  
  // Listener for select and deselect button.
  selBtn.addEventListener("click", function(){
    selectAll(document.querySelector(`#${selBtn.getAttribute('data-menu')}`));
  })

  deselBtn.addEventListener('click', function(){
    deselectAll(document.querySelector(`#${selBtn.getAttribute('data-menu')}`));
  });
  
  // Listener for Search Bar.
  searchInput.addEventListener('keyup', function(){displayMatches(this, [...listItems])});
  searchInput.addEventListener('change', function(){displayMatches(this, [...listItems])});
});

const submitBtns = document.querySelectorAll(".submit-btn");
submitBtns.forEach(btn => {
  btn.addEventListener('click', function(){
    const select = document.querySelector(`#${btn.getAttribute('data-menu')}`).querySelector('select');
    console.log(select);
    const selectedOptions = [...select.querySelectorAll('option')]
    .filter(option => option.selected).map(option => option.textContent.trim());
    if (selectedOptions.length === 0) {
      alert(`You haven't picked anything.`)
    } else if (selectedOptions.length > 1) {
      const last = selectedOptions.pop();
      alert(`You picked ${selectedOptions.join(', ')}, and ${last}.`);  
    } else {
      alert (`You picked ${selectedOptions[0]}.`);
    }
    
  })
  
})