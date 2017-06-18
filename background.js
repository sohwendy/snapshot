var page = "sans";
var pageName = page;
var counter = 1000;

chrome.browserAction.onClicked.addListener(function(tab) {
  pageName = page + counter;
  counter ++;

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    //download as html
    chrome.tabs.sendMessage(tabs[0].id, {}, function(response) {
      let doc = response.document;
      let blob = new Blob([doc], {type: "text/plain;charset=utf-8"});

      chrome.downloads.download({
        url: URL.createObjectURL(blob, { oneTimeOnly: true }),
        filename: `${pageName}.html`,
      });
    });

    //download as mhtml
    chrome.pageCapture.saveAsMHTML({
      tabId: tabs[0].id
       }, function(html) {

      var url = URL.createObjectURL(html, { oneTimeOnly: true });
      chrome.downloads.download({
        url: url,
        filename: `${pageName}.mhtml`
      });
    });
  });

  //capture visible area
  chrome.tabs.captureVisibleTab({
     format : "png"
  }, function(screenshot) {
      chrome.downloads.download({
      url: screenshot,
      filename: `${pageName}.png`
    });
  });
});