function addToBlacklist(uniqueID) {
  chrome.storage.sync.get(['blacklist'], function(result) {
    let blacklist = result.blacklist || [];
    blacklist.push(uniqueID);
    chrome.storage.sync.set({blacklist: blacklist});
  });
}

function hideBlacklisted() {
  chrome.storage.sync.get(['blacklist'], function(result) {
    const blacklist = result.blacklist || [];
    const listingNodes = document.evaluate(listings_xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (let i = 0; i < listingNodes.snapshotLength; i++) {
      const node = listingNodes.snapshotItem(i);
      const href = node.getAttribute('href');
      const uniqueID = href.split('?')[0];
      if (blacklist.includes(uniqueID)) {
        node.parentNode.style.display = 'none';
      }
    }
  });
}

function addButtonAndBlacklist() {
  const listingNodes = document.evaluate(listings_xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  const buttonNodes = document.evaluate(ignore_buttons_xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

  for (let i = 0; i < buttonNodes.snapshotLength; i++) {
    const buttonNode = buttonNodes.snapshotItem(i);
    const listingNode = listingNodes.snapshotItem(i);
    const href = listingNode.getAttribute('href');
    const uniqueID = href.split('?')[0];

    const btn = document.createElement('button');
    btn.innerHTML = 'Ignore';
    btn.style.position = 'relative';
    btn.style.zIndex = '1000';
    btn.addEventListener('click', function(event) {
      event.stopPropagation();
      event.preventDefault();
      addToBlacklist(uniqueID);
      listingNode.parentNode.style.display = 'none';
    });

    buttonNode.appendChild(btn);
  }
}

const listings_xpath = '(//div[@id="site-content"]/div/div/div/div/div/div)[1]//div[@itemprop="itemListElement"]/div/div/div/a[contains(@target, "listing_")]';
const ignore_buttons_xpath = '(//div[@id="site-content"]/div/div/div/div/div/div)[1]//div[@itemprop="itemListElement"]/div/div/div/a[contains(@target, "listing_")]/../div/div[2]/div[3]';

// Wait 5 seconds before running initial logic
setTimeout(function() {
  hideBlacklisted();
  addButtonAndBlacklist();
}, 5000);
