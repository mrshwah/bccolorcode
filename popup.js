let tagKey;
let tagInput = document.getElementById('tag');
let colorInput = document.getElementById('color');
let selectTag = document.getElementById('selectTag');
let saveButton = document.getElementById('save');
let updateButton = document.getElementById('update');
let deleteButton = document.getElementById('delete');
let tags = [];

updateButton.disabled = true;

function addOption(tag) {
  let option = document.createElement('option');
  option['data-tag'] = tag.tag;
  option['data-color'] = tag.color;
  option.text = tag.tag;
  selectTag.appendChild(option);
}

function validateInput() {
  return !(tagInput.value === '' || colorInput.value == '');
}

chrome.storage.sync.get('tags', function (data) {
  tags = data.tags ? data.tags : [];
  tags.map(function(tag) {
    addOption(tag)
  });
});

saveButton.onclick = function (element) {
  if (!validateInput()) {
    alert('Invalid input: All fields are required.');
    return;
  };
  let tag = tagInput.value;
  let color = colorInput.value;
  tags.push({tag, color});
  addOption(tag);
  chrome.storage.sync.set({
    tags
  }, function () {
    console.log('Tag set to ' + tag + ' with color ' + color);
  });
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    chrome.tabs.update(tabs[0].id, {
      url: tabs[0].url
    });
  });
  location.reload();
};

updateButton.onclick = function (element) {
  selectTag.remove(selectTag.selectedIndex);
  tags = tags.filter((tag) => (tag.tag !== tagKey));
  let tag = tagInput.value;
  let color = colorInput.value;
  tags.push({tag, color});
  addOption(tag);
  chrome.storage.sync.set({
    tags
  }, function () {
    console.log('Tag set to ' + tag + ' with color ' + color);
  });
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    chrome.tabs.update(tabs[0].id, {
      url: tabs[0].url
    });
  });
  location.reload();
};

deleteButton.onclick = function (element) {
  selectTag.remove(selectTag.selectedIndex);
  tags = tags.filter((tag) => (tag.tag !== tagKey));
  chrome.storage.sync.set({
    tags
  }, function () {
    console.log('Tag ' + tagKey + ' removed');
  });
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    chrome.tabs.update(tabs[0].id, {
      url: tabs[0].url
    });
  });
  location.reload();
};

selectTag.onchange = function (element) {
  let selected = selectTag.options[selectTag.selectedIndex];
  if (selected.value === "new") {
    updateButton.disabled = true;
    saveButton.disabled = false;
    return;
  }
  else {
    updateButton.disabled = false;
    saveButton.disabled = true;
  }
  tagKey = selected['data-tag'];
  tagInput.text = selected['data-tag'];
  tagInput.value = selected['data-tag'];
  colorInput.text = selected['data-color'];
  colorInput.value = selected['data-color']
  console.log(tagKey);
}