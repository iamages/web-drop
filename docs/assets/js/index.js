"use strict";var selectedFile={type:null,file:null};const uploadModal={controller:new BulmaModal("#upload-modal"),head:{closeButton:document.getElementById("upload-modal-close-button")},detailsPage:{page:document.getElementById("upload-modal-details-page"),body:{img:document.getElementById("upload-modal-img"),descriptionInput:document.getElementById("upload-modal-description-input"),nsfwToggle:document.getElementById("upload-modal-nsfw-toggle"),hiddenToggle:document.getElementById("upload-modal-hidden-toggle")}},completePage:{page:document.getElementById("upload-modal-complete-page"),body:{shareButton:document.getElementById("upload-modal-share-button"),copyButton:document.getElementById("upload-modal-copy-button"),goButton:document.getElementById("upload-modal-go-button")}},foot:{uploadButton:document.getElementById("upload-modal-upload-button")}};async function upload(){uploadModal.head.closeButton.classList.add("is-hidden"),uploadModal.foot.uploadButton.classList.add("is-loading");var e={description:"No description yet.",nsfw:uploadModal.detailsPage.body.nsfwToggle.checked,hidden:uploadModal.detailsPage.body.hiddenToggle.checked};""!==uploadModal.detailsPage.body.descriptionInput.value&&(e.description=uploadModal.detailsPage.body.descriptionInput.value);var o={id:"unknown"};try{switch(selectedFile.type){case"file":var a=new FormData;a.set("info",JSON.stringify(e)),a.set("upload_file",selectedFile.file);var d=await fetch(apiRoot+"/file/new/upload",{method:"POST",body:a});o=await d.json();break;case"url":e.upload_url=selectedFile.file;d=await fetch(apiRoot+"/file/new/websave",{method:"POST",body:JSON.stringify(e)});o=await d.json()}}catch(e){console.error(e),bulmaToast.toast({type:"is-danger",message:e})}const l=`${apiRoot}/file/${o.id}/embed`;uploadModal.completePage.body.shareButton.setAttribute("data-iamages-url",l),uploadModal.completePage.body.copyButton.setAttribute("data-iamages-url",l),uploadModal.completePage.body.goButton.href=l,uploadModal.foot.uploadButton.classList.remove("is-loading"),uploadModal.foot.uploadButton.classList.add("is-hidden"),uploadModal.head.closeButton.classList.remove("is-hidden"),uploadModal.detailsPage.page.classList.add("is-hidden"),uploadModal.completePage.page.classList.remove("is-hidden")}function showUploadModalUsingUrl(){const e=document.getElementById("upload-url-input").value;""!=e&&(uploadModal.detailsPage.body.img.src=e,uploadModal.detailsPage.body.img.alt=e,selectedFile.type="url",selectedFile.file=e,uploadModal.controller.show())}uploadModal.controller.addEventListener("modal:close",(()=>{uploadModal.detailsPage.page.classList.remove("is-hidden"),uploadModal.completePage.page.classList.add("is-hidden"),uploadModal.detailsPage.body.img.src="",uploadModal.detailsPage.body.descriptionInput.value="",uploadModal.detailsPage.body.nsfwToggle.value=!1,uploadModal.detailsPage.body.hiddenToggle.value=!1,uploadModal.foot.uploadButton.classList.remove("is-loading"),uploadModal.foot.uploadButton.classList.remove("is-hidden")})),uploadModal.completePage.body.shareButton.onclick=async e=>{await navigator.share({url:e.target.getAttribute("data-iamages-url")})},uploadModal.completePage.body.copyButton.onclick=async e=>{await navigator.clipboard.writeText(uploadModal.completePage.body.copyButton.getAttribute("data-iamages-url"))},uploadModal.foot.uploadButton.onclick=upload,document.getElementById("upload-file-input").onchange=e=>{selectedFile.type="file",selectedFile.file=e.target.files[0];const o=URL.createObjectURL(selectedFile.file);uploadModal.detailsPage.body.img.src=o,uploadModal.detailsPage.body.img.alt=o,uploadModal.controller.show()},document.getElementById("upload-url-next-button").onclick=showUploadModalUsingUrl,document.getElementById("upload-url-input").onkeyup=e=>{if("Enter"===e.key)showUploadModalUsingUrl()},navigator.share||uploadModal.completePage.body.shareButton.classList.add("is-hidden");